import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from '@tale-ui/react/date-range-picker';
import { RangeCalendar } from '@tale-ui/react/range-calendar';

type Args = {
  isRequired?: boolean;
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/DateRangePicker',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', width: '320px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isRequired: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <DateRangePicker.Root {...args} style={{ width: '100%' }}>
      <DateRangePicker.Label>Date range</DateRangePicker.Label>
      <DateRangePicker.Group>
        <DateRangePicker.StartDate>
          {(segment) => <DateRangePicker.Segment segment={segment} />}
        </DateRangePicker.StartDate>
        <span style={{ color: 'var(--neutral-50)' }}>&ndash;</span>
        <DateRangePicker.EndDate>
          {(segment) => <DateRangePicker.Segment segment={segment} />}
        </DateRangePicker.EndDate>
        <DateRangePicker.Trigger />
      </DateRangePicker.Group>
      <DateRangePicker.Popover>
        <DateRangePicker.Dialog>
          <RangeCalendar.Root>
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <RangeCalendar.PreviousButton />
              <RangeCalendar.Heading />
              <RangeCalendar.NextButton />
            </header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => (
                  <RangeCalendar.GridHeaderCell>
                    {day}
                  </RangeCalendar.GridHeaderCell>
                )}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => <RangeCalendar.Cell date={date} />}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar.Root>
        </DateRangePicker.Dialog>
      </DateRangePicker.Popover>
    </DateRangePicker.Root>
  ),
};
