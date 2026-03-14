import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@tale-ui/react/calendar';
import { TemporalAdapterProvider } from '@tale-ui/react/temporal-adapter-provider';
import { TemporalAdapterDateFns } from '@tale-ui/react/temporal-adapter-date-fns';

const adapter = new TemporalAdapterDateFns();

const meta: Meta = {
  title: 'Form Controls/Calendar',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// CalendarInner — must be inside Calendar.Root (useContext requires it)
// ---------------------------------------------------------------------------

function CalendarInner() {
  const context = Calendar.useContext();
  const getWeekList = Calendar.useWeekList();
  const getDayList = Calendar.useDayList();

  const weeks = getWeekList({ date: context.visibleDate, amount: 'end-of-month' });
  const dayNames = getDayList({ date: context.visibleDate, amount: 7 });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-3xs)', marginBottom: 'var(--space-2xs)' }}>
        <Calendar.DecrementMonth aria-label="Previous month">‹</Calendar.DecrementMonth>
        <span style={{ fontFamily: 'var(--label-font-family)', fontWeight: 600, fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-80)' }}>
          {adapter.formatByString(context.visibleDate, 'MMMM yyyy')}
        </span>
        <Calendar.IncrementMonth aria-label="Next month">›</Calendar.IncrementMonth>
      </div>
      <Calendar.DayGrid>
        <Calendar.DayGridHeader>
          <Calendar.DayGridHeaderRow>
            {dayNames.map((day, i) => (
              <Calendar.DayGridHeaderCell key={i} value={day} />
            ))}
          </Calendar.DayGridHeaderRow>
        </Calendar.DayGridHeader>
        <Calendar.DayGridBody>
          {weeks.map((week, wi) => (
            <Calendar.DayGridRow key={wi} value={week}>
              {(day, di) => (
                <Calendar.DayGridCell key={di} value={day}>
                  <Calendar.DayButton />
                </Calendar.DayGridCell>
              )}
            </Calendar.DayGridRow>
          ))}
        </Calendar.DayGridBody>
      </Calendar.DayGrid>
    </>
  );
}

function CalendarDemo({ value, onValueChange, disabled, readOnly }: {
  value: Date | null;
  onValueChange?: (date: Date | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <TemporalAdapterProvider adapter={adapter}>
      <Calendar.Root value={value} onValueChange={onValueChange} disabled={disabled} readOnly={readOnly}>
        <CalendarInner />
      </Calendar.Root>
    </TemporalAdapterProvider>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | null>(null);
    return <CalendarDemo value={value} onValueChange={setValue} />;
  },
};

export const Disabled: Story = {
  render: () => <CalendarDemo value={null} disabled />,
};

export const ReadOnly: Story = {
  name: 'Read Only',
  render: () => <CalendarDemo value={new Date()} readOnly />,
};
