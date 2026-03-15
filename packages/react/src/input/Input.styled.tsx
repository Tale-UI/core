import * as React from 'react';
import {
  TextField,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
} from 'react-aria-components';
import type {
  TextFieldProps as AriaTextFieldProps,
  InputProps as AriaInputProps,
  LabelProps as AriaLabelProps,
  TextProps as AriaTextProps,
} from 'react-aria-components';
import { cx } from '../_cx';

type Size = 'sm' | 'md' | 'lg';

// ── Root (TextField) ───────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaTextFieldProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <TextField ref={ref} className={cx('tale-input__root', className)} {...props} />
  ),
);
Root.displayName = 'Input.Root';

// ── Input ──────────────────────────────────────────────────────────────────

export type InputProps = Omit<AriaInputProps, 'className'> & {
  size?: Size | undefined;
  className?: string | undefined;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <AriaInput
      ref={ref}
      className={cx(size !== 'md' ? `tale-input tale-input--${size}` : 'tale-input', className)}
      {...props}
    />
  ),
);
Input.displayName = 'Input.Input';

// ── Label ──────────────────────────────────────────────────────────────────

export interface LabelProps extends Omit<AriaLabelProps, 'className'> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-input__label', className)} {...props} />
  ),
);
Label.displayName = 'Input.Label';

// ── Description ────────────────────────────────────────────────────────────

export interface DescriptionProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-input__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'Input.Description';

// ── ErrorMessage ───────────────────────────────────────────────────────────

export interface ErrorMessageProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="errorMessage"
      className={cx('tale-input__error', className)}
      {...props}
    />
  ),
);
ErrorMessage.displayName = 'Input.ErrorMessage';
