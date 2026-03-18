import * as React from 'react';
import {
  TextField as AriaTextField,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type TextFieldProps as AriaTextFieldProps,
  type InputProps as AriaInputProps,
  type LabelProps as AriaLabelProps,
  type TextProps as AriaTextProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (TextField) ───────────────────────────────────────────────────── */

export interface RootProps extends Omit<AriaTextFieldProps, 'className'> {
  className?: string | undefined;
}

/**
 * A single-line text input with label and description.
 *
 * @example
 * ```tsx
 * import { TextField } from '@tale-ui/react/text-field';
 *
 * <TextField.Root>
 *   <TextField.Label>Name</TextField.Label>
 *   <TextField.Input placeholder="Enter your name" />
 * </TextField.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaTextField
      ref={ref}
      className={cx('tale-text-field', className)}
      {...props}
    />
  ),
);
Root.displayName = 'TextField.Root';

/* ─── Input ──────────────────────────────────────────────────────────────── */

export interface InputProps extends Omit<AriaInputProps, 'className'> {
  className?: string | undefined;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <AriaInput
      ref={ref}
      className={cx('tale-text-field__input', className)}
      {...props}
    />
  ),
);
Input.displayName = 'TextField.Input';

/* ─── Label ──────────────────────────────────────────────────────────────── */

export interface LabelProps extends Omit<AriaLabelProps, 'className'> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel
      ref={ref}
      className={cx('tale-text-field__label', className)}
      {...props}
    />
  ),
);
Label.displayName = 'TextField.Label';

/* ─── Description ────────────────────────────────────────────────────────── */

export interface DescriptionProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-text-field__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'TextField.Description';

/* ─── ErrorMessage ───────────────────────────────────────────────────────── */

export interface ErrorMessageProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError
      ref={ref}
      className={cx('tale-text-field__error', className)}
      {...props}
    />
  ),
);
ErrorMessage.displayName = 'TextField.ErrorMessage';
