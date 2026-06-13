import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@tale-ui/react/input';

type Args = {
  placeholder: string;
  size: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Input',
  decorators: [
    (Story) => (
      <div className="story-field" style={{ width: 'initial' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: 'Type here...',
    size: 'md',
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Input.Root isDisabled={args.isDisabled} isInvalid={args.isInvalid} isReadOnly={args.isReadOnly}>
      <Input.Input size={args.size} placeholder={args.placeholder} />
    </Input.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <Input.Root isDisabled={args.isDisabled} isInvalid={args.isInvalid} isReadOnly={args.isReadOnly}>
      <Input.Label>Email address</Input.Label>
      <Input.Input size={args.size} placeholder={args.placeholder} />
    </Input.Root>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <Input.Root isDisabled={args.isDisabled} isInvalid={args.isInvalid} isReadOnly={args.isReadOnly}>
      <Input.Label>Username</Input.Label>
      <Input.Input size={args.size} placeholder={args.placeholder} />
      <Input.Description>Must be 3–20 characters long.</Input.Description>
    </Input.Root>
  ),
};

export const WithError: Story = {
  args: {
    isInvalid: true,
  },
  render: (args) => (
    <Input.Root isInvalid={args.isInvalid} isDisabled={args.isDisabled} isReadOnly={args.isReadOnly}>
      <Input.Label>Email</Input.Label>
      <Input.Input size={args.size} placeholder={args.placeholder} />
      <Input.ErrorMessage>Please enter a valid email address.</Input.ErrorMessage>
    </Input.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    placeholder: 'Cannot edit',
  },
  render: (args) => (
    <Input.Root isDisabled={args.isDisabled} isInvalid={args.isInvalid} isReadOnly={args.isReadOnly}>
      <Input.Label>Disabled input</Input.Label>
      <Input.Input size={args.size} placeholder={args.placeholder} />
    </Input.Root>
  ),
};

export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
  },
  render: (args) => (
    <Input.Root isReadOnly={args.isReadOnly} isDisabled={args.isDisabled} isInvalid={args.isInvalid}>
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

export const AllVariations: Story = {
  decorators: [(Story) => <Story />],
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg'] as const;
    const states = [
      { label: 'Default', props: {} },
      { label: 'Disabled', props: { isDisabled: true } },
      { label: 'Invalid', props: { isInvalid: true } },
      { label: 'Read-only', props: { isReadOnly: true } },
    ] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${sizes.length}, 200px)`, gap: '0.8rem 1.2rem', alignItems: 'start' }}>
        <div />
        {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
        {states.map((state) => (
          <React.Fragment>
            <div key={`label-${state.label}`} className="story-label" style={{ paddingTop: '0.4rem' }}>{state.label}</div>
            {sizes.map((s) => (
              <Input.Root key={`${state.label}-${s}`} {...state.props}>
                <Input.Label>{state.label}</Input.Label>
                <Input.Input size={s} placeholder="Placeholder" />
                {state.label === 'Invalid' && <Input.ErrorMessage>Error message</Input.ErrorMessage>}
              </Input.Root>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  },
};
