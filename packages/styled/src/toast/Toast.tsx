import * as React from 'react';
import { Toast as H } from '@tale-ui/react/toast';
import { cx } from '../_cx';

export const Provider = H.Provider;
export const Viewport = H.Viewport;
export const Portal = H.Portal;
export const Arrow = H.Arrow;
export const useToastManager = H.useToastManager;
export const createToastManager = H.createToastManager;

export const Positioner = React.forwardRef<
  React.ComponentRef<typeof H.Positioner>,
  React.ComponentPropsWithoutRef<typeof H.Positioner>
>(({ className, ...props }, ref) => (
  <H.Positioner className={cx('tale-toast__positioner', className)} ref={ref} {...props} />
));
Positioner.displayName = 'Toast.Positioner';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-toast__root', className)} ref={ref} {...props} />
));
Root.displayName = 'Toast.Root';

export const Content = React.forwardRef<
  React.ComponentRef<typeof H.Content>,
  React.ComponentPropsWithoutRef<typeof H.Content>
>(({ className, ...props }, ref) => (
  <H.Content className={cx('tale-toast__content', className)} ref={ref} {...props} />
));
Content.displayName = 'Toast.Content';

export const Title = React.forwardRef<
  React.ComponentRef<typeof H.Title>,
  React.ComponentPropsWithoutRef<typeof H.Title>
>(({ className, ...props }, ref) => (
  <H.Title className={cx('tale-toast__title', className)} ref={ref} {...props} />
));
Title.displayName = 'Toast.Title';

export const Description = React.forwardRef<
  React.ComponentRef<typeof H.Description>,
  React.ComponentPropsWithoutRef<typeof H.Description>
>(({ className, ...props }, ref) => (
  <H.Description className={cx('tale-toast__description', className)} ref={ref} {...props} />
));
Description.displayName = 'Toast.Description';

export const Close = React.forwardRef<
  React.ComponentRef<typeof H.Close>,
  React.ComponentPropsWithoutRef<typeof H.Close>
>(({ className, ...props }, ref) => (
  <H.Close className={cx('tale-toast__close', className)} ref={ref} {...props} />
));
Close.displayName = 'Toast.Close';

export const Action = React.forwardRef<
  React.ComponentRef<typeof H.Action>,
  React.ComponentPropsWithoutRef<typeof H.Action>
>(({ className, ...props }, ref) => (
  <H.Action className={cx('tale-toast__action', className)} ref={ref} {...props} />
));
Action.displayName = 'Toast.Action';
