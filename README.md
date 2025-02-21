# Vue Bare

**Unstyled Vue components for frustration-free human interactions**

[![github license](https://img.shields.io/github/license/ericvera/vue-bare.svg?style=flat-square)](https://github.com/ericvera/vue-bare/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/vue-bare.svg?style=flat-square)](https://npmjs.org/package/vue-bare)

Vue Bare provides a collection of unstyled Vue components that focus on making it simple to provide a great user experience.

# Features

- 🎯 **UX-First**: Enforces HTML attributes that create frustration-free experiences
- 🎨 **Completely Unstyled**: Full control over your component styling
- 🔒 **Type-Safe**: Written in TypeScript with full type definitions
- 📦 **Tree-Shakeable**: Only import what you need
- 🪶 **Lightweight**: No unnecessary styling or JavaScript overhead

All components support `v-model` binding for seamless two-way data binding in your Vue applications.

## Requirements

- Vue 3
- Node.js >= 20

## Components

### TextInputBare

A bare text input component that forces some props for an improved UX.

Required props:

- `autocapitalize`: 'none' | 'sentence' | 'words' | 'characters'
- `autocomplete`: 'off' | 'one-time-code' | 'name' | 'address-line1' | 'address-line2' | 'address-level1' | 'address-level2' | 'postal-code' | 'tel'
- `class`: ClassValue
- `id`: string
- `inputmode`: 'none' | 'text' | 'decimal' | 'numeric' | 'search' | 'url' | 'tel'
- `name`: string
- `placeholder`: string
- `spellcheck`: boolean

Optional props:

- `autofocus`: boolean
- `disabled`: boolean
- `value`: string

```vue
<TextInputBare
  v-model="text"
  id="my-input"
  name="my-input"
  class="my-input-class"
  placeholder="Enter text"
  autocomplete="off"
  autocapitalize="none"
  inputmode="text"
  :spellcheck="false"
/>
```

### EmailInputBare

A specialized input component for email addresses with appropriate defaults (e.g. autocapitalize=none, inputmode=email, spellcheck=false).

Required props:

- `autocomplete`: 'off' | 'username' | 'email'
- `class`: ClassValue
- `id`: string
- `name`: string

Optional props:

- `autofocus`: boolean
- `disabled`: boolean
- `placeholder`: string
- `value`: string

```vue
<EmailInputBare
  v-model="email"
  id="email-input"
  name="email"
  autocomplete="username"
  class="email-input-class"
/>
```

### TextAreaBare

A bare textarea component for multi-line text input that forces some props for an improved UX.

Required props:

- `class`: ClassValue
- `id`: string
- `name`: string
- `placeholder`: string
- `spellcheck`: boolean

Optional props:

- `autofocus`: boolean
- `disabled`: boolean
- `maxCharacters`: number
- `maxRows`: number (defaults to 2)
- `value`: string

```vue
<TextAreaBare
  v-model="text"
  id="textarea"
  name="textarea"
  placeholder="Enter multi-line text"
  spellcheck="false"
  class="textarea-class"
/>
```

### PasswordInputBare

A specialized input component for password entry with appropriate defaults (e.g. type=password, autocapitalize=none, inputmode=text, spellcheck=false).

Required props:

- `autocomplete`: 'current-password' | 'new-password'
- `class`: ClassValue
- `id`: string
- `name`: string

Optional props:

- `autofocus`: boolean
- `disabled`: boolean
- `value`: string

```vue
<PasswordInputBare
  v-model="password"
  id="password"
  name="password"
  autocomplete="current-password"
  class="password-input-class"
/>
```

### TelephoneInputBare

A specialized input component for phone numbers that handles formatting and E.164 standardization. The component automatically formats US phone numbers for display while maintaining E.164 format for the actual value.

Required props:

- `autocomplete`: 'tel' | 'off'
- `class`: ClassValue
- `id`: string
- `name`: string
- `placeholder`: string

Optional props:

- `autofocus`: boolean
- `disabled`: boolean
- `value`: string

```vue
<TelephoneInputBare
  v-model="phoneNumber"
  id="phone"
  name="phone"
  autocomplete="tel"
  placeholder="(555) 555-5555"
  class="phone-input-class"
/>
```

### RadioListBare and RadioListItemBare

Components for creating radio button groups.

RadioListBare required props:

- `id`: string
- `name`: string

RadioListBare optional props:

- `class`: ClassValue
- `disabled`: boolean
- `value`: string

RadioListItemBare required props:

- `class`: ClassValue
- `value`: string

RadioListItemBare optional props:

- `disabled`: boolean

```vue
<RadioListBare id="radio-group" name="options" v-model="selected">
  <RadioListItemBare value="option1">Option 1</RadioListItemBare>
  <RadioListItemBare value="option2">Option 2</RadioListItemBare>
  <RadioListItemBare value="option3">Option 3</RadioListItemBare>
</RadioListBare>
```

### SnackbarBare

A component for displaying temporary notifications or messages.

Exposed properties:

- `height`: number - The total height of the snackbar including margins, useful for adjusting layouts when the snackbar is visible (e.g. when a floating action button is present)

Required props:

- `class`: ClassValue
- `hideClass`: string (CSS class for hiding the snackbar)
- `show`: boolean
- `showClass`: string (CSS class for showing the snackbar)

```ts
import { useSnackbarStore } from 'vue-bare-composables'

const snackbarStore = useSnackbarStore()
const { message, actions } = storeToRefs(snackbarStore)
```

```vue
<SnackbarBare
  :message
  :actions
  show-class="opacity-100 translate-y-0"
  hide-class="opacity-0 translate-y-2"
  class="snackbar-class"
/>
```

### SwitchBare

A toggle switch component.

Required props:

- `class`: ClassValue
- `id`: string
- `name`: string

Optional props:

- `disabled`: boolean
- `value`: boolean

```vue
<SwitchBare v-model="enabled" id="feature-toggle" name="feature-toggle">
  Enable feature
</SwitchBare>
```
