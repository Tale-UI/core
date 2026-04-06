# ColorWheel

`import { ColorWheel } from '@tale-ui/react/color-wheel';`

A circular hue selector that renders as a color wheel ring.

## Parts

| Part | Description |
|------|-------------|
| `ColorWheel.Root` | The wheel container; requires `outerRadius` and `innerRadius` |
| `ColorWheel.Track` | The circular color track |
| `ColorWheel.Thumb` | Draggable thumb on the wheel |

## Props

Accepts all React Aria `ColorWheel` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { parseColor } from 'react-aria-components';

<ColorWheel.Root
  defaultValue={parseColor('hsl(0, 100%, 50%)')}
  outerRadius={100}
  innerRadius={70}
>
  <ColorWheel.Track />
  <ColorWheel.Thumb />
</ColorWheel.Root>
```

## CSS Classes

- `.tale-color-wheel` — Root
- `.tale-color-wheel__track` — Circular track
- `.tale-color-wheel__thumb` — Draggable thumb

## Pitfalls

<!-- pitfall: color-wheel-track-required -->
- **`ColorWheel.Track` is required** — Omitting `ColorWheel.Track` inside `ColorWheel.Root` will render a blank element with no visible color ring.

<!-- pitfall: color-wheel-radius-required -->
- **`outerRadius` and `innerRadius` are required props** — Both props must be provided on `ColorWheel.Root`. Omitting either will cause incorrect rendering or a runtime error.

<!-- cross-pitfall-ref: color-imports-from-rac -->
<!-- cross-pitfall-ref: no-color-pojo-state -->

## Notes

- `outerRadius` and `innerRadius` control the wheel dimensions and ring thickness.
- Use `parseColor()` from `react-aria-components` to create color values.
