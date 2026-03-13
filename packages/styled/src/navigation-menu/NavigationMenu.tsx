import * as React from 'react';
import { NavigationMenu as H } from '@tale-ui/react/navigation-menu';
import { cx } from '../_cx';

export const Portal = H.Portal;
export const Positioner = H.Positioner;
export const Backdrop = H.Backdrop;
export const Arrow = H.Arrow;
export const Item = H.Item;

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-navigation-menu', className)} ref={ref} {...props} />
));
Root.displayName = 'NavigationMenu.Root';

export const List = React.forwardRef<
  React.ComponentRef<typeof H.List>,
  React.ComponentPropsWithoutRef<typeof H.List>
>(({ className, ...props }, ref) => (
  <H.List className={cx('tale-navigation-menu__list', className)} ref={ref} {...props} />
));
List.displayName = 'NavigationMenu.List';

export const Trigger = React.forwardRef<
  React.ComponentRef<typeof H.Trigger>,
  React.ComponentPropsWithoutRef<typeof H.Trigger>
>(({ className, ...props }, ref) => (
  <H.Trigger className={cx('tale-navigation-menu__trigger', className)} ref={ref} {...props} />
));
Trigger.displayName = 'NavigationMenu.Trigger';

export const Icon = React.forwardRef<
  React.ComponentRef<typeof H.Icon>,
  React.ComponentPropsWithoutRef<typeof H.Icon>
>(({ className, ...props }, ref) => (
  <H.Icon className={cx('tale-navigation-menu__icon', className)} ref={ref} {...props} />
));
Icon.displayName = 'NavigationMenu.Icon';

export const Link = React.forwardRef<
  React.ComponentRef<typeof H.Link>,
  React.ComponentPropsWithoutRef<typeof H.Link>
>(({ className, ...props }, ref) => (
  <H.Link className={cx('tale-navigation-menu__link', className)} ref={ref} {...props} />
));
Link.displayName = 'NavigationMenu.Link';

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-navigation-menu__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'NavigationMenu.Popup';

export const Content = React.forwardRef<
  React.ComponentRef<typeof H.Content>,
  React.ComponentPropsWithoutRef<typeof H.Content>
>(({ className, ...props }, ref) => (
  <H.Content className={cx('tale-navigation-menu__content', className)} ref={ref} {...props} />
));
Content.displayName = 'NavigationMenu.Content';

export const Viewport = React.forwardRef<
  React.ComponentRef<typeof H.Viewport>,
  React.ComponentPropsWithoutRef<typeof H.Viewport>
>(({ className, ...props }, ref) => (
  <H.Viewport className={cx('tale-navigation-menu__viewport', className)} ref={ref} {...props} />
));
Viewport.displayName = 'NavigationMenu.Viewport';
