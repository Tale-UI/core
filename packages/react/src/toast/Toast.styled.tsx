import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  ToastRootToastObject,
  ToastRootState,
  ToastRootProps,
} from './root/ToastRoot';

export const Provider = H.Provider;
export const Viewport = H.Viewport;
export const Portal = H.Portal;
export const Arrow = H.Arrow;
export const useToastManager = H.useToastManager;
export const createToastManager = H.createToastManager;

const StyledPositioner = React.forwardRef<
  React.ComponentRef<typeof H.Positioner>,
  React.ComponentPropsWithoutRef<typeof H.Positioner>
>(({ className, ...props }, ref) => (
  <H.Positioner className={cx('tale-toast__positioner', className)} ref={ref} {...props} />
));
StyledPositioner.displayName = 'Toast.Positioner';
export const Positioner = StyledPositioner as typeof H.Positioner;

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-toast__root', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'Toast.Root';
export const Root = StyledRoot as typeof H.Root;

export namespace Root {
    export type ToastObject<Data extends object = any> = ToastRootToastObject<Data>;
  export type State = ToastRootState;
  export type Props = ToastRootProps;
}

const StyledContent = React.forwardRef<
  React.ComponentRef<typeof H.Content>,
  React.ComponentPropsWithoutRef<typeof H.Content>
>(({ className, ...props }, ref) => (
  <H.Content className={cx('tale-toast__content', className)} ref={ref} {...props} />
));
StyledContent.displayName = 'Toast.Content';
export const Content = StyledContent as typeof H.Content;

const StyledTitle = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-toast__title', className)} ref={ref} {...props} />
));
StyledTitle.displayName = 'Toast.Title';
export const Title = StyledTitle as typeof H.Title;

const StyledDescription = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-toast__description', className)} ref={ref} {...props} />
));
StyledDescription.displayName = 'Toast.Description';
export const Description = StyledDescription as typeof H.Description;

const StyledClose = React.forwardRef<
  React.ComponentRef<typeof H.Close>,
  React.ComponentPropsWithoutRef<typeof H.Close>
>(({ className, ...props }, ref) => (
  <H.Close className={cx('tale-toast__close', className)} ref={ref} {...props} />
));
StyledClose.displayName = 'Toast.Close';
export const Close = StyledClose as typeof H.Close;

const StyledAction = React.forwardRef<
  React.ComponentRef<typeof H.Action>,
  React.ComponentPropsWithoutRef<typeof H.Action>
>(({ className, ...props }, ref) => (
  <H.Action className={cx('tale-toast__action', className)} ref={ref} {...props} />
));
StyledAction.displayName = 'Toast.Action';
export const Action = StyledAction as typeof H.Action;
