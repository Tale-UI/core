# ColorField

`import { ColorField } from '@tale-ui/react/color-field';`

A text input for entering color values as hex, RGB, or HSL strings.

## Parts

| Part | Description |
|------|-------------|
| `ColorField.Root` | Wrapper that manages color field state |
| `ColorField.Input` | The text input element |
| `ColorField.Label` | Accessible label |
| `ColorField.Description` | Helper text |
| `ColorField.ErrorMessage` | Validation error message |

## Basic Usage

```tsx
<ColorField.Root>
  <ColorField.Label>Color</ColorField.Label>
  <ColorField.Input />
</ColorField.Root>
```

## CSS Classes

- `.tale-color-field` — Root
- `.tale-color-field__input` — Text input
- `.tale-color-field__label` — Label
- `.tale-color-field__description` — Description text
- `.tale-color-field__error` — Error message

## Notes

- Accepts and parses hex, RGB, and HSL color string formats.
- Supports `isDisabled` and `isRequired` props on the Root.
