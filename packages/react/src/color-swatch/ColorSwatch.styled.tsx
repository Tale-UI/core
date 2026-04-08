import * as React from 'react';
import {
  ColorSwatch as AriaColorSwatch,
  type ColorSwatchProps as AriaColorSwatchProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── ColorSwatch ────────────────────────────────────────────────────────────

export type ColorSwatchProps = Omit<AriaColorSwatchProps, 'className'> & {
  className?: string;
};

/**
 * Displays a preview of a colour value.
 *
 * @example
 * ```tsx
 * import { ColorSwatch, parseColor } from '@tale-ui/react/color-swatch';
 *
 * <ColorSwatch color={parseColor('#ff0000')} />
 * ```
 */
export const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(
  ({ className, ...props }, ref) => (
    <AriaColorSwatch ref={ref} className={cx('tale-color-swatch', className)} {...props} />
  ),
);
ColorSwatch.displayName = 'ColorSwatch';
