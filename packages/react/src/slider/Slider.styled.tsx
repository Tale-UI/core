import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  SliderRootState,
  SliderRootProps,
  SliderRootChangeEventReason,
  SliderRootChangeEventDetails,
  SliderRootCommitEventReason,
  SliderRootCommitEventDetails,
} from './root/SliderRoot';

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-slider', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'Slider.Root';
export const Root = StyledRoot as typeof H.Root;

export namespace Root {
  export type State = SliderRootState;
    export type Props<Value extends number | readonly number[] = number | readonly number[]> = SliderRootProps<Value>;
  export type ChangeEventReason = SliderRootChangeEventReason;
  export type ChangeEventDetails = SliderRootChangeEventDetails;
  export type CommitEventReason = SliderRootCommitEventReason;
  export type CommitEventDetails = SliderRootCommitEventDetails;
}

const StyledControl = React.forwardRef<
  React.ComponentRef<typeof H.Control>,
  React.ComponentPropsWithoutRef<typeof H.Control>
>(({ className, ...props }, ref) => (
  <H.Control className={cx('tale-slider__control', className)} ref={ref} {...props} />
));
StyledControl.displayName = 'Slider.Control';
export const Control = StyledControl as typeof H.Control;

const StyledTrack = React.forwardRef<
  React.ComponentRef<typeof H.Track>,
  React.ComponentPropsWithoutRef<typeof H.Track>
>(({ className, ...props }, ref) => (
  <H.Track className={cx('tale-slider__track', className)} ref={ref} {...props} />
));
StyledTrack.displayName = 'Slider.Track';
export const Track = StyledTrack as typeof H.Track;

const StyledIndicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-slider__indicator', className)} ref={ref} {...props} />
));
StyledIndicator.displayName = 'Slider.Indicator';
export const Indicator = StyledIndicator as typeof H.Indicator;

const StyledThumb = React.forwardRef<
  React.ComponentRef<typeof H.Thumb>,
  React.ComponentPropsWithoutRef<typeof H.Thumb>
>(({ className, ...props }, ref) => (
  <H.Thumb className={cx('tale-slider__thumb', className)} ref={ref} {...props} />
));
StyledThumb.displayName = 'Slider.Thumb';
export const Thumb = StyledThumb as typeof H.Thumb;

export { Value } from './index.parts';
