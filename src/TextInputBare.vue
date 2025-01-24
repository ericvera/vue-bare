<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { ClassValue } from './types'

export interface TextInputBareProps {
  /**
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize)
   */
  autocapitalize: 'none' | 'sentence' | 'words' | 'characters'
  /**
   * @see [Apple Docs](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element)
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
   */
  autocomplete:
    | 'off'
    | 'one-time-code'
    | 'name'
    | 'address-line1'
    | 'address-line2'
    | 'address-level1' // for US, State
    | 'address-level2' // for US, City
    | 'postal-code'
    | 'tel'
  id: string
  /**
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)
   */
  inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'search' | 'url' | 'tel'
  name: string
  placeholder: string
  /**
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck)
   */
  spellcheck: boolean

  autofocus?: boolean
  class?: ClassValue
  disabled?: boolean
  value?: string
}

// Prop required for implementer of TextInputBare, but not necessary for
// consumers
interface Props extends TextInputBareProps {
  class: ClassValue
}

const props = defineProps<Props>()

const model = defineModel({
  type: String,
  default: '',
})

watchEffect(() => {
  if (props.value !== undefined) {
    model.value = props.value
  }
})

const passtroughProps = computed(() => {
  const { value, ...rest } = props
  return rest
})
</script>

<template>
  <input v-model="model" type="text" v-bind="passtroughProps" />
</template>
