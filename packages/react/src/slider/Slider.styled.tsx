import * as React from 'react';
import {
  Slider as AriaSlider,
  SliderTrack as AriaSliderTrack,
  SliderThumb as AriaSliderThumb,
  SliderOutput as AriaSliderOutput,
  Label as AriaLabel,
  type SliderProps as AriaSliderProps,
  type SliderTrackProps as AriaSliderTrackProps,
  type SliderThumbProps as AriaSliderThumbProps,
  type SliderOutputProps as AriaSliderOutputProps,
  type LabelProps as AriaLabelProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ────────────────────────────────────────────────────────────────── */

export type RootProps<T extends number | number[] = number> = Omit<AriaSliderProps<T>, 'className'> & {
  className?: string;
};

export const Root: <T extends number | number[] = number>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RootProps, ref) => (
    <AriaSlider
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-slider', className)}
      {...props}
    />
  ),
) as any;
(Root as any).displayName = 'Slider.Root';

/* ─── Control — touch-active container around the track ──────────────────── */

export type ControlProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

export const Control = React.forwardRef<HTMLDivElement, ControlProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-slider__control', className)} {...props} />
  ),
);
Control.displayName = 'Slider.Control';

/* ─── Track ───────────────────────────────────────────────────────────────── */

export type TrackProps = Omit<AriaSliderTrackProps, 'className'> & { className?: string };

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  ({ className, ...props }, ref) => (
    <AriaSliderTrack ref={ref} className={cx('tale-slider__track', className)} {...props} />
  ),
);
Track.displayName = 'Slider.Track';

/* ─── Indicator — filled portion of the track ────────────────────────────── */

export type IndicatorProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

export const Indicator = React.forwardRef<HTMLDivElement, IndicatorProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-slider__indicator', className)} {...props} />
  ),
);
Indicator.displayName = 'Slider.Indicator';

/* ─── Thumb ───────────────────────────────────────────────────────────────── */

export type ThumbProps = Omit<AriaSliderThumbProps, 'className'> & { className?: string };

export const Thumb = React.forwardRef<HTMLDivElement, ThumbProps>(
  ({ className, ...props }, ref) => (
    <AriaSliderThumb ref={ref} className={cx('tale-slider__thumb', className)} {...props} />
  ),
);
Thumb.displayName = 'Slider.Thumb';

/* ─── Output (current value display) ─────────────────────────────────────── */

export type OutputProps = Omit<AriaSliderOutputProps, 'className'> & { className?: string };

export const Output = React.forwardRef<HTMLOutputElement, OutputProps>(
  ({ className, ...props }, ref) => (
    <AriaSliderOutput ref={ref} className={cx('tale-slider__output', className)} {...props} />
  ),
);
Output.displayName = 'Slider.Output';

/* ─── Label ───────────────────────────────────────────────────────────────── */

export type LabelProps = Omit<AriaLabelProps, 'className'> & { className?: string };

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-slider__label', className)} {...props} />
  ),
);
Label.displayName = 'Slider.Label';
