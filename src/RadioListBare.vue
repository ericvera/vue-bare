<script setup lang="ts">
import { computed, provide } from 'vue'
import { RadioListInjectionKeys } from './constants'
import { ClassValue } from './types'

export interface RadioListBareProps {
  id: string
  name: string

  /**
   * @remarks `ul` may not require styling so not forcing class prop to be
   * defined
   */
  class?: ClassValue
  disabled?: boolean
  value?: string
  modelValue?: string
}

const props = defineProps<RadioListBareProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const updateValue = (value: string) => {
  emit('update:modelValue', value)
}

const onItemClick = (value: string) => {
  updateValue(value)
}

const effectiveValue = computed(() => props.modelValue ?? props.value ?? '')

provide(RadioListInjectionKeys.Value, effectiveValue)
provide(RadioListInjectionKeys.Disabled, props.disabled)
provide(RadioListInjectionKeys.OnItemClick, onItemClick)
</script>

<template>
  <ul v-bind="props">
    <slot />
  </ul>
</template>
