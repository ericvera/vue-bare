# Vue Bare

**Unstyled Vue components for frustration-free human interactions**

[![github license](https://img.shields.io/github/license/ericvera/vue-bare.svg?style=flat-square)](https://github.com/ericvera/vue-bare/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/vue-bare.svg?style=flat-square)](https://npmjs.org/package/vue-bare)
[![npm downloads](https://img.shields.io/npm/dt/vue-bare.svg?style=flat-square)](https://npmjs.org/package/vue-bare)

Vue Bare provides a collection of unstyled Vue components that focus on making it simple to provide a great user experience.

# Features

- 🎯 **UX-First**: Enforces HTML attributes that create frustration-free experiences
- 🎨 **Completely Unstyled**: Full control over your component styling
- 🔒 **Type-Safe**: Written in TypeScript with full type definitions
- 📦 **Tree-Shakeable**: Only import what you need
- 🪶 **Lightweight**: No unnecessary styling or JavaScript overhead

## Requirements

- Vue 3
- Node.js >= 20

## Components

### TextInputBare

A bare text input component with full support for:

- Autocapitalization
- Autocomplete
- Input modes
- Spellcheck
- And other standard input attributes

```vue
<TextInputBare
  v-model="text"
  placeholder="Enter text"
  autocomplete="off"
  :spellcheck="false"
/>
```

### EmailInputBare

A specialized input component for email addresses with appropriate defaults and validations.

```vue
<EmailInputBare v-model="email" placeholder="Enter email" />
```
