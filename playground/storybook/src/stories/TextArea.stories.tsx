import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from '@tale-ui/react/text-area';

type Args = {
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/TextArea',
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
    isInvalid: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <TextArea.Root {...args}>
      <TextArea.TextArea placeholder="Enter text…" />
    </TextArea.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <TextArea.Root {...args}>
      <TextArea.Label>Bio</TextArea.Label>
      <TextArea.TextArea />
      <TextArea.Description>Max 500 chars</TextArea.Description>
    </TextArea.Root>
  ),
};

export const WithError: Story = {
  args: {
    isInvalid: true,
  },
  render: (args) => (
    <TextArea.Root {...args}>
      <TextArea.Label>Bio</TextArea.Label>
      <TextArea.TextArea />
      <TextArea.ErrorMessage>This field is required</TextArea.ErrorMessage>
    </TextArea.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <TextArea.Root {...args}>
      <TextArea.Label>Bio</TextArea.Label>
      <TextArea.TextArea placeholder="Disabled field" />
    </TextArea.Root>
  ),
};
