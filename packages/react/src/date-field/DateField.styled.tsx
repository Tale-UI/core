import * as React from 'react';
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type DateFieldProps as AriaDateFieldProps,
  type DateInputProps as AriaDateInputProps,
  type DateSegmentProps as AriaDateSegmentProps,
  type LabelProps as AriaLabelProps,
  type TextProps,
  type FieldErrorProps,
  type DateValue,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export type RootProps<T extends DateValue = DateValue> = Omit<AriaDateFieldProps<T>, 'className'> & { className?: string };

const RootInner = <T extends DateValue>(
  { className, ...props }: RootProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => <AriaDateField ref={ref} className={cx('tale-date-field', className)} {...props} />;

export const Root = React.forwardRef(RootInner) as <T extends DateValue = DateValue>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;
(Root as any).displayName = 'DateField.Root';

/* ─── DateInput ────────────────────────────────────────────────────────────── */

export type DateInputProps = Omit<AriaDateInputProps, 'className'> & { className?: string };

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  ({ className, ...props }, ref) => (
    <AriaDateInput ref={ref} className={cx('tale-date-field__input', className)} {...props} />
  ),
);
DateInput.displayName = 'DateField.DateInput';

/* ─── Segment ──────────────────────────────────────────────────────────────── */

export type SegmentProps = Omit<AriaDateSegmentProps, 'className'> & { className?: string };

export const Segment = React.forwardRef<HTMLDivElement, SegmentProps>(
  ({ className, ...props }, ref) => (
    <AriaDateSegment ref={ref} className={cx('tale-date-field__segment', className)} {...props} />
  ),
);
Segment.displayName = 'DateField.Segment';

/* ─── Label ────────────────────────────────────────────────────────────────── */

export type LabelProps = Omit<AriaLabelProps, 'className'> & { className?: string };

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-date-field__label', className)} {...props} />
  ),
);
Label.displayName = 'DateField.Label';

/* ─── Description ──────────────────────────────────────────────────────────── */

export type DescriptionProps = Omit<TextProps, 'className' | 'slot'> & { className?: string };

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText ref={ref} slot="description" className={cx('tale-date-field__description', className)} {...props} />
  ),
);
Description.displayName = 'DateField.Description';

/* ─── ErrorMessage ─────────────────────────────────────────────────────────── */

export type ErrorMessageProps = Omit<FieldErrorProps, 'className'> & { className?: string };

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError ref={ref} className={cx('tale-date-field__error', className)} {...props} />
  ),
);
ErrorMessage.displayName = 'DateField.ErrorMessage';
