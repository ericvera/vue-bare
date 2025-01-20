<script setup lang="ts">
import { DefineComponent } from 'vue'

type ClassValue = string | object | (string | object)[] | undefined

interface BaseProps {
  disabled?: boolean
}

interface LinkProps extends BaseProps {
  to: string
  is: DefineComponent
  onClick?: never
}

interface ButtonProps extends BaseProps {
  to?: never
  is?: never
  onClick: (event: MouseEvent) => void
}

export type ButtonBareProps = LinkProps | ButtonProps

interface Props {
  class: ClassValue
}

const props = defineProps<Props & ButtonBareProps>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <component
    :is="props.to && !props.disabled ? props.is : 'button'"
    :class="props.class"
    :to="props.to"
    :disabled="props.disabled"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <slot />
  </component>
</template>
