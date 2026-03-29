import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '@tale-ui/react/calendar';
import { today, getLocalTimeZone } from '@internationalized/date';

type Args = {
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Calendar',
  parameters: { layout: 'centered' },
  argTypes: {
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<Args>;

const CalendarTemplate = (args: Args) => (
  <Calendar.Root {...args}>
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
);

export const Default: Story = {
  render: (args) => <CalendarTemplate {...args} />,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => <CalendarTemplate {...args} />,
};

export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
  },
  render: (args) => (
    <Calendar.Root defaultValue={today(getLocalTimeZone())} {...args}>
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
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-sections">
        <div>
          <p className="story-label">Default calendar</p>
          <CalendarTemplate />
        </div>
      </div>
    );
  },
};
