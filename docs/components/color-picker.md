# ColorPicker

`import { ColorPicker } from '@tale-ui/react/color-picker';`

A wrapper component that provides shared color state to child color components (ColorArea, ColorSlider, ColorField, etc.).

## Known Issue — ColorSlider inside ColorPicker.Root

**Do NOT nest `ColorSlider` inside `ColorPicker.Root`.** React Aria's `ColorPicker` context does not propagate the shared color value to nested `ColorSlider` correctly. This causes a runtime error:

```
Uncaught Error: Unknown color channel: hue
```

## Recommended Usage

Use `ColorArea` and `ColorSlider` as **standalone** components, each with their own `defaultValue`. Link them with shared state if needed:

```tsx
import { useState } from 'react';
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { parseColor } from 'react-aria-components';

const [color, setColor] = useState(parseColor('hsb(200, 100%, 100%)'));

<ColorArea.Root value={color} onChange={setColor}>
  <ColorArea.Thumb />
</ColorArea.Root>

<ColorSlider.Root channel="hue" value={color} onChange={setColor}>
  <ColorSlider.Label>Hue</ColorSlider.Label>
  <ColorSlider.Output />
  <ColorSlider.Track>
    <ColorSlider.Thumb />
  </ColorSlider.Track>
</ColorSlider.Root>
```

## CSS Classes

None — `ColorPicker.Root` is a state-only wrapper with no DOM element or BEM class.

## Notes

- This is a headless state provider; it does not render its own DOM node.
- Do **not** nest `ColorSlider` inside `ColorPicker.Root` — use standalone components with shared state instead.
