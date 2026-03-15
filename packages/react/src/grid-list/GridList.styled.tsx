import * as React from 'react';
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  type GridListProps as AriaGridListProps,
  type GridListItemProps as AriaGridListItemProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps<T extends object> = Omit<AriaGridListProps<T>, 'className'> & {
  className?: string;
};

export const Root: <T extends object>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RootProps<object>, ref) => (
    <AriaGridList
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-grid-list', className)}
      {...props}
    />
  ),
) as any;
(Root as any).displayName = 'GridList.Root';

// ── Item ───────────────────────────────────────────────────────────────────

export type ItemProps = Omit<AriaGridListItemProps, 'className'> & {
  className?: string;
};

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaGridListItem ref={ref} className={cx('tale-grid-list__item', className)} {...props} />
  ),
);
Item.displayName = 'GridList.Item';
