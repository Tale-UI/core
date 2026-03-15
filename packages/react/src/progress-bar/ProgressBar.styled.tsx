import * as React from 'react';
import { ProgressBar } from 'react-aria-components';
import type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaProgressBarProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <ProgressBar ref={ref} className={cx('tale-progress-bar', className)} {...props} />
  ),
);
Root.displayName = 'ProgressBar.Root';

// ── Track ──────────────────────────────────────────────────────────────────

export interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-progress-bar__track', className)} {...props} />
  ),
);
Track.displayName = 'ProgressBar.Track';

// ── Indicator ──────────────────────────────────────────────────────────────

export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current value (0–max). When null the bar is indeterminate.
   */
  value?: number | null | undefined;
  /**
   * The minimum value.
   * @default 0
   */
  min?: number | undefined;
  /**
   * The maximum value.
   * @default 100
   */
  max?: number | undefined;
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLDivElement, IndicatorProps>(
  ({ className, value, min = 0, max = 100, style, ...props }, ref) => {
    const percentage =
      value != null && Number.isFinite(value) ? ((value - min) / (max - min)) * 100 : null;

    const indicatorStyle: React.CSSProperties =
      percentage != null
        ? { insetInlineStart: 0, height: 'inherit', width: `${percentage}%`, ...style }
        : { ...style };

    return (
      <div
        ref={ref}
        className={cx('tale-progress-bar__indicator', className)}
        data-indeterminate={percentage == null ? '' : undefined}
        style={indicatorStyle}
        {...props}
      />
    );
  },
);
Indicator.displayName = 'ProgressBar.Indicator';

// ── Label ──────────────────────────────────────────────────────────────────

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-progress-bar__label', className)} {...props} />
  ),
);
Label.displayName = 'ProgressBar.Label';

// ── Value ──────────────────────────────────────────────────────────────────

export interface ValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Value = React.forwardRef<HTMLSpanElement, ValueProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden className={cx('tale-progress-bar__value', className)} {...props} />
  ),
);
Value.displayName = 'ProgressBar.Value';

export type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
