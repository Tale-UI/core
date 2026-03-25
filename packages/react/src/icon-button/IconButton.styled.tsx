import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { cx } from '../_cx';

type Variant = 'primary' | 'neutral' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<AriaButtonProps, 'className'> {
  variant?: Variant | undefined;
  size?: Size | undefined;
  /** Alias for `isDisabled` for convenience. */
  disabled?: boolean | undefined;
  className?: string | undefined;
}

/**
 * A square button designed for icon-only use. Renders the same as Button
 * but with equal padding and `aspect-ratio: 1` for a square shape.
 *
 * Always provide an `aria-label` for accessibility since there is no visible text.
 *
 * @example
 * ```tsx
 * import { IconButton } from '@tale-ui/react/icon-button';
 * import { Icon } from '@tale-ui/react/icon';
 * import { Search } from 'lucide-react';
 *
 * <IconButton variant="ghost" aria-label="Search">
 *   <Icon icon={Search} />
 * </IconButton>
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', className, disabled, isDisabled, ...props }, ref) => (
    <AriaButton
      ref={ref}
      isDisabled={disabled ?? isDisabled}
      className={cx(`tale-icon-button tale-button tale-button--${variant} tale-icon-button--${size}`, className)}
      {...props}
    />
  ),
);
IconButton.displayName = 'IconButton';
