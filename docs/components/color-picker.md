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
import { parseColor } from '@tale-ui/react/color-picker';

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

## Props

Accepts all React Aria `ColorPicker` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## CSS Classes

None — `ColorPicker.Root` is a state-only wrapper with no DOM element or BEM class.

## Pitfalls

<!-- pitfall: color-picker-no-label-prop -->
- **`ColorPicker.Root` does not accept a `label` prop** — There is no `label` prop on `ColorPicker.Root`. It is a headless state provider only.
  - anti-pattern: `<ColorPicker.Root label="Pick a color" defaultValue={parseColor('hsl(0, 100%, 50%)')}>`
  - fix: `<ColorPicker.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}>`
  - complete example:
    ```tsx
    import { useState } from 'react';
    import { ColorArea } from '@tale-ui/react/color-area';
    import { ColorSlider } from '@tale-ui/react/color-slider';
    import { parseColor } from '@tale-ui/react/color-picker';
    
    export function Example() {
      const [color, setColor] = useState(parseColor('hsb(200, 100%, 100%)'));
      return (
        <>
          <ColorArea.Root value={color} onChange={setColor}>
            <ColorArea.Thumb />
          </ColorArea.Root>
          
          <ColorSlider.Root channel="hue" value={color} onChange={setColor}>
            <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
          </ColorSlider.Root>
        </>
      );
    }
    ```

<!-- multi-idea-ok -->
<!-- pitfall: color-picker-sub-components-not-exported -->
- **Sub-components are NOT exported from `@tale-ui/react/color-picker`** — `ColorArea`, `ColorSwatch`, `ColorSlider`, and other color components each have their own import path. Import them individually.
  - anti-pattern: `import { ColorArea, ColorSlider } from '@tale-ui/react/color-picker'`
  - fix: `import { ColorArea } from '@tale-ui/react/color-area'`
  - fix: `import { ColorSlider } from '@tale-ui/react/color-slider'`

<!-- cross-pitfall-ref: color-imports-from-rac -->
<!-- cross-pitfall-ref: no-color-pojo-state -->

## Notes

- This is a headless state provider; it does not render its own DOM node.
- Do **not** nest `ColorSlider` inside `ColorPicker.Root` — use standalone components with shared state instead.
