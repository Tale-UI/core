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
    <DateField.Root {...args} className="story-field-full">
      <DateField.DateInput className="story-date-input">
        {(segment) => <DateField.Segment segment={segment} />}
      </DateField.DateInput>
    </DateField.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <DateField.Root {...args} className="story-field-full">
      <DateField.Label>Date</DateField.Label>
      <DateField.DateInput className="story-date-input">
        {(segment) => <DateField.Segment segment={segment} />}
      </DateField.DateInput>
    </DateField.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <p className="story-label">Default</p>
          <DateField.Root>
            <DateField.Label>Date</DateField.Label>
            <DateField.DateInput className="story-date-input">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.DateInput>
          </DateField.Root>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p className="story-label">Disabled</p>
          <DateField.Root isDisabled>
            <DateField.Label>Date</DateField.Label>
            <DateField.DateInput className="story-date-input">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.DateInput>
          </DateField.Root>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p className="story-label">Invalid</p>
          <DateField.Root isInvalid>
            <DateField.Label>Date</DateField.Label>
            <DateField.DateInput className="story-date-input">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.DateInput>
          </DateField.Root>
        </div>
      </div>
    );
  },
};
