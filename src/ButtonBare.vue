<script setup lang="ts">
import { ClassValue } from './types'

export interface ButtonProps {
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  class?: ClassValue
}

interface Props extends ButtonProps {
  class: ClassValue
}

const props = defineProps<Props>()
</script>

<template>
  <component :is="props.onClick ? 'button' : 'a'" v-bind="props">
    <slot />
  </component>
</template>
