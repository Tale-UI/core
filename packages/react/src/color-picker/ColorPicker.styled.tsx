import {
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
} from 'react-aria-components';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = AriaColorPickerProps;

export function Root(props: RootProps) {
  return <AriaColorPicker {...props} />;
}
Root.displayName = 'ColorPicker.Root';
