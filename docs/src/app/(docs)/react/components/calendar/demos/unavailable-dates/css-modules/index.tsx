'use client';
import * as React from 'react';
import { getDayOfWeek } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import { Calendar } from '@tale-ui/react/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../calendar.module.css';

const holidays: Array<[number, number]> = [
  [1, 1], // New Year's Day
  [7, 4], // Independence Day
  [11, 11], // Veterans Day
  [12, 25], // Christmas Day
];

function isDateUnavailable(date: DateValue) {
  const dow = getDayOfWeek(date, 'en-US');
  const month = date.month;
  const day = date.day;

  // Weekends (0 = Sunday, 6 = Saturday)
  if (dow === 0 || dow === 6) {
    return true;
  }

  // US holidays
  if (holidays.some(([m, d]) => month === m && day === d)) {
    return true;
  }

  // First Monday of every month (maintenance day)
  if (dow === 1 && day <= 7) {
    return true;
  }

  return false;
}

export default function UnavailableDatesCalendar() {
  return (
    <Calendar.Root
      className={styles.Root}
      isDateUnavailable={isDateUnavailable}
      aria-label="Appointment date"
    >
      <header className={styles.Header}>
        <Calendar.PreviousButton className={styles.DecrementMonth}>
          <ChevronLeft />
        </Calendar.PreviousButton>
        <Calendar.Heading className={styles.HeaderLabel} />
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
    </Calendar.Root>
  );
}
