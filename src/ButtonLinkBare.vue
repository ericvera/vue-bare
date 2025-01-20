<script setup lang="ts">
import { DefineComponent } from 'vue'
import { ClassValue } from './types'

export interface ButtonLinkProps {
  disabled?: boolean
  class?: ClassValue
  to: string
}

interface Props extends ButtonLinkProps {
  class: ClassValue
  is: DefineComponent
}

const props = defineProps<Props>()
</script>

<template>
  <component v-bind="props">
    <slot />
  </component>
</template>
