import * as React from 'react';
import { MoreVertical } from 'lucide-react';
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

/* ─── Context ────────────────────────────────────────────────────────────── */

type Size = 'sm' | 'md';
interface MenuContextValue { size: Size; }
const MenuContext = React.createContext<MenuContextValue>({ size: 'md' });

/* ─── Root (MenuTrigger) ──────────────────────────────────────────────────── */

export type RootProps = AriaMenuTriggerProps & {
  /** Size of menu items, propagated via context. @default 'md' */
  size?: Size | undefined;
};
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
export function Root({ size, ...props }: RootProps) {
  const value = React.useMemo<MenuContextValue>(() => ({ size: size ?? 'md' }), [size]);
  return (
    <MenuContext.Provider value={value}>
      <AriaMenuTrigger {...props} />
    </MenuContext.Provider>
  );
}
Root.displayName = 'Menu.Root';

/* ─── Trigger ─────────────────────────────────────────────────────────────── */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string };

/**
 * Button that opens the menu dropdown
 *
 * @example
 * ```tsx
 * <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options</Menu.Trigger>
 * ```
 */
export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, ...props }, ref) => (
    <AriaButton ref={ref} className={cx('tale-menu__trigger', className)} {...props} />
  ),
);
Trigger.displayName = 'Menu.Trigger';

/* ─── MenuList (Menu inside Popover) ─────────────────────────────────────── */

export type MenuListProps = Omit<AriaMenuProps<object>, 'className'> & { className?: string };

/**
 * The menu list containing items, rendered inside a popover
 *
 * @example
 * ```tsx
 * <Menu.MenuList>
 *   <Menu.Item id="edit">Edit</Menu.Item>
 *   <Menu.Item id="delete">Delete</Menu.Item>
 * </Menu.MenuList>
 * ```
 */
export const MenuList = React.forwardRef<HTMLDivElement, MenuListProps>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(MenuContext);
    const sizeClass = size !== 'md' ? ` tale-menu__popup--${size}` : '';
    return (
      <AriaMenu ref={ref} className={cx(`tale-menu__popup${sizeClass}`, className)} {...props} />
    );
  },
);
MenuList.displayName = 'Menu.MenuList';

/* ─── Popover ─────────────────────────────────────────────────────────────── */

export type PopoverProps = Omit<AriaPopoverProps, 'className'> & { className?: string };

/**
 * Floating container that holds the menu list when open
 *
 * @example
 * ```tsx
 * <Menu.Popover>
 *   <Menu.MenuList>…</Menu.MenuList>
 * </Menu.Popover>
 * ```
 */
export const Popover = React.forwardRef<HTMLElement, PopoverProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-menu__popover', className)} {...props} />
  ),
);
Popover.displayName = 'Menu.Popover';

/* ─── Item ────────────────────────────────────────────────────────────────── */

export type ItemProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

/**
 * A single actionable item inside the menu
 *
 * @example
 * ```tsx
 * <Menu.Item id="edit" onAction={() => edit()}>Edit</Menu.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__item', className)} {...props} />
  ),
);
Item.displayName = 'Menu.Item';

/* ─── Group (MenuSection) ─────────────────────────────────────────────────── */

export type GroupProps<T = object> = AriaMenuSectionProps<T>;

/**
 * Groups related menu items under an optional header
 *
 * @example
 * ```tsx
 * <Menu.Group>
 *   <Menu.Header>Actions</Menu.Header>
 *   <Menu.Item id="copy">Copy</Menu.Item>
 * </Menu.Group>
 * ```
 */
export const Group: <T extends object>(
  props: GroupProps<T> & React.RefAttributes<HTMLElement>,
) => React.ReactElement | null = AriaMenuSection as any;

/* ─── Header (Header inside MenuSection) ─────────────────────────────────── */

export type HeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & { className?: string };

/**
 * Heading label for a group of menu items
 *
 * @example
 * ```tsx
 * <Menu.Header>Actions</Menu.Header>
 * ```
 */
export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => (
    <AriaHeader ref={ref as React.Ref<HTMLElement>} className={cx('tale-menu__header', className)} {...props} />
  ),
);
Header.displayName = 'Menu.Header';

/* ─── Separator ───────────────────────────────────────────────────────────── */

export type SeparatorProps = Omit<AriaSeparatorProps, 'className'> & { className?: string };

/**
 * Visual divider between menu items or groups
 *
 * @example
 * ```tsx
 * <Menu.Separator />
 * ```
 */
export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <AriaSeparator ref={ref} className={cx('tale-menu__separator', className)} {...props} />
  ),
);
Separator.displayName = 'Menu.Separator';

/* ─── Arrow ──────────────────────────────────────────────────────────────── */

export type ArrowProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

/**
 * Decorative arrow pointing from the popover toward the trigger
 *
 * @example
 * ```tsx
 * <Menu.Popover>
 *   <Menu.Arrow />
 *   <Menu.MenuList>…</Menu.MenuList>
 * </Menu.Popover>
 * ```
 */
export const Arrow = React.forwardRef<HTMLDivElement, ArrowProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-menu__arrow', className)} {...props} />
  ),
);
Arrow.displayName = 'Menu.Arrow';

/* ─── CheckboxItem ───────────────────────────────────────────────────────── */

export type CheckboxItemProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

/**
 * A menu item with a checkbox for toggling a boolean option
 *
 * @example
 * ```tsx
 * <Menu.CheckboxItem id="bold" isSelected={isBold}>Bold</Menu.CheckboxItem>
 * ```
 */
export const CheckboxItem = React.forwardRef<HTMLDivElement, CheckboxItemProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__checkbox-item', className)} {...props} />
  ),
);
CheckboxItem.displayName = 'Menu.CheckboxItem';

/* ─── RadioItem ──────────────────────────────────────────────────────────── */

export type RadioItemProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

/**
 * A menu item acting as a radio button within a group
 *
 * @example
 * ```tsx
 * <Menu.RadioItem id="asc">Ascending</Menu.RadioItem>
 * ```
 */
export const RadioItem = React.forwardRef<HTMLDivElement, RadioItemProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__radio-item', className)} {...props} />
  ),
);
RadioItem.displayName = 'Menu.RadioItem';

/* ─── LinkItem ───────────────────────────────────────────────────────────── */

export type LinkItemProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

/**
 * A menu item that navigates to a URL
 *
 * @example
 * ```tsx
 * <Menu.LinkItem id="docs" href="/docs">Documentation</Menu.LinkItem>
 * ```
 */
export const LinkItem = React.forwardRef<HTMLDivElement, LinkItemProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__link-item', className)} {...props} />
  ),
);
LinkItem.displayName = 'Menu.LinkItem';

/* ─── SubmenuTrigger ─────────────────────────────────────────────────────── */

export type SubmenuTriggerProps<T = object> = Omit<AriaMenuItemProps<T>, 'className'> & { className?: string };

/**
 * A menu item that opens a nested submenu
 *
 * @example
 * ```tsx
 * <Menu.SubmenuTrigger id="share">Share</Menu.SubmenuTrigger>
 * ```
 */
export const SubmenuTrigger = React.forwardRef<HTMLDivElement, SubmenuTriggerProps>(
  ({ className, ...props }, ref) => (
    <AriaMenuItem ref={ref} className={cx('tale-menu__submenu-trigger', className)} {...props} />
  ),
);
SubmenuTrigger.displayName = 'Menu.SubmenuTrigger';

/* ─── DotsButton ─────────────────────────────────────────────────────────── */

export type DotsButtonProps = Omit<AriaButtonProps, 'className'> & {
  /** Accessible label for the button. Defaults to "Open menu". */
  'aria-label'?: string;
  className?: string | undefined;
};

/**
 * A vertical-dots icon button intended as a compact menu trigger.
 *
 * @example
 * ```tsx
 * import { Menu } from '@tale-ui/react/menu';
 *
 * <Menu.Root>
 *   <Menu.DotsButton />
 *   <Menu.Popover>
 *     <Menu.MenuList>
 *       <Menu.Item id="edit">Edit</Menu.Item>
 *       <Menu.Item id="delete">Delete</Menu.Item>
 *     </Menu.MenuList>
 *   </Menu.Popover>
 * </Menu.Root>
 * ```
 */
export const DotsButton = React.forwardRef<HTMLButtonElement, DotsButtonProps>(
  ({ 'aria-label': ariaLabel = 'Open menu', className, ...props }, ref) => (
    <AriaButton
      ref={ref}
      aria-label={ariaLabel}
      className={cx('tale-menu__dots-button', className)}
      {...props}
    >
      <MoreVertical className="tale-menu__dots-button-icon" aria-hidden />
    </AriaButton>
  ),
);
DotsButton.displayName = 'Menu.DotsButton';
