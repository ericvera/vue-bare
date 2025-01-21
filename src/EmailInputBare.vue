<script setup lang="ts">
import { computed } from 'vue'
import { ClassValue } from './types'

export interface EmailInputBareProps {
  // https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
  autocomplete: 'off' | 'username' | 'email'

  id: string
  name: string
  autofocus?: boolean
  disabled?: boolean
  class?: ClassValue
}

const props = defineProps<EmailInputBareProps>()
const model = defineModel({
  type: String,
  default: '',
})

// Remove value from passtroughProps as model takes care of it
const passtroughProps = computed(() => {
  const { class: _, ...rest } = props
  return rest
})
</script>

<template>
  <input
    v-model="model"
    type="email"
    autocapitalize="none"
    inputmode="email"
    spellcheck="false"
    v-bind="passtroughProps"
    @keypress.prevent.space
  />
</template>
