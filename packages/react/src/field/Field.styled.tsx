import * as React from 'react';
import {
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type LabelProps as AriaLabelProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/**
 * A wrapper that links a label, description, and error message to a form control.
 *
 * @example
 * ```tsx
 * import { Field } from '@tale-ui/react/field';
 *
 * <Field.Root>
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control>
 *     <input className="tale-input" placeholder="you@example.com" />
 *   </Field.Control>
 *   <Field.Description>We'll never share your email.</Field.Description>
 * </Field.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-field', className)} {...props} />
  ),
);
Root.displayName = 'Field.Root';

export const Label = React.forwardRef<
  HTMLLabelElement,
  Omit<AriaLabelProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaLabel ref={ref} className={cx('tale-field__label', className)} {...props} />
));
Label.displayName = 'Field.Label';

export const Description = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof AriaText> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaText ref={ref} slot="description" className={cx('tale-field__description', className)} {...props} />
));
Description.displayName = 'Field.Description';

export const Error = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof AriaFieldError> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaFieldError ref={ref} className={cx('tale-field__error', className)} {...props} />
));
Error.displayName = 'Field.Error';

export const Control = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-field__control', className)} {...props} />
  ),
);
Control.displayName = 'Field.Control';

export const Item = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-field__item', className)} {...props} />
  ),
);
Item.displayName = 'Field.Item';
