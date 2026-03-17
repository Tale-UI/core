# ColorWheel

`import { ColorWheel } from '@tale-ui/react/color-wheel';`

A circular hue selector that renders as a color wheel ring.

## Parts

| Part | Description |
|------|-------------|
| `ColorWheel.Root` | The wheel container; requires `outerRadius` and `innerRadius` |
| `ColorWheel.Track` | The circular color track |
| `ColorWheel.Thumb` | Draggable thumb on the wheel |

## Basic Usage

```tsx
import { parseColor } from 'react-aria-components';

<ColorWheel.Root
  defaultValue={parseColor('hsl(0, 100%, 50%)')}
  outerRadius={100}
  innerRadius={70}
>
  <ColorWheel.Track>
    <ColorWheel.Thumb />
  </ColorWheel.Track>
</ColorWheel.Root>
```

## CSS Classes

- `.tale-color-wheel` — Root
- `.tale-color-wheel__track` — Circular track
- `.tale-color-wheel__thumb` — Draggable thumb

## Notes

- `outerRadius` and `innerRadius` control the wheel dimensions and ring thickness.
- Use `parseColor()` from `react-aria-components` to create color values.
