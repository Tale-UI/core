import * as React from 'react';
import { Star } from 'lucide-react';
import { Icon } from '../icon';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

export interface RatingBadgeProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'children'> {
  /** Numeric rating value. */
  value: number;
  /** Size of the badge. Defaults to 'md'. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A pill-shaped badge showing a star icon and numeric rating.
 *
 * @example
 * ```tsx
 * import { RatingBadge } from '@tale-ui/react/rating-badge';
 *
 * <RatingBadge value={4.5} />
 * <RatingBadge value={3.8} size="lg" />
 * ```
 */
export const RatingBadge = React.forwardRef<HTMLSpanElement, RatingBadgeProps>(
  ({ value, size = 'md', className, ...props }, ref) => (
    <span
      ref={ref}
      className={cx(`tale-rating-badge tale-rating-badge--${size}`, className)}
      {...props}
    >
      <Icon icon={Star} size="sm" />
      {value.toFixed(1)}
    </span>
  ),
);
RatingBadge.displayName = 'RatingBadge';
