'use client';
import * as React from 'react';
import { Calendar } from '@tale-ui/react/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../../calendar.module.css';
import indexStyles from './index.module.css';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
type FirstDay = (typeof dayKeys)[number];

export default function StartOfWeekCalendar() {
  const [weekStartsOn, setWeekStartsOn] = React.useState<FirstDay>('mon');

  return (
    <div className={indexStyles.Wrapper}>
      <label className={indexStyles.Label}>
        First day of the week
        <select
          className={indexStyles.Select}
          value={weekStartsOn}
          onChange={(event) => setWeekStartsOn(event.target.value as FirstDay)}
        >
          {dayNames.map((day, index) => (
            <option key={day} value={dayKeys[index]}>
              {day}
            </option>
          ))}
        </select>
      </label>
      <Calendar.Root className={styles.Root} firstDayOfWeek={weekStartsOn}>
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
    </div>
  );
}
