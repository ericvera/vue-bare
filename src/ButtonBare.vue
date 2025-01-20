<script setup lang="ts">
import { ClassValue } from './types'

export interface ButtonProps {
  disabled?: boolean
  onClick: (event: MouseEvent) => void
}

interface Props extends ButtonProps {
  class: ClassValue
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button v-bind="props" @click="(e: MouseEvent) => emit('click', e)">
    <slot />
  </button>
</template>
