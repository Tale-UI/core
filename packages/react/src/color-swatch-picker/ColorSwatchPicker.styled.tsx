import * as React from 'react';
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  type ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
} from 'react-aria-components';
import { cx } from '../_cx';
import type { ColorSwatchShape } from '../color-swatch/ColorSwatch.styled';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = Omit<AriaColorSwatchPickerProps, 'className'> & {
  className?: string;
  /**
   * Visual shape applied to every swatch (and its selection ring) inside the
   * picker. Cascades down via CSS so child `ColorSwatch` components pick this
   * up automatically; individual `ColorSwatch.shape` props override it.
   *
   * @default 'square'
   */
  shape?: ColorSwatchShape;
};

/**
 * A grid of colour swatches for picking from predefined colours.
 *
 * @example
 * ```tsx
 * import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
 * import { ColorSwatch } from '@tale-ui/react/color-swatch';
 *
 * <ColorSwatchPicker.Root shape="circle">
 *   <ColorSwatchPicker.Item color="#ff0000"><ColorSwatch /></ColorSwatchPicker.Item>
 *   <ColorSwatchPicker.Item color="#00ff00"><ColorSwatch /></ColorSwatchPicker.Item>
 *   <ColorSwatchPicker.Item color="#0000ff"><ColorSwatch /></ColorSwatchPicker.Item>
 * </ColorSwatchPicker.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, shape, ...props }, ref) => {
    const base = [
      'tale-color-swatch-picker',
      shape === 'circle' && 'tale-color-swatch-picker--circle',
      shape === 'square' && 'tale-color-swatch-picker--square',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <AriaColorSwatchPicker
        ref={ref}
        className={cx(base, className)}
        {...props}
      />
    );
  },
);
Root.displayName = 'ColorSwatchPicker.Root';

// ── Item ───────────────────────────────────────────────────────────────────

export type ItemProps = Omit<AriaColorSwatchPickerItemProps, 'className'> & {
  className?: string;
};

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaColorSwatchPickerItem
      ref={ref}
      className={cx('tale-color-swatch-picker__item', className)}
      {...props}
    />
  ),
);
Item.displayName = 'ColorSwatchPicker.Item';
