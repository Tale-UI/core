import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

export const useContext = H.useContext;
export const useWeekList = H.useWeekList;
export const useDayList = H.useDayList;

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-calendar', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'Calendar.Root';
export const Root = StyledRoot as typeof H.Root;

// CalendarViewport manages its own internal container — className not forwarded
export const Viewport = H.Viewport;

const StyledDayGrid = React.forwardRef<
  React.ComponentRef<typeof H.DayGrid>,
  React.ComponentPropsWithoutRef<typeof H.DayGrid>
>(({ className, ...props }, ref) => (
  <H.DayGrid className={cx('tale-calendar__day-grid', className)} ref={ref} {...props} />
));
StyledDayGrid.displayName = 'Calendar.DayGrid';
export const DayGrid = StyledDayGrid as typeof H.DayGrid;

const StyledDayGridHeader = React.forwardRef<
  React.ComponentRef<typeof H.DayGridHeader>,
  React.ComponentPropsWithoutRef<typeof H.DayGridHeader>
>(({ className, ...props }, ref) => (
  <H.DayGridHeader className={cx('tale-calendar__day-grid-header', className)} ref={ref} {...props} />
));
StyledDayGridHeader.displayName = 'Calendar.DayGridHeader';
export const DayGridHeader = StyledDayGridHeader as typeof H.DayGridHeader;

const StyledDayGridHeaderRow = React.forwardRef<
  React.ComponentRef<typeof H.DayGridHeaderRow>,
  React.ComponentPropsWithoutRef<typeof H.DayGridHeaderRow>
>(({ className, ...props }, ref) => (
  <H.DayGridHeaderRow className={cx('tale-calendar__day-grid-header-row', className)} ref={ref} {...props} />
));
StyledDayGridHeaderRow.displayName = 'Calendar.DayGridHeaderRow';
export const DayGridHeaderRow = StyledDayGridHeaderRow as typeof H.DayGridHeaderRow;

const StyledDayGridHeaderCell = React.forwardRef<
  React.ComponentRef<typeof H.DayGridHeaderCell>,
  React.ComponentPropsWithoutRef<typeof H.DayGridHeaderCell>
>(({ className, ...props }, ref) => (
  <H.DayGridHeaderCell className={cx('tale-calendar__day-grid-header-cell', className)} ref={ref} {...props} />
));
StyledDayGridHeaderCell.displayName = 'Calendar.DayGridHeaderCell';
export const DayGridHeaderCell = StyledDayGridHeaderCell as typeof H.DayGridHeaderCell;

const StyledDayGridBody = React.forwardRef<
  React.ComponentRef<typeof H.DayGridBody>,
  React.ComponentPropsWithoutRef<typeof H.DayGridBody>
>(({ className, ...props }, ref) => (
  <H.DayGridBody className={cx('tale-calendar__day-grid-body', className)} ref={ref} {...props} />
));
StyledDayGridBody.displayName = 'Calendar.DayGridBody';
export const DayGridBody = StyledDayGridBody as typeof H.DayGridBody;

const StyledDayGridRow = React.forwardRef<
  React.ComponentRef<typeof H.DayGridRow>,
  React.ComponentPropsWithoutRef<typeof H.DayGridRow>
>(({ className, ...props }, ref) => (
  <H.DayGridRow className={cx('tale-calendar__day-grid-row', className)} ref={ref} {...props} />
));
StyledDayGridRow.displayName = 'Calendar.DayGridRow';
export const DayGridRow = StyledDayGridRow as typeof H.DayGridRow;

const StyledDayGridCell = React.forwardRef<
  React.ComponentRef<typeof H.DayGridCell>,
  React.ComponentPropsWithoutRef<typeof H.DayGridCell>
>(({ className, ...props }, ref) => (
  <H.DayGridCell className={cx('tale-calendar__day-grid-cell', className)} ref={ref} {...props} />
));
StyledDayGridCell.displayName = 'Calendar.DayGridCell';
export const DayGridCell = StyledDayGridCell as typeof H.DayGridCell;

const StyledDayButton = React.forwardRef<
  React.ComponentRef<typeof H.DayButton>,
  React.ComponentPropsWithoutRef<typeof H.DayButton>
>(({ className, ...props }, ref) => (
  <H.DayButton className={cx('tale-calendar__day-button', className)} ref={ref} {...props} />
));
StyledDayButton.displayName = 'Calendar.DayButton';
export const DayButton = StyledDayButton as typeof H.DayButton;

const StyledIncrementMonth = React.forwardRef<
  React.ComponentRef<typeof H.IncrementMonth>,
  React.ComponentPropsWithoutRef<typeof H.IncrementMonth>
>(({ className, ...props }, ref) => (
  <H.IncrementMonth className={cx('tale-calendar__increment-month', className)} ref={ref} {...props} />
));
StyledIncrementMonth.displayName = 'Calendar.IncrementMonth';
export const IncrementMonth = StyledIncrementMonth as typeof H.IncrementMonth;

const StyledDecrementMonth = React.forwardRef<
  React.ComponentRef<typeof H.DecrementMonth>,
  React.ComponentPropsWithoutRef<typeof H.DecrementMonth>
>(({ className, ...props }, ref) => (
  <H.DecrementMonth className={cx('tale-calendar__decrement-month', className)} ref={ref} {...props} />
));
StyledDecrementMonth.displayName = 'Calendar.DecrementMonth';
export const DecrementMonth = StyledDecrementMonth as typeof H.DecrementMonth;
