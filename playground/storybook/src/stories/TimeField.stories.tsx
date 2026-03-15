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
      <div style={{ display: 'flex', flexDirection: 'column', width: '320px' }}>
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
    <TimeField.Root {...args} style={{ width: '100%' }}>
      <TimeField.DateInput style={{ display: 'flex' }}>
        {(segment) => <TimeField.Segment segment={segment} />}
      </TimeField.DateInput>
    </TimeField.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <TimeField.Root {...args} style={{ width: '100%' }}>
      <TimeField.Label>Time</TimeField.Label>
      <TimeField.DateInput style={{ display: 'flex' }}>
        {(segment) => <TimeField.Segment segment={segment} />}
      </TimeField.DateInput>
    </TimeField.Root>
  ),
};
