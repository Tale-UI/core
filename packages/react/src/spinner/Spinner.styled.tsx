import * as React from 'react';
import { cx } from '../_cx';

type Variant = 'circle' | 'line' | 'dots';
type Size = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'children'> {
  /** Visual style of the spinner animation. */
  variant?: Variant | undefined;
  /** Size of the spinner. */
  size?: Size | undefined;
  /** Accessible label. Defaults to "Loading". */
  label?: string | undefined;
  className?: string | undefined;
}

/**
 * An indeterminate loading indicator with animated variants.
 *
 * @example
 * ```tsx
 * import { Spinner } from '@tale-ui/react/spinner';
 *
 * <Spinner />
 * <Spinner variant="dots" size="lg" />
 * <Spinner variant="line" label="Saving…" />
 * ```
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ variant = 'circle', size = 'md', label = 'Loading', className, ...props }, ref) => {
    const classes = ['tale-spinner'];
    if (variant !== 'circle') classes.push(`tale-spinner--${variant}`);
    if (size !== 'md') classes.push(`tale-spinner--${size}`);

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cx(classes.join(' '), className)}
        {...props}
      >
        {variant === 'circle' && (
          <svg
            className="tale-spinner__svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="tale-spinner__track"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="3"
            />
            <circle
              className="tale-spinner__arc"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
        {variant === 'line' && (
          <div className="tale-spinner__line-track">
            <div className="tale-spinner__line-indicator" />
          </div>
        )}
        {variant === 'dots' && (
          <>
            <span className="tale-spinner__dot" />
            <span className="tale-spinner__dot" />
            <span className="tale-spinner__dot" />
          </>
        )}
      </div>
    );
  },
);
Spinner.displayName = 'Spinner';
