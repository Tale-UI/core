import * as React from 'react';
import { Checkbox as AriaCheckbox } from 'react-aria-components';
import type { CheckboxProps as AriaCheckboxProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface CheckboxRootProps extends Omit<AriaCheckboxProps, 'className'> {
  className?: string | undefined;
}

/**
 * A checkbox input with indicator and label.
 *
 * @example
 * ```tsx
 * import { Checkbox } from '@tale-ui/react/checkbox';
 *
 * function CheckIcon() {
 *   return (
 *     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
 *       <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 *     </svg>
 *   );
 * }
 *
 * <Checkbox.Root>
 *   <Checkbox.Indicator>
 *     <CheckIcon />
 *   </Checkbox.Indicator>
 *   Accept terms and conditions
 * </Checkbox.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLLabelElement, CheckboxRootProps>(
  ({ className, ...props }, ref) => (
    <AriaCheckbox ref={ref} className={cx('tale-checkbox', className)} {...props} />
  ),
);
Root.displayName = 'Checkbox.Root';

export interface CheckboxIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-checkbox__indicator', className)} {...props} />
  ),
);
Indicator.displayName = 'Checkbox.Indicator';
