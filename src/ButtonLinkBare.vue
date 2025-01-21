<script setup lang="ts">
import { ClassValue } from './types'

export interface ButtonLinkProps {
  disabled?: boolean
  class?: ClassValue
  to: string
}

interface Props extends ButtonLinkProps {
  class: ClassValue
}

const props = defineProps<Props>()
</script>

<template>
  <slot v-bind="props" />
</template>
