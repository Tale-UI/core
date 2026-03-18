import * as React from 'react';
import {
  RangeCalendar as AriaRangeCalendar,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarCell as AriaCalendarCell,
  Heading as AriaHeading,
  Button as AriaButton,
  type RangeCalendarProps as AriaRangeCalendarProps,
  type CalendarGridProps as AriaCalendarGridProps,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  type CalendarCellProps as AriaCalendarCellProps,
  type HeadingProps as AriaHeadingProps,
  type ButtonProps as AriaButtonProps,
  type DateValue,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export type RootProps<T extends DateValue = DateValue> = Omit<AriaRangeCalendarProps<T>, 'className'> & { className?: string };

const RootInner = <T extends DateValue>(
  { className, ...props }: RootProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => <AriaRangeCalendar ref={ref} className={cx('tale-range-calendar', className)} {...props} />;

/**
 * A calendar for selecting a date range.
 *
 * @example
 * ```tsx
 * import { RangeCalendar } from '@tale-ui/react/range-calendar';
 *
 * <RangeCalendar.Root>
 *   <RangeCalendar.PreviousButton />
 *   <RangeCalendar.Heading />
 *   <RangeCalendar.NextButton />
 *   <RangeCalendar.Grid>
 *     <RangeCalendar.GridHeader>
 *       {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
 *     </RangeCalendar.GridHeader>
 *     <RangeCalendar.GridBody>
 *       {(date) => <RangeCalendar.Cell date={date} />}
 *     </RangeCalendar.GridBody>
 *   </RangeCalendar.Grid>
 * </RangeCalendar.Root>
 * ```
 */
export const Root = React.forwardRef(RootInner) as <T extends DateValue = DateValue>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;
(Root as any).displayName = 'RangeCalendar.Root';

/* ─── Grid ─────────────────────────────────────────────────────────────────── */

export const Grid = React.forwardRef<HTMLTableElement, Omit<AriaCalendarGridProps, 'className'> & { className?: string }>(
  ({ className, ...props }, ref) => (
    <AriaCalendarGrid ref={ref} className={cx('tale-range-calendar__grid', className)} {...props} />
  ),
);
Grid.displayName = 'RangeCalendar.Grid';

/* ─── GridHeader ───────────────────────────────────────────────────────────── */

export const GridHeader = React.forwardRef<HTMLTableSectionElement, Omit<AriaCalendarGridHeaderProps, 'className'> & { className?: string }>(
  ({ className, ...props }, ref) => (
    <AriaCalendarGridHeader ref={ref} className={cx('tale-range-calendar__grid-header', className)} {...props} />
  ),
);
GridHeader.displayName = 'RangeCalendar.GridHeader';

/* ─── GridHeaderCell ───────────────────────────────────────────────────────── */

export const GridHeaderCell = React.forwardRef<HTMLTableCellElement, Omit<AriaCalendarHeaderCellProps, 'className'> & { className?: string }>(
  ({ className, ...props }, ref) => (
    <AriaCalendarHeaderCell ref={ref} className={cx('tale-range-calendar__header-cell', className)} {...props} />
  ),
);
GridHeaderCell.displayName = 'RangeCalendar.GridHeaderCell';

/* ─── GridBody ─────────────────────────────────────────────────────────────── */

export const GridBody = React.forwardRef<HTMLTableSectionElement, Omit<AriaCalendarGridBodyProps, 'className'> & { className?: string }>(
  ({ className, ...props }, ref) => (
    <AriaCalendarGridBody ref={ref} className={cx('tale-range-calendar__grid-body', className)} {...props} />
  ),
);
GridBody.displayName = 'RangeCalendar.GridBody';

/* ─── Cell ─────────────────────────────────────────────────────────────────── */

export const Cell = React.forwardRef<HTMLTableCellElement, Omit<AriaCalendarCellProps, 'className'> & { className?: string }>(
  ({ className, ...props }, ref) => (
    <AriaCalendarCell ref={ref} className={cx('tale-range-calendar__cell', className)} {...props} />
  ),
);
Cell.displayName = 'RangeCalendar.Cell';

/* ─── Heading ──────────────────────────────────────────────────────────────── */

export const Heading = React.forwardRef<HTMLHeadingElement, Omit<AriaHeadingProps, 'className'> & { className?: string }>(
  ({ className, ...props }, ref) => (
    <AriaHeading ref={ref} className={cx('tale-range-calendar__heading', className)} {...props} />
  ),
);
Heading.displayName = 'RangeCalendar.Heading';

/* ─── PreviousButton ───────────────────────────────────────────────────────── */

export const PreviousButton = React.forwardRef<HTMLButtonElement, Omit<AriaButtonProps, 'className' | 'slot'> & { className?: string }>(
  ({ className, children = '\u2039', ...props }, ref) => (
    <AriaButton ref={ref} slot="previous" className={cx('tale-range-calendar__prev-button', className)} {...props}>
      {children as React.ReactNode}
    </AriaButton>
  ),
);
PreviousButton.displayName = 'RangeCalendar.PreviousButton';

/* ─── NextButton ───────────────────────────────────────────────────────────── */

export const NextButton = React.forwardRef<HTMLButtonElement, Omit<AriaButtonProps, 'className' | 'slot'> & { className?: string }>(
  ({ className, children = '\u203A', ...props }, ref) => (
    <AriaButton ref={ref} slot="next" className={cx('tale-range-calendar__next-button', className)} {...props}>
      {children as React.ReactNode}
    </AriaButton>
  ),
);
NextButton.displayName = 'RangeCalendar.NextButton';
