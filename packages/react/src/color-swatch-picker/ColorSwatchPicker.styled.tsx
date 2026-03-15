import * as React from 'react';
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  type ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = Omit<AriaColorSwatchPickerProps, 'className'> & {
  className?: string;
};

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaColorSwatchPicker
      ref={ref}
      className={cx('tale-color-swatch-picker', className)}
      {...props}
    />
  ),
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
