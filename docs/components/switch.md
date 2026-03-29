# Switch

`import { Switch } from '@tale-ui/react/switch';`

A toggle switch component with a sliding thumb, built on React Aria's Switch.

## Parts

| Part | Description |
|------|-------------|
| `Switch.Root` | The switch label and toggle wrapper |
| `Switch.Thumb` | The sliding thumb indicator |

## Props

Accepts all React Aria `Switch` props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md'` | `'md'` | Size variant |
| `className` | `string` | -- | Additional CSS class name |

### Visual

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether the switch visual appears on/checked |
| `size` | `'sm' \| 'md'` | `'md'` | Size variant |

`Switch.Visual` is `aria-hidden` — for component composition only, not application UI. See [Visual-Only Exports](visual-exports.md).

## Basic Usage

```tsx
<Switch.Root>
  <Switch.Thumb />
  Enable notifications
</Switch.Root>
```

## Examples

### Selected by Default

```tsx
<Switch.Root defaultSelected>
  <Switch.Thumb />
  Dark mode
</Switch.Root>
```

### Disabled

```tsx
<Switch.Root isDisabled>
  <Switch.Thumb />
  Disabled switch
</Switch.Root>
```

### Disabled and Selected

```tsx
<Switch.Root isDisabled defaultSelected>
  <Switch.Thumb />
  Disabled and on
</Switch.Root>
```

### All States

```tsx
<Switch.Root>
  <Switch.Thumb />
  Default (off)
</Switch.Root>

<Switch.Root defaultSelected>
  <Switch.Thumb />
  Default (on)
</Switch.Root>

<Switch.Root isDisabled>
  <Switch.Thumb />
  Disabled (off)
</Switch.Root>

<Switch.Root isDisabled defaultSelected>
  <Switch.Thumb />
  Disabled (on)
</Switch.Root>
```

### Small Size

```tsx
<Switch.Root size="sm">
  <Switch.Thumb />
  Small switch
</Switch.Root>
```

## CSS Classes

- `.tale-switch` -- Base (root label)
- `.tale-switch__thumb` -- The sliding thumb element
- `.tale-switch--sm` -- Small size variant

## Notes

- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- The label text is placed as a child of `Switch.Root`, alongside `Switch.Thumb`.
- Supports `data-readonly`, `data-required`, and `data-invalid` attributes for corresponding states.
