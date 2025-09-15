<script setup lang="ts">
import { computed, useTemplateRef, watchEffect } from 'vue'
import { ClassValue } from './types'

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
    | 'address-level1' // for US, State
    | 'address-level2' // for US, City
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

const model = defineModel({
  type: String,
  default: '',
})

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // If trimStart is not enabled, just update the model
  if (!props.trimStart) {
    model.value = value
    return
  }

  // Handle empty input case when trimStart is enabled
  if (!value || value.trim() === '') {
    model.value = ''
    input.value = ''
    return
  }

  // Check if there are leading spaces to trim
  if (value === value.trimStart()) {
    model.value = value
    return
  }

  const cursorPosition = input.selectionStart ?? 0
  const spacesRemoved = value.length - value.trimStart().length

  // Apply trimStart
  const trimmedValue = value.trimStart()
  model.value = trimmedValue

  // Directly update input value to ensure UI updates
  input.value = trimmedValue

  // Adjust cursor position
  const newCursorPosition = Math.max(0, cursorPosition - spacesRemoved)
  input.setSelectionRange(newCursorPosition, newCursorPosition)
}

watchEffect(() => {
  if (props.value !== undefined) {
    let newValue = props.value

    // Apply trimStart if enabled and value is being set programmatically
    if (props.trimStart && newValue) {
      newValue = newValue.trimStart()
    }

    model.value = newValue
  }
})

const passtroughProps = computed(() => {
  const { value, trimStart, ...rest } = props
  return rest
})
</script>

<template>
  <input
    ref="input-ref"
    :value="model"
    type="text"
    v-bind="passtroughProps"
    @input="handleInput"
  />
</template>
