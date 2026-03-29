import * as React from 'react';
import { cx } from '../_cx';

type Variant =
  | 'neutral' | 'brand' | 'error' | 'warning' | 'success'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
  | 'pink' | 'rose';
type Size = 'sm' | 'md' | 'lg';
type BadgeType = 'pill' | 'rounded' | 'modern';

export interface BadgeProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  variant?: Variant | undefined;
  size?: Size | undefined;
  /** Visual type. `'pill'` (default) uses full border-radius, `'rounded'` uses medium radius, `'modern'` uses neutral shadow styling. */
  type?: BadgeType | undefined;
  className?: string | undefined;
}

/**
 * A small status label.
 *
 * @example
 * ```tsx
 * import { Badge } from '@tale-ui/react/badge';
 *
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">Failed</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'md', type = 'pill', className, ...props }, ref) => (
    <span
      ref={ref}
      className={cx(
        `tale-badge tale-badge--${variant} tale-badge--${size}${type !== 'pill' ? ` tale-badge--${type}` : ''}`,
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
