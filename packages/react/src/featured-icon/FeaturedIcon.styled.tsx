import * as React from 'react';
import { cx } from '../_cx';

type Variant = 'brand' | 'error' | 'warning' | 'success' | 'neutral';
type Shape = 'circle' | 'square';
type Size = 'sm' | 'md' | 'lg' | 'xl';
type Theme = 'light' | 'gradient' | 'dark' | 'outline' | 'modern' | 'modern-neue';

export interface FeaturedIconProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  /** Color variant. Defaults to 'brand'. */
  variant?: Variant | undefined;
  /** Shape of the container. Defaults to 'circle'. */
  shape?: Shape | undefined;
  /** Size of the container. Defaults to 'md'. */
  size?: Size | undefined;
  /** Visual theme. Defaults to 'light'. */
  theme?: Theme | undefined;
  className?: string | undefined;
}

/**
 * A themed background wrapper for an Icon child.
 *
 * @example
 * ```tsx
 * import { FeaturedIcon } from '@tale-ui/react/featured-icon';
 * import { Icon } from '@tale-ui/react/icon';
 * import { AlertCircle } from 'lucide-react';
 *
 * <FeaturedIcon variant="error" shape="circle" size="lg">
 *   <Icon icon={AlertCircle} />
 * </FeaturedIcon>
 * <FeaturedIcon variant="brand" theme="gradient" size="xl">
 *   <Icon icon={AlertCircle} />
 * </FeaturedIcon>
 * ```
 */
export const FeaturedIcon = React.forwardRef<HTMLSpanElement, FeaturedIconProps>(
  ({ variant = 'brand', shape = 'circle', size = 'md', theme = 'light', className, ...props }, ref) => {
    const classes = [`tale-featured-icon tale-featured-icon--${variant} tale-featured-icon--${size}`];
    if (shape === 'square') classes.push('tale-featured-icon--square');
    if (theme !== 'light') classes.push(`tale-featured-icon--${theme}`);

    return (
      <span
        ref={ref}
        className={cx(classes.join(' '), className)}
        {...props}
      />
    );
  },
);
FeaturedIcon.displayName = 'FeaturedIcon';
