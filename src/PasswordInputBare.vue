<script setup lang="ts">
import { ClassValue } from './types'

export interface PasswordInputBareProps {
  // https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
  autocomplete: 'current-password' | 'new-password'

  id: string
  name: string
  autofocus?: boolean
  disabled?: boolean
  class?: ClassValue
}

interface Props extends PasswordInputBareProps {
  class: ClassValue
}

const props = defineProps<Props>()

const model = defineModel({
  type: String,
  default: '',
})
</script>

<template>
  <input
    v-model="model"
    type="password"
    autocapitalize="none"
    inputmode="text"
    spellcheck="false"
    v-bind="props"
  />
</template>
