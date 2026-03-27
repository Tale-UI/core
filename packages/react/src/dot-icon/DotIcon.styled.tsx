import * as React from 'react';
import { cx } from '../_cx';

type Color = 'neutral' | 'brand' | 'error' | 'warning' | 'success';
type Size = 'sm' | 'md' | 'lg';

export interface DotIconProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'children'> {
  /** Dot color variant. Defaults to 'neutral'. */
  color?: Color | undefined;
  /** Dot size. Defaults to 'md'. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A small colored circle indicator, typically used for status.
 *
 * @example
 * ```tsx
 * import { DotIcon } from '@tale-ui/react/dot-icon';
 *
 * <DotIcon color="success" />
 * <DotIcon color="error" size="lg" />
 * ```
 */
export const DotIcon = React.forwardRef<HTMLSpanElement, DotIconProps>(
  ({ color = 'neutral', size = 'md', className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx(`tale-dot-icon tale-dot-icon--${color} tale-dot-icon--${size}`, className)}
      {...props}
    />
  ),
);
DotIcon.displayName = 'DotIcon';
