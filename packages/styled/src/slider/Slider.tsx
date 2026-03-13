import * as React from 'react';
import { Slider as H } from '@tale-ui/react/slider';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-slider', className)} ref={ref} {...props} />
));
Root.displayName = 'Slider.Root';

export const Control = React.forwardRef<
  React.ComponentRef<typeof H.Control>,
  React.ComponentPropsWithoutRef<typeof H.Control>
>(({ className, ...props }, ref) => (
  <H.Control className={cx('tale-slider__control', className)} ref={ref} {...props} />
));
Control.displayName = 'Slider.Control';

export const Track = React.forwardRef<
  React.ComponentRef<typeof H.Track>,
  React.ComponentPropsWithoutRef<typeof H.Track>
>(({ className, ...props }, ref) => (
  <H.Track className={cx('tale-slider__track', className)} ref={ref} {...props} />
));
Track.displayName = 'Slider.Track';

export const Indicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-slider__indicator', className)} ref={ref} {...props} />
));
Indicator.displayName = 'Slider.Indicator';

export const Thumb = React.forwardRef<
  React.ComponentRef<typeof H.Thumb>,
  React.ComponentPropsWithoutRef<typeof H.Thumb>
>(({ className, ...props }, ref) => (
  <H.Thumb className={cx('tale-slider__thumb', className)} ref={ref} {...props} />
));
Thumb.displayName = 'Slider.Thumb';
