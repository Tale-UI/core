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
  CalendarStateContext as AriaCalendarStateContext,
  RangeCalendarStateContext as AriaRangeCalendarStateContext,
  Button as AriaButton,
  type CalendarProps as AriaCalendarProps,
  type CalendarGridProps as AriaCalendarGridProps,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  type CalendarCellProps as AriaCalendarCellProps,
  type CalendarHeadingProps as AriaCalendarHeadingProps,
  type CalendarMonthPickerProps as AriaCalendarMonthPickerProps,
  type CalendarYearPickerProps as AriaCalendarYearPickerProps,
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

type CalendarPickerInjectedProps = {
  className: string;
  isDisabled: boolean;
  isReadOnly: boolean;
};

export type MonthPickerRenderProps = Parameters<AriaCalendarMonthPickerProps['children']>[0] &
  CalendarPickerInjectedProps;

export type MonthPickerProps = Omit<AriaCalendarMonthPickerProps, 'children'> & {
  className?: string;
  children?: (renderProps: MonthPickerRenderProps) => ReturnType<AriaCalendarMonthPickerProps['children']>;
};

export type YearPickerRenderProps = Parameters<AriaCalendarYearPickerProps['children']>[0] &
  CalendarPickerInjectedProps;

export type YearPickerProps = Omit<AriaCalendarYearPickerProps, 'children'> & {
  className?: string;
  children?: (renderProps: YearPickerRenderProps) => ReturnType<AriaCalendarYearPickerProps['children']>;
};

type CalendarPickerSelectProps = MonthPickerRenderProps | YearPickerRenderProps;

function useCalendarPickerState(): Pick<CalendarPickerInjectedProps, 'isDisabled' | 'isReadOnly'> {
  const calendarState = React.useContext(AriaCalendarStateContext);
  const rangeCalendarState = React.useContext(AriaRangeCalendarStateContext);

  return {
    isDisabled: Boolean(calendarState?.isDisabled ?? rangeCalendarState?.isDisabled),
    isReadOnly: Boolean(calendarState?.isReadOnly ?? rangeCalendarState?.isReadOnly),
  };
}

function CalendarPickerSelect({
  'aria-label': ariaLabel,
  value,
  onChange,
  items,
  className,
  isDisabled,
  isReadOnly,
}: CalendarPickerSelectProps): React.ReactElement {
  return (
    <select
      aria-label={ariaLabel}
      aria-readonly={isReadOnly || undefined}
      className={className}
      disabled={isDisabled}
      value={String(value)}
      onChange={(event) => onChange(Number(event.currentTarget.value))}
    >
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.formatted}
        </option>
      ))}
    </select>
  );
}

/**
 * Locale-aware month picker for the current calendar state.
 *
 * Renders a Tale UI styled native `<select>` by default. Pass a render-prop
 * child to build custom UI; the render props include `className` for applying
 * the same `tale-calendar__month-picker` styles.
 */
export function MonthPicker({ className, children, ...props }: MonthPickerProps): React.ReactElement {
  const pickerState = useCalendarPickerState();
  const pickerClassName = cx('tale-calendar__month-picker', className);

  return (
    <AriaCalendarMonthPicker {...props}>
      {(renderProps) => {
        const taleRenderProps = { ...renderProps, ...pickerState, className: pickerClassName };
        return children ? children(taleRenderProps) : <CalendarPickerSelect {...taleRenderProps} />;
      }}
    </AriaCalendarMonthPicker>
  );
}
MonthPicker.displayName = 'Calendar.MonthPicker';

/**
 * Locale-aware year picker for the current calendar state.
 *
 * Renders a Tale UI styled native `<select>` by default. Pass a render-prop
 * child to build custom UI; the render props include `className` for applying
 * the same `tale-calendar__year-picker` styles.
 */
export function YearPicker({ className, children, ...props }: YearPickerProps): React.ReactElement {
  const pickerState = useCalendarPickerState();
  const pickerClassName = cx('tale-calendar__year-picker', className);

  return (
    <AriaCalendarYearPicker {...props}>
      {(renderProps) => {
        const taleRenderProps = { ...renderProps, ...pickerState, className: pickerClassName };
        return children ? children(taleRenderProps) : <CalendarPickerSelect {...taleRenderProps} />;
      }}
    </AriaCalendarYearPicker>
  );
}
YearPicker.displayName = 'Calendar.YearPicker';
