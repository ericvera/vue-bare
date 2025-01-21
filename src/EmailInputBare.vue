<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { ClassValue } from './types'

export interface EmailInputBareProps {
  // https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
  autocomplete: 'off' | 'username' | 'email'

  id: string
  name: string
  value?: string
  autofocus?: boolean
  disabled?: boolean
  class?: ClassValue
}

interface Props extends EmailInputBareProps {
  class: ClassValue
}

const props = defineProps<Props>()

const model = defineModel({
  type: String,
  default: '',
})

watchEffect(() => {
  if (props.value !== undefined) {
    model.value = props.value
  }
})

const passtroughProps = computed(() => {
  const { value, ...rest } = props
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
