import * as React from 'react';
import {
  TimeField as AriaTimeField,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type TimeFieldProps as AriaTimeFieldProps,
  type DateInputProps as AriaDateInputProps,
  type DateSegmentProps as AriaDateSegmentProps,
  type LabelProps as AriaLabelProps,
  type TextProps,
  type FieldErrorProps,
  type TimeValue,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export type RootProps<T extends TimeValue = TimeValue> = Omit<AriaTimeFieldProps<T>, 'className'> & { className?: string };

const RootInner = <T extends TimeValue>(
  { className, ...props }: RootProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => <AriaTimeField ref={ref} className={cx('tale-time-field', className)} {...props} />;

export const Root = React.forwardRef(RootInner) as <T extends TimeValue = TimeValue>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;
(Root as any).displayName = 'TimeField.Root';

/* ─── DateInput ────────────────────────────────────────────────────────────── */

export type DateInputProps = Omit<AriaDateInputProps, 'className'> & { className?: string };

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  ({ className, ...props }, ref) => (
    <AriaDateInput ref={ref} className={cx('tale-time-field__input', className)} {...props} />
  ),
);
DateInput.displayName = 'TimeField.DateInput';

/* ─── Segment ──────────────────────────────────────────────────────────────── */

export type SegmentProps = Omit<AriaDateSegmentProps, 'className'> & { className?: string };

export const Segment = React.forwardRef<HTMLDivElement, SegmentProps>(
  ({ className, ...props }, ref) => (
    <AriaDateSegment ref={ref} className={cx('tale-time-field__segment', className)} {...props} />
  ),
);
Segment.displayName = 'TimeField.Segment';

/* ─── Label ────────────────────────────────────────────────────────────────── */

export type LabelProps = Omit<AriaLabelProps, 'className'> & { className?: string };

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-time-field__label', className)} {...props} />
  ),
);
Label.displayName = 'TimeField.Label';

/* ─── Description ──────────────────────────────────────────────────────────── */

export type DescriptionProps = Omit<TextProps, 'className' | 'slot'> & { className?: string };

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText ref={ref} slot="description" className={cx('tale-time-field__description', className)} {...props} />
  ),
);
Description.displayName = 'TimeField.Description';

/* ─── ErrorMessage ─────────────────────────────────────────────────────────── */

export type ErrorMessageProps = Omit<FieldErrorProps, 'className'> & { className?: string };

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError ref={ref} className={cx('tale-time-field__error', className)} {...props} />
  ),
);
ErrorMessage.displayName = 'TimeField.ErrorMessage';
