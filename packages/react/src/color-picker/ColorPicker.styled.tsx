import {
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
} from 'react-aria-components';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = AriaColorPickerProps;

/**
 * A colour picker state provider (headless, no DOM output).
 *
 * Use ColorPicker.Root to provide shared color state to nested ColorArea,
 * ColorSlider, ColorField, and related color controls.
 *
 * @example
 * ```tsx
 * import { ColorPicker } from '@tale-ui/react/color-picker';
 * import { ColorArea } from '@tale-ui/react/color-area';
 * import { ColorSlider } from '@tale-ui/react/color-slider';
 *
 * <ColorPicker.Root defaultValue="hsb(200, 100%, 100%)">
 *   <ColorArea.Root xChannel="saturation" yChannel="brightness">
 *     <ColorArea.Thumb />
 *   </ColorArea.Root>
 *
 *   <ColorSlider.Root channel="hue">
 *     <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
 *   </ColorSlider.Root>
 * </ColorPicker.Root>
 * ```
 */
export function Root(props: RootProps) {
  return <AriaColorPicker {...props} />;
}
Root.displayName = 'ColorPicker.Root';
