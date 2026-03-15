import * as React from 'react';
import { cx } from '../_cx';

export const Root = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cx('tale-navigation-menu', className)} {...props} />
  ),
);
Root.displayName = 'NavigationMenu.Root';

export const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cx('tale-navigation-menu__list', className)} {...props} />
  ),
);
List.displayName = 'NavigationMenu.List';

export const Item = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cx('tale-navigation-menu__item', className)} {...props} />
  ),
);
Item.displayName = 'NavigationMenu.Item';

export const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cx('tale-navigation-menu__trigger', className)} {...props} />
));
Trigger.displayName = 'NavigationMenu.Trigger';

export const Popup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-navigation-menu__popup', className)} {...props} />
  ),
);
Popup.displayName = 'NavigationMenu.Popup';

export const Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-navigation-menu__content', className)} {...props} />
  ),
);
Content.displayName = 'NavigationMenu.Content';

export const Link = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a ref={ref} className={cx('tale-navigation-menu__link', className)} {...props} />
));
Link.displayName = 'NavigationMenu.Link';
