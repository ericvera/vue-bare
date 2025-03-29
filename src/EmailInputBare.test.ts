import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import EmailInputBare from './EmailInputBare.vue'

const createWrapper = (props = {}) =>
  mount(EmailInputBare, {
    props: {
      id: 'email-input',
      name: 'email',
      placeholder: 'Enter email',
      autocomplete: 'email',
      class: 'test-class',
      ...props,
    },
  })

it('renders correctly with default props', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  expect(input.exists()).toBe(true)
  expect(input.attributes('id')).toBe('email-input')
  expect(input.attributes('name')).toBe('email')
  expect(input.attributes('placeholder')).toBe('Enter email')
  expect(input.attributes('autocomplete')).toBe('email')
  expect(input.attributes('autocapitalize')).toBe('none')
  expect(input.attributes('inputmode')).toBe('email')
  expect(input.attributes('spellcheck')).toBe('false')
  expect(input.attributes('type')).toBe('email')
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
  await input.setValue('test@example.com')
  await input.trigger('input')

  // Check the emitted event for the value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "test@example.com",
    ]
  `)

  // Now clear it
  await input.setValue('')
  await input.trigger('input')

  // Check the emitted event for empty string
  expect(wrapper.emitted('update:modelValue')?.[1]).toMatchInlineSnapshot(`
    [
      "",
    ]
  `)

  // Should be empty
  expect(input.element.value).toBe('')
})

it('sets initial value correctly', () => {
  const wrapper = createWrapper({ value: 'user@example.com' })
  const input = wrapper.find('input')

  // Should have the value we set
  expect(input.element.value).toBe('user@example.com')
})

it('updates value when props change', async () => {
  const wrapper = createWrapper({ value: 'first@example.com' })
  const input = wrapper.find('input')

  // Should have the initial value
  expect(input.element.value).toBe('first@example.com')

  // Update the prop
  await wrapper.setProps({ value: 'updated@example.com' })

  // Should reflect the new value
  expect(input.element.value).toBe('updated@example.com')
})

it('emits events when user types', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Type something
  await input.setValue('email@example.com')
  await input.trigger('input')

  // Verify the event was emitted with the correct value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "email@example.com",
    ]
  `)
})

it('prevents space keypress in email field', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Set a value first
  await input.setValue('test@example.com')
  await input.trigger('input')

  // Try to add a space with keypress
  await input.trigger('keypress', { key: ' ' })

  // Value should remain the same, without the space
  expect(input.element.value).toBe('test@example.com')
})

it('respects disabled attribute', async () => {
  const wrapper = createWrapper({ disabled: true })
  const input = wrapper.find('input')

  // Verify disabled attribute is set
  expect(input.attributes('disabled')).toBe('')

  // Try to set a value (shouldn't work because it's disabled)
  await input.setValue('test@example.com')

  // Cannot emit events when disabled
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

it('clears input when set to empty', async () => {
  // Start with a value
  const wrapper = createWrapper({ value: 'initial@example.com' })
  const input = wrapper.find('input')

  // Initially not empty
  expect(input.element.value).toBe('initial@example.com')

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
