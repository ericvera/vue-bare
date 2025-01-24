<script setup lang="ts">
import { provide, watchEffect } from 'vue'
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
}

const props = defineProps<RadioListBareProps>()

const model = defineModel<string>()

const onItemClick = (value: string) => {
  model.value = value
}

// Update the model value when the props value changes
watchEffect(() => {
  model.value = props.value
})

provide(RadioListInjectionKeys.Value, model)
provide(RadioListInjectionKeys.Disabled, props.disabled)
provide(RadioListInjectionKeys.OnItemClick, onItemClick)
</script>

<template>
  <ul v-bind="props">
    <slot />
  </ul>
</template>
