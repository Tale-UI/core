'use client';
import * as React from 'react';
import { Calendar } from '@tale-ui/react/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../calendar.module.css';

export default function CalendarWithWeekNumbers() {
  return (
    <Calendar.Root className={styles.Root}>
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
