import type { Meta, StoryObj } from '@storybook/react-vite';
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
      <div className="story-field">
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
    <DateRangePicker.Root {...args} className="story-field-full">
      <DateRangePicker.Label>Date range</DateRangePicker.Label>
      <DateRangePicker.Group>
        <DateRangePicker.StartDate>
          {(segment) => <DateRangePicker.Segment segment={segment} />}
        </DateRangePicker.StartDate>
        <span className="story-separator-dash">&ndash;</span>
        <DateRangePicker.EndDate>
          {(segment) => <DateRangePicker.Segment segment={segment} />}
        </DateRangePicker.EndDate>
        <DateRangePicker.Trigger />
      </DateRangePicker.Group>
      <DateRangePicker.Popover>
        <DateRangePicker.Dialog>
          <RangeCalendar.Root>
            <RangeCalendar.Header>
              <RangeCalendar.PreviousButton />
              <RangeCalendar.Heading />
              <RangeCalendar.NextButton />
            </RangeCalendar.Header>
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

function DateRangePickerExample({ isDisabled }: { isDisabled?: boolean }) {
  return <DateRangePicker.Root isDisabled={isDisabled} className="story-field-full">
    <DateRangePicker.Label>Date range</DateRangePicker.Label>
    <DateRangePicker.Group>
      <DateRangePicker.StartDate>
        {(segment) => <DateRangePicker.Segment segment={segment} />}
      </DateRangePicker.StartDate>
      <span className="story-separator-dash">&ndash;</span>
      <DateRangePicker.EndDate>
        {(segment) => <DateRangePicker.Segment segment={segment} />}
      </DateRangePicker.EndDate>
      <DateRangePicker.Trigger />
    </DateRangePicker.Group>
    <DateRangePicker.Popover>
      <DateRangePicker.Dialog>
        <RangeCalendar.Root>
          <RangeCalendar.Header>
            <RangeCalendar.PreviousButton />
            <RangeCalendar.Heading />
            <RangeCalendar.NextButton />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => (
                <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>
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
}

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px' }}>
          <p className="story-label">Default</p>
          <DateRangePickerExample />
        </div>
        <div style={{ flex: '1 1 280px' }}>
          <p className="story-label">Disabled</p>
          <DateRangePickerExample isDisabled />
        </div>
      </div>
    );
  },
};
