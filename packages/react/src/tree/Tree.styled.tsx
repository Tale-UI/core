import * as React from 'react';
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type TreeProps as AriaTreeProps,
  type TreeItemProps as AriaTreeItemProps,
  type TreeItemContentProps as AriaTreeItemContentProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps<T extends object> = Omit<AriaTreeProps<T>, 'className'> & {
  className?: string;
};

export const Root: <T extends object>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RootProps<object>, ref) => (
    <AriaTree
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-tree', className)}
      {...props}
    />
  ),
) as any;
(Root as any).displayName = 'Tree.Root';

// ── Item ───────────────────────────────────────────────────────────────────

export type ItemProps<T extends object> = Omit<AriaTreeItemProps<T>, 'className'> & {
  className?: string;
};

export const Item: <T extends object>(
  props: ItemProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: ItemProps<object>, ref) => (
    <AriaTreeItem
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-tree__item', className)}
      {...props}
    />
  ),
) as any;
(Item as any).displayName = 'Tree.Item';

// ── ItemContent ────────────────────────────────────────────────────────────

export type ItemContentProps = AriaTreeItemContentProps;

export function ItemContent(props: ItemContentProps) {
  return <AriaTreeItemContent {...props} />;
}
ItemContent.displayName = 'Tree.ItemContent';
