import * as React from 'react';
import { cx } from '../_cx';

/* ─── Root ────────────────────────────────────────────────────────────────── */

type Variant = 'plain' | 'divided';
type Density = 'compact' | 'default' | 'spacious';

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'ul'>, 'className'> {
  /** Visual style. `'divided'` adds separators between items. @default 'plain' */
  variant?: Variant | undefined;
  /** Item padding density. @default 'default' */
  density?: Density | undefined;
  className?: string | undefined;
}

/**
 * A simple non-interactive list (distinct from GridList which has selection/keyboard semantics).
 *
 * @example
 * ```tsx
 * import { List } from '@tale-ui/react/list';
 *
 * <List.Root variant="divided">
 *   <List.Item>First item</List.Item>
 *   <List.Item>Second item</List.Item>
 *   <List.Item>Third item</List.Item>
 * </List.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLUListElement, RootProps>(
  ({ variant = 'plain', density = 'default', className, ...props }, ref) => {
    const classes = ['tale-list'];
    if (variant !== 'plain') classes.push(`tale-list--${variant}`);
    if (density !== 'default') classes.push(`tale-list--${density}`);
    return (
      <ul
        ref={ref}
        className={cx(classes.join(' '), className)}
        {...props}
      />
    );
  },
);
Root.displayName = 'List.Root';

/* ─── Item ────────────────────────────────────────────────────────────────── */

export interface ItemProps extends Omit<React.ComponentPropsWithoutRef<'li'>, 'className'> {
  className?: string | undefined;
}

/**
 * A single list item.
 *
 * @example
 * ```tsx
 * <List.Item>Item content</List.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLLIElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cx('tale-list__item', className)}
      {...props}
    />
  ),
);
Item.displayName = 'List.Item';
