import * as React from 'react';
import {
  CheckboxField as AriaCheckboxField,
  CheckboxButton as AriaCheckboxButton,
  Text as AriaText,
  FieldError as AriaFieldError,
} from 'react-aria-components';
import type {
  CheckboxFieldProps as AriaCheckboxFieldProps,
  CheckboxButtonProps as AriaCheckboxButtonProps,
} from 'react-aria-components';
import { cx } from '../_cx';
import { useSize } from '../_SizeContext';

type Size = 'sm' | 'md';

export interface CheckboxFieldRootProps extends Omit<AriaCheckboxFieldProps, 'className'> {
  /** Size of the checkbox indicator. Defaults to `'md'`. Inherits from CheckboxGroup `size` when omitted.
   * The `'sm'` variant is for edge-cases only (dense tables, compact toolbars) — prefer `'md'` in most contexts. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A checkbox with built-in support for a description and validation error message.
 * Replaces `Checkbox` (deprecated upstream in React Aria Components 1.18).
 *
 * @status stable
 *
 * @example
 * ```tsx
 * import { CheckboxField } from '@tale-ui/react/checkbox-field';
 * import { Icon } from '@tale-ui/react/icon';
 * import { Check } from 'lucide-react';
 *
 * <CheckboxField.Root>
 *   <CheckboxField.Button>
 *     <CheckboxField.Indicator>
 *       <Icon icon={Check} size="sm" />
 *     </CheckboxField.Indicator>
 *     Accept terms and conditions
 *   </CheckboxField.Button>
 *   <CheckboxField.Description>
 *     You can withdraw consent at any time.
 *   </CheckboxField.Description>
 *   <CheckboxField.Error>You must accept the terms to continue.</CheckboxField.Error>
 * </CheckboxField.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, CheckboxFieldRootProps>(
  ({ size: sizeProp, className, ...props }, ref) => {
    const size = useSize(sizeProp, 'md');
    return (
      <AriaCheckboxField
        ref={ref}
        className={cx(
          size !== 'md'
            ? `tale-checkbox-field tale-checkbox-field--${size}`
            : 'tale-checkbox-field',
          className,
        )}
        {...props}
      />
    );
  },
);
Root.displayName = 'CheckboxField.Root';

export interface CheckboxFieldButtonProps extends Omit<AriaCheckboxButtonProps, 'className'> {
  className?: string | undefined;
}

export const Button = React.forwardRef<HTMLLabelElement, CheckboxFieldButtonProps>(
  ({ className, ...props }, ref) => (
    <AriaCheckboxButton
      ref={ref}
      className={cx('tale-checkbox-field__button', className)}
      {...props}
    />
  ),
);
Button.displayName = 'CheckboxField.Button';

export interface CheckboxFieldIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLSpanElement, CheckboxFieldIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-checkbox-field__indicator', className)} {...props} />
  ),
);
Indicator.displayName = 'CheckboxField.Indicator';

export interface CheckboxFieldDescriptionProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaText>,
  'className'
> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, CheckboxFieldDescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-checkbox-field__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'CheckboxField.Description';

export interface CheckboxFieldErrorProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaFieldError>,
  'className'
> {
  className?: string | undefined;
}

export const Error = React.forwardRef<HTMLElement, CheckboxFieldErrorProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError ref={ref} className={cx('tale-checkbox-field__error', className)} {...props} />
  ),
);
Error.displayName = 'CheckboxField.Error';
