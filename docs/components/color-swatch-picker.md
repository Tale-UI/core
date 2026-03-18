# ColorSwatchPicker

`import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';`

A selectable grid of color swatches for picking from a predefined set of colors.

## Parts

| Part | Description |
|------|-------------|
| `ColorSwatchPicker.Root` | Container that manages selection state |
| `ColorSwatchPicker.Item` | Individual selectable swatch item |

## Basic Usage

```tsx
import { ColorSwatch } from '@tale-ui/react/color-swatch';

<ColorSwatchPicker.Root>
  <ColorSwatchPicker.Item color="#ff0000">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
  <ColorSwatchPicker.Item color="#00ff00">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
  <ColorSwatchPicker.Item color="#0000ff">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
</ColorSwatchPicker.Root>
```

## CSS Classes

- `.tale-color-swatch-picker` — Root container
- `.tale-color-swatch-picker__item` — Individual swatch item

## Notes

- Each `Item` accepts a `color` prop specifying the swatch color.
- Combine with `ColorSwatch` inside each `Item` to render the visual swatch.
- Selection state is managed via `value` / `onChange` (controlled) or `defaultValue` (uncontrolled). The selected swatch receives `data-selected`.
