# DateField

`import { DateField } from '@tale-ui/react/date-field';`

A segmented date input field that allows users to type a date value with individual segments for month, day, and year.

## Parts

| Part | Description |
|------|-------------|
| `DateField.Root` | Wrapper that manages date field state |
| `DateField.DateInput` | Container for date segments; accepts a render function |
| `DateField.Segment` | Individual editable segment (month, day, year) |
| `DateField.Label` | Accessible label |
| `DateField.Description` | Helper text below the field |
| `DateField.ErrorMessage` | Validation error message |

## Props

Accepts all React Aria `DateField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<DateField.Root>
  <DateField.DateInput style={{ display: 'flex' }}>
    {(segment) => <DateField.Segment segment={segment} />}
  </DateField.DateInput>
</DateField.Root>
```

## Examples

### With Label

```tsx
<DateField.Root>
  <DateField.Label>Date</DateField.Label>
  <DateField.DateInput style={{ display: 'flex' }}>
    {(segment) => <DateField.Segment segment={segment} />}
  </DateField.DateInput>
</DateField.Root>
```

## CSS Classes

- `.tale-date-field` — Root
- `.tale-date-field__input` — DateInput container
- `.tale-date-field__segment` — Individual segment
- `.tale-date-field__label` — Label
- `.tale-date-field__description` — Description text
- `.tale-date-field__error` — Error message

## Notes

- `DateInput` requires a render function child that receives each segment.
- Supports `isRequired` and `isDisabled` props on the Root.
