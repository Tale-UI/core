# Field

`import { Field } from '@tale-ui/react/field';`

A generic field wrapper providing label, description, error, and control layout for any input.

## Parts

| Part | Description |
|------|-------------|
| `Field.Root` | Outer container div. |
| `Field.Label` | The field label. |
| `Field.Control` | Wrapper around the input element. |
| `Field.Description` | Help text below the input. |
| `Field.Error` | Validation error message. |
| `Field.Item` | Optional item container for grouped content. |

## Basic Usage

```tsx
<Field.Root>
  <Field.Label>Name</Field.Label>
  <Field.Control>
    <input className="tale-input" placeholder="Enter your name" />
  </Field.Control>
</Field.Root>
```

## Examples

### With Description

```tsx
<Field.Root>
  <Field.Label>Email</Field.Label>
  <Field.Control>
    <input className="tale-input" type="email" placeholder="you@example.com" />
  </Field.Control>
  <Field.Description>We will never share your email with anyone.</Field.Description>
</Field.Root>
```

### With Error

```tsx
<Field.Root>
  <Field.Label>Password</Field.Label>
  <Field.Control>
    <input className="tale-input" type="password" />
  </Field.Control>
  <Field.Description>Must be at least 8 characters long.</Field.Description>
  <Field.Error>This field is required.</Field.Error>
</Field.Root>
```

## CSS Classes

- `.tale-field` — Base
- `.tale-field__label` — Label
- `.tale-field__control` — Input wrapper
- `.tale-field__description` — Help text
- `.tale-field__error` — Error message
- `.tale-field__item` — Item container

## Notes

- `Field` is a layout component -- it does not include its own input. Place any `<input>`, `<textarea>`, or custom input component inside `Field.Control`.
- Use the `.tale-input` class on native `<input>` elements for consistent styling.
