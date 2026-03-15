import * as React from 'react';
import {
  ColorWheel as AriaColorWheel,
  ColorWheelTrack as AriaColorWheelTrack,
  ColorThumb as AriaColorThumb,
  type ColorWheelProps as AriaColorWheelProps,
  type ColorWheelTrackProps as AriaColorWheelTrackProps,
  type ColorThumbProps as AriaColorThumbProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = Omit<AriaColorWheelProps, 'className'> & {
  className?: string;
};

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaColorWheel ref={ref} className={cx('tale-color-wheel', className)} {...props} />
  ),
);
Root.displayName = 'ColorWheel.Root';

// ── Track ──────────────────────────────────────────────────────────────────

export type TrackProps = Omit<AriaColorWheelTrackProps, 'className'> & {
  className?: string;
};

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  ({ className, ...props }, ref) => (
    <AriaColorWheelTrack ref={ref} className={cx('tale-color-wheel__track', className)} {...props} />
  ),
);
Track.displayName = 'ColorWheel.Track';

// ── Thumb ──────────────────────────────────────────────────────────────────

export type ThumbProps = Omit<AriaColorThumbProps, 'className'> & {
  className?: string;
};

export const Thumb = React.forwardRef<HTMLDivElement, ThumbProps>(
  ({ className, ...props }, ref) => (
    <AriaColorThumb ref={ref} className={cx('tale-color-wheel__thumb', className)} {...props} />
  ),
);
Thumb.displayName = 'ColorWheel.Thumb';
