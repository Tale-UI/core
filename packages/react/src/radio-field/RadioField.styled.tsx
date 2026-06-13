import * as React from 'react';
import {
  RadioField as AriaRadioField,
  RadioButton as AriaRadioButton,
  Text as AriaText,
  FieldError as AriaFieldError,
} from 'react-aria-components';
import type {
  RadioFieldProps as AriaRadioFieldProps,
  RadioButtonProps as AriaRadioButtonProps,
} from 'react-aria-components';
import { cx } from '../_cx';
import { useSize } from '../_SizeContext';

type Size = 'sm' | 'md';

export interface RadioFieldRootProps extends Omit<AriaRadioFieldProps, 'className'> {
  /** Size of the radio indicator. Defaults to `'md'`. Inherits from RadioGroup `size` when omitted.
   * The `'sm'` variant is for edge-cases only (dense tables, compact toolbars) — prefer `'md'` in most contexts. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A radio button with built-in support for a description and validation error message.
 * Replaces `Radio` (deprecated upstream in React Aria Components 1.18).
 * Must be used inside a `RadioGroup` (from `@tale-ui/react/radio-group`).
 *
 * @status stable
 *
 * @example
 * ```tsx
 * import { RadioGroup } from '@tale-ui/react/radio-group';
 * import { RadioField } from '@tale-ui/react/radio-field';
 *
 * <RadioGroup label="Subscription plan" isRequired>
 *   <RadioField.Root value="pro">
 *     <RadioField.Button>
 *       <RadioField.Indicator>
 *         <RadioField.Dot />
 *       </RadioField.Indicator>
 *       Pro
 *     </RadioField.Button>
 *     <RadioField.Description>
 *       Unlimited projects and priority support.
 *     </RadioField.Description>
 *     <RadioField.Error>Please choose a plan to continue.</RadioField.Error>
 *   </RadioField.Root>
 * </RadioGroup>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RadioFieldRootProps>(
  ({ size: sizeProp, className, ...props }, ref) => {
    const size = useSize(sizeProp, 'md');
    return (
      <AriaRadioField
        ref={ref}
        className={cx(
          size !== 'md' ? `tale-radio-field tale-radio-field--${size}` : 'tale-radio-field',
          className,
        )}
        {...props}
      />
    );
  },
);
Root.displayName = 'RadioField.Root';

export interface RadioFieldButtonProps extends Omit<AriaRadioButtonProps, 'className'> {
  className?: string | undefined;
}

export const Button = React.forwardRef<HTMLLabelElement, RadioFieldButtonProps>(
  ({ className, ...props }, ref) => (
    <AriaRadioButton ref={ref} className={cx('tale-radio-field__button', className)} {...props} />
  ),
);
Button.displayName = 'RadioField.Button';

export interface RadioFieldIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLSpanElement, RadioFieldIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-radio-field__indicator', className)} {...props} />
  ),
);
Indicator.displayName = 'RadioField.Indicator';

export interface RadioFieldDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Dot = React.forwardRef<HTMLSpanElement, RadioFieldDotProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-radio-field__dot', className)} {...props} />
  ),
);
Dot.displayName = 'RadioField.Dot';

export interface RadioFieldDescriptionProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaText>,
  'className'
> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, RadioFieldDescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-radio-field__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'RadioField.Description';

export interface RadioFieldErrorProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaFieldError>,
  'className'
> {
  className?: string | undefined;
}

export const Error = React.forwardRef<HTMLElement, RadioFieldErrorProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError ref={ref} className={cx('tale-radio-field__error', className)} {...props} />
  ),
);
Error.displayName = 'RadioField.Error';
