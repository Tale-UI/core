import * as React from 'react';
import {
  Slider as AriaSlider,
  SliderTrack as AriaSliderTrack,
  SliderThumb as AriaSliderThumb,
  SliderOutput as AriaSliderOutput,
  SliderStateContext,
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

/**
 * A slider for selecting a numeric value within a range.
 *
 * @example
 * ```tsx
 * import { Slider } from '@tale-ui/react/slider';
 *
 * <Slider.Root defaultValue={50}>
 *   <Slider.Header>
 *     <Slider.Label>Volume</Slider.Label>
 *     <Slider.Output />
 *   </Slider.Header>
 *   <Slider.Control>
 *     <Slider.Track>
 *       <Slider.Indicator />
 *       <Slider.Thumb />
 *     </Slider.Track>
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 */
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

/* ─── Header (label + output row) ────────────────────────────────────────── */

export const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-slider__header', className)} {...props} />
  ),
);
Header.displayName = 'Slider.Header';

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
  ({ className, style, ...props }, ref) => {
    const state = React.useContext(SliderStateContext);
    let fillStyle: React.CSSProperties | undefined;
    if (state) {
      const count = state.values.length;
      const start = count > 1 ? state.getThumbPercent(0) : 0;
      const end = state.getThumbPercent(count - 1);
      const startPct = `${start * 100}%`;
      const sizePct = `${(end - start) * 100}%`;
      fillStyle =
        state.orientation === 'vertical'
          ? { bottom: startPct, height: sizePct }
          : { left: startPct, width: sizePct };
    }
    return (
      <div ref={ref} className={cx('tale-slider__indicator', className)} style={{ ...fillStyle, ...style }} {...props} />
    );
  },
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

export type OutputProps = Omit<AriaSliderOutputProps, 'className'> & {
  className?: string;
  /** Position relative to the thumb. Nest Output inside Thumb when using this prop. */
  position?: 'top' | 'bottom';
  /** Thumb index to display. When set, only that thumb's formatted value is shown instead of all values. */
  index?: number;
};

export const Output = React.forwardRef<HTMLOutputElement, OutputProps>(
  ({ className, position, index, children, ...props }, ref) => {
    const state = React.useContext(SliderStateContext);
    const resolvedChildren =
      children ?? (index != null && state ? state.getThumbValueLabel(index) : undefined);
    return (
      <AriaSliderOutput
        ref={ref}
        className={cx(
          `tale-slider__output${position ? ` tale-slider__output--${position}` : ''}`,
          className,
        )}
        {...props}
      >
        {resolvedChildren}
      </AriaSliderOutput>
    );
  },
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
