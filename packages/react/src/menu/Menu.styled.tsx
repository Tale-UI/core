import * as React from 'react';
import {
  MenuTrigger as AriaMenuTrigger,
  Button as AriaButton,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  Popover as AriaPopover,
  Separator as AriaSeparator,
  Header as AriaHeader,
  type MenuTriggerProps as AriaMenuTriggerProps,
  type ButtonProps as AriaButtonProps,
  type MenuProps as AriaMenuProps,
  type MenuItemProps as AriaMenuItemProps,
  type MenuSectionProps as AriaMenuSectionProps,
  type PopoverProps as AriaPopoverProps,
  type SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (MenuTrigger) ──────────────────────────────────────────────────── */

export type RootProps = AriaMenuTriggerProps;
/**
 * A dropdown menu triggered by a button.
 *
 * @example
 * ```tsx
 * import { Menu } from '@tale-ui/react/menu';
 *
 * <Menu.Root>
 *   <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options</Menu.Trigger>
 *   <Menu.Popover>
 *     <Menu.MenuList>
 *       <Menu.Item id="edit">Edit</Menu.Item>
 *       <Menu.Item id="duplicate">Duplicate</Menu.Item>
 *       <Menu.Separator />
 *       <Menu.Item id="delete">Delete</Menu.Item>
 *     </Menu.MenuList>
 *   </Menu.Popover>
 * </Menu.Root>
 * ```
 */
export const Root = AriaMenuTrigger;

/* ─── Trigger ─────────────────────────────────────────────────────────────── */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string };

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, ...props }, ref) => (
    <AriaButton ref={ref} className={cx('tale-menu__trigger', className)} {...props} />
  ),
);
Trigger.displayName = 'Menu.Trigger';

/* ─── MenuList (Menu inside Popover) ─────────────────────────────────────── */

export type MenuListProps = Omit<AriaMenuProps<object>, 'className'> & { className?: string };

export const MenuList = React.forwardRef<HTMLDivElement, MenuListProps>(
  ({ className, ...props }, ref) => (
    <AriaMenu ref={ref} className={cx('tale-menu__popup', className)} {...props} />
  ),
);
MenuList.displayName = 'Menu.MenuList';

/* ─── Popover ─────────────────────────────────────────────────────────────── */

export type PopoverProps = Omit<AriaPopoverProps, 'className'> & { className?: string };

export const Popover = React.forwardRef<HTMLElement, PopoverProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-menu__popover', className)} {...props} />
  ),
);
Popover.displayName = 'Menu.Popover';

/* ─── Item ────────────────────────────────────────────────────────────────── */

export type ItemProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__item', className)} {...props} />
  ),
);
Item.displayName = 'Menu.Item';

/* ─── Group (MenuSection) ─────────────────────────────────────────────────── */

export type GroupProps<T = object> = AriaMenuSectionProps<T>;

export const Group: <T extends object>(
  props: GroupProps<T> & React.RefAttributes<HTMLElement>,
) => React.ReactElement | null = AriaMenuSection as any;

/* ─── Header (Header inside MenuSection) ─────────────────────────────────── */

export type HeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & { className?: string };

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => (
    <AriaHeader ref={ref as React.Ref<HTMLElement>} className={cx('tale-menu__header', className)} {...props} />
  ),
);
Header.displayName = 'Menu.Header';

/* ─── Separator ───────────────────────────────────────────────────────────── */

export type SeparatorProps = Omit<AriaSeparatorProps, 'className'> & { className?: string };

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <AriaSeparator ref={ref} className={cx('tale-menu__separator', className)} {...props} />
  ),
);
Separator.displayName = 'Menu.Separator';

/* ─── Arrow ──────────────────────────────────────────────────────────────── */

export type ArrowProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

export const Arrow = React.forwardRef<HTMLDivElement, ArrowProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-menu__arrow', className)} {...props} />
  ),
);
Arrow.displayName = 'Menu.Arrow';

/* ─── CheckboxItem ───────────────────────────────────────────────────────── */

export type CheckboxItemProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

export const CheckboxItem = React.forwardRef<HTMLDivElement, CheckboxItemProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__checkbox-item', className)} {...props} />
  ),
);
CheckboxItem.displayName = 'Menu.CheckboxItem';

/* ─── RadioItem ──────────────────────────────────────────────────────────── */

export type RadioItemProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

export const RadioItem = React.forwardRef<HTMLDivElement, RadioItemProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__radio-item', className)} {...props} />
  ),
);
RadioItem.displayName = 'Menu.RadioItem';

/* ─── LinkItem ───────────────────────────────────────────────────────────── */

export type LinkItemProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

export const LinkItem = React.forwardRef<HTMLDivElement, LinkItemProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__link-item', className)} {...props} />
  ),
);
LinkItem.displayName = 'Menu.LinkItem';

/* ─── SubmenuTrigger ─────────────────────────────────────────────────────── */

export type SubmenuTriggerProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

export const SubmenuTrigger = React.forwardRef<HTMLDivElement, SubmenuTriggerProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__submenu-trigger', className)} {...props} />
  ),
);
SubmenuTrigger.displayName = 'Menu.SubmenuTrigger';
