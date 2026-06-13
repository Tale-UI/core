import * as React from 'react';
import { Star } from 'lucide-react';
import { Icon } from '../icon';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

export interface RatingStarsProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'children'> {
  /** Rating value from 0 to max. Supports half values (e.g. 3.5). */
  value: number;
  /** Maximum number of stars. Defaults to 5. */
  max?: number | undefined;
  /** Size of the stars. Defaults to 'md'. */
  size?: Size | undefined;
  className?: string | undefined;
}

const iconSize: Record<Size, 'sm' | 'md' | 'lg'> = { sm: 'sm', md: 'sm', lg: 'md' };

/**
 * A read-only star rating display.
 *
 * @example
 * ```tsx
 * import { RatingStars } from '@tale-ui/react/rating-stars';
 *
 * <RatingStars value={3.5} />
 * <RatingStars value={4} max={5} size="lg" />
 * ```
 */
export const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  ({ value, max = 5, size = 'md', className, ...props }, ref) => {
    const stars: React.ReactNode[] = [];

    for (let i = 0; i < max; i += 1) {
      const filled = value >= i + 1;
      const half = !filled && value >= i + 0.5;

      if (half) {
        stars.push(
          <span key={i} className="tale-rating-stars__star tale-rating-stars__star--half">
            <span className="tale-rating-stars__star-overlay">
              <Icon icon={Star} size={iconSize[size]} />
            </span>
            <Icon icon={Star} size={iconSize[size]} />
          </span>,
        );
      } else {
        stars.push(
          <span
            key={i}
            className={`tale-rating-stars__star${filled ? ' tale-rating-stars__star--filled' : ''}`}
          >
            <Icon icon={Star} size={iconSize[size]} />
          </span>,
        );
      }
    }

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${value} out of ${max} stars`}
        className={cx(`tale-rating-stars tale-rating-stars--${size}`, className)}
        {...props}
      >
        {stars}
      </div>
    );
  },
);
RatingStars.displayName = 'RatingStars';
