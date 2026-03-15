import * as React from 'react';
import {
  TextField as AriaTextField,
  TextArea as AriaTextArea,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type TextFieldProps as AriaTextFieldProps,
  type TextAreaProps as AriaTextAreaProps,
  type LabelProps as AriaLabelProps,
  type TextProps as AriaTextProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (TextField) ───────────────────────────────────────────────────── */

export interface RootProps extends Omit<AriaTextFieldProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaTextField
      ref={ref}
      className={cx('tale-text-area', className)}
      {...props}
    />
  ),
);
Root.displayName = 'TextArea.Root';

/* ─── TextArea ───────────────────────────────────────────────────────────── */

export interface TextAreaProps extends Omit<AriaTextAreaProps, 'className'> {
  className?: string | undefined;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => (
    <AriaTextArea
      ref={ref}
      className={cx('tale-text-area__textarea', className)}
      {...props}
    />
  ),
);
TextArea.displayName = 'TextArea.TextArea';

/* ─── Label ──────────────────────────────────────────────────────────────── */

export interface LabelProps extends Omit<AriaLabelProps, 'className'> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel
      ref={ref}
      className={cx('tale-text-area__label', className)}
      {...props}
    />
  ),
);
Label.displayName = 'TextArea.Label';

/* ─── Description ────────────────────────────────────────────────────────── */

export interface DescriptionProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-text-area__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'TextArea.Description';

/* ─── ErrorMessage ───────────────────────────────────────────────────────── */

export interface ErrorMessageProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError
      ref={ref}
      className={cx('tale-text-area__error', className)}
      {...props}
    />
  ),
);
ErrorMessage.displayName = 'TextArea.ErrorMessage';
