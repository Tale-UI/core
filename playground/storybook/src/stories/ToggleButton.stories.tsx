import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';

type Args = {
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isSelected?: boolean;
  children?: string;
};

const meta: Meta<Args> = {
  title: 'Components/ToggleButton',
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDisabled: { control: 'boolean' },
    isSelected: { control: 'boolean' },
  },
  args: {
    size: 'md',
    isDisabled: false,
    isSelected: false,
    children: 'Toggle me',
  },
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <ToggleButton key={String(args.isSelected)} size={args.size} isDisabled={args.isDisabled} defaultSelected={args.isSelected}>
      {args.children}
    </ToggleButton>
  ),
};

export const Pressed: Story = {
  args: {
    isSelected: true,
    children: 'Pressed',
  },
  render: Default.render,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: 'Disabled',
  },
  render: Default.render,
};

export const Group: Story = {
  render: (args) => (
    <ToggleButtonGroup>
      <ToggleButton key={`bold-${args.isSelected}`} size={args.size} isDisabled={args.isDisabled} defaultSelected={args.isSelected}>
        Bold
      </ToggleButton>
      <ToggleButton size={args.size} isDisabled={args.isDisabled}>
        Italic
      </ToggleButton>
      <ToggleButton size={args.size} isDisabled={args.isDisabled}>
        Underline
      </ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="story-row story-row--s">
      <ToggleButton key={`sm-${args.isSelected}`} size="sm" isDisabled={args.isDisabled} defaultSelected={args.isSelected}>
        Small
      </ToggleButton>
      <ToggleButton key={`md-${args.isSelected}`} size="md" isDisabled={args.isDisabled} defaultSelected={args.isSelected}>
        Medium
      </ToggleButton>
      <ToggleButton key={`lg-${args.isSelected}`} size="lg" isDisabled={args.isDisabled} defaultSelected={args.isSelected}>
        Large
      </ToggleButton>
    </div>
  ),
};
