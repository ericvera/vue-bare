<script setup lang="ts">
import { ClassValue } from './types'

export interface TextInputBareProps {
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize
  autocapitalize: 'none' | 'sentence' | 'words' | 'characters'

  // https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
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

  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode
  inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'search' | 'url' | 'tel'

  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck
  // NOTE: This being on will cause email to be auto-capitalized
  spellcheck: boolean

  id: string
  placeholder: string
  name: string
  autofocus?: boolean
  disabled?: boolean
  class?: ClassValue
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
</script>

<template>
  <input v-model="model" type="text" v-bind="props" />
</template>
