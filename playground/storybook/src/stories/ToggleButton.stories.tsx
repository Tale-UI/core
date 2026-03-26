import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';

type Args = {
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  defaultSelected?: boolean;
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
    defaultSelected: { control: 'boolean' },
  },
  args: {
    size: 'md',
    isDisabled: false,
    defaultSelected: false,
    children: 'Toggle me',
  },
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <ToggleButton key={String(args.defaultSelected)} size={args.size} isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
      {args.children}
    </ToggleButton>
  ),
};

export const Pressed: Story = {
  args: {
    defaultSelected: true,
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
    <ToggleButtonGroup aria-label="Text formatting">
      <ToggleButton key={`bold-${args.defaultSelected}`} size={args.size} isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
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
      <ToggleButton key={`sm-${args.defaultSelected}`} size="sm" isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
        Small
      </ToggleButton>
      <ToggleButton key={`md-${args.defaultSelected}`} size="md" isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
        Medium
      </ToggleButton>
      <ToggleButton key={`lg-${args.defaultSelected}`} size="lg" isDisabled={args.isDisabled} defaultSelected={args.defaultSelected}>
        Large
      </ToggleButton>
    </div>
  ),
};
