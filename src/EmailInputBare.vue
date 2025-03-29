<script setup lang="ts">
import { computed, useTemplateRef, watchEffect } from 'vue'
import { ClassValue } from './types'

export interface EmailInputBareProps {
  /**
   * @see [Apple Docs](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element)
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
   */
  autocomplete: 'off' | 'username' | 'email'
  id: string
  name: string

  autofocus?: boolean
  class?: ClassValue
  disabled?: boolean
  placeholder?: string
  value?: string
}

interface Props extends EmailInputBareProps {
  class: ClassValue
}

const props = defineProps<Props>()
const inputRef = useTemplateRef<HTMLInputElement>('input-ref')

defineExpose({
  focus: () => {
    inputRef.value?.focus()
  },
})

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
  const { value, placeholder, ...rest } = props

  return {
    ...rest,
    ...(placeholder !== undefined && { placeholder }),
  }
})
</script>

<template>
  <input
    ref="input-ref"
    v-model="model"
    type="email"
    autocapitalize="none"
    inputmode="email"
    spellcheck="false"
    v-bind="passtroughProps"
    @keypress.prevent.space
  />
</template>
