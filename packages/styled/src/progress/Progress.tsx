import * as React from 'react';
import { Progress as H } from '@tale-ui/react/progress';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-progress', className)} ref={ref} {...props} />
));
Root.displayName = 'Progress.Root';

export const Value = H.Value;

export const Track = React.forwardRef<
  React.ComponentRef<typeof H.Track>,
  React.ComponentPropsWithoutRef<typeof H.Track>
>(({ className, ...props }, ref) => (
  <H.Track className={cx('tale-progress__track', className)} ref={ref} {...props} />
));
Track.displayName = 'Progress.Track';

export const Indicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-progress__indicator', className)} ref={ref} {...props} />
));
Indicator.displayName = 'Progress.Indicator';
