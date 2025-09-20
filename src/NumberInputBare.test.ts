import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import NumberInputBare from './NumberInputBare.vue'

const createWrapper = (props = {}) =>
  mount(NumberInputBare, {
    props: {
      id: 'number-input',
      name: 'number',
      placeholder: 'Enter number',
      autocomplete: 'off',
      class: 'test-class',
      ...props,
    },
  })

it('renders correctly with default props', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  expect(input.exists()).toBe(true)
  expect(input.attributes('id')).toBe('number-input')
  expect(input.attributes('name')).toBe('number')
  expect(input.attributes('placeholder')).toBe('Enter number')
  expect(input.attributes('autocomplete')).toBe('off')
  expect(input.attributes('autocapitalize')).toBe('none')
  expect(input.attributes('inputmode')).toBe('numeric')
  expect(input.attributes('spellcheck')).toBe('false')
  expect(input.attributes('type')).toBe('text')
  expect(input.attributes('class')).toBe('test-class')
})

it('passes the correct attributes to the input', () => {
  const wrapper = createWrapper({
    disabled: true,
    autofocus: true,
    class: 'custom-class',
  })

  const input = wrapper.find('input')
  expect(input.attributes('disabled')).toBe('')
  expect(input.attributes('autofocus')).toBe('')
  expect(input.attributes('class')).toBe('custom-class')
})

it('handles empty input correctly', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  expect(input.element.value).toBe('')

  await input.setValue('123')
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      123,
    ]
  `)

  await input.setValue('')
  expect(wrapper.emitted('update:modelValue')?.[1]).toMatchInlineSnapshot(`
    [
      undefined,
    ]
  `)

  expect(input.element.value).toBe('')
})

it('sets initial value correctly', () => {
  const wrapper = createWrapper({ value: 42 })
  const input = wrapper.find('input')

  expect(input.element.value).toBe('42')
})

it('updates value when props change', async () => {
  const wrapper = createWrapper({ value: 10 })
  const input = wrapper.find('input')

  expect(input.element.value).toBe('10')

  await wrapper.setProps({ value: 25 })

  expect(input.element.value).toBe('25')
})

it('emits numeric values when user types digits', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  await input.setValue('123')

  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      123,
    ]
  `)
})

it('filters out non-digit characters', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')
  const inputElement = input.element

  inputElement.value = 'abc123def456'
  await input.trigger('input')

  expect(inputElement.value).toBe('123456')
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      123456,
    ]
  `)
})

it('respects disabled attribute', async () => {
  const wrapper = createWrapper({ disabled: true })
  const input = wrapper.find('input')

  expect(input.attributes('disabled')).toBe('')

  await input.setValue('123')

  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

it('applies maxDigits constraint', async () => {
  const wrapper = createWrapper({ maxDigits: 3 })
  const input = wrapper.find('input')
  const inputElement = input.element

  inputElement.value = '12345'
  await input.trigger('input')

  expect(inputElement.value).toBe('123')
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      123,
    ]
  `)
})

it('allows input up to maxDigits length', async () => {
  const wrapper = createWrapper({ maxDigits: 5 })
  const input = wrapper.find('input')
  const inputElement = input.element

  inputElement.value = '12345'
  await input.trigger('input')

  expect(inputElement.value).toBe('12345')
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      12345,
    ]
  `)
})

it('defaults to 15 digit limit when no maxDigits is provided', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')
  const inputElement = input.element

  // 16 digits - should be truncated to 15
  inputElement.value = '1234567890123456'
  await input.trigger('input')

  expect(inputElement.value).toBe('123456789012345')
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      123456789012345,
    ]
  `)
})

it('works with values under default 15 digit limit', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')
  const inputElement = input.element

  inputElement.value = '123456789'
  await input.trigger('input')

  expect(inputElement.value).toBe('123456789')
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      123456789,
    ]
  `)
})

it('exposes focus method', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  const focusSpy = vi.spyOn(input.element, 'focus')

  const vm = wrapper.vm as { focus: () => void }
  vm.focus()

  expect(focusSpy).toHaveBeenCalled()
})

it('exposes blur method', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  const blurSpy = vi.spyOn(input.element, 'blur')

  const vm = wrapper.vm as { blur: () => void }
  vm.blur()

  expect(blurSpy).toHaveBeenCalled()
})

it('exposes select method', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  const selectSpy = vi.spyOn(input.element, 'select')

  const vm = wrapper.vm as { select: () => void }
  vm.select()

  expect(selectSpy).toHaveBeenCalled()
})

it('handles undefined modelValue', () => {
  const wrapper = createWrapper({ modelValue: undefined })
  const input = wrapper.find('input')

  expect(input.element.value).toBe('')
})

it('converts string numbers to integers', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  await input.setValue('42')

  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      42,
    ]
  `)
})

it('handles zero correctly', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  await input.setValue('0')

  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      0,
    ]
  `)
  expect(input.element.value).toBe('0')
})

it('caps maxDigits at 15 even if higher value is provided', async () => {
  const wrapper = createWrapper({ maxDigits: 20 })
  const input = wrapper.find('input')
  const inputElement = input.element

  // 16 digits - should still be truncated to 15 despite maxDigits being 20
  inputElement.value = '1234567890123456'
  await input.trigger('input')

  expect(inputElement.value).toBe('123456789012345')
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      123456789012345,
    ]
  `)
})

it('does not pass maxDigits prop as HTML attribute', () => {
  const wrapper = createWrapper({ maxDigits: 5 })
  const input = wrapper.find('input')

  expect(input.attributes('maxdigits')).toBeUndefined()
})
