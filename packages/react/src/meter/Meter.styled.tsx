import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-meter', className)} ref={ref} {...props} />
));
Root.displayName = 'Meter.Root';

export const Label = React.forwardRef<
  React.ComponentRef<typeof H.Label>,
  React.ComponentPropsWithoutRef<typeof H.Label>
>(({ className, ...props }, ref) => (
  <H.Label className={cx('tale-meter__label', className)} ref={ref} {...props} />
));
Label.displayName = 'Meter.Label';

export const Value = H.Value;

export const Track = React.forwardRef<
  React.ComponentRef<typeof H.Track>,
  React.ComponentPropsWithoutRef<typeof H.Track>
>(({ className, ...props }, ref) => (
  <H.Track className={cx('tale-meter__track', className)} ref={ref} {...props} />
));
Track.displayName = 'Meter.Track';

export const Indicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-meter__indicator', className)} ref={ref} {...props} />
));
Indicator.displayName = 'Meter.Indicator';
