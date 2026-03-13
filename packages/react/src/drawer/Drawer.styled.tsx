import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  DrawerRootProps,
  DrawerRootActions,
  DrawerRootChangeEventReason,
  DrawerRootChangeEventDetails,
  DrawerRootSnapPointChangeEventReason,
  DrawerRootSnapPointChangeEventDetails,
} from './root/DrawerRoot';
import type { DrawerSnapPoint } from './root/DrawerRootContext';

export const Root = H.Root;

export namespace Root {
    export type Props<Payload = unknown> = DrawerRootProps<Payload>;
  export type Actions = DrawerRootActions;
  export type ChangeEventReason = DrawerRootChangeEventReason;
  export type ChangeEventDetails = DrawerRootChangeEventDetails;
  export type SnapPointChangeEventReason = DrawerRootSnapPointChangeEventReason;
  export type SnapPointChangeEventDetails = DrawerRootSnapPointChangeEventDetails;
  export type SnapPoint = DrawerSnapPoint;
}

export const Portal = H.Portal;
export const Viewport = H.Viewport;
export const Trigger = H.Trigger;
export const Provider = H.Provider;
export const Indent = H.Indent;
export const IndentBackground = H.IndentBackground;
export const createHandle = H.createHandle;
export const Handle = H.Handle;

const StyledBackdrop = React.forwardRef<
  React.ComponentRef<typeof H.Backdrop>,
  React.ComponentPropsWithoutRef<typeof H.Backdrop>
>(({ className, ...props }, ref) => (
  <H.Backdrop className={cx('tale-drawer__backdrop', className)} ref={ref} {...props} />
));
StyledBackdrop.displayName = 'Drawer.Backdrop';
export const Backdrop = StyledBackdrop as typeof H.Backdrop;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-drawer__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'Drawer.Popup';
export const Popup = StyledPopup as typeof H.Popup;

const StyledContent = React.forwardRef<
  React.ComponentRef<typeof H.Content>,
  React.ComponentPropsWithoutRef<typeof H.Content>
>(({ className, ...props }, ref) => (
  <H.Content className={cx('tale-drawer__content', className)} ref={ref} {...props} />
));
StyledContent.displayName = 'Drawer.Content';
export const Content = StyledContent as typeof H.Content;

const StyledTitle = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-drawer__title', className)} ref={ref} {...props} />
));
StyledTitle.displayName = 'Drawer.Title';
export const Title = StyledTitle as typeof H.Title;

const StyledDescription = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-drawer__description', className)} ref={ref} {...props} />
));
StyledDescription.displayName = 'Drawer.Description';
export const Description = StyledDescription as typeof H.Description;

export const Close = H.Close;
