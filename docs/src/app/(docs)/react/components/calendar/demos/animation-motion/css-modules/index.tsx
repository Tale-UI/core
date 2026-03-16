'use client';
import * as React from 'react';
import { Calendar } from '@tale-ui/react/calendar';
import { CalendarStateContext } from 'react-aria-components';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../calendar.module.css';

function AnimatedGridBody() {
  const state = React.useContext(CalendarStateContext)!;
  const { start } = state.visibleRange;
  const key = `${start.year}-${start.month}`;

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <Calendar.GridBody
        key={key}
        className={styles.DayGridBody}
      >
        {(date) => <Calendar.Cell date={date} className={styles.DayButton} />}
      </Calendar.GridBody>
    </AnimatePresence>
  );
}

export default function AnimatedCalendarWithMotion() {
  return (
    <Calendar.Root className={styles.Root}>
      <header className={styles.Header}>
        <Calendar.PreviousButton className={styles.DecrementMonth}>
          <ChevronLeft />
        </Calendar.PreviousButton>
        <AnimatePresence initial={false} mode="popLayout">
          <Calendar.Heading className={styles.HeaderLabel} />
        </AnimatePresence>
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
        <AnimatedGridBody />
      </Calendar.Grid>
    </Calendar.Root>
  );
}
