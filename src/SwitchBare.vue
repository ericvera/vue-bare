<script setup lang="ts">
import { computed } from 'vue'
import { ClassValue } from './types'

export interface SwitchBareProps {
  id: string
  name: string

  class?: ClassValue
  disabled?: boolean
  value?: boolean
  modelValue?: boolean
}

interface Props extends SwitchBareProps {
  class: ClassValue
}

const props = defineProps<Props>()

const effectiveValue = computed(() => props.modelValue || props.value)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const updateValue = (value: boolean) => {
  emit('update:modelValue', value)
}

const onClick = () => {
  if (props.disabled) {
    return
  }

  updateValue(!effectiveValue.value)
}
</script>

<template>
  <div v-bind="props" @click="onClick">
    <slot />
  </div>
</template>
