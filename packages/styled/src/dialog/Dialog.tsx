import * as React from 'react';
import { Dialog as H } from '@tale-ui/react/dialog';
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
  <H.Backdrop className={cx('tale-dialog__backdrop', className)} ref={ref} {...props} />
));
Backdrop.displayName = 'Dialog.Backdrop';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-dialog__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'Dialog.Popup';

export const Title = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-dialog__title', className)} ref={ref} {...props} />
));
Title.displayName = 'Dialog.Title';

export const Description = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-dialog__description', className)} ref={ref} {...props} />
));
Description.displayName = 'Dialog.Description';

export const Close = React.forwardRef<
  React.ComponentRef<typeof H.Close>,
  React.ComponentPropsWithoutRef<typeof H.Close>
>(({ className, ...props }, ref) => (
  <H.Close className={cx('tale-dialog__close', className)} ref={ref} {...props} />
));
Close.displayName = 'Dialog.Close';
