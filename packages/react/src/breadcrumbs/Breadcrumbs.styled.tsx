import * as React from 'react';
import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
  Link as AriaLink,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  type BreadcrumbProps as AriaBreadcrumbProps,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (Breadcrumbs) ─────────────────────────────────────────────────── */

export type RootProps<T extends object = {}> = Omit<AriaBreadcrumbsProps<T>, 'className'> & {
  className?: string | undefined;
};

export const Root: <T extends object = {}>(
  props: RootProps<T> & React.RefAttributes<HTMLOListElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RootProps, ref) => (
    <AriaBreadcrumbs
      ref={ref as React.Ref<HTMLOListElement>}
      className={cx('tale-breadcrumbs', className)}
      {...props}
    />
  ),
) as any;
(Root as any).displayName = 'Breadcrumbs.Root';

/* ─── Item (Breadcrumb) ──────────────────────────────────────────────────── */

export interface ItemProps extends Omit<AriaBreadcrumbProps, 'className'> {
  className?: string | undefined;
}

export const Item = React.forwardRef<HTMLLIElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaBreadcrumb
      ref={ref}
      className={cx('tale-breadcrumbs__item', className)}
      {...props}
    />
  ),
);
Item.displayName = 'Breadcrumbs.Item';

/* ─── Link ───────────────────────────────────────────────────────────────── */

export interface LinkProps extends Omit<AriaLinkProps, 'className'> {
  className?: string | undefined;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, ...props }, ref) => (
    <AriaLink
      ref={ref}
      className={cx('tale-breadcrumbs__link', className)}
      {...props}
    />
  ),
);
Link.displayName = 'Breadcrumbs.Link';
