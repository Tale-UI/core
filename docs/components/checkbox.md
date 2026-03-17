# Checkbox

`import { Checkbox } from '@tale-ui/react/checkbox';`

A compound checkbox component with a visual indicator, built on React Aria's Checkbox.

## Parts

| Part | Description |
|------|-------------|
| `Checkbox.Root` | The checkbox label and input wrapper |
| `Checkbox.Indicator` | The visual box that contains the check/minus icon |

## Basic Usage

```tsx
<Checkbox.Root>
  <Checkbox.Indicator>
    <CheckIcon />
  </Checkbox.Indicator>
  Accept terms and conditions
</Checkbox.Root>
```

## Examples

### Checked by Default

```tsx
<Checkbox.Root defaultSelected>
  <Checkbox.Indicator>
    <CheckIcon />
  </Checkbox.Indicator>
  Checked by default
</Checkbox.Root>
```

### Disabled

```tsx
<Checkbox.Root isDisabled>
  <Checkbox.Indicator>
    <CheckIcon />
  </Checkbox.Indicator>
  Disabled checkbox
</Checkbox.Root>
```

### Indeterminate

```tsx
<Checkbox.Root isIndeterminate>
  <Checkbox.Indicator>
    <MinusIcon />
  </Checkbox.Indicator>
  Indeterminate state
</Checkbox.Root>
```

### All States

```tsx
<Checkbox.Root>
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
  Unchecked
</Checkbox.Root>

<Checkbox.Root defaultSelected>
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
  Checked
</Checkbox.Root>

<Checkbox.Root isIndeterminate>
  <Checkbox.Indicator><MinusIcon /></Checkbox.Indicator>
  Indeterminate
</Checkbox.Root>

<Checkbox.Root isDisabled>
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
  Disabled
</Checkbox.Root>

<Checkbox.Root isDisabled defaultSelected>
  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
  Disabled + Checked
</Checkbox.Root>
```

## CSS Classes

- `.tale-checkbox` -- Base (root label)
- `.tale-checkbox__indicator` -- The visual indicator box

## Notes

- You must provide your own SVG icon inside `Checkbox.Indicator` (e.g. a checkmark or minus icon).
- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- `isIndeterminate` renders a third visual state (typically a minus icon instead of a checkmark).
- When used inside a `CheckboxGroup`, add a `value` prop to each `Checkbox.Root`.
