'use client';
import * as React from 'react';
import { today, getLocalTimeZone } from '@internationalized/date';
import { Calendar } from '@tale-ui/react/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './calendar.module.css';

const now = today(getLocalTimeZone());

export default function CalendarValidation() {
  return (
    <Calendar.Root
      className={styles.Root}
      minValue={now.subtract({ days: 3 })}
      maxValue={now.add({ days: 15 })}
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
