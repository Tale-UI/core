# Troubleshooting — @tale-ui/react

Issues encountered while building a kitchen-sink demo app with `@tale-ui/react@^1.3.26` (React Aria Components 1.16.0).

---

## 1. `Unknown color channel: hue` when using ColorPicker.Root with ColorArea + ColorSlider

### Error

```
Uncaught Error: Unknown color channel: hue
    getChannelRange Color.mjs:351
    useColorSliderState.mjs:38
    ColorSlider ColorSlider.mjs:24
```

### What caused it

The `ColorPicker.Root` docs show this pattern:

```tsx
import { ColorPicker } from '@tale-ui/react/color-picker';
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

At runtime, React Aria's `ColorPicker` context does not propagate the shared color value to the nested `ColorSlider` correctly. When `ColorSlider` tries to resolve `channel="hue"`, it has no parent color to reference, so `getChannelRange("hue")` fails because the slider's internal color object doesn't recognise the channel.

Switching the color format from `hsl(...)` to `hsb(...)` did **not** fix the issue — the context propagation was the root cause, not the color space.

### Fix

Use `ColorArea` and `ColorSlider` as **standalone** components, each with their own `defaultValue`, instead of nesting them inside `ColorPicker.Root`:

```tsx
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { parseColor } from 'react-aria-components';

{/* Standalone ColorArea */}
<ColorArea.Root defaultValue={parseColor('hsb(200, 100%, 100%)')}>
  <ColorArea.Thumb />
</ColorArea.Root>

{/* Standalone ColorSlider — works because it owns its own color value */}
<ColorSlider.Root channel="hue" defaultValue={parseColor('hsl(200, 100%, 50%)')}>
  <ColorSlider.Label>Hue</ColorSlider.Label>
  <ColorSlider.Output />
  <ColorSlider.Track>
    <ColorSlider.Thumb />
  </ColorSlider.Track>
</ColorSlider.Root>
```

### Trade-off

The components no longer share a single color value. If you need a unified color picker where the area and slider are linked, you'll need to manage the state yourself:

```tsx
const [color, setColor] = useState(parseColor('hsb(200, 100%, 100%)'));

<ColorArea.Root value={color} onChange={setColor}>
  <ColorArea.Thumb />
</ColorArea.Root>

<ColorSlider.Root channel="hue" value={color} onChange={setColor}>
  <ColorSlider.Track>
    <ColorSlider.Thumb />
  </ColorSlider.Track>
</ColorSlider.Root>
```

---

## General tips

### Checkbox.Indicator needs a child SVG icon

`Checkbox.Indicator` does **not** render a checkmark on its own. You must provide one as a child, or the checkbox will appear empty even when checked:

```tsx
{/* Correct */}
<Checkbox.Root>
  <Checkbox.Indicator>
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M11.5 3.5L5.5 9.5L2.5 6.5" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Checkbox.Indicator>
  Label text
</Checkbox.Root>

{/* Wrong — no tick will render */}
<Checkbox.Root>
  <Checkbox.Indicator />
  Label text
</Checkbox.Root>
```

### Drawer.Backdrop is a sibling, not a wrapper

Unlike `Dialog.Backdrop` (which wraps `Dialog.Popup`), `Drawer.Backdrop` must be a **self-closing sibling** of `Drawer.Popup`:

```tsx
{/* Correct */}
<Drawer.Root>
  <Drawer.Trigger className="tale-button tale-button--neutral">Open</Drawer.Trigger>
  <Drawer.Backdrop />
  <Drawer.Popup>...</Drawer.Popup>
</Drawer.Root>

{/* Wrong — backdrop will not dismiss correctly */}
<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Backdrop>
    <Drawer.Popup>...</Drawer.Popup>
  </Drawer.Backdrop>
</Drawer.Root>
```

### AlertDialog.Trigger needs explicit tale-button classes

`Dialog.Trigger` auto-applies the `tale-button` base class, but `AlertDialog.Trigger` does **not**. You must add both the base class and variant yourself:

```tsx
{/* Dialog — only needs variant */}
<Dialog.Trigger className="tale-button--primary">Open</Dialog.Trigger>

{/* AlertDialog — needs base + variant */}
<AlertDialog.Trigger className="tale-button tale-button--danger">Delete</AlertDialog.Trigger>
```

### Drawer.Trigger and Drawer.Close also need explicit tale-button classes

Same as AlertDialog — these apply their own BEM class (`tale-drawer__trigger`, `tale-drawer__close`), not `tale-button`:

```tsx
<Drawer.Trigger className="tale-button tale-button--neutral">Open</Drawer.Trigger>
<Drawer.Close className="tale-button tale-button--primary">Save</Drawer.Close>
```

### Dialog.Backdrop wraps Dialog.Popup

The opposite of the Drawer pattern — `Dialog.Backdrop` must **wrap** `Dialog.Popup`:

```tsx
<Dialog.Root isOpen={open} onOpenChange={setOpen}>
  <Dialog.Trigger className="tale-button--primary">Open</Dialog.Trigger>
  <Dialog.Backdrop>
    <Dialog.Popup>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Popup>
  </Dialog.Backdrop>
</Dialog.Root>
```

### Base font-size is required

The design system assumes `1rem = 10px`. Without this, all spacing and sizing will be wrong:

```css
html {
  font-size: 62.5%;
}

body {
  background-color: var(--neutral-5);
}
```
