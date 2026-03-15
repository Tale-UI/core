import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@tale-ui/react/date-picker';
import { Calendar } from '@tale-ui/react/calendar';

type Args = {
  isRequired?: boolean;
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/DatePicker',
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

const DatePickerTemplate = (args: Args & { showLabel?: boolean }) => (
  <DatePicker.Root {...args} style={{ width: '100%' }}>
    {args.showLabel && <DatePicker.Label>Date</DatePicker.Label>}
    <DatePicker.Group>
      <DatePicker.DateInput>
        {(segment) => <DatePicker.Segment segment={segment} />}
      </DatePicker.DateInput>
      <DatePicker.Trigger />
    </DatePicker.Group>
    <DatePicker.Popover>
      <DatePicker.Dialog>
        <Calendar.Root>
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Calendar.PreviousButton />
            <Calendar.Heading />
            <Calendar.NextButton />
          </header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
        </Calendar.Root>
      </DatePicker.Dialog>
    </DatePicker.Popover>
  </DatePicker.Root>
);

export const Default: Story = {
  render: (args) => <DatePickerTemplate {...args} />,
};

export const WithLabel: Story = {
  render: (args) => <DatePickerTemplate {...args} showLabel />,
};
