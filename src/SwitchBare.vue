<script setup lang="ts">
import { watch } from 'vue'
import { ClassValue } from './types'

export interface SwitchBareProps {
  id: string
  name: string

  class?: ClassValue
  disabled?: boolean
  value?: boolean
}

interface Props extends SwitchBareProps {
  class: ClassValue
}

const props = defineProps<Props>()

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
