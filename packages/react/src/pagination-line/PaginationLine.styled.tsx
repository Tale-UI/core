import * as React from 'react';
import * as Pagination from '../pagination/Pagination.styled';
import { cx } from '../_cx';

// ── PaginationLine ─────────────────────────────────────────────────────────

export interface PaginationLineProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Current active page (1-indexed). */
  page: number;
  /** Total number of pages / slides. */
  total: number;
  /**
   * Size of each line indicator.
   * @default 'md'
   */
  size?: 'md' | 'lg';
  /**
   * Whether to render a frosted-glass frame around the indicators.
   * Useful when overlaid on images or video.
   */
  framed?: boolean;
  /** Callback fired when the user clicks a line. Receives the 1-indexed page number. */
  onPageChange?: (page: number) => void;
}

/**
 * Auto-rendering horizontal line/progress-bar indicators for carousel and slide pagination.
 * Renders `total` clickable lines with the current page highlighted.
 *
 * @example
 * ```tsx
 * import { PaginationLine } from '@tale-ui/react/pagination-line';
 *
 * // Basic line indicators
 * <PaginationLine page={2} total={5} onPageChange={setPage} />
 *
 * // Large lines with frosted-glass frame
 * <PaginationLine page={1} total={3} size="lg" framed />
 * ```
 */
export const PaginationLine = React.forwardRef<HTMLElement, PaginationLineProps>(
  ({ page, total, size = 'md', framed, onPageChange, className, ...rest }, ref) => (
    <Pagination.Root
      ref={ref}
      aria-label="Slide pagination"
      className={cx(
        `tale-pagination-line${size === 'lg' ? ' tale-pagination-line--lg' : ''}${framed ? ' tale-pagination-line--framed' : ''}`,
        className,
      )}
      {...rest}
    >
      {Array.from({ length: total }, (_, i) => {
        const pageNum = i + 1;
        const isCurrent = pageNum === page;
        return (
          <Pagination.Line
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
PaginationLine.displayName = 'PaginationLine';
