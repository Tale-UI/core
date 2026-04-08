import {
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
} from 'react-aria-components';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = AriaColorPickerProps;

/**
 * A colour picker state provider (headless, no DOM output).
 *
 * **WARNING:** Do NOT nest ColorSlider inside ColorPicker.Root — the context
 * does not propagate correctly and causes "Unknown color channel: hue" at
 * runtime. Use ColorArea and ColorSlider as standalone components with
 * shared state instead:
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { ColorArea } from '@tale-ui/react/color-area';
 * import { ColorSlider } from '@tale-ui/react/color-slider';
 * import { parseColor } from '@tale-ui/react/color-picker';
 *
 * const [color, setColor] = useState(parseColor('hsb(200, 100%, 100%)'));
 *
 * <ColorArea.Root value={color} onChange={setColor}>
 *   <ColorArea.Thumb />
 * </ColorArea.Root>
 *
 * <ColorSlider.Root channel="hue" value={color} onChange={setColor}>
 *   <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
 * </ColorSlider.Root>
 * ```
 */
export function Root(props: RootProps) {
  return <AriaColorPicker {...props} />;
}
Root.displayName = 'ColorPicker.Root';
