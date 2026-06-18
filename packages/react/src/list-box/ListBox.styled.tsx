import * as React from 'react';
import {
  Collection as AriaCollection,
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxLoadMoreItem as AriaListBoxLoadMoreItem,
  ListBoxSection as AriaListBoxSection,
  SelectionIndicator as AriaSelectionIndicator,
  Text as AriaText,
  type CollectionProps as AriaCollectionProps,
  type HeaderProps as AriaHeaderProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxLoadMoreItemProps as AriaListBoxLoadMoreItemProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  type SelectionIndicatorProps as AriaSelectionIndicatorProps,
  type TextProps as AriaTextProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export type RootProps<T extends object = object> = Omit<AriaListBoxProps<T>, 'className'> & {
  className?: string;
};

/**
 * A standalone selectable listbox for options, command results, and picker grids.
 *
 * @status stable
 * @example
 * ```tsx
 * import { ListBox } from '@tale-ui/react/list-box';
 *
 * <ListBox.Root aria-label="Project status" selectionMode="single">
 *   <ListBox.Item id="todo" textValue="To do">To do</ListBox.Item>
 *   <ListBox.Item id="doing" textValue="In progress">In progress</ListBox.Item>
 *   <ListBox.Item id="done" textValue="Done">Done</ListBox.Item>
 * </ListBox.Root>
 * ```
 */
export const Root: <T extends object = object>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RootProps, ref) => (
    <AriaListBox
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-list-box', className)}
      {...props}
    />
  ),
) as any;
(Root as any).displayName = 'ListBox.Root';

/* ─── Item ─────────────────────────────────────────────────────────────────── */

export type ItemProps<T = object> = Omit<AriaListBoxItemProps<T>, 'className'> & {
  className?: string;
};

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaListBoxItem ref={ref} className={cx('tale-list-box__item', className)} {...props} />
  ),
);
Item.displayName = 'ListBox.Item';

/* ─── Section ──────────────────────────────────────────────────────────────── */

export type SectionProps<T extends object = object> = Omit<AriaListBoxSectionProps<T>, 'className'> & {
  className?: string;
};

export const Section: <T extends object = object>(
  props: SectionProps<T> & React.RefAttributes<HTMLElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: SectionProps, ref) => (
    <AriaListBoxSection
      ref={ref as React.Ref<HTMLElement>}
      className={cx('tale-list-box__section', className)}
      {...props}
    />
  ),
) as any;
(Section as any).displayName = 'ListBox.Section';

/* ─── Header ───────────────────────────────────────────────────────────────── */

export type HeaderProps = Omit<AriaHeaderProps, 'className'> & { className?: string };

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => (
    <AriaHeader
      ref={ref as React.Ref<HTMLElement>}
      className={cx('tale-list-box__header', className)}
      {...props}
    />
  ),
);
Header.displayName = 'ListBox.Header';

/* ─── Text ─────────────────────────────────────────────────────────────────── */

export type TextProps = Omit<AriaTextProps, 'className'> & { className?: string };

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref as React.Ref<HTMLElement>}
      className={cx('tale-list-box__text', className)}
      {...props}
    />
  ),
);
Text.displayName = 'ListBox.Text';

/* ─── SelectionIndicator ───────────────────────────────────────────────────── */

export type SelectionIndicatorProps = Omit<AriaSelectionIndicatorProps, 'className'> & {
  className?: string;
};

export const SelectionIndicator = React.forwardRef<HTMLDivElement, SelectionIndicatorProps>(
  ({ className, ...props }, ref) => (
    <AriaSelectionIndicator
      ref={ref}
      className={cx('tale-list-box__selection-indicator', className)}
      {...props}
    />
  ),
);
SelectionIndicator.displayName = 'ListBox.SelectionIndicator';

/* ─── LoadMoreItem ─────────────────────────────────────────────────────────── */

export type LoadMoreItemProps = Omit<AriaListBoxLoadMoreItemProps, 'className'> & {
  className?: string;
};

export const LoadMoreItem = React.forwardRef<HTMLDivElement, LoadMoreItemProps>(
  ({ className, ...props }, ref) => (
    <AriaListBoxLoadMoreItem
      ref={ref}
      className={cx('tale-list-box__load-more-item', className)}
      {...props}
    />
  ),
);
LoadMoreItem.displayName = 'ListBox.LoadMoreItem';

/* ─── Collection ───────────────────────────────────────────────────────────── */

export type CollectionProps<T extends object = object> = AriaCollectionProps<T>;

export const Collection: <T extends object = object>(
  props: CollectionProps<T>,
) => React.ReactElement | null = AriaCollection as any;
