import {
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
} from 'react-aria-components';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = AriaColorPickerProps;

/**
 * A colour picker combining area, sliders, and swatches.
 *
 * @example
 * ```tsx
 * import { ColorPicker } from '@tale-ui/react/color-picker';
 * import { ColorArea } from '@tale-ui/react/color-area';
 * import { ColorSlider } from '@tale-ui/react/color-slider';
 * import { parseColor } from 'react-aria-components';
 *
 * <ColorPicker.Root defaultColor={parseColor('hsl(0, 100%, 50%)')}>
 *   <ColorArea.Root><ColorArea.Thumb /></ColorArea.Root>
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
