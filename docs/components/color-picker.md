# ColorPicker

`import { ColorPicker } from '@tale-ui/react/color-picker';`

A wrapper component that provides shared color state to child color components (ColorArea, ColorSlider, ColorField, etc.).

## Basic Usage

```tsx
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { parseColor } from 'react-aria-components';

<ColorPicker.Root defaultColor={parseColor('hsl(0, 100%, 50%)')}>
  <ColorArea.Root>
    <ColorArea.Thumb />
  </ColorArea.Root>
  <ColorSlider.Root channel="hue">
    <ColorSlider.Track>
      <ColorSlider.Thumb />
    </ColorSlider.Track>
  </ColorSlider.Root>
</ColorPicker.Root>
```

## CSS Classes

None -- `ColorPicker.Root` is a state-only wrapper with no DOM element or BEM class.

## Notes

- This is a headless state provider; it does not render its own DOM node.
- Nest color components (`ColorArea`, `ColorSlider`, `ColorField`, etc.) inside to share a single color value.
