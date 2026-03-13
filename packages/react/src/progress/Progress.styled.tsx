import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-progress', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'Progress.Root';
export const Root = StyledRoot as typeof H.Root;

export const Value = H.Value;

const StyledTrack = React.forwardRef<
  React.ComponentRef<typeof H.Track>,
  React.ComponentPropsWithoutRef<typeof H.Track>
>(({ className, ...props }, ref) => (
  <H.Track className={cx('tale-progress__track', className)} ref={ref} {...props} />
));
StyledTrack.displayName = 'Progress.Track';
export const Track = StyledTrack as typeof H.Track;

const StyledIndicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-progress__indicator', className)} ref={ref} {...props} />
));
StyledIndicator.displayName = 'Progress.Indicator';
export const Indicator = StyledIndicator as typeof H.Indicator;

export { Label } from './index.parts';
export type { Status } from './index.parts';
