import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@tale-ui/react/input';

type Args = {
  placeholder: string;
  size: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Input',
  decorators: [
    (Story) => (
      <div className="story-field">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: 'Type here...',
    size: 'md',
    isDisabled: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDisabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Input.Root isDisabled={args.isDisabled}>
      <Input.Input size={args.size} placeholder={args.placeholder} />
    </Input.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <Input.Root isDisabled={args.isDisabled}>
      <Input.Label>Email address</Input.Label>
      <Input.Input size={args.size} placeholder={args.placeholder} />
    </Input.Root>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <Input.Root isDisabled={args.isDisabled}>
      <Input.Label>Username</Input.Label>
      <Input.Input size={args.size} placeholder={args.placeholder} />
      <Input.Description>Must be 3–20 characters long.</Input.Description>
    </Input.Root>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <Input.Root isInvalid isDisabled={args.isDisabled}>
      <Input.Label>Email</Input.Label>
      <Input.Input size={args.size} placeholder={args.placeholder} />
      <Input.ErrorMessage>Please enter a valid email address.</Input.ErrorMessage>
    </Input.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    label: 'Disabled input',
    placeholder: 'Cannot edit',
  },
  render: (args) => (
    <Input.Root isDisabled={args.isDisabled}>
      <Input.Label>Disabled input</Input.Label>
      <Input.Input size={args.size} placeholder={args.placeholder} />
    </Input.Root>
  ),
};

export const ReadOnly: Story = {
  render: (args) => (
    <Input.Root isReadOnly>
      <Input.Label>Read-only input</Input.Label>
      <Input.Input size={args.size} value="This value cannot be changed" />
    </Input.Root>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-col story-col--m">
      <Input.Root>
        <Input.Label>Small</Input.Label>
        <Input.Input size="sm" placeholder="Small input" />
      </Input.Root>
      <Input.Root>
        <Input.Label>Medium</Input.Label>
        <Input.Input size="md" placeholder="Medium input" />
      </Input.Root>
      <Input.Root>
        <Input.Label>Large</Input.Label>
        <Input.Input size="lg" placeholder="Large input" />
      </Input.Root>
    </div>
  ),
};
