import * as React from 'react';
import { cx } from '../_cx';

export interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="menubar" className={cx('tale-menubar', className)} {...props} />
  ),
);
Root.displayName = 'Menubar.Root';

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

/**
 * Wraps a Menu.Root inside the menubar, applying the menubar item styling
 * to the trigger button via CSS.
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-menubar__item', className)} {...props} />
  ),
);
Item.displayName = 'Menubar.Item';
