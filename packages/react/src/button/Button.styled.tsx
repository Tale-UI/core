import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { cx } from '../_cx';

type Variant = 'primary' | 'neutral' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<AriaButtonProps, 'className'> {
  variant?: Variant | undefined;
  size?: Size | undefined;
  /** Alias for `isDisabled` for convenience. */
  disabled?: boolean | undefined;
  className?: string | undefined;
}

/**
 * A styled button with variant and size props.
 *
 * @example
 * ```tsx
 * import { Button } from '@tale-ui/react/button';
 *
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="neutral">Neutral</Button>
 * <Button variant="ghost">Ghost</Button>
 * <Button variant="danger">Danger</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, disabled, isDisabled, ...props }, ref) => (
    <AriaButton
      ref={ref}
      isDisabled={disabled ?? isDisabled}
      className={cx(`tale-button tale-button--${variant} tale-button--${size}`, className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
