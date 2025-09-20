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

- Vue 3.x
- Node.js >= 22

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
- `trimStart`: boolean - Automatically removes leading whitespace from user input
- `value`: string

Exposed methods:

- `focus()`: Programmatically focus the input element
- `blur()`: Programmatically blur the input element
- `select()`: Programmatically select all text in the input element

```vue
<TextInputBare
  ref="textInput"
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
<button @click="textInput.focus()">Focus Input</button>

<!-- With trimStart to prevent leading spaces -->
<TextInputBare
  v-model="username"
  id="username"
  name="username"
  class="username-input"
  placeholder="Enter username"
  autocomplete="off"
  autocapitalize="none"
  inputmode="text"
  :spellcheck="false"
  :trimStart="true"
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

Exposed methods:

- `focus()`: Programmatically focus the input element
- `blur()`: Programmatically blur the input element

```vue
<EmailInputBare
  ref="emailInput"
  v-model="email"
  id="email-input"
  name="email"
  autocomplete="username"
  class="email-input-class"
/>
<button @click="emailInput.focus()">Focus Input</button>
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

Exposed methods:

- `focus()`: Programmatically focus the textarea element
- `blur()`: Programmatically blur the textarea element

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

A specialized input component for password entry with appropriate defaults (e.g. type=password, autocapitalize=none, inputmode=text, spellcheck=false). Supports an optional show/hide toggle functionality.

Required props:

- `autocomplete`: 'current-password' | 'new-password'
- `class`: ClassValue
- `id`: string
- `name`: string

Optional props:

- `autofocus`: boolean
- `disabled`: boolean
- `toggleable`: boolean - Enables show/hide password functionality
- `value`: string
- `wrapperClass`: ClassValue - CSS class for the wrapper div when toggleable is enabled

Exposed methods:

- `focus()`: Programmatically focus the input element
- `blur()`: Programmatically blur the input element

```vue
<!-- Basic password input -->
<PasswordInputBare
  ref="passwordInput"
  v-model="password"
  id="password"
  name="password"
  autocomplete="current-password"
  class="password-input-class"
/>
<button @click="passwordInput.focus()">Focus Input</button>

<!-- With show/hide toggle functionality -->
<PasswordInputBare
  v-model="password"
  id="password"
  name="password"
  autocomplete="current-password"
  class="password-input-class"
  :toggleable="true"
  wrapper-class="password-wrapper"
>
  <template #toggle="{ isVisible, toggle }">
    <button @click="toggle" type="button">
      {{ isVisible ? 'Hide' : 'Show' }}
    </button>
  </template>
</PasswordInputBare>
```

When `toggleable` is enabled:

- The input is wrapped in a div with the class specified by `wrapperClass`
- A `toggle` slot is available that receives `isVisible` (boolean) and `toggle` (function) as slot props
- The toggle slot content is rendered after the input element in the DOM
- Use CSS (e.g., flexbox with `flex-direction: row-reverse` or CSS Grid) to visually position the toggle before the input if needed
- The input type switches between "password" and "text" based on visibility
- The `autocomplete` attribute is maintained regardless of visibility state for security

### NumberInputBare

A specialized input component for numeric input that only allows digits. Automatically filters out non-numeric characters and supports limiting the maximum number of digits.

Required props:

- `autocomplete`: 'off'
- `class`: ClassValue
- `id`: string
- `name`: string
- `placeholder`: string

Optional props:

- `autofocus`: boolean
- `disabled`: boolean
- `maxDigits`: number - Maximum number of digits allowed
- `value`: number

Exposed methods:

- `focus()`: Programmatically focus the input element
- `blur()`: Programmatically blur the input element
- `select()`: Programmatically select all text in the input element

```vue
<NumberInputBare
  ref="numberInput"
  v-model="quantity"
  id="quantity"
  name="quantity"
  autocomplete="off"
  placeholder="Enter quantity"
  :maxDigits="3"
  class="number-input-class"
/>
<button @click="numberInput.focus()">Focus Input</button>
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

Exposed methods:

- `focus()`: Programmatically focus the input element
- `blur()`: Programmatically blur the input element
- `select()`: Programmatically select all text in the input element

```vue
<TelephoneInputBare
  ref="phoneInput"
  v-model="phoneNumber"
  id="phone"
  name="phone"
  autocomplete="tel"
  placeholder="(555) 555-5555"
  class="phone-input-class"
/>
<button @click="phoneInput.focus()">Focus Input</button>
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
