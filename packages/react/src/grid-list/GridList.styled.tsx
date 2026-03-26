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

/**
 * A list of interactive items with keyboard navigation and selection.
 *
 * @example
 * ```tsx
 * import { GridList } from '@tale-ui/react/grid-list';
 * import { Icon } from '@tale-ui/react/icon';
 * import { Star, Heart, Bell } from 'lucide-react';
 *
 * <GridList.Root aria-label="Items" selectionMode="multiple">
 *   <GridList.Item id="1" textValue="Favorites"><Icon icon={Star} size="sm" />Favorites</GridList.Item>
 *   <GridList.Item id="2" textValue="Liked"><Icon icon={Heart} size="sm" />Liked</GridList.Item>
 *   <GridList.Item id="3" textValue="Alerts"><Icon icon={Bell} size="sm" />Alerts</GridList.Item>
 * </GridList.Root>
 * ```
 */
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
