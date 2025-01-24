<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { ClassValue } from './types'

export interface PasswordInputBareProps {
  /**
   * @see [Apple Docs](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element)
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
   */
  autocomplete: 'current-password' | 'new-password'
  id: string
  name: string

  autofocus?: boolean
  class?: ClassValue
  disabled?: boolean
  value?: string
}

interface Props extends PasswordInputBareProps {
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
    type="password"
    autocapitalize="none"
    inputmode="text"
    spellcheck="false"
    v-bind="passtroughProps"
  />
</template>
