'use client';
import * as React from 'react';
import { today, getLocalTimeZone } from '@internationalized/date';
import type { CalendarProps } from 'react-aria-components';
import type { DateValue } from '@internationalized/date';
import { Calendar } from '@tale-ui/react/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import indexStyles from './index.module.css';
import styles from '../../calendar.module.css';

const now = today(getLocalTimeZone());

export default function MinMaxDateCalendars() {
  return (
    <div className={indexStyles.Wrapper}>
      <ValidationCalendar minValue={now} />
      <ValidationCalendar maxValue={now} />
    </div>
  );
}

function ValidationCalendar(props: Omit<CalendarProps<DateValue>, 'className'> & { className?: string }) {
  return (
    <Calendar.Root className={styles.Root} {...props}>
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
