import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '@tale-ui/react/text-field';

type Args = {
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/TextField',
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
    <TextField.Root {...args}>
      <TextField.Input placeholder="Enter text…" />
    </TextField.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <TextField.Root {...args}>
      <TextField.Label>Name</TextField.Label>
      <TextField.Input />
      <TextField.Description>Helper text</TextField.Description>
    </TextField.Root>
  ),
};

export const WithError: Story = {
  args: {
    isInvalid: true,
  },
  render: (args) => (
    <TextField.Root {...args}>
      <TextField.Label>Email</TextField.Label>
      <TextField.Input />
      <TextField.ErrorMessage>Please enter a valid email address</TextField.ErrorMessage>
    </TextField.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <TextField.Root {...args}>
      <TextField.Label>Name</TextField.Label>
      <TextField.Input placeholder="Disabled field" />
    </TextField.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-cards">
        <div style={{ width: 240 }}>
          <div className="story-heading">Default</div>
          <TextField.Root>
            <TextField.Label>Name</TextField.Label>
            <TextField.Input placeholder="Enter text…" />
            <TextField.Description>Helper text</TextField.Description>
          </TextField.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Required</div>
          <TextField.Root isRequired>
            <TextField.Label>Email</TextField.Label>
            <TextField.Input placeholder="Required field" />
          </TextField.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Invalid</div>
          <TextField.Root isInvalid>
            <TextField.Label>Email</TextField.Label>
            <TextField.Input />
            <TextField.ErrorMessage>Invalid email</TextField.ErrorMessage>
          </TextField.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Disabled</div>
          <TextField.Root isDisabled>
            <TextField.Label>Name</TextField.Label>
            <TextField.Input placeholder="Disabled" />
          </TextField.Root>
        </div>
        <div style={{ width: 240 }}>
          <div className="story-heading">Read-only</div>
          <TextField.Root isReadOnly>
            <TextField.Label>Name</TextField.Label>
            <TextField.Input value="Read-only value" />
          </TextField.Root>
        </div>
      </div>
    );
  },
};
