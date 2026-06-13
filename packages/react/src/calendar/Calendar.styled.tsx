import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Calendar as AriaCalendar,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarCell as AriaCalendarCell,
  CalendarHeading as AriaCalendarHeading,
  CalendarMonthPicker as AriaCalendarMonthPicker,
  CalendarYearPicker as AriaCalendarYearPicker,
  Button as AriaButton,
  type CalendarProps as AriaCalendarProps,
  type CalendarGridProps as AriaCalendarGridProps,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  type CalendarCellProps as AriaCalendarCellProps,
  type CalendarHeadingProps as AriaCalendarHeadingProps,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';
import type { DateValue } from '@internationalized/date';
import { Icon } from '../icon';
import { cx } from '../_cx';

/**
 * A date calendar for selecting a single date — or multiple dates with
 * `selectionMode="multiple"` (the `value` becomes an array of dates).
 * Use `weeksInMonth` on `Calendar.Grid` to override the locale's number of displayed weeks.
 *
 * Note: Navigation buttons and heading need a flex wrapper — they don't layout automatically.
 * `Calendar.Heading` must have no vertical margin or padding (`margin: 0; padding: 0;`) — the
 * CSS already sets this, but do not add extra spacing to it or wrap it in an element that does.
 * Use `GridHeaderCell` in GridHeader (not `Cell` — that's for GridBody dates only).
 *
 * @example
 * ```tsx
 * import { Calendar } from '@tale-ui/react/calendar';
 *
 * <Calendar.Root>
 *   <Calendar.Header>
 *     <Calendar.PreviousButton />
 *     <Calendar.Heading />
 *     <Calendar.NextButton />
 *   </Calendar.Header>
 *   <Calendar.Grid>
 *     <Calendar.GridHeader>
 *       {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
 *     </Calendar.GridHeader>
 *     <Calendar.GridBody>
 *       {(date) => <Calendar.Cell date={date} />}
 *     </Calendar.GridBody>
 *   </Calendar.Grid>
 * </Calendar.Root>
 * ```
 */
type CalendarSelectionMode = 'single' | 'multiple';

export type RootProps<M extends CalendarSelectionMode = 'single'> = Omit<
  AriaCalendarProps<DateValue, M>,
  'className'
> & { className?: string };

export const Root: <M extends CalendarSelectionMode = 'single'>(
  props: RootProps<M> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RootProps<CalendarSelectionMode>, ref) => (
    <AriaCalendar
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-calendar', className)}
      {...props}
    />
  ),
) as any;
(Root as any).displayName = 'Calendar.Root';

// Header (flex wrapper for navigation buttons + heading)
export const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-calendar__header', className)} {...props} />
  ),
);
Header.displayName = 'Calendar.Header';

// Grid (contains header + body)
export const Grid = React.forwardRef<
  HTMLTableElement,
  Omit<AriaCalendarGridProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaCalendarGrid ref={ref} className={cx('tale-calendar__grid', className)} {...props} />
));
Grid.displayName = 'Calendar.Grid';

// Grid header (thead — renders a row of weekday names via render prop)
export const GridHeader = React.forwardRef<
  HTMLTableSectionElement,
  Omit<AriaCalendarGridHeaderProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaCalendarGridHeader
    ref={ref}
    className={cx('tale-calendar__grid-header', className)}
    {...props}
  />
));
GridHeader.displayName = 'Calendar.GridHeader';

// Header cell (th - weekday name)
export const GridHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  Omit<AriaCalendarHeaderCellProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaCalendarHeaderCell
    ref={ref}
    className={cx('tale-calendar__grid-header-cell', className)}
    {...props}
  />
));
GridHeaderCell.displayName = 'Calendar.GridHeaderCell';

// Grid body (tbody — renders rows via render prop: (date) => CalendarCell)
export const GridBody = React.forwardRef<
  HTMLTableSectionElement,
  Omit<AriaCalendarGridBodyProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaCalendarGridBody
    ref={ref}
    className={cx('tale-calendar__grid-body', className)}
    {...props}
  />
));
GridBody.displayName = 'Calendar.GridBody';

// Cell (td + button)
export const Cell = React.forwardRef<
  HTMLTableCellElement,
  Omit<AriaCalendarCellProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaCalendarCell ref={ref} className={cx('tale-calendar__cell', className)} {...props} />
));
Cell.displayName = 'Calendar.Cell';

// Heading (month/year label)
/**
 * Month/year label. Backed by React Aria's CalendarHeading: auto-formats the
 * visible month and supports an `offset` (in months) for multi-month layouts.
 */
export const Heading = React.forwardRef<
  HTMLHeadingElement,
  Omit<AriaCalendarHeadingProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaCalendarHeading ref={ref} className={cx('tale-calendar__heading', className)} {...props} />
));
Heading.displayName = 'Calendar.Heading';

// Previous month button
export const PreviousButton = React.forwardRef<
  HTMLButtonElement,
  Omit<AriaButtonProps, 'className' | 'slot'> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <AriaButton
    ref={ref}
    slot="previous"
    className={cx(
      'tale-icon-button tale-button tale-button--ghost tale-calendar__prev-button',
      className,
    )}
    {...props}
  >
    {children ?? <Icon icon={ChevronLeft} size="sm" />}
  </AriaButton>
));
PreviousButton.displayName = 'Calendar.PreviousButton';

// Next month button
export const NextButton = React.forwardRef<
  HTMLButtonElement,
  Omit<AriaButtonProps, 'className' | 'slot'> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <AriaButton
    ref={ref}
    slot="next"
    className={cx(
      'tale-icon-button tale-button tale-button--ghost tale-calendar__next-button',
      className,
    )}
    {...props}
  >
    {children ?? <Icon icon={ChevronRight} size="sm" />}
  </AriaButton>
));
NextButton.displayName = 'Calendar.NextButton';

// Headless month/year picker helpers (React Aria render-prop components).
// They provide locale-aware month/year lists for building custom picker UIs —
// see the Calendar docs "Month and year pickers" section.
export const MonthPicker = AriaCalendarMonthPicker;
export const YearPicker = AriaCalendarYearPicker;
