import * as React from 'react';
import {
  DatePicker as AriaDatePicker,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Group as AriaGroup,
  Button as AriaButton,
  Popover as AriaPopover,
  Dialog as AriaDialog,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type DatePickerProps as AriaDatePickerProps,
  type DateInputProps as AriaDateInputProps,
  type DateSegmentProps as AriaDateSegmentProps,
  type GroupProps as AriaGroupProps,
  type ButtonProps as AriaButtonProps,
  type PopoverProps as AriaPopoverProps,
  type DialogProps as AriaDialogProps,
  type LabelProps as AriaLabelProps,
  type TextProps,
  type FieldErrorProps,
  type DateValue,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export type RootProps<T extends DateValue = DateValue> = Omit<AriaDatePickerProps<T>, 'className'> & { className?: string };

const RootInner = <T extends DateValue>(
  { className, ...props }: RootProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => <AriaDatePicker ref={ref} className={cx('tale-date-picker', className)} {...props} />;

export const Root = React.forwardRef(RootInner) as <T extends DateValue = DateValue>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;
(Root as any).displayName = 'DatePicker.Root';

/* ─── DateInput ────────────────────────────────────────────────────────────── */

export type DateInputProps = Omit<AriaDateInputProps, 'className'> & { className?: string };

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  ({ className, ...props }, ref) => (
    <AriaDateInput ref={ref} className={cx('tale-date-picker__input', className)} {...props} />
  ),
);
DateInput.displayName = 'DatePicker.DateInput';

/* ─── Segment ──────────────────────────────────────────────────────────────── */

export type SegmentProps = Omit<AriaDateSegmentProps, 'className'> & { className?: string };

export const Segment = React.forwardRef<HTMLDivElement, SegmentProps>(
  ({ className, ...props }, ref) => (
    <AriaDateSegment ref={ref} className={cx('tale-date-picker__segment', className)} {...props} />
  ),
);
Segment.displayName = 'DatePicker.Segment';

/* ─── Group ────────────────────────────────────────────────────────────────── */

export type GroupProps = Omit<AriaGroupProps, 'className'> & { className?: string };

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, ...props }, ref) => (
    <AriaGroup ref={ref} className={cx('tale-date-picker__group', className)} {...props} />
  ),
);
Group.displayName = 'DatePicker.Group';

/* ─── Trigger ──────────────────────────────────────────────────────────────── */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string };

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, children = '\u25BE', ...props }, ref) => (
    <AriaButton ref={ref} className={cx('tale-date-picker__trigger', className)} {...props}>
      {children as React.ReactNode}
    </AriaButton>
  ),
);
Trigger.displayName = 'DatePicker.Trigger';

/* ─── Popover ──────────────────────────────────────────────────────────────── */

export type PopoverProps = Omit<AriaPopoverProps, 'className'> & { className?: string };

export const Popover = React.forwardRef<HTMLElement, PopoverProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-date-picker__popover', className)} {...props} />
  ),
);
Popover.displayName = 'DatePicker.Popover';

/* ─── Dialog ───────────────────────────────────────────────────────────────── */

export type DialogProps = Omit<AriaDialogProps, 'className'> & { className?: string };

export const Dialog = React.forwardRef<HTMLElement, DialogProps>(
  ({ className, ...props }, ref) => (
    <AriaDialog ref={ref} className={cx('tale-date-picker__dialog', className)} {...props} />
  ),
);
Dialog.displayName = 'DatePicker.Dialog';

/* ─── Label ────────────────────────────────────────────────────────────────── */

export type LabelProps = Omit<AriaLabelProps, 'className'> & { className?: string };

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-date-picker__label', className)} {...props} />
  ),
);
Label.displayName = 'DatePicker.Label';

/* ─── Description ──────────────────────────────────────────────────────────── */

export type DescriptionProps = Omit<TextProps, 'className' | 'slot'> & { className?: string };

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText ref={ref} slot="description" className={cx('tale-date-picker__description', className)} {...props} />
  ),
);
Description.displayName = 'DatePicker.Description';

/* ─── ErrorMessage ─────────────────────────────────────────────────────────── */

export type ErrorMessageProps = Omit<FieldErrorProps, 'className'> & { className?: string };

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError ref={ref} className={cx('tale-date-picker__error', className)} {...props} />
  ),
);
ErrorMessage.displayName = 'DatePicker.ErrorMessage';
