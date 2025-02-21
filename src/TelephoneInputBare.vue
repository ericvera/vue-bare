<script setup lang="ts">
import { formatPartialUSPhoneNumber, getPartialE164PhoneNumber } from 'e164num'
import { computed, watchEffect } from 'vue'
import { ClassValue } from './types'

export interface TelephoneInputBareProps {
  /**
   * @see [Apple Docs](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element)
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
   */
  autocomplete: 'tel' | 'off'
  id: string
  name: string
  placeholder: string

  autofocus?: boolean
  class?: ClassValue
  disabled?: boolean
  value?: string
}

interface Props extends TelephoneInputBareProps {
  class: ClassValue
}

const props = defineProps<Props>()

const model = defineModel({
  type: String,
  default: '',
})

// Create a function that determines the new cursor position based on the
// previous value and cursor position and the new value
const getNewCursorPosition = (
  previousValue: string,
  previousCursorPosition: number,
  newValue: string,
) => {
  // Get the number of actual digits before the cursor in the previous value
  const prevDigitsBeforeCursor = previousValue
    .slice(0, previousCursorPosition)
    .replace(/[^\d+]/g, '').length

  // Find position in new value where we have the same number of digits
  let newPosition = newValue.length > 0 && newValue[0] === '(' ? 1 : 0
  let digitCount = 0

  while (newPosition < newValue.length && digitCount < prevDigitsBeforeCursor) {
    const char = newValue[newPosition]

    if (char && /[\d+]/.test(char)) {
      digitCount++
    }

    newPosition++
  }

  return newPosition
}

// Handle input changes
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Filter out non-digit and non-plus characters
  const filteredValue = value.replace(/[^\d+]/g, '')

  // Ensure only one plus sign at the start
  const normalizedValue = filteredValue.replace(/\+/g, '')
  const finalValue = filteredValue.startsWith('+')
    ? `+${normalizedValue}`
    : normalizedValue

  const newE164Value = getPartialE164PhoneNumber(finalValue)

  model.value = newE164Value

  const formattedValue = formatPartialUSPhoneNumber(newE164Value)

  // Get cursor position before updating the value
  const cursorPosition = input.selectionStart

  input.value = formattedValue

  // Fix cursor position to account for formatting
  const newCursorPosition = getNewCursorPosition(
    value,
    cursorPosition ?? 0,
    formattedValue,
  )
  input.setSelectionRange(newCursorPosition, newCursorPosition)
}

watchEffect(() => {
  if (props.value !== undefined) {
    model.value = getPartialE164PhoneNumber(props.value)
  }
})

const passtroughProps = computed(() => {
  const { value, ...rest } = props

  return rest
})
</script>

<template>
  <input
    :value="formatPartialUSPhoneNumber(model)"
    type="tel"
    autocapitalize="none"
    inputmode="tel"
    spellcheck="false"
    v-bind="passtroughProps"
    @input="handleInput"
  />
</template>
