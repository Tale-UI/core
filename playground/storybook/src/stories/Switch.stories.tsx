import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@tale-ui/react/switch';

type Args = {
  isSelected?: boolean;
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Switch',
  argTypes: {
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    isSelected: false,
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Switch.Root key={String(args.isSelected)} defaultSelected={args.isSelected} isDisabled={args.isDisabled}>
      <Switch.Thumb />
      Enable notifications
    </Switch.Root>
  ),
};

export const Selected: Story = {
  args: {
    isSelected: true,
    isDisabled: false,
  },
  render: (args) => (
    <Switch.Root key={String(args.isSelected)} defaultSelected={args.isSelected} isDisabled={args.isDisabled}>
      <Switch.Thumb />
      Dark mode
    </Switch.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isSelected: false,
    isDisabled: true,
  },
  render: (args) => (
    <Switch.Root key={String(args.isSelected)} defaultSelected={args.isSelected} isDisabled={args.isDisabled}>
      <Switch.Thumb />
      Disabled switch
    </Switch.Root>
  ),
};

export const DisabledSelected: Story = {
  args: {
    isSelected: true,
    isDisabled: true,
  },
  render: (args) => (
    <Switch.Root key={String(args.isSelected)} defaultSelected={args.isSelected} isDisabled={args.isDisabled}>
      <Switch.Thumb />
      Disabled and on
    </Switch.Root>
  ),
};

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
      <Switch.Root>
        <Switch.Thumb />
        Default (off)
      </Switch.Root>

      <Switch.Root defaultSelected>
        <Switch.Thumb />
        Default (on)
      </Switch.Root>

      <Switch.Root isDisabled>
        <Switch.Thumb />
        Disabled (off)
      </Switch.Root>

      <Switch.Root isDisabled defaultSelected>
        <Switch.Thumb />
        Disabled (on)
      </Switch.Root>
    </div>
  ),
};
