import type { Meta, StoryObj } from '@storybook/react';
import { DateField } from '@tale-ui/react/date-field';

type Args = {
  isRequired?: boolean;
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/DateField',
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
    <DateField.Root {...args} style={{ width: '100%' }}>
      <DateField.DateInput style={{ display: 'flex' }}>
        {(segment) => <DateField.Segment segment={segment} />}
      </DateField.DateInput>
    </DateField.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <DateField.Root {...args} style={{ width: '100%' }}>
      <DateField.Label>Date</DateField.Label>
      <DateField.DateInput style={{ display: 'flex' }}>
        {(segment) => <DateField.Segment segment={segment} />}
      </DateField.DateInput>
    </DateField.Root>
  ),
};
