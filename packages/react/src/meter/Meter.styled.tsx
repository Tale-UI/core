import * as React from 'react';
import { Meter } from 'react-aria-components';
import type { MeterProps as AriaMeterProps } from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaMeterProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <Meter ref={ref} className={cx('tale-meter', className)} {...props} />
  ),
);
Root.displayName = 'Meter.Root';

// ── Track ──────────────────────────────────────────────────────────────────

export interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-meter__track', className)} {...props} />
  ),
);
Track.displayName = 'Meter.Track';

// ── Indicator ──────────────────────────────────────────────────────────────

export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current value.
   */
  value?: number | undefined;
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
  ({ className, value = 0, min = 0, max = 100, style, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const indicatorStyle: React.CSSProperties = {
      insetInlineStart: 0,
      height: 'inherit',
      width: `${percentage}%`,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cx('tale-meter__indicator', className)}
        style={indicatorStyle}
        {...props}
      />
    );
  },
);
Indicator.displayName = 'Meter.Indicator';

// ── Label ──────────────────────────────────────────────────────────────────

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-meter__label', className)} {...props} />
  ),
);
Label.displayName = 'Meter.Label';

// ── Value ──────────────────────────────────────────────────────────────────

export interface ValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Value = React.forwardRef<HTMLSpanElement, ValueProps>(
  ({ className, children, ...props }, ref) => {
    if (process.env.NODE_ENV !== 'production' && children == null) {
      console.warn(
        'Meter.Value was rendered without children. It is a display-only <span> that renders ' +
          'whatever text you pass as children. Use <Meter.Value>60%</Meter.Value>.',
      );
    }

    return (
      <span ref={ref} aria-hidden className={cx('tale-meter__value', className)} {...props}>
        {children}
      </span>
    );
  },
);
Value.displayName = 'Meter.Value';
