import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { cx } from '../_cx';
import { Spinner } from '../spinner/Spinner.styled';

type Variant = 'primary' | 'neutral' | 'ghost' | 'danger' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const SPINNER_SIZE: Record<Size, 'sm' | 'md'> = { sm: 'sm', md: 'sm', lg: 'md' };

export interface IconButtonProps extends Omit<AriaButtonProps, 'className' | 'aria-label' | 'aria-labelledby'> {
  variant?: Variant | undefined;
  size?: Size | undefined;
  /** Alias for `isDisabled` for convenience. */
  disabled?: boolean | undefined;
  /** Alias for `isPending` for convenience. */
  pending?: boolean | undefined;
  className?: string | undefined;
  /**
   * Accessible label for the icon button. Required because icon-only buttons
   * have no visible text — without this, screen readers announce nothing useful.
   *
   * Provide exactly one of `aria-label` or `aria-labelledby`.
   */
  'aria-label'?: string | undefined;
  /** ID of an element that labels this button. Alternative to `aria-label`. */
  'aria-labelledby'?: string | undefined;
}

/**
 * Require at least one of `aria-label` or `aria-labelledby`.
 * If neither is provided, TypeScript will report a type error.
 */
type RequireAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: string | undefined }
  | { 'aria-label'?: string | undefined; 'aria-labelledby': string };

export type AccessibleIconButtonProps = IconButtonProps & RequireAccessibleName;

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
 * <IconButton variant="ghost" aria-label="Loading" isPending>
 *   <Icon icon={Search} />
 * </IconButton>
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, AccessibleIconButtonProps>(
  ({ variant = 'ghost', size = 'md', className, disabled, isDisabled, isPending, pending, children, ...props }, ref) => {
    const effectivePending = pending ?? isPending;
    return (
      <AriaButton
        ref={ref}
        isDisabled={disabled ?? isDisabled}
        isPending={effectivePending}
        className={cx(`tale-icon-button tale-button tale-button--${variant} tale-icon-button--${size}`, className)}
        {...props}
      >
        <span className="tale-button__content" style={effectivePending ? { visibility: 'hidden' } : undefined}>
          {children as React.ReactNode}
        </span>
        {effectivePending && (
          <Spinner
            variant="circle"
            size={SPINNER_SIZE[size]}
            aria-hidden="true"
            role="presentation"
            className="tale-button__spinner"
          />
        )}
      </AriaButton>
    );
  },
);
IconButton.displayName = 'IconButton';
