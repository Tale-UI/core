import * as React from 'react';
import {
  ColorSlider as AriaColorSlider,
  SliderTrack as AriaSliderTrack,
  ColorThumb as AriaColorThumb,
  SliderOutput as AriaSliderOutput,
  Label as AriaLabel,
  type ColorSliderProps as AriaColorSliderProps,
  type SliderTrackProps as AriaSliderTrackProps,
  type ColorThumbProps as AriaColorThumbProps,
  type SliderOutputProps as AriaSliderOutputProps,
  type LabelProps as AriaLabelProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = Omit<AriaColorSliderProps, 'className'> & {
  className?: string;
};

/**
 * A slider for adjusting a single colour channel (hue, saturation, etc.).
 *
 * @example
 * ```tsx
 * import { ColorSlider } from '@tale-ui/react/color-slider';
 * import { parseColor } from 'react-aria-components';
 *
 * <ColorSlider.Root channel="hue" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
 *   <ColorSlider.Label>Hue</ColorSlider.Label>
 *   <ColorSlider.Output />
 *   <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
 * </ColorSlider.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaColorSlider ref={ref} className={cx('tale-color-slider', className)} {...props} />
  ),
);
Root.displayName = 'ColorSlider.Root';

// ── Track ──────────────────────────────────────────────────────────────────

export type TrackProps = Omit<AriaSliderTrackProps, 'className'> & {
  className?: string;
};

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  ({ className, ...props }, ref) => (
    <AriaSliderTrack ref={ref} className={cx('tale-color-slider__track', className)} {...props} />
  ),
);
Track.displayName = 'ColorSlider.Track';

// ── Thumb ──────────────────────────────────────────────────────────────────

export type ThumbProps = Omit<AriaColorThumbProps, 'className'> & {
  className?: string;
};

export const Thumb = React.forwardRef<HTMLDivElement, ThumbProps>(
  ({ className, ...props }, ref) => (
    <AriaColorThumb ref={ref} className={cx('tale-color-slider__thumb', className)} {...props} />
  ),
);
Thumb.displayName = 'ColorSlider.Thumb';

// ── Label ──────────────────────────────────────────────────────────────────

export type LabelProps = Omit<AriaLabelProps, 'className'> & {
  className?: string;
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-color-slider__label', className)} {...props} />
  ),
);
Label.displayName = 'ColorSlider.Label';

// ── Output ─────────────────────────────────────────────────────────────────

export type OutputProps = Omit<AriaSliderOutputProps, 'className'> & {
  className?: string;
};

export const Output = React.forwardRef<HTMLOutputElement, OutputProps>(
  ({ className, ...props }, ref) => (
    <AriaSliderOutput ref={ref} className={cx('tale-color-slider__output', className)} {...props} />
  ),
);
Output.displayName = 'ColorSlider.Output';
