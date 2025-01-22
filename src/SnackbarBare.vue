<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { ClassValue } from './types'

export interface SnackbarBareProps {
  show: boolean
  showClass: string
  hideClass: string
  class?: ClassValue
}

interface Props extends SnackbarBareProps {
  class: ClassValue
}

const props = defineProps<Props>()

const classes = ref<string>()
const root = ref<HTMLElement | null>(null)
const height = ref(0)

defineExpose({
  height,
})

// Trigger animations. Having this here, which the classes initialized to
// undefined ensures that there is no weird animation on first render.
watchEffect(() => {
  if (props.show) {
    classes.value = props.showClass
  } else if (classes.value !== undefined) {
    classes.value = props.hideClass
  }
})

watchEffect(() => {
  if (!root.value || !props.show) {
    height.value = 0
    return
  }

  const computedStyle = window.getComputedStyle(root.value)

  // Only include margin-bottom as this is used to calculate the bottom of any
  // element that goes above it which itself would include a margin-bottom.
  height.value =
    root.value.offsetHeight +
    parseFloat(computedStyle.getPropertyValue('margin-bottom')) +
    parseFloat(computedStyle.getPropertyValue('margin-top'))
})
</script>

<template>
  <div ref="root" :class="[classes, props.class]">
    <slot />
  </div>
</template>
