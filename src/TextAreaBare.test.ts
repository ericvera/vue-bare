import { mount } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'
import TextAreaBare from './TextAreaBare.vue'

// Mock the window.getComputedStyle
const mockGetComputedStyle = vi.fn().mockReturnValue({
  getPropertyValue: (prop: string) => {
    if (prop === 'padding-top') {
      return '5'
    }

    if (prop === 'padding-bottom') {
      return '5'
    }

    return '0'
  },
})

// Set up mocks before tests
// Mock the Element.scrollHeight which is read-only
beforeEach(() => {
  // Mock the Element.scrollHeight which is read-only
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: function () {
      return 40
    },
  })
})

const createWrapper = (props = {}) =>
  mount(TextAreaBare, {
    props: {
      id: 'textarea-input',
      name: 'textarea',
      placeholder: 'Enter text',
      spellcheck: false,
      class: 'test-class',
      ...props,
    },
    global: {
      mocks: {
        window: {
          getComputedStyle: mockGetComputedStyle,
        },
      },
    },
  })

it('renders correctly with default props', () => {
  const wrapper = createWrapper()
  const textarea = wrapper.find('textarea')

  expect(textarea.exists()).toBe(true)
  expect(textarea.attributes('id')).toBe('textarea-input')
  expect(textarea.attributes('name')).toBe('textarea')
  expect(textarea.attributes('placeholder')).toBe('Enter text')
  expect(textarea.attributes('spellcheck')).toBe('false')
  expect(textarea.attributes('rows')).toBe('1')
  expect(textarea.attributes('autocomplete')).toBe('off')
  expect(textarea.attributes('autocapitalize')).toBe('sentence')
  expect(textarea.attributes('inputmode')).toBe('text')
  expect(textarea.attributes('class')).toBe('test-class')
})

it('passes the correct attributes to the textarea', () => {
  const wrapper = createWrapper({
    disabled: true,
    autofocus: true,
    class: 'custom-class',
  })

  const textarea = wrapper.find('textarea')
  expect(textarea.attributes('disabled')).toBe('')
  expect(textarea.attributes('autofocus')).toBe('')
  expect(textarea.attributes('class')).toBe('custom-class')
})

it('handles empty input correctly', async () => {
  const wrapper = createWrapper()
  const textarea = wrapper.find('textarea')

  // Initial state should be empty
  expect(textarea.element.value).toBe('')

  // Set a value first
  await textarea.setValue('test value')

  // Check the emitted event for the value
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      "test value",
    ]
  `)

  // Now clear it
  await textarea.setValue('')

  // Check the emitted event for empty string
  expect(wrapper.emitted('update:modelValue')?.[1]).toMatchInlineSnapshot(`
    [
      "",
    ]
  `)

  // Should be empty
  expect(textarea.element.value).toBe('')
})

it('respects maxCharacters prop', async () => {
  // Create a fresh wrapper for this test
  const wrapper = createWrapper({ maxCharacters: 5 })
  const textarea = wrapper.find('textarea')

  // Set value and trigger both input and change events
  await textarea.setValue('123456789')
  await textarea.trigger('change')

  // Check the DOM value - it should be trimmed in the component
  expect(textarea.element.value).toBe('12345')
  expect(textarea.element.value.length).toBe(5)

  // Get the emitted value
  const emitted = wrapper.emitted('update:modelValue')
  expect(emitted).toBeTruthy()

  // The emitted value should be the trimmed one
  const lastEmittedValue = emitted?.[emitted.length - 1]
  expect(lastEmittedValue).toMatchInlineSnapshot(`
    [
      "12345",
    ]
  `)
})

it('emits focus and blur events', async () => {
  const wrapper = createWrapper()
  const textarea = wrapper.find('textarea')

  // Trigger focus
  await textarea.trigger('focus')
  expect(wrapper.emitted('focus')).toBeTruthy()

  // Trigger blur
  await textarea.trigger('blur')
  expect(wrapper.emitted('blur')).toBeTruthy()
})

it('sets initial value correctly', () => {
  const wrapper = createWrapper({ value: 'initial value' })
  const textarea = wrapper.find('textarea')

  // Should have the value we set
  expect(textarea.element.value).toBe('initial value')
})

it('updates value when props change', async () => {
  const wrapper = createWrapper({ value: 'first value' })
  const textarea = wrapper.find('textarea')

  // Should have the initial value
  expect(textarea.element.value).toBe('first value')

  // Update the prop
  await wrapper.setProps({ value: 'updated value' })

  // Should reflect the new value
  expect(textarea.element.value).toBe('updated value')
})
