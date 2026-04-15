import * as React from 'react';
import * as Pagination from '../pagination/Pagination.styled';
import { cx } from '../_cx';

// ── PaginationDot ──────────────────────────────────────────────────────────

export interface PaginationDotProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Current active page (1-indexed). */
  page: number;
  /** Total number of pages / slides. */
  total: number;
  /**
   * Size of each dot indicator.
   * @default 'md'
   */
  size?: 'md' | 'lg';
  /**
   * Whether to render a frosted-glass frame around the indicators.
   * Useful when overlaid on images or video.
   */
  framed?: boolean;
  /** Callback fired when the user clicks a dot. Receives the 1-indexed page number. */
  onPageChange?: (page: number) => void;
}

/**
 * Auto-rendering dot indicators for carousel and slide pagination.
 * Renders `total` clickable dots with the current page highlighted.
 *
 * @example
 * ```tsx
 * import { PaginationDot } from '@tale-ui/react/pagination-dot';
 *
 * // Basic dot indicators
 * <PaginationDot page={2} total={5} onPageChange={setPage} />
 *
 * // Large dots with frosted-glass frame
 * <PaginationDot page={1} total={3} size="lg" framed />
 * ```
 */
export const PaginationDot = React.forwardRef<HTMLElement, PaginationDotProps>(
  ({ page, total, size = 'md', framed, onPageChange, className, ...rest }, ref) => (
    <Pagination.Root
      ref={ref}
      aria-label="Slide pagination"
      className={cx(
        `tale-pagination-dot${size === 'lg' ? ' tale-pagination-dot--lg' : ''}${framed ? ' tale-pagination-dot--framed' : ''}`,
        className,
      )}
      {...rest}
    >
      {Array.from({ length: total }, (_, i) => {
        const pageNum = i + 1;
        const isCurrent = pageNum === page;
        return (
          <Pagination.Dot
            key={pageNum}
            page={pageNum}
            current={isCurrent}
            onClick={onPageChange && !isCurrent ? () => { onPageChange(pageNum); } : undefined}
          />
        );
      })}
    </Pagination.Root>
  ),
);
PaginationDot.displayName = 'PaginationDot';
