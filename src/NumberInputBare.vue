<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { ClassValue } from './types.js'

export interface NumberInputBareProps {
  /**
   * @see [Apple Docs](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element)
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
   */
  autocomplete: 'off'
  id: string
  name: string
  placeholder: string

  autofocus?: boolean
  class?: ClassValue
  disabled?: boolean
  maxDigits?: number
  modelValue?: number
  value?: number
}

interface Props extends NumberInputBareProps {
  class: ClassValue
}

const props = defineProps<Props>()
const inputRef = useTemplateRef<HTMLInputElement>('input-ref')

defineExpose({
  focus: () => {
    inputRef.value?.focus()
  },
  blur: () => {
    inputRef.value?.blur()
  },
  select: () => {
    inputRef.value?.select()
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

const updateValue = (value: number | undefined) => {
  emit('update:modelValue', value)
}

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Handle empty input case
  if (!value || value.trim() === '') {
    updateValue(undefined)
    input.value = ''
    return
  }

  // Filter out non-digit characters
  let filteredValue = value.replace(/[^\d]/g, '')

  // Apply maxDigits constraint (default to 15 to stay within safe integer
  // range)
  const effectiveMaxDigits = Math.min(props.maxDigits ?? 15, 15)

  if (filteredValue.length > effectiveMaxDigits) {
    filteredValue = filteredValue.slice(0, effectiveMaxDigits)
  }

  // Update input value to filtered value
  if (filteredValue !== value) {
    const cursorPosition = input.selectionStart ?? 0
    input.value = filteredValue
    // Maintain cursor position after filtering
    const newCursorPosition = Math.min(cursorPosition, filteredValue.length)
    input.setSelectionRange(newCursorPosition, newCursorPosition)
  }

  if (filteredValue === '') {
    updateValue(undefined)
    return
  }

  const numericValue = parseInt(filteredValue, 10)
  updateValue(numericValue)
}

const effectiveValue = computed(() => {
  const value = props.modelValue ?? props.value

  return value !== undefined ? value.toString() : ''
})

const passtroughProps = computed(() => {
  const { value, modelValue, maxDigits, ...rest } = props

  return rest
})
</script>

<template>
  <input
    ref="input-ref"
    :value="effectiveValue"
    type="text"
    autocapitalize="none"
    inputmode="numeric"
    spellcheck="false"
    v-bind="passtroughProps"
    @input="handleInput"
  />
</template>
