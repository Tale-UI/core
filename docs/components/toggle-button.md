# ToggleButton

`import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';`

A pressable toggle button that maintains selected/unselected state, built on React Aria's ToggleButton.

## Basic Usage

```tsx
<ToggleButton size="md">Toggle me</ToggleButton>
```

## Examples

### Pressed by Default

```tsx
<ToggleButton defaultSelected>Pressed</ToggleButton>
```

### Disabled

```tsx
<ToggleButton isDisabled>Disabled</ToggleButton>
```

### Group

```tsx
<ToggleButtonGroup>
  <ToggleButton>Bold</ToggleButton>
  <ToggleButton>Italic</ToggleButton>
  <ToggleButton>Underline</ToggleButton>
</ToggleButtonGroup>
```

### All Sizes

```tsx
<ToggleButton size="sm">Small</ToggleButton>
<ToggleButton size="md">Medium</ToggleButton>
<ToggleButton size="lg">Large</ToggleButton>
```

## CSS Classes

- `.tale-toggle-button` -- Base
- `.tale-toggle-button--sm` -- Small size
- `.tale-toggle-button--md` -- Medium size (default)
- `.tale-toggle-button--lg` -- Large size
- `.tale-toggle-button-group` -- Group wrapper

## Notes

- `size` defaults to `"md"`.
- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- `ToggleButtonGroup` wraps multiple toggle buttons for toolbar-style layouts.
