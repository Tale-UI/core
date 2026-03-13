import * as React from 'react';
import { DrawerPreview as H } from '@tale-ui/react/drawer';
import { cx } from '../_cx';

export const Root = H.Root;
export const Portal = H.Portal;
export const Viewport = H.Viewport;
export const Trigger = H.Trigger;
export const Provider = H.Provider;
export const Indent = H.Indent;
export const IndentBackground = H.IndentBackground;
export const createHandle = H.createHandle;
export const Handle = H.Handle;

export const Backdrop = React.forwardRef<
  React.ComponentRef<typeof H.Backdrop>,
  React.ComponentPropsWithoutRef<typeof H.Backdrop>
>(({ className, ...props }, ref) => (
  <H.Backdrop className={cx('tale-drawer__backdrop', className)} ref={ref} {...props} />
));
Backdrop.displayName = 'Drawer.Backdrop';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-drawer__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'Drawer.Popup';

export const Content = React.forwardRef<
  React.ComponentRef<typeof H.Content>,
  React.ComponentPropsWithoutRef<typeof H.Content>
>(({ className, ...props }, ref) => (
  <H.Content className={cx('tale-drawer__content', className)} ref={ref} {...props} />
));
Content.displayName = 'Drawer.Content';

export const Title = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-drawer__title', className)} ref={ref} {...props} />
));
Title.displayName = 'Drawer.Title';

export const Description = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-drawer__description', className)} ref={ref} {...props} />
));
Description.displayName = 'Drawer.Description';

export const Close = H.Close;
