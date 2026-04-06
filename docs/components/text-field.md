# TextField

`import { TextField } from '@tale-ui/react/text-field';`

A single-line text input with label, description, and error message support.

## Parts

| Part | Description |
|------|-------------|
| `TextField.Root` | Wrapper that manages text field state |
| `TextField.Input` | The text input element |
| `TextField.Label` | Accessible label |
| `TextField.Description` | Helper text below the input |
| `TextField.ErrorMessage` | Validation error message (shown when `isInvalid`) |

## Props

Accepts all React Aria `TextField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<TextField.Root>
  <TextField.Input placeholder="Enter text..." />
</TextField.Root>
```

## Examples

### With Label and Description

```tsx
<TextField.Root>
  <TextField.Label>Name</TextField.Label>
  <TextField.Input />
  <TextField.Description>Helper text</TextField.Description>
</TextField.Root>
```

### With Error

```tsx
<TextField.Root isInvalid>
  <TextField.Label>Email</TextField.Label>
  <TextField.Input />
  <TextField.ErrorMessage>Please enter a valid email address</TextField.ErrorMessage>
</TextField.Root>
```

### Disabled

```tsx
<TextField.Root isDisabled>
  <TextField.Label>Name</TextField.Label>
  <TextField.Input placeholder="Disabled field" />
</TextField.Root>
```

## CSS Classes

- `.tale-text-field` — Root
- `.tale-text-field__input` — Text input
- `.tale-text-field__label` — Label
- `.tale-text-field__description` — Description text
- `.tale-text-field__error` — Error message

## Pitfalls

<!-- pitfall: text-field-input-attrs-on-input -->
- **`TextField.Root` accepts `name` — HTML input attributes (`type`, `minLength`, `maxLength`, `placeholder`) go on `TextField.Input`.**
  - anti-pattern: `<TextField.Root placeholder="Enter name" type="email">`
  - fix: `<TextField.Root name="email"><TextField.Input placeholder="Enter name" type="email" /></TextField.Root>`

<!-- pitfall: no-password-input-component -->
- **There is NO `PasswordInput` component** — for password fields, use `TextField` with `type="password"` on `TextField.Input`.
  - anti-pattern: `<PasswordInput name="password" />`
  - fix: `<TextField.Root><TextField.Label>Password</TextField.Label><TextField.Input name="password" type="password" /></TextField.Root>`

## Notes

- Supports `isRequired`, `isInvalid`, `isDisabled`, and `isReadOnly` props on the Root.
- `ErrorMessage` only renders when `isInvalid` is true on the Root.
