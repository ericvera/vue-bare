<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { ClassValue } from './types.js'

export interface TextInputBareProps {
  /**
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize)
   */
  autocapitalize: 'none' | 'sentence' | 'words' | 'characters'
  /**
   * @see [Apple Docs](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element)
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
   */
  autocomplete:
    | 'off'
    | 'one-time-code'
    | 'name'
    | 'address-line1'
    | 'address-line2'
    // for US, State
    | 'address-level1'
    // for US, City
    | 'address-level2'
    | 'postal-code'
    | 'tel'
  id: string
  /**
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)
   */
  inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'search' | 'url' | 'tel'
  name: string
  placeholder: string
  /**
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck)
   */
  spellcheck: boolean

  autofocus?: boolean
  class?: ClassValue
  disabled?: boolean
  trimStart?: boolean
  modelValue?: string
  value?: string
}

// Prop required for implementer of TextInputBare, but not necessary for
// consumers
interface Props extends TextInputBareProps {
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
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const updateValue = (value: string) => {
  emit('update:modelValue', value)
}

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // If trimStart is not enabled, just update the model
  if (!props.trimStart) {
    updateValue(value)
    return
  }

  // Handle empty input case when trimStart is enabled
  if (!value || value.trim() === '') {
    updateValue('')
    input.value = ''
    return
  }

  // Check if there are leading spaces to trim
  if (value === value.trimStart()) {
    updateValue(value)
    return
  }

  const cursorPosition = input.selectionStart ?? 0
  const spacesRemoved = value.length - value.trimStart().length

  // Apply trimStart
  const trimmedValue = value.trimStart()
  updateValue(trimmedValue)

  // Directly update input value to ensure UI updates
  input.value = trimmedValue

  // Adjust cursor position
  const newCursorPosition = Math.max(0, cursorPosition - spacesRemoved)
  input.setSelectionRange(newCursorPosition, newCursorPosition)
}

const effectiveValue = computed(() => {
  const value = props.modelValue ?? props.value ?? ''

  // Apply trimStart if enabled
  if (props.trimStart && value) {
    return value.trimStart()
  }

  return value
})

const passtroughProps = computed(() => {
  const { value, modelValue, trimStart, ...rest } = props
  return rest
})
</script>

<template>
  <input
    ref="input-ref"
    :value="effectiveValue"
    type="text"
    v-bind="passtroughProps"
    @input="handleInput"
  />
</template>
