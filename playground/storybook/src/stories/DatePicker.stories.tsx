import type { Meta, StoryObj } from '@storybook/react-vite';
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

const DatePickerTemplate = (args: Args & { showLabel?: boolean }) => (
  <DatePicker.Root {...args} className="story-field-full">
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
          <Calendar.Header>
            <Calendar.PreviousButton />
            <Calendar.Heading />
            <Calendar.NextButton />
          </Calendar.Header>
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

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px' }}>
          <p className="story-label">Default</p>
          <DatePickerTemplate showLabel />
        </div>
        <div style={{ flex: '1 1 250px' }}>
          <p className="story-label">Disabled</p>
          <DatePickerTemplate showLabel isDisabled />
        </div>
      </div>
    );
  },
};
