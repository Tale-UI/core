import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '../icon';
import { cx } from '../_cx';

/* ─── Root ────────────────────────────────────────────────────────────────── */

export interface RootProps extends React.ComponentPropsWithoutRef<'nav'> {}

/**
 * Page navigation control for moving between pages of content.
 *
 * @example
 * ```tsx
 * import { Pagination } from '@tale-ui/react/pagination';
 *
 * <Pagination.Root aria-label="Pagination">
 *   <Pagination.PreviousTrigger />
 *   <Pagination.Item page={1} />
 *   <Pagination.Item page={2} current />
 *   <Pagination.Item page={3} />
 *   <Pagination.NextTrigger />
 * </Pagination.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cx('tale-pagination', className)}
      {...props}
    />
  ),
);
Root.displayName = 'Pagination.Root';

/* ─── Item ────────────────────────────────────────────────────────────────── */

export interface ItemProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  /** The page number this item represents. */
  page: number;
  /** Whether this is the current page. */
  current?: boolean;
}

/**
 * A page number button.
 *
 * @example
 * ```tsx
 * <Pagination.Item page={1} />
 * <Pagination.Item page={2} current />
 * ```
 */
export const Item = React.forwardRef<HTMLButtonElement, ItemProps>(
  ({ page, current, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={`Page ${page}`}
      aria-current={current ? 'page' : undefined}
      className={cx(
        current ? 'tale-pagination__item tale-pagination__item--current' : 'tale-pagination__item',
        className,
      )}
      {...props}
    >
      {page}
    </button>
  ),
);
Item.displayName = 'Pagination.Item';

/* ─── Ellipsis ────────────────────────────────────────────────────────────── */

export interface EllipsisProps extends React.ComponentPropsWithoutRef<'span'> {}

/**
 * A visual indicator for skipped page numbers.
 *
 * @example
 * ```tsx
 * <Pagination.Ellipsis />
 * ```
 */
export const Ellipsis = React.forwardRef<HTMLSpanElement, EllipsisProps>(
  ({ className, children = '…', ...props }, ref) => (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cx('tale-pagination__ellipsis', className)}
      {...props}
    >
      {children}
    </span>
  ),
);
Ellipsis.displayName = 'Pagination.Ellipsis';

/* ─── PreviousTrigger ─────────────────────────────────────────────────────── */

export interface PreviousTriggerProps extends React.ComponentPropsWithoutRef<'button'> {}

/**
 * Button to navigate to the previous page. Renders a `ChevronLeft` icon by default.
 * Pass children to override.
 *
 * @example
 * ```tsx
 * <Pagination.PreviousTrigger />
 * <Pagination.PreviousTrigger disabled />
 * ```
 */
export const PreviousTrigger = React.forwardRef<HTMLButtonElement, PreviousTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Previous page"
      className={cx('tale-pagination__previous', className)}
      {...props}
    >
      {children ?? <Icon icon={ChevronLeft} size="sm" />}
    </button>
  ),
);
PreviousTrigger.displayName = 'Pagination.PreviousTrigger';

/* ─── NextTrigger ─────────────────────────────────────────────────────────── */

export interface NextTriggerProps extends React.ComponentPropsWithoutRef<'button'> {}

/**
 * Button to navigate to the next page. Renders a `ChevronRight` icon by default.
 * Pass children to override.
 *
 * @example
 * ```tsx
 * <Pagination.NextTrigger />
 * <Pagination.NextTrigger disabled />
 * ```
 */
export const NextTrigger = React.forwardRef<HTMLButtonElement, NextTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Next page"
      className={cx('tale-pagination__next', className)}
      {...props}
    >
      {children ?? <Icon icon={ChevronRight} size="sm" />}
    </button>
  ),
);
NextTrigger.displayName = 'Pagination.NextTrigger';
