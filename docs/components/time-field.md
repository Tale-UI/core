# TimeField

`import { TimeField } from '@tale-ui/react/time-field';`

A segmented time input field that allows users to type a time value with individual segments for hours, minutes, and period.

## Parts

| Part | Description |
|------|-------------|
| `TimeField.Root` | Wrapper that manages time field state |
| `TimeField.DateInput` | Container for time segments; accepts a render function |
| `TimeField.Segment` | Individual editable segment (hour, minute, AM/PM) |
| `TimeField.Label` | Accessible label |
| `TimeField.Description` | Helper text |
| `TimeField.ErrorMessage` | Validation error message |

## Basic Usage

```tsx
<TimeField.Root>
  <TimeField.DateInput style={{ display: 'flex' }}>
    {(segment) => <TimeField.Segment segment={segment} />}
  </TimeField.DateInput>
</TimeField.Root>
```

## Examples

### With Label

```tsx
<TimeField.Root>
  <TimeField.Label>Time</TimeField.Label>
  <TimeField.DateInput style={{ display: 'flex' }}>
    {(segment) => <TimeField.Segment segment={segment} />}
  </TimeField.DateInput>
</TimeField.Root>
```

## CSS Classes

- `.tale-time-field` — Root
- `.tale-time-field__input` — DateInput container
- `.tale-time-field__segment` — Individual segment
- `.tale-time-field__label` — Label
- `.tale-time-field__description` — Description text
- `.tale-time-field__error` — Error message

## Notes

- `DateInput` requires a render function child that receives each segment.
- Supports `isRequired` and `isDisabled` props on the Root.
