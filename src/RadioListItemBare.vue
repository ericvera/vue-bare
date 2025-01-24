<script setup lang="ts">
import { inject } from 'vue'
import { RadioListInjectionKeys } from './constants'
import { ClassValue } from './types'

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

const listDisabled = inject<boolean>(RadioListInjectionKeys.Disabled, false)
const selectedValue = inject<string>(RadioListInjectionKeys.Value, '')
const onItemClick = inject<(value: string) => void>(
  RadioListInjectionKeys.OnItemClick,
  () => {},
)

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
