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

## Pitfalls

<!-- pitfall: color-area-no-gradient-sub-part -->
- **Only `Root` and `Thumb` sub-parts — no `ColorArea.Gradient`** — There is no `ColorArea.Gradient` sub-part. The gradient background is rendered automatically by `ColorArea.Root`.

<!-- pitfall: color-area-y-channel-value -->
- **`yChannel` value depends on color space** — Use `yChannel="lightness"` for HSL color space and `yChannel="brightness"` for HSB color space. Mixing these causes incorrect color rendering.

<!-- cross-pitfall-ref: color-imports-from-rac -->
<!-- cross-pitfall-ref: no-color-pojo-state -->
<!-- cross-pitfall-ref: no-color-extract-channel -->

## Notes

- Use `parseColor()` from `react-aria-components` to create color values.
- Commonly paired with `ColorSlider` for a complete color picker.
