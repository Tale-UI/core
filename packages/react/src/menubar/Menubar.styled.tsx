import * as React from 'react';
import { cx } from '../_cx';

export interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

/**
 * A horizontal menu bar containing multiple Menu.Root instances.
 * Menubar only provides the menubar container and item wrappers; compose
 * @tale-ui/react/menu inside each Menubar.Item for the actual menu behavior.
 *
 * @example
 * ```tsx
 * import { Menubar } from '@tale-ui/react/menubar';
 * import { Menu } from '@tale-ui/react/menu';
 *
 * <Menubar.Root>
 *   <Menubar.Item>
 *     <Menu.Root>
 *       <Menu.Trigger>File</Menu.Trigger>
 *       <Menu.Popover>
 *         <Menu.MenuList>
 *           <Menu.Item id="new">New</Menu.Item>
 *           <Menu.Item id="open">Open</Menu.Item>
 *         </Menu.MenuList>
 *       </Menu.Popover>
 *     </Menu.Root>
 *   </Menubar.Item>
 * </Menubar.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(({ className, ...props }, ref) => (
  <div ref={ref} role="menubar" className={cx('tale-menubar', className)} {...props} />
));
Root.displayName = 'Menubar.Root';

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

/**
 * Wraps one Menu.Root inside the menubar, applying menubar item styling to
 * that menu's trigger button via CSS.
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx('tale-menubar__item', className)} {...props} />
));
Item.displayName = 'Menubar.Item';
