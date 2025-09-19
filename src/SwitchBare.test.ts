import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import SwitchBare from './SwitchBare.vue'

const createWrapper = (props = {}) =>
  mount(SwitchBare, {
    props: {
      id: 'switch-input',
      name: 'switch',
      class: 'test-class',
      ...props,
    },
    slots: {
      default: 'Switch Label',
    },
  })

it('renders correctly with default props', () => {
  const wrapper = createWrapper()
  const switchDiv = wrapper.find('div')

  expect(switchDiv.exists()).toBe(true)
  expect(switchDiv.attributes('id')).toBe('switch-input')
  expect(switchDiv.attributes('name')).toBe('switch')
  expect(switchDiv.attributes('class')).toBe('test-class')
  expect(switchDiv.text()).toBe('Switch Label')
})

it('passes the correct attributes to the div', () => {
  const wrapper = createWrapper({
    disabled: true,
    class: 'custom-class',
  })

  const switchDiv = wrapper.find('div')
  expect(switchDiv.attributes('disabled')).toBe('true')
  expect(switchDiv.attributes('class')).toBe('custom-class')
})

it('does not emit update event initially when no value is specified', () => {
  const wrapper = createWrapper()

  // No event should be emitted initially when no value is specified
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

it('toggles value when clicked', async () => {
  const wrapper = createWrapper()
  const switchDiv = wrapper.find('div')

  // Initial state (false)
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()

  // Click to change state to true
  await switchDiv.trigger('click')

  // Should emit true
  expect(wrapper.emitted('update:modelValue')?.[0]).toMatchInlineSnapshot(`
    [
      true,
    ]
  `)

  // Update the prop to simulate v-model binding
  await wrapper.setProps({ modelValue: true })

  // Click again to change state to false
  await switchDiv.trigger('click')

  // Should emit false
  expect(wrapper.emitted('update:modelValue')?.[1]).toMatchInlineSnapshot(`
    [
      false,
    ]
  `)
})

it('updates value when props change', async () => {
  const wrapper = createWrapper({ value: false })

  // Update the prop to true
  await wrapper.setProps({ value: true })

  // Should not emit when value prop changes
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()

  // Update the prop to false
  await wrapper.setProps({ value: false })

  // Should still not emit
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

it('does not toggle when disabled', async () => {
  const wrapper = createWrapper({ disabled: true })
  const switchDiv = wrapper.find('div')

  // Initial state (no emit)
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()

  // Try to click
  await switchDiv.trigger('click')

  // Should not emit anything
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

it('allows custom slot content', () => {
  const wrapper = mount(SwitchBare, {
    props: {
      id: 'switch-input',
      name: 'switch',
      class: 'switch-class',
    },
    slots: {
      default: '<span class="custom-label">Custom Content</span>',
    },
  })

  const customLabel = wrapper.find('.custom-label')
  expect(customLabel.exists()).toBe(true)
  expect(customLabel.text()).toBe('Custom Content')
})

it('prioritizes modelValue over value prop', async () => {
  const wrapper = createWrapper({
    modelValue: true,
    value: false,
  })
  const switchDiv = wrapper.find('div')

  // Should use modelValue (true), so clicking should emit false
  await switchDiv.trigger('click')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
})

it('falls back to value when modelValue is undefined', async () => {
  const wrapper = createWrapper({ value: true })
  const switchDiv = wrapper.find('div')

  // Should use value (true), so clicking should emit false
  await switchDiv.trigger('click')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
})

it('handles falsy values correctly', async () => {
  const wrapper = createWrapper({ modelValue: false })
  const switchDiv = wrapper.find('div')

  // Should use modelValue (false), so clicking should emit true
  await switchDiv.trigger('click')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
})
