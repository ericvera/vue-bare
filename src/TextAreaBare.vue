<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ClassValue } from './types'

export interface TextAreaBareProps {
  id: string
  name: string
  placeholder: string
  /**
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck)
   */
  spellcheck: boolean

  autofocus?: boolean
  class?: ClassValue
  disabled?: boolean
  maxCharacters?: number
  maxRows?: number
  modelValue?: string
  value?: string
}

interface Props extends TextAreaBareProps {
  class: ClassValue
}

const DefaultRows = 2

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  keypress: [event: KeyboardEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const updateValue = (value: string) => {
  emit('update:modelValue', value)
}

const calculatedLineHeight = ref(0)
const element = ref<HTMLTextAreaElement>()

defineExpose({
  focus: () => {
    element.value?.focus()
  },
  blur: () => {
    element.value?.blur()
  },
  click: () => {
    element.value?.click()
  },
})

const effectiveValue = computed(() => props.modelValue ?? props.value ?? '')

// Remove class from passtroughProps as it is handled separately
const passtroughProps = computed(() => {
  const { maxRows, maxCharacters, value, modelValue, ...rest } = props

  return rest
})

const resize = () => {
  if (!element.value) {
    return
  }

  element.value.style.height = 'inherit'

  const computedStyles = window.getComputedStyle(element.value)
  const totalPadding = getTotalPadding(computedStyles)

  const height =
    Math.min(
      (props.maxRows ?? DefaultRows) * calculatedLineHeight.value,
      element.value.scrollHeight - totalPadding,
    ) + totalPadding

  element.value.style.height = `${height}px`
}

const getTotalPadding = (computedStyle: CSSStyleDeclaration) =>
  parseInt(computedStyle.getPropertyValue('padding-top')) +
  parseInt(computedStyle.getPropertyValue('padding-bottom'))

const getLineHeight = () => {
  if (!element.value) {
    return 0
  }

  // Store original value set to empty to force single line height calculation
  const originalValue = element.value.value
  element.value.value = ''
  element.value.rows = 1

  const computedStyles = window.getComputedStyle(element.value)
  const oneLineHeight =
    element.value.scrollHeight - getTotalPadding(computedStyles)

  // Set to new line and then two rows to force double line height calculation
  element.value.value = '\n'
  element.value.rows = 2
  const twoLineHeight =
    element.value.scrollHeight - getTotalPadding(computedStyles)

  // Restore original state
  element.value.rows = 1
  element.value.value = originalValue

  return twoLineHeight - oneLineHeight
}

onMounted(() => {
  calculatedLineHeight.value = getLineHeight()
})

// Calculate whenever the value changes
watch(
  [effectiveValue, calculatedLineHeight],
  () => {
    resize()
  },
  // Needed in order to resize after the textarea has been updated
  { flush: 'post' },
)

// Ignore keypresses beyond maxCharacters
const keypressHandler = (e: KeyboardEvent) => {
  emit('keypress', e)

  if (props.maxCharacters === undefined) {
    return
  }

  const { value } = e.target as HTMLTextAreaElement

  if (value.length >= props.maxCharacters) {
    e.preventDefault()
  }
}

// Handle input and change events, ensuring value respects maxCharacters
const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement

  // If maxCharacters is set, always ensure value respects the limit
  if (props.maxCharacters !== undefined) {
    const inputValue = target.value.slice(0, props.maxCharacters)

    // Always update the input field with the potentially trimmed value
    target.value = inputValue

    // Set the model value to the trimmed value
    updateValue(inputValue)
  } else {
    // Just update the model with the original value
    updateValue(target.value)
  }

  resize()
}
</script>

<template>
  <textarea
    ref="element"
    :value="effectiveValue"
    rows="1"
    autoComplete="off"
    autocapitalize="sentence"
    inputmode="text"
    v-bind="passtroughProps"
    @keypress="keypressHandler"
    @input="handleInput"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>
