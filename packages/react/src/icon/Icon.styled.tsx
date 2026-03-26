import * as React from 'react';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg' | 'xl';

type IconComponent = React.ForwardRefExoticComponent<
  Omit<React.SVGAttributes<SVGSVGElement>, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** A lucide-react icon component (e.g., ChevronDown). */
  icon: IconComponent;
  /** Size variant. Defaults to 'md'. */
  size?: Size;
  /** Additional class name merged with BEM base. */
  className?: string;
  /** Accessible label. If omitted, icon is decorative (aria-hidden). */
  label?: string;
}

/**
 * Renders a Lucide icon with Tale UI BEM sizing.
 *
 * @example
 * ```tsx
 * import { Icon } from '@tale-ui/react/icon';
 * import { Heart } from 'lucide-react';
 *
 * <Icon icon={Heart} size="md" />
 * <Icon icon={Heart} size="lg" label="Favorite" />
 * ```
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComp, size = 'md', className, label, ...props }, ref) => (
    <IconComp
      ref={ref}
      className={cx(size === 'md' ? 'tale-icon' : `tale-icon tale-icon--${size}`, className)}
      aria-hidden={label ? undefined : true}
      aria-label={label || undefined}
      role={label ? 'img' : undefined}
      {...props}
    />
  ),
);
Icon.displayName = 'Icon';
