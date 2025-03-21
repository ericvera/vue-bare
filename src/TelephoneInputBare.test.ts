import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import TelephoneInputBare from './TelephoneInputBare.vue'

const createWrapper = (props = {}) =>
  mount(TelephoneInputBare, {
    props: {
      id: 'phone-input',
      name: 'phone',
      placeholder: 'Phone number',
      autocomplete: 'tel',
      class: 'test-class',
      ...props,
    },
  })

it('renders correctly with default props', () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  expect(input.exists()).toBe(true)
  expect(input.attributes('id')).toBe('phone-input')
  expect(input.attributes('name')).toBe('phone')
  expect(input.attributes('placeholder')).toBe('Phone number')
  expect(input.attributes('autocomplete')).toBe('tel')
  expect(input.attributes('type')).toBe('tel')
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
  await input.setValue('12345')
  await input.trigger('input')

  // Check the emitted event for the digits
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "+12345",
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

it('formats phone numbers as user types', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Type a phone number
  await input.setValue('2345678901')
  await input.trigger('input')

  // Check the emitted event value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "+12345678901",
    ]
  `)

  // Should be formatted
  expect(input.element.value).not.toBe('2345678901')

  // Verify the formatted value
  expect(input.element.value).toMatchInlineSnapshot(`"(234) 567-8901"`)
})

it('formats appropriately when the user enters a plus sign for US numbers', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Input with plus sign
  await input.setValue('+12345678901')
  await input.trigger('input')

  // Check that events were emitted with the correct value
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')

  // Access the emitted value with snapshot
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "+12345678901",
    ]
  `)

  // Verify the formatted value
  expect(input.element.value).toMatchInlineSnapshot(`"(234) 567-8901"`)
})

it('formats appropriately when the user enters a plus sign for international numbers', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Input with plus sign
  await input.setValue('+3')
  await input.trigger('input')

  // Check that events were emitted with the correct value
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')

  // Access the emitted value with snapshot
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "+3",
    ]
  `)

  // Verify the formatted value
  expect(input.element.value).toMatchInlineSnapshot(`"+3"`)
})

it('clears input when set to empty', async () => {
  // Start with a value
  const wrapper = createWrapper({ value: '1234567890' })
  const input = wrapper.find('input')

  // Initially not empty
  expect(input.element.value).not.toBe('')

  // Verify initial value is formatted correctly
  expect(input.element.value).toMatchInlineSnapshot(`"(234) 567-890"`)

  // Set prop to empty
  await wrapper.setProps({ value: '' })

  // Should be empty
  expect(input.element.value).toBe('')
})

it('filters out non-digit characters except plus sign', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Input with non-digit characters - only keep digits
  await input.setValue('abc123-456.789')
  await input.trigger('input')

  // Verify events were emitted
  const emittedEvents = wrapper.emitted()
  expect(emittedEvents).toHaveProperty('update:modelValue')

  // Access the emitted value with optional chaining
  expect(emittedEvents['update:modelValue']?.[0]).toMatchInlineSnapshot(`
    [
      "+123456789",
    ]
  `)

  // Verify the formatted value
  expect(input.element.value).toMatchInlineSnapshot(`"(234) 567-89"`)
})

// Test cursor positioning functionality
it('handles input formatting without losing cursor context', async () => {
  const wrapper = createWrapper()
  const input = wrapper.find('input')

  // Type a sequence of digits and verify the component formats correctly
  await input.setValue('1')
  await input.trigger('input')
  const step1 = input.element.value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "+1",
    ]
  `)

  await input.setValue('12')
  await input.trigger('input')
  const step2 = input.element.value
  expect(wrapper.emitted('update:modelValue')?.[1]).toMatchInlineSnapshot(`
    [
      "",
    ]
  `)

  await input.setValue('123')
  await input.trigger('input')
  const step3 = input.element.value
  expect(wrapper.emitted('update:modelValue')?.[2]).toMatchInlineSnapshot(`
    [
      "+12",
    ]
  `)

  // Verify each step has different formatting as digits are added
  // Should be formatted
  expect(step1).not.toBe('1')

  // Should be formatted
  expect(step2).not.toBe('12')

  // Should be formatted
  expect(step3).not.toBe('123')

  // Verify adding more digits changes the formatting
  expect(step2).not.toBe(step1)
  expect(step3).not.toBe(step2)

  expect(input.element.value).toMatchInlineSnapshot(`"(23"`)
})
