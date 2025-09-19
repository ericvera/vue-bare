import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import TextInputBare from './TextInputBare.vue'

const createWrapper = (props = {}) =>
  mount(TextInputBare, {
    props: {
      id: 'text-input',
      name: 'text',
      placeholder: 'Enter text',
      autocomplete: 'off',
      autocapitalize: 'none',
      inputmode: 'text',
      spellcheck: false,
      class: 'test-class',
      ...props,
    },
  })

it('renders correctly with default props', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  expect(input.exists()).toBe(true)
  expect(input.attributes('id')).toBe('text-input')
  expect(input.attributes('name')).toBe('text')
  expect(input.attributes('placeholder')).toBe('Enter text')
  expect(input.attributes('autocomplete')).toBe('off')
  expect(input.attributes('autocapitalize')).toBe('none')
  expect(input.attributes('inputmode')).toBe('text')
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

  // Initial state should be empty
  expect(input.element.value).toBe('')

  // Set a value first
  await input.setValue('test value')
  // Don't manually trigger input - setValue already does it

  // Check the emitted event for the value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "test value",
    ]
  `)

  // Now clear it
  await input.setValue('')
  // Don't manually trigger input - setValue already does it

  // Check the emitted event for empty string (now at index [1])
  expect(wrapper.emitted('update:modelValue')?.[1]).toMatchInlineSnapshot(`
    [
      "",
    ]
  `)

  // Should be empty
  expect(input.element.value).toBe('')
})

it('sets initial value correctly', () => {
  const wrapper = createWrapper({ value: 'initial value' })
  const input = wrapper.find('input')

  // Should have the value we set
  expect(input.element.value).toBe('initial value')
})

it('updates value when props change', async () => {
  const wrapper = createWrapper({ value: 'first value' })
  const input = wrapper.find('input')

  // Should have the initial value
  expect(input.element.value).toBe('first value')

  // Update the prop
  await wrapper.setProps({ value: 'updated value' })

  // Should reflect the new value
  expect(input.element.value).toBe('updated value')
})

it('emits events when user types', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Type something
  await input.setValue('user input')

  // Verify the event was emitted with the correct value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "user input",
    ]
  `)
})

it('respects disabled attribute', async () => {
  const wrapper = createWrapper({ disabled: true })
  const input = wrapper.find('input')

  // Verify disabled attribute is set
  expect(input.attributes('disabled')).toBe('')

  // Try to set a value (shouldn't work because it's disabled)
  await input.setValue('test input')

  // Cannot emit events when disabled
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

it('clears input when set to empty', async () => {
  // Start with a value
  const wrapper = createWrapper({ value: 'initial text' })
  const input = wrapper.find('input')

  // Initially not empty
  expect(input.element.value).toBe('initial text')

  // Set prop to empty
  await wrapper.setProps({ value: '' })

  // Should be empty
  expect(input.element.value).toBe('')
})

it('exposes focus method', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Mock the focus method
  const focusSpy = vi.spyOn(input.element, 'focus')

  // Focus the input
  const vm = wrapper.vm as { focus: () => void }
  vm.focus()

  // Verify focus was called
  expect(focusSpy).toHaveBeenCalled()
})

it('exposes blur method', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Mock the blur method
  const blurSpy = vi.spyOn(input.element, 'blur')

  // Blur the input
  const vm = wrapper.vm as { blur: () => void }
  vm.blur()

  // Verify blur was called
  expect(blurSpy).toHaveBeenCalled()
})

it('exposes select method', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Mock the select method
  const selectSpy = vi.spyOn(input.element, 'select')

  // Select the input text
  const vm = wrapper.vm as { select: () => void }
  vm.select()

  // Verify select was called
  expect(selectSpy).toHaveBeenCalled()
})

it('trims leading spaces when trimStart is true', async () => {
  const wrapper = createWrapper({ trimStart: true })
  const input = wrapper.find('input')
  const inputElement = input.element

  // Simulate user typing with leading spaces
  inputElement.value = '   hello world'
  await input.trigger('input')

  // Should emit the trimmed value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "hello world",
    ]
  `)

  // Input should show the trimmed value
  expect(inputElement.value).toBe('hello world')
})

it('does not trim leading spaces when trimStart is false', async () => {
  const wrapper = createWrapper({ trimStart: false })
  const input = wrapper.find('input')

  // Type text with leading spaces
  await input.setValue('   hello world')

  // Should emit the value with spaces
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "   hello world",
    ]
  `)

  // Input should keep the spaces
  expect(input.element.value).toBe('   hello world')
})

it('does not trim leading spaces when trimStart is not provided', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Type text with leading spaces
  await input.setValue('   hello world')

  // Should emit the value with spaces (default behavior)
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "   hello world",
    ]
  `)

  // Input should keep the spaces
  expect(input.element.value).toBe('   hello world')
})

it('handles only spaces input when trimStart is true', async () => {
  const wrapper = createWrapper({ trimStart: true })
  const input = wrapper.find('input')
  const inputElement = input.element

  // First type some text to ensure we're starting from a non-empty state
  inputElement.value = 'test'
  await input.trigger('input')

  // Now type only spaces
  inputElement.value = '     '
  await input.trigger('input')

  // Should emit empty string (check the second emission)
  expect(wrapper.emitted('update:modelValue')?.[1]).toMatchInlineSnapshot(`
    [
      "",
    ]
  `)

  // Input should be empty
  expect(inputElement.value).toBe('')
})

it('preserves trailing spaces when trimStart is true', async () => {
  const wrapper = createWrapper({ trimStart: true })
  const input = wrapper.find('input')

  // Type text with trailing spaces (no leading spaces)
  await input.setValue('hello world   ')

  // Should keep trailing spaces
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "hello world   ",
    ]
  `)

  // Input should keep trailing spaces
  expect(input.element.value).toBe('hello world   ')
})

it('trims leading spaces from initial value when trimStart is true', () => {
  const wrapper = createWrapper({
    trimStart: true,
    value: '   initial value',
  })
  const input = wrapper.find('input')

  // Should display trimmed initial value
  expect(input.element.value).toBe('initial value')
})

it('trims leading spaces when value prop changes and trimStart is true', async () => {
  const wrapper = createWrapper({
    trimStart: true,
    value: 'first value',
  })
  const input = wrapper.find('input')

  // Initial value should be as is (no leading spaces)
  expect(input.element.value).toBe('first value')

  // Update prop with leading spaces
  await wrapper.setProps({ value: '   updated value' })

  // Should display trimmed value
  expect(input.element.value).toBe('updated value')
})

it('handles mixed whitespace when trimStart is true', async () => {
  const wrapper = createWrapper({ trimStart: true })
  const input = wrapper.find('input')
  const inputElement = input.element

  // Simulate typing text with tabs and spaces
  inputElement.value = '\t  \t hello'
  await input.trigger('input')

  // Should trim all leading whitespace
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "hello",
    ]
  `)

  // Input should show trimmed value
  expect(inputElement.value).toBe('hello')
})

it('does not affect trimStart prop attribute on input element', () => {
  const wrapper = createWrapper({ trimStart: true })
  const input = wrapper.find('input')

  // trimStart should not be passed as an HTML attribute
  expect(input.attributes('trimstart')).toBeUndefined()
})
