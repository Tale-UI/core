import * as React from 'react';
import {
  ColorSwatch as AriaColorSwatch,
  type ColorSwatchProps as AriaColorSwatchProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── ColorSwatch ────────────────────────────────────────────────────────────

export type ColorSwatchShape = 'square' | 'circle';

export type ColorSwatchProps = Omit<AriaColorSwatchProps, 'className' | 'style'> & {
  className?: string;
  style?: React.CSSProperties;
  /**
   * Visual shape of the swatch.
   *
   * When the swatch is nested inside a `<ColorSwatchPicker.Root shape="circle">`,
   * setting this prop overrides the picker's shape for this individual swatch.
   *
   * @default 'square'
   */
  shape?: ColorSwatchShape;
  /**
   * Optional second colour. When provided, the swatch is split diagonally —
   * `color` fills the top-left half and `secondaryColor` fills the bottom-right
   * half. Useful when one swatch represents a theme that pairs a brand colour
   * with a neutral colour.
   *
   * Accepts a CSS colour string (same format as `color`).
   */
  secondaryColor?: string;
};

/**
 * Displays a preview of a colour value.
 *
 * @example
 * ```tsx
 * import { ColorSwatch } from '@tale-ui/react/color-swatch';
 *
 * <ColorSwatch color="#ff0000" />
 * <ColorSwatch color="#ff0000" shape="circle" />
 * <ColorSwatch color="#ff0000" secondaryColor="#e0e0e0" />
 * ```
 */
export const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(
  ({ className, shape, secondaryColor, style, ...props }, ref) => {
    const mergedStyle: React.CSSProperties | undefined = secondaryColor
      ? { ...style, ['--tale-color-swatch-secondary' as never]: secondaryColor }
      : style;
    const base = [
      'tale-color-swatch',
      shape === 'circle' && 'tale-color-swatch--circle',
      shape === 'square' && 'tale-color-swatch--square',
      secondaryColor && 'tale-color-swatch--split',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <AriaColorSwatch
        ref={ref}
        className={cx(base, className)}
        style={mergedStyle}
        {...props}
      />
    );
  },
);
ColorSwatch.displayName = 'ColorSwatch';
