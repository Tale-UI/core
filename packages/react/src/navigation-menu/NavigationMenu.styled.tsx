import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  NavigationMenuRootState,
  NavigationMenuRootProps,
  NavigationMenuRootActions,
  NavigationMenuRootChangeEventReason,
  NavigationMenuRootChangeEventDetails,
} from './root/NavigationMenuRoot';

export const Portal = H.Portal;
export const Positioner = H.Positioner;
export const Backdrop = H.Backdrop;
export const Arrow = H.Arrow;
export const Item = H.Item;

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-navigation-menu', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'NavigationMenu.Root';
export const Root = StyledRoot as typeof H.Root;

export namespace Root {
  export type State = NavigationMenuRootState;
  export type Props = NavigationMenuRootProps;
  export type Actions = NavigationMenuRootActions;
  export type ChangeEventReason = NavigationMenuRootChangeEventReason;
  export type ChangeEventDetails = NavigationMenuRootChangeEventDetails;
}

const StyledList = React.forwardRef<
  React.ComponentRef<typeof H.List>,
  React.ComponentPropsWithoutRef<typeof H.List>
>(({ className, ...props }, ref) => (
  <H.List className={cx('tale-navigation-menu__list', className)} ref={ref} {...props} />
));
StyledList.displayName = 'NavigationMenu.List';
export const List = StyledList as typeof H.List;

const StyledTrigger = React.forwardRef<
  React.ComponentRef<typeof H.Trigger>,
  React.ComponentPropsWithoutRef<typeof H.Trigger>
>(({ className, ...props }, ref) => (
  <H.Trigger className={cx('tale-navigation-menu__trigger', className)} ref={ref} {...props} />
));
StyledTrigger.displayName = 'NavigationMenu.Trigger';
export const Trigger = StyledTrigger as typeof H.Trigger;

const StyledIcon = React.forwardRef<
  React.ComponentRef<typeof H.Icon>,
  React.ComponentPropsWithoutRef<typeof H.Icon>
>(({ className, ...props }, ref) => (
  <H.Icon className={cx('tale-navigation-menu__icon', className)} ref={ref} {...props} />
));
StyledIcon.displayName = 'NavigationMenu.Icon';
export const Icon = StyledIcon as typeof H.Icon;

const StyledLink = React.forwardRef<
  React.ComponentRef<typeof H.Link>,
  React.ComponentPropsWithoutRef<typeof H.Link>
>(({ className, ...props }, ref) => (
  <H.Link className={cx('tale-navigation-menu__link', className)} ref={ref} {...props} />
));
StyledLink.displayName = 'NavigationMenu.Link';
export const Link = StyledLink as typeof H.Link;

const StyledPopup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-navigation-menu__popup', className)} ref={ref} {...props} />
));
StyledPopup.displayName = 'NavigationMenu.Popup';
export const Popup = StyledPopup as typeof H.Popup;

const StyledContent = React.forwardRef<
  React.ComponentRef<typeof H.Content>,
  React.ComponentPropsWithoutRef<typeof H.Content>
>(({ className, ...props }, ref) => (
  <H.Content className={cx('tale-navigation-menu__content', className)} ref={ref} {...props} />
));
StyledContent.displayName = 'NavigationMenu.Content';
export const Content = StyledContent as typeof H.Content;

const StyledViewport = React.forwardRef<
  React.ComponentRef<typeof H.Viewport>,
  React.ComponentPropsWithoutRef<typeof H.Viewport>
>(({ className, ...props }, ref) => (
  <H.Viewport className={cx('tale-navigation-menu__viewport', className)} ref={ref} {...props} />
));
StyledViewport.displayName = 'NavigationMenu.Viewport';
export const Viewport = StyledViewport as typeof H.Viewport;
