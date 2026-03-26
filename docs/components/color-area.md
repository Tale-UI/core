# ColorArea

`import { ColorArea } from '@tale-ui/react/color-area';`

A two-dimensional color picker area for selecting saturation and lightness (or other channel pairs).

## Parts

| Part | Description |
|------|-------------|
| `ColorArea.Root` | The 2D gradient area |
| `ColorArea.Thumb` | Draggable thumb for selecting a color |

## Props

Accepts all React Aria `ColorArea` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { parseColor } from 'react-aria-components';

<ColorArea.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}>
  <ColorArea.Thumb />
</ColorArea.Root>
```

## CSS Classes

- `.tale-color-area` — Root
- `.tale-color-area__thumb` — Draggable thumb

## Notes

- Use `parseColor()` from `react-aria-components` to create color values.
- Commonly paired with `ColorSlider` for a complete color picker.
