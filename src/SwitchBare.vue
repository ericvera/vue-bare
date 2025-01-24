<script setup lang="ts">
import { watch } from 'vue'
import { ClassValue } from './types'

export interface SwitchBareProps {
  id: string
  disabled?: boolean
  class?: ClassValue
  value?: boolean
}

const props = defineProps<SwitchBareProps>()

const model = defineModel({
  type: Boolean,
  default: false,
})

watch(
  () => props.value,
  (value) => {
    model.value = value
  },
  {
    immediate: true,
  },
)

const onClick = () => {
  if (props.disabled) {
    return
  }

  model.value = !model.value
}
</script>

<template>
  <div v-bind="props" @click="onClick">
    <slot />
  </div>
</template>
