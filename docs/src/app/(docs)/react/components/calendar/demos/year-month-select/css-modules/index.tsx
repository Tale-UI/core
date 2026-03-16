'use client';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { CalendarStateContext } from 'react-aria-components';
import { Calendar } from '@tale-ui/react/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../calendar.module.css';
import indexStyles from './index.module.css';

const YEAR_PAST = 40;
const YEAR_FUTURE = 10;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function CalendarContent() {
  const state = React.useContext(CalendarStateContext)!;
  const { start } = state.visibleRange;
  const currentMonth = start.month;
  const currentYear = start.year;
  const todayYear = new Date().getFullYear();
  const years = Array.from(
    { length: YEAR_PAST + YEAR_FUTURE + 1 },
    (_, i) => todayYear - YEAR_PAST + i,
  );

  return (
    <React.Fragment>
      <header className={styles.Header}>
        <Calendar.PreviousButton className={styles.DecrementMonth}>
          <ChevronLeft />
        </Calendar.PreviousButton>
        <select
          className={indexStyles.Select}
          value={currentMonth}
          onChange={(event) =>
            state.setFocusedDate(
              new CalendarDate(currentYear, Number(event.target.value), 1),
            )
          }
        >
          {MONTHS.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
        <select
          className={indexStyles.Select}
          value={currentYear}
          onChange={(event) =>
            state.setFocusedDate(
              new CalendarDate(Number(event.target.value), currentMonth, 1),
            )
          }
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <Calendar.NextButton className={styles.IncrementMonth}>
          <ChevronRight />
        </Calendar.NextButton>
      </header>
      <Calendar.Grid className={styles.DayGrid}>
        <Calendar.GridHeader className={styles.DayGridHeaderRow}>
          {(day) => (
            <Calendar.GridHeaderCell className={styles.DayGridHeaderCell}>
              {day}
            </Calendar.GridHeaderCell>
          )}
        </Calendar.GridHeader>
        <Calendar.GridBody className={styles.DayGridBody}>
          {(date) => <Calendar.Cell date={date} className={styles.DayButton} />}
        </Calendar.GridBody>
      </Calendar.Grid>
    </React.Fragment>
  );
}

export default function ExampleCalendarYearMonthSelect() {
  return (
    <Calendar.Root className={styles.Root}>
      <CalendarContent />
    </Calendar.Root>
  );
}
