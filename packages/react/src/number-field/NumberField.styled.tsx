import * as React from 'react';
import {
  NumberField as AriaNumberField,
  Group as AriaGroup,
  Input as AriaInput,
  Button as AriaButton,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type NumberFieldProps as AriaNumberFieldProps,
  type GroupProps as AriaGroupProps,
  type InputProps as AriaInputProps,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  HTMLDivElement,
  Omit<AriaNumberFieldProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaNumberField ref={ref} className={cx('tale-number-field', className)} {...props} />
));
Root.displayName = 'NumberField.Root';

export const Group = React.forwardRef<
  HTMLDivElement,
  Omit<AriaGroupProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaGroup ref={ref} className={cx('tale-number-field__group', className)} {...props} />
));
Group.displayName = 'NumberField.Group';

export const Input = React.forwardRef<
  HTMLInputElement,
  Omit<AriaInputProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaInput ref={ref} className={cx('tale-number-field__input', className)} {...props} />
));
Input.displayName = 'NumberField.Input';

export const Increment = React.forwardRef<
  HTMLButtonElement,
  Omit<AriaButtonProps, 'className' | 'slot' | 'children'> & { className?: string; children?: React.ReactNode }
>(({ className, children = '+', ...props }, ref) => (
  <AriaButton ref={ref} slot="increment" className={cx('tale-number-field__increment', className)} {...props}>
    {children}
  </AriaButton>
));
Increment.displayName = 'NumberField.Increment';

export const Decrement = React.forwardRef<
  HTMLButtonElement,
  Omit<AriaButtonProps, 'className' | 'slot' | 'children'> & { className?: string; children?: React.ReactNode }
>(({ className, children = '−', ...props }, ref) => (
  <AriaButton ref={ref} slot="decrement" className={cx('tale-number-field__decrement', className)} {...props}>
    {children}
  </AriaButton>
));
Decrement.displayName = 'NumberField.Decrement';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof AriaLabel> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaLabel ref={ref} className={cx('tale-number-field__label', className)} {...props} />
));
Label.displayName = 'NumberField.Label';

export const Description = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof AriaText> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaText ref={ref} slot="description" className={cx('tale-number-field__description', className)} {...props} />
));
Description.displayName = 'NumberField.Description';

export const ErrorMessage = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof AriaFieldError> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaFieldError ref={ref} className={cx('tale-number-field__error', className)} {...props} />
));
ErrorMessage.displayName = 'NumberField.ErrorMessage';
