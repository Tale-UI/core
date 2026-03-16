'use client';
import * as React from 'react';
import { parseZonedDateTime, toCalendarDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import { Calendar } from '@tale-ui/react/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './calendar.module.css';

export default function CalendarWithTimezone() {
  const [value, setValue] = React.useState<DateValue | null>(
    toCalendarDate(parseZonedDateTime('2025-04-17T04:45[America/New_York]')),
  );
  return (
    <div className={styles.Wrapper}>
      <Calendar.Root
        className={styles.Root}
        value={value}
        onChange={setValue}
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
      {value && <p className={styles.Text}>Selected date: {value.toString()}</p>}
    </div>
  );
}
