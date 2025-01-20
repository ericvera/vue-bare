<script setup lang="ts">
type ClassValue = string | object | (string | object)[] | undefined

interface BaseProps {
  disabled?: boolean
}

interface LinkProps extends BaseProps {
  to: string
  onClick?: never
}

interface ButtonProps extends BaseProps {
  to?: never
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
  <NuxtLink
    v-if="props.to && !props.disabled"
    :class="props.class"
    :to="props.to"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :class="props.class"
    :disabled="props.disabled"
    @click="(e) => emit('click', e)"
  >
    <slot />
  </button>
</template>
