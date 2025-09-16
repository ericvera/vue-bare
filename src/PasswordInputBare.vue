<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
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
  toggleable?: boolean
  modelValue?: string
  value?: string
  wrapperClass?: ClassValue
}

interface Props extends PasswordInputBareProps {
  class: ClassValue
}

const props = defineProps<Props>()
const inputRef = useTemplateRef<HTMLInputElement>('input-ref')
const isVisible = ref(false)

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

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

const inputType = computed(() => {
  return props.toggleable && isVisible.value ? 'text' : 'password'
})

const passtroughProps = computed(() => {
  const { value, modelValue, toggleable, wrapperClass, ...rest } = props
  return rest
})
</script>

<template>
  <div v-if="toggleable" :class="wrapperClass">
    <input
      ref="input-ref"
      :value="effectiveValue"
      :type="inputType"
      autocapitalize="none"
      inputmode="text"
      spellcheck="false"
      v-bind="passtroughProps"
      @change="handleChange"
    />
    <slot name="toggle" :is-visible="isVisible" :toggle="toggleVisibility" />
  </div>
  <input
    v-else
    ref="input-ref"
    :value="modelValue ?? value ?? ''"
    type="password"
    autocapitalize="none"
    inputmode="text"
    spellcheck="false"
    v-bind="passtroughProps"
    @change="handleChange"
  />
</template>
