import * as React from 'react';
import {
  SearchField as AriaSearchField,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  Button as AriaButton,
  type SearchFieldProps as AriaSearchFieldProps,
  type InputProps as AriaInputProps,
  type LabelProps as AriaLabelProps,
  type TextProps as AriaTextProps,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (SearchField) ─────────────────────────────────────────────────── */

export interface RootProps extends Omit<AriaSearchFieldProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaSearchField
      ref={ref}
      className={cx('tale-search-field', className)}
      {...props}
    />
  ),
);
Root.displayName = 'SearchField.Root';

/* ─── Input ──────────────────────────────────────────────────────────────── */

export interface InputProps extends Omit<AriaInputProps, 'className'> {
  className?: string | undefined;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <AriaInput
      ref={ref}
      className={cx('tale-search-field__input', className)}
      {...props}
    />
  ),
);
Input.displayName = 'SearchField.Input';

/* ─── Label ──────────────────────────────────────────────────────────────── */

export interface LabelProps extends Omit<AriaLabelProps, 'className'> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel
      ref={ref}
      className={cx('tale-search-field__label', className)}
      {...props}
    />
  ),
);
Label.displayName = 'SearchField.Label';

/* ─── Description ────────────────────────────────────────────────────────── */

export interface DescriptionProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-search-field__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'SearchField.Description';

/* ─── ErrorMessage ───────────────────────────────────────────────────────── */

export interface ErrorMessageProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError
      ref={ref}
      className={cx('tale-search-field__error', className)}
      {...props}
    />
  ),
);
ErrorMessage.displayName = 'SearchField.ErrorMessage';

/* ─── ClearButton ────────────────────────────────────────────────────────── */

export interface ClearButtonProps extends Omit<AriaButtonProps, 'className'> {
  className?: string | undefined;
}

export const ClearButton = React.forwardRef<HTMLButtonElement, ClearButtonProps>(
  ({ className, ...props }, ref) => (
    <AriaButton
      ref={ref}
      className={cx('tale-search-field__clear', className)}
      {...props}
    />
  ),
);
ClearButton.displayName = 'SearchField.ClearButton';
