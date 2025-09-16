<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
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
  modelValue?: string
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

const handleChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  updateValue(input.value)
}

const effectiveValue = computed(() => props.modelValue ?? props.value ?? '')

const passtroughProps = computed(() => {
  const { value, modelValue, placeholder, ...rest } = props

  return {
    ...rest,
    ...(placeholder !== undefined && { placeholder }),
  }
})
</script>

<template>
  <input
    ref="input-ref"
    :value="effectiveValue"
    type="email"
    autocapitalize="none"
    inputmode="email"
    spellcheck="false"
    v-bind="passtroughProps"
    @keypress.prevent.space
    @change="handleChange"
  />
</template>
