import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { cx } from '../_cx';
import { Spinner } from '../spinner/Spinner.styled';

type Variant = 'primary' | 'neutral' | 'ghost' | 'danger' | 'danger-neutral' | 'danger-ghost' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const SPINNER_SIZE: Record<Size, 'sm' | 'md'> = { sm: 'sm', md: 'sm', lg: 'md' };

export interface ButtonProps extends Omit<AriaButtonProps, 'className'> {
  variant?: Variant | undefined;
  size?: Size | undefined;
  /** Alias for `isDisabled` for convenience. */
  disabled?: boolean | undefined;
  /** Alias for `isPending` for convenience. */
  pending?: boolean | undefined;
  /** When true, keeps children visible alongside the spinner during pending state. */
  showTextWhileLoading?: boolean | undefined;
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
 * <Button variant="danger-neutral">Outlined danger</Button>
 * <Button variant="danger-ghost">Ghost danger</Button>
 * <Button variant="inverse">Inverse</Button>
 * <Button variant="primary" isPending>Saving…</Button>
 * <Button variant="primary" isPending showTextWhileLoading>Saving…</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, disabled, isDisabled, isPending, pending, showTextWhileLoading, children, ...props }, ref) => {
    const effectivePending = pending ?? isPending;
    const hideContent = effectivePending && !showTextWhileLoading;
    return (
      <AriaButton
        ref={ref}
        isDisabled={disabled ?? isDisabled}
        isPending={effectivePending}
        className={cx(`tale-button tale-button--${variant} tale-button--${size}`, className)}
        {...props}
      >
        <span
          className={`tale-button__content${effectivePending && showTextWhileLoading ? ' tale-button__content--with-spinner' : ''}`}
          style={hideContent ? { visibility: 'hidden' } : undefined}
        >
          {children as React.ReactNode}
        </span>
        {effectivePending && (
          <Spinner
            variant="circle"
            size={SPINNER_SIZE[size]}
            aria-hidden="true"
            role="presentation"
            className={showTextWhileLoading ? 'tale-button__spinner--inline' : 'tale-button__spinner'}
          />
        )}
      </AriaButton>
    );
  },
);
Button.displayName = 'Button';
