import * as React from 'react';
import {
  ColorField as AriaColorField,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type ColorFieldProps as AriaColorFieldProps,
  type InputProps as AriaInputProps,
  type LabelProps as AriaLabelProps,
  type TextProps as AriaTextProps,
  type FieldErrorProps as AriaFieldErrorProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = Omit<AriaColorFieldProps, 'className'> & {
  className?: string;
};

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaColorField ref={ref} className={cx('tale-color-field', className)} {...props} />
  ),
);
Root.displayName = 'ColorField.Root';

// ── Input ──────────────────────────────────────────────────────────────────

export type InputProps = Omit<AriaInputProps, 'className'> & {
  className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <AriaInput ref={ref} className={cx('tale-color-field__input', className)} {...props} />
  ),
);
Input.displayName = 'ColorField.Input';

// ── Label ──────────────────────────────────────────────────────────────────

export type LabelProps = Omit<AriaLabelProps, 'className'> & {
  className?: string;
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-color-field__label', className)} {...props} />
  ),
);
Label.displayName = 'ColorField.Label';

// ── Description ────────────────────────────────────────────────────────────

export type DescriptionProps = Omit<AriaTextProps, 'className' | 'slot'> & {
  className?: string;
};

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-color-field__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'ColorField.Description';

// ── ErrorMessage ───────────────────────────────────────────────────────────

export type ErrorMessageProps = Omit<AriaFieldErrorProps, 'className'> & {
  className?: string;
};

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError
      ref={ref}
      className={cx('tale-color-field__error', className)}
      {...props}
    />
  ),
);
ErrorMessage.displayName = 'ColorField.ErrorMessage';
