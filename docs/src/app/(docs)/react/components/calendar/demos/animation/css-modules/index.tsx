'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Calendar } from '@tale-ui/react/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../calendar.module.css';
import indexStyles from './index.module.css';

export default function AnimatedCalendar() {
  return (
    <Calendar.Root className={clsx(styles.Root, indexStyles.Root)}>
      <header className={styles.Header}>
        <Calendar.PreviousButton className={styles.DecrementMonth}>
          <ChevronLeft />
        </Calendar.PreviousButton>
        <Calendar.Heading className={clsx(styles.HeaderLabel, indexStyles.HeaderLabel)} />
        <Calendar.NextButton className={styles.IncrementMonth}>
          <ChevronRight />
        </Calendar.NextButton>
      </header>
      <Calendar.Grid className={clsx(styles.DayGrid, indexStyles.DayGrid)}>
        <Calendar.GridHeader className={styles.DayGridHeaderRow}>
          {(day) => (
            <Calendar.GridHeaderCell className={styles.DayGridHeaderCell}>
              {day}
            </Calendar.GridHeaderCell>
          )}
        </Calendar.GridHeader>
        <Calendar.GridBody className={clsx(styles.DayGridBody, indexStyles.DayGridBody)}>
          {(date) => <Calendar.Cell date={date} className={styles.DayButton} />}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Root>
  );
}
