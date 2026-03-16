'use client';
import * as React from 'react';
import { Calendar } from '@tale-ui/react/calendar';
import { Select } from '@tale-ui/react/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../calendar.module.css';
import indexStyles from './index.module.css';

export default function CalendarWithTimezoneDisplay() {
  const [timezone, setTimezone] = React.useState<string>('Australia/Sydney');
  return (
    <div className={indexStyles.Wrapper}>
      <TimezoneSelect
        selectedKey={timezone}
        onSelectionChange={(key) => setTimezone(key as string)}
      />
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
      <p className={indexStyles.Text}>Timezone: {timezone}</p>
    </div>
  );
}

function TimezoneSelect(props: {
  selectedKey: string;
  onSelectionChange: (key: React.Key | null) => void;
}) {
  return (
    <Select.Root selectedKey={props.selectedKey} onSelectionChange={props.onSelectionChange}>
      <Select.Label className={indexStyles.Label}>Timezone</Select.Label>
      <Select.Trigger className={indexStyles.Select}>
        <Select.Value className={indexStyles.Value} />
        <Select.Icon>&#8595;</Select.Icon>
      </Select.Trigger>
      <Select.Popover className={indexStyles.Popup}>
        <Select.ListBox className={indexStyles.List}>
          {timezones.map((tz) => (
            <Select.Item key={tz} id={tz} className={indexStyles.Item}>
              {tz}
            </Select.Item>
          ))}
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  );
}

const timezones = [
  'America/Los_Angeles',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
] as const;
