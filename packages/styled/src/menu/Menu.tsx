import * as React from 'react';
import { Menu as H } from '@tale-ui/react/menu';
import { cx } from '../_cx';

export const Root = H.Root;
export const Trigger = H.Trigger;
export const Portal = H.Portal;
export const Backdrop = H.Backdrop;
export const Positioner = H.Positioner;
export const Arrow = H.Arrow;
export const Group = H.Group;
export const RadioGroup = H.RadioGroup;
export const SubmenuRoot = H.SubmenuRoot;
export const Separator = H.Separator;
export const Handle = H.Handle;
export const createHandle = H.createHandle;

export const Popup = React.forwardRef<
  React.ComponentRef<typeof H.Popup>,
  React.ComponentPropsWithoutRef<typeof H.Popup>
>(({ className, ...props }, ref) => (
  <H.Popup className={cx('tale-menu__popup', className)} ref={ref} {...props} />
));
Popup.displayName = 'Menu.Popup';

export const Item = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-menu__item', className)} ref={ref} {...props} />
));
Item.displayName = 'Menu.Item';

export const CheckboxItem = React.forwardRef<
  React.ComponentRef<typeof H.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof H.CheckboxItem>
>(({ className, ...props }, ref) => (
  <H.CheckboxItem className={cx('tale-menu__checkbox-item', className)} ref={ref} {...props} />
));
CheckboxItem.displayName = 'Menu.CheckboxItem';

export const CheckboxItemIndicator = React.forwardRef<
  React.ComponentRef<typeof H.CheckboxItemIndicator>,
  React.ComponentPropsWithoutRef<typeof H.CheckboxItemIndicator>
>(({ className, ...props }, ref) => (
  <H.CheckboxItemIndicator className={cx('tale-menu__item-indicator', className)} ref={ref} {...props} />
));
CheckboxItemIndicator.displayName = 'Menu.CheckboxItemIndicator';

export const RadioItem = React.forwardRef<
  React.ComponentRef<typeof H.RadioItem>,
  React.ComponentPropsWithoutRef<typeof H.RadioItem>
>(({ className, ...props }, ref) => (
  <H.RadioItem className={cx('tale-menu__radio-item', className)} ref={ref} {...props} />
));
RadioItem.displayName = 'Menu.RadioItem';

export const RadioItemIndicator = React.forwardRef<
  React.ComponentRef<typeof H.RadioItemIndicator>,
  React.ComponentPropsWithoutRef<typeof H.RadioItemIndicator>
>(({ className, ...props }, ref) => (
  <H.RadioItemIndicator className={cx('tale-menu__item-indicator', className)} ref={ref} {...props} />
));
RadioItemIndicator.displayName = 'Menu.RadioItemIndicator';

export const LinkItem = React.forwardRef<
  React.ComponentRef<typeof H.LinkItem>,
  React.ComponentPropsWithoutRef<typeof H.LinkItem>
>(({ className, ...props }, ref) => (
  <H.LinkItem className={cx('tale-menu__link-item', className)} ref={ref} {...props} />
));
LinkItem.displayName = 'Menu.LinkItem';

export const SubmenuTrigger = React.forwardRef<
  React.ComponentRef<typeof H.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof H.SubmenuTrigger>
>(({ className, ...props }, ref) => (
  <H.SubmenuTrigger className={cx('tale-menu__submenu-trigger', className)} ref={ref} {...props} />
));
SubmenuTrigger.displayName = 'Menu.SubmenuTrigger';

export const GroupLabel = React.forwardRef<
  React.ComponentRef<typeof H.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof H.GroupLabel>
>(({ className, ...props }, ref) => (
  <H.GroupLabel className={cx('tale-menu__group-label', className)} ref={ref} {...props} />
));
GroupLabel.displayName = 'Menu.GroupLabel';
