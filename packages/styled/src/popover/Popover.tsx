import * as React from 'react';
import { Popover as H } from '@tale-ui/react/popover';
import { cx } from '../_cx';

export const Root = H.Root;
export const Trigger = H.Trigger;
export const Portal = H.Portal;
export const Positioner = H.Positioner;
export const Backdrop = H.Backdrop;
export const Viewport = H.Viewport;
export const createHandle = H.createHandle;
export const Handle = H.Handle;

export const Arrow = React.forwardRef<
  React.ComponentRef<typeof H.Arrow>,
  React.ComponentPropsWithoutRef<typeof H.Arrow>
>(({ className, ...props }, ref) => (
  <H.Arrow className={cx('tale-popover__arrow', className)} ref={ref} {...props} />
));
Arrow.displayName = 'Popover.Arrow';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-popover__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'Popover.Popup';

export const Title = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-popover__title', className)} ref={ref} {...props} />
));
Title.displayName = 'Popover.Title';

export const Description = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-popover__description', className)} ref={ref} {...props} />
));
Description.displayName = 'Popover.Description';

export const Close = React.forwardRef<
  React.ComponentRef<typeof H.Close>,
  React.ComponentPropsWithoutRef<typeof H.Close>
>(({ className, ...props }, ref) => (
  <H.Close className={cx('tale-popover__close', className)} ref={ref} {...props} />
));
Close.displayName = 'Popover.Close';
