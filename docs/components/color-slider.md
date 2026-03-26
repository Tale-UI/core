# ColorSlider

`import { ColorSlider } from '@tale-ui/react/color-slider';`

A slider for adjusting a single color channel (hue, saturation, lightness, alpha, etc.).

## Parts

| Part | Description |
|------|-------------|
| `ColorSlider.Root` | Wrapper; requires a `channel` prop |
| `ColorSlider.Track` | The gradient track |
| `ColorSlider.Thumb` | Draggable thumb |
| `ColorSlider.Label` | Accessible label |
| `ColorSlider.Output` | Displays the current channel value |

## Props

Accepts all React Aria `ColorSlider` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { parseColor } from 'react-aria-components';

<ColorSlider.Root channel="hue" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
  <ColorSlider.Label>Hue</ColorSlider.Label>
  <ColorSlider.Output />
  <ColorSlider.Track>
    <ColorSlider.Thumb />
  </ColorSlider.Track>
</ColorSlider.Root>
```

## Examples

### Saturation Slider

```tsx
<ColorSlider.Root channel="saturation" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
  <ColorSlider.Label>Saturation</ColorSlider.Label>
  <ColorSlider.Output />
  <ColorSlider.Track>
    <ColorSlider.Thumb />
  </ColorSlider.Track>
</ColorSlider.Root>
```

## CSS Classes

- `.tale-color-slider` — Root
- `.tale-color-slider__track` — Gradient track
- `.tale-color-slider__thumb` — Draggable thumb
- `.tale-color-slider__label` — Label
- `.tale-color-slider__output` — Value output

## Notes

- The `channel` prop on Root is required and determines which color channel the slider controls (e.g. `"hue"`, `"saturation"`, `"lightness"`, `"alpha"`).
- Use `parseColor()` from `react-aria-components` to create color values.
