import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import PasswordInputBare from './PasswordInputBare.vue'

const createWrapper = (props = {}) =>
  mount(PasswordInputBare, {
    props: {
      id: 'password-input',
      name: 'password',
      autocomplete: 'current-password',
      class: 'test-class',
      ...props,
    },
  })

it('renders correctly with default props', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  expect(input.exists()).toBe(true)
  expect(input.attributes('id')).toBe('password-input')
  expect(input.attributes('name')).toBe('password')
  expect(input.attributes('autocomplete')).toBe('current-password')
  expect(input.attributes('type')).toBe('password')
  expect(input.attributes('autocapitalize')).toBe('none')
  expect(input.attributes('inputmode')).toBe('text')
  expect(input.attributes('spellcheck')).toBe('false')
  expect(input.attributes('class')).toBe('test-class')
})

it('passes the correct attributes to the input', () => {
  const wrapper = createWrapper({
    disabled: true,
    autofocus: true,
    class: 'custom-class',
    autocomplete: 'new-password',
  })

  const input = wrapper.find('input')
  expect(input.attributes('disabled')).toBe('')
  expect(input.attributes('autofocus')).toBe('')
  expect(input.attributes('class')).toBe('custom-class')
  expect(input.attributes('autocomplete')).toBe('new-password')
})

it('handles empty input correctly', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Initial state should be empty
  expect(input.element.value).toBe('')

  // Set a value first
  await input.setValue('password123')
  await input.trigger('input')

  // Check the emitted event for the value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "password123",
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
  const wrapper = createWrapper({ value: 'initial-password' })
  const input = wrapper.find('input')

  // Should have the value we set
  expect(input.element.value).toBe('initial-password')
})

it('updates value when props change', async () => {
  const wrapper = createWrapper({ value: 'first-password' })
  const input = wrapper.find('input')

  // Should have the initial value
  expect(input.element.value).toBe('first-password')

  // Update the prop
  await wrapper.setProps({ value: 'updated-password' })

  // Should reflect the new value
  expect(input.element.value).toBe('updated-password')
})

it('emits events when user types', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Type something
  await input.setValue('secret123')
  await input.trigger('input')

  // Verify the event was emitted with the correct value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "secret123",
    ]
  `)
})

it('respects disabled attribute', async () => {
  const wrapper = createWrapper({ disabled: true })
  const input = wrapper.find('input')

  // Verify disabled attribute is set
  expect(input.attributes('disabled')).toBe('')

  // Try to set a value (shouldn't work because it's disabled)
  await input.setValue('password123')
  await input.trigger('input')

  // Cannot emit events when disabled
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

it('clears input when set to empty', async () => {
  // Start with a value
  const wrapper = createWrapper({ value: 'initial-password' })
  const input = wrapper.find('input')

  // Initially not empty
  expect(input.element.value).toBe('initial-password')

  // Set prop to empty
  await wrapper.setProps({ value: '' })

  // Should be empty
  expect(input.element.value).toBe('')
})
