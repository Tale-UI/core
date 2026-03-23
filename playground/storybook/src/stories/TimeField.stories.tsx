import type { Meta, StoryObj } from '@storybook/react';
import { TimeField } from '@tale-ui/react/time-field';

type Args = {
  isRequired?: boolean;
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/TimeField',
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
  args: {
    isRequired: false,
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <TimeField.Root {...args} className="story-field-full">
      <TimeField.DateInput className="story-date-input">
        {(segment) => <TimeField.Segment segment={segment} />}
      </TimeField.DateInput>
    </TimeField.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <TimeField.Root {...args} className="story-field-full">
      <TimeField.Label>Time</TimeField.Label>
      <TimeField.DateInput className="story-date-input">
        {(segment) => <TimeField.Segment segment={segment} />}
      </TimeField.DateInput>
    </TimeField.Root>
  ),
};
