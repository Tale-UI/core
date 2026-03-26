import * as React from 'react';
import { Calendar } from 'lucide-react';
import { Icon } from '../icon';
import {
  DateRangePicker as AriaDateRangePicker,
  Group as AriaGroup,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Button as AriaButton,
  Popover as AriaPopover,
  Dialog as AriaDialog,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type GroupProps as AriaGroupProps,
  type DateInputProps as AriaDateInputProps,
  type DateSegmentProps as AriaDateSegmentProps,
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

export type RootProps<T extends DateValue = DateValue> = Omit<AriaDateRangePickerProps<T>, 'className'> & { className?: string };

const RootInner = <T extends DateValue>(
  { className, ...props }: RootProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => <AriaDateRangePicker ref={ref} className={cx('tale-date-range-picker', className)} {...props} />;

/**
 * A date range input with start/end fields and a calendar popover.
 *
 * @example
 * ```tsx
 * import { DateRangePicker } from '@tale-ui/react/date-range-picker';
 * import { RangeCalendar } from '@tale-ui/react/range-calendar';
 *
 * <DateRangePicker.Root>
 *   <DateRangePicker.Label>Date range</DateRangePicker.Label>
 *   <DateRangePicker.Group>
 *     <DateRangePicker.StartDate>
 *       {(segment) => <DateRangePicker.Segment segment={segment} />}
 *     </DateRangePicker.StartDate>
 *     <span>–</span>
 *     <DateRangePicker.EndDate>
 *       {(segment) => <DateRangePicker.Segment segment={segment} />}
 *     </DateRangePicker.EndDate>
 *     <DateRangePicker.Trigger />
 *   </DateRangePicker.Group>
 *   <DateRangePicker.Popover>
 *     <DateRangePicker.Dialog>
 *       <RangeCalendar.Root>
 *         <RangeCalendar.Header>
 *           <RangeCalendar.PreviousButton />
 *           <RangeCalendar.Heading />
 *           <RangeCalendar.NextButton />
 *         </RangeCalendar.Header>
 *         <RangeCalendar.Grid>
 *           <RangeCalendar.GridHeader>
 *             {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
 *           </RangeCalendar.GridHeader>
 *           <RangeCalendar.GridBody>
 *             {(date) => <RangeCalendar.Cell date={date} />}
 *           </RangeCalendar.GridBody>
 *         </RangeCalendar.Grid>
 *       </RangeCalendar.Root>
 *     </DateRangePicker.Dialog>
 *   </DateRangePicker.Popover>
 * </DateRangePicker.Root>
 * ```
 */
export const Root = React.forwardRef(RootInner) as <T extends DateValue = DateValue>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;
(Root as any).displayName = 'DateRangePicker.Root';

/* ─── Group ────────────────────────────────────────────────────────────────── */

export type GroupProps = Omit<AriaGroupProps, 'className'> & { className?: string };

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, ...props }, ref) => (
    <AriaGroup ref={ref} className={cx('tale-date-range-picker__group', className)} {...props} />
  ),
);
Group.displayName = 'DateRangePicker.Group';

/* ─── StartDate ────────────────────────────────────────────────────────────── */

export type StartDateProps = Omit<AriaDateInputProps, 'className' | 'slot'> & { className?: string };

export const StartDate = React.forwardRef<HTMLDivElement, StartDateProps>(
  ({ className, ...props }, ref) => (
    <AriaDateInput ref={ref} slot="start" className={cx('tale-date-range-picker__start', className)} {...props} />
  ),
);
StartDate.displayName = 'DateRangePicker.StartDate';

/* ─── EndDate ──────────────────────────────────────────────────────────────── */

export type EndDateProps = Omit<AriaDateInputProps, 'className' | 'slot'> & { className?: string };

export const EndDate = React.forwardRef<HTMLDivElement, EndDateProps>(
  ({ className, ...props }, ref) => (
    <AriaDateInput ref={ref} slot="end" className={cx('tale-date-range-picker__end', className)} {...props} />
  ),
);
EndDate.displayName = 'DateRangePicker.EndDate';

/* ─── Segment ──────────────────────────────────────────────────────────────── */

export type SegmentProps = Omit<AriaDateSegmentProps, 'className'> & { className?: string };

export const Segment = React.forwardRef<HTMLDivElement, SegmentProps>(
  ({ className, ...props }, ref) => (
    <AriaDateSegment ref={ref} className={cx('tale-date-range-picker__segment', className)} {...props} />
  ),
);
Segment.displayName = 'DateRangePicker.Segment';

/* ─── Trigger ──────────────────────────────────────────────────────────────── */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string };

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, children, ...props }, ref) => (
    <AriaButton ref={ref} className={cx('tale-icon-button tale-button tale-button--ghost tale-date-range-picker__trigger', className)} {...props}>
      {children ?? <Icon icon={Calendar} size="sm" />}
    </AriaButton>
  ),
);
Trigger.displayName = 'DateRangePicker.Trigger';

/* ─── Popover ──────────────────────────────────────────────────────────────── */

export type PopoverProps = Omit<AriaPopoverProps, 'className'> & { className?: string };

export const Popover = React.forwardRef<HTMLElement, PopoverProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-date-range-picker__popover', className)} {...props} />
  ),
);
Popover.displayName = 'DateRangePicker.Popover';

/* ─── Dialog ───────────────────────────────────────────────────────────────── */

export type DialogProps = Omit<AriaDialogProps, 'className'> & { className?: string };

export const Dialog = React.forwardRef<HTMLElement, DialogProps>(
  ({ className, ...props }, ref) => (
    <AriaDialog ref={ref} className={cx('tale-date-range-picker__dialog', className)} {...props} />
  ),
);
Dialog.displayName = 'DateRangePicker.Dialog';

/* ─── Label ────────────────────────────────────────────────────────────────── */

export type LabelProps = Omit<AriaLabelProps, 'className'> & { className?: string };

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-date-range-picker__label', className)} {...props} />
  ),
);
Label.displayName = 'DateRangePicker.Label';

/* ─── Description ──────────────────────────────────────────────────────────── */

export type DescriptionProps = Omit<TextProps, 'className' | 'slot'> & { className?: string };

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText ref={ref} slot="description" className={cx('tale-date-range-picker__description', className)} {...props} />
  ),
);
Description.displayName = 'DateRangePicker.Description';

/* ─── ErrorMessage ─────────────────────────────────────────────────────────── */

export type ErrorMessageProps = Omit<FieldErrorProps, 'className'> & { className?: string };

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError ref={ref} className={cx('tale-date-range-picker__error', className)} {...props} />
  ),
);
ErrorMessage.displayName = 'DateRangePicker.ErrorMessage';
