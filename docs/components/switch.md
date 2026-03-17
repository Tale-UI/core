# Switch

`import { Switch } from '@tale-ui/react/switch';`

A toggle switch component with a sliding thumb, built on React Aria's Switch.

## Parts

| Part | Description |
|------|-------------|
| `Switch.Root` | The switch label and toggle wrapper |
| `Switch.Thumb` | The sliding thumb indicator |

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

## CSS Classes

- `.tale-switch` -- Base (root label)
- `.tale-switch__thumb` -- The sliding thumb element

## Notes

- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- The label text is placed as a child of `Switch.Root`, alongside `Switch.Thumb`.
