'use client';
import * as React from 'react';
import { CalendarStateContext } from 'react-aria-components';
import { Calendar } from '@tale-ui/react/calendar';
import { Separator } from '@tale-ui/react/separator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './calendar.module.css';

function Header() {
  const state = React.useContext(CalendarStateContext)!;
  const { start } = state.visibleRange;
  const startLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    start.toDate('UTC'),
  );
  const nextMonth = start.add({ months: 1 });
  const nextLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    nextMonth.toDate('UTC'),
  );

  return (
    <header className={styles.Header}>
      <div className={styles.HeaderPanel}>
        <Calendar.PreviousButton className={styles.DecrementMonth}>
          <ChevronLeft />
        </Calendar.PreviousButton>
        <span className={styles.HeaderLabel}>{startLabel}</span>
        <span />
      </div>
      <div className={styles.HeaderPanel}>
        <span />
        <span className={styles.HeaderLabel}>{nextLabel}</span>
        <Calendar.NextButton className={styles.IncrementMonth}>
          <ChevronRight />
        </Calendar.NextButton>
      </div>
    </header>
  );
}

function DayGrid(props: { offset?: { months: number } }) {
  const { offset } = props;

  return (
    <Calendar.Grid className={styles.DayGrid} offset={offset}>
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
  );
}

export default function CalendarTwoMonths() {
  return (
    <Calendar.Root visibleDuration={{ months: 2 }} className={styles.Root}>
      <Header />
      <div className={styles.RootWithTwoPanelsContent}>
        <DayGrid />
        <Separator className={styles.DayGridSeparator} />
        <DayGrid offset={{ months: 1 }} />
      </div>
    </Calendar.Root>
  );
}
