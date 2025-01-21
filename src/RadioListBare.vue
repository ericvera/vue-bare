<script setup lang="ts">
import { ClassValue } from './types'
import { provide, watchEffect } from 'vue'

export interface RadioListBareProps {
  value?: string
  disabled?: boolean
  // NOTE: ul may not require styling so not forcing class prop to be defined
  class?: ClassValue
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

provide('value', model)
provide('disabled', props.disabled)
provide('onItemClick', onItemClick)
</script>

<template>
  <ul :class="props.class">
    <slot />
  </ul>
</template>
