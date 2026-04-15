import * as React from 'react';
import { cx } from '../_cx';

export interface SectionDividerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * A decorative full-width horizontal divider for separating page sections.
 * Centers content in a max-width container with responsive horizontal padding.
 *
 * @example
 * ```tsx
 * import { SectionDivider } from '@tale-ui/react/section-divider';
 *
 * <SectionDivider />
 * ```
 */
export const SectionDivider = React.forwardRef<HTMLDivElement, SectionDividerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-section-divider', className)} {...props}>
      <hr className="tale-section-divider__rule" />
    </div>
  ),
);
SectionDivider.displayName = 'SectionDivider';
