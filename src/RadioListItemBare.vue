<script setup lang="ts">
import { ClassValue } from './types'
import { inject } from 'vue'

export interface RadioListItemBareProps {
  value: string
  class?: ClassValue
  disabled?: boolean
}

// Prop required for implementer of RadioListItemBare, but not necessary for
// consumers
interface Props extends RadioListItemBareProps {
  class: ClassValue
}

const props = defineProps<Props>()

export interface RadioListItemBareDefaultSlotProps {
  selected: boolean
  listDisabled: boolean
}

defineSlots<{
  default(props: RadioListItemBareDefaultSlotProps): unknown
}>()

const listDisabled = inject<boolean>('disabled', false)
const selectedValue = inject<string>('value', '')
const onItemClick = inject<(value: string) => void>('onItemClick', () => {})

const internalOnItemClick = () => {
  if (!listDisabled && !props.disabled) {
    onItemClick?.(props.value)
  }
}
</script>

<template>
  <li
    :class="props.class"
    :disabled="props.disabled"
    @click="internalOnItemClick"
  >
    <slot :selected="props.value === selectedValue" :list-disabled />
  </li>
</template>
