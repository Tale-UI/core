import * as React from 'react';
import { AlertDialog as H } from '@tale-ui/react/alert-dialog';
import { cx } from '../_cx';

export const Root = H.Root;
export const Portal = H.Portal;
export const Viewport = H.Viewport;
export const Trigger = H.Trigger;
export const createHandle = H.createHandle;
export const Handle = H.Handle;

export const Backdrop = React.forwardRef<
  React.ComponentRef<typeof H.Backdrop>,
  React.ComponentPropsWithoutRef<typeof H.Backdrop>
>(({ className, ...props }, ref) => (
  <H.Backdrop className={cx('tale-alert-dialog__backdrop', className)} ref={ref} {...props} />
));
Backdrop.displayName = 'AlertDialog.Backdrop';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-alert-dialog__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'AlertDialog.Popup';

export const Title = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-alert-dialog__title', className)} ref={ref} {...props} />
));
Title.displayName = 'AlertDialog.Title';

export const Description = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-alert-dialog__description', className)} ref={ref} {...props} />
));
Description.displayName = 'AlertDialog.Description';

export const Close = H.Close;
