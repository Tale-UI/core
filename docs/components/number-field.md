# NumberField

`import { NumberField } from '@tale-ui/react/number-field';`

A numeric input with increment/decrement buttons, supporting min/max bounds, step values, and number formatting.

## Parts

| Part | Description |
|------|-------------|
| `NumberField.Root` | Wrapper managing value state, validation, and formatting |
| `NumberField.Label` | Accessible label for the field |
| `NumberField.Group` | Groups the input and stepper buttons together |
| `NumberField.Input` | The text input element |
| `NumberField.Increment` | Button to increase the value (renders `+` by default) |
| `NumberField.Decrement` | Button to decrease the value (renders `−` by default) |
| `NumberField.Description` | Help text displayed below the field |
| `NumberField.ErrorMessage` | Validation error message |

## Props

Accepts all React Aria `NumberField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<NumberField.Root defaultValue={0}>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

## Examples

### With Label

```tsx
<NumberField.Root defaultValue={1}>
  <NumberField.Label>Quantity</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Min/Max Bounds

```tsx
<NumberField.Root defaultValue={5} minValue={0} maxValue={10}>
  <NumberField.Label>Rating (0-10)</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Custom Step

```tsx
<NumberField.Root defaultValue={0} step={5}>
  <NumberField.Label>Step by 5</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Disabled

```tsx
<NumberField.Root defaultValue={42} isDisabled>
  <NumberField.Label>Disabled</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Currency Format

```tsx
<NumberField.Root
  defaultValue={99.99}
  formatOptions={{ style: 'currency', currency: 'USD' }}
>
  <NumberField.Label>Price</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

## CSS Classes

- `.tale-number-field` — Root container
- `.tale-number-field__label` — Label
- `.tale-number-field__group` — Input + buttons group
- `.tale-number-field__input` — Text input
- `.tale-number-field__increment` — Increment button
- `.tale-number-field__decrement` — Decrement button
- `.tale-number-field__description` — Help text
- `.tale-number-field__error` — Error message

## Pitfalls

<!-- pitfall: number-field-no-null-value -->
- **`NumberField.Root` `value` prop accepts `number | undefined`, NOT `number | null`.**
  - anti-pattern: `<NumberField.Root value={count ?? null}>`
  - fix: `<NumberField.Root value={count ?? undefined}>`

<!-- pitfall: number-field-no-phantom-sub-parts -->
- **No `NumberField.Step` or `NumberField.HintText` sub-parts.** Use `NumberField.Description` for help text.
  - anti-pattern: `<NumberField.HintText>Between 0 and 100</NumberField.HintText>`
  - fix: `<NumberField.Description>Between 0 and 100</NumberField.Description>`

<!-- cross-pitfall-ref: minvalue-maxvalue-not-min-max -->

## Notes

- Built on React Aria `NumberField`, `Group`, `Input`, `Button`, `Label`, `Text`, and `FieldError`.
- Pass `formatOptions` (Intl.NumberFormat options) for locale-aware formatting such as currency or percentages.
- Stepper buttons are automatically disabled at min/max bounds.
- **`Increment` and `Decrement` render their own icons by default** (`+` and `−`). Use them self-closing: `<NumberField.Increment />`. Only pass children if you need a custom icon.
