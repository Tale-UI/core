import * as React from 'react';
import {
  ColorArea as AriaColorArea,
  ColorThumb as AriaColorThumb,
  type ColorAreaProps as AriaColorAreaProps,
  type ColorThumbProps as AriaColorThumbProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = Omit<AriaColorAreaProps, 'className'> & {
  className?: string;
};

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaColorArea ref={ref} className={cx('tale-color-area', className)} {...props} />
  ),
);
Root.displayName = 'ColorArea.Root';

// ── Thumb ──────────────────────────────────────────────────────────────────

export type ThumbProps = Omit<AriaColorThumbProps, 'className'> & {
  className?: string;
};

export const Thumb = React.forwardRef<HTMLDivElement, ThumbProps>(
  ({ className, ...props }, ref) => (
    <AriaColorThumb ref={ref} className={cx('tale-color-area__thumb', className)} {...props} />
  ),
);
Thumb.displayName = 'ColorArea.Thumb';
