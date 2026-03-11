import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@tale-ui/react/toggle';
import { ToggleGroup } from '@tale-ui/react/toggle-group';

type Args = {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  defaultPressed?: boolean;
};

const meta: Meta<Args> = {
  title: 'Form Controls/Toggle',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    defaultPressed: { control: 'boolean' },
  },
  args: {
    size: 'md',
    disabled: false,
    defaultPressed: false,
  },
  render: ({ size = 'md', disabled, defaultPressed }) => (
    <Toggle
      className={`tale-toggle tale-toggle--${size}`}
      disabled={disabled}
      defaultPressed={defaultPressed}
    >
      Bold
    </Toggle>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Pressed: Story = { args: { defaultPressed: true } };

export const Disabled: Story = { args: { disabled: true } };

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Toggle key={size} className={`tale-toggle tale-toggle--${size}`}>
          {size.toUpperCase()}
        </Toggle>
      ))}
    </div>
  ),
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
      <Toggle className="tale-toggle tale-toggle--md">Unpressed</Toggle>
      <Toggle className="tale-toggle tale-toggle--md" defaultPressed>Pressed</Toggle>
      <Toggle className="tale-toggle tale-toggle--md" disabled>Disabled</Toggle>
    </div>
  ),
};

export const Group: Story = {
  name: 'Toggle Group',
  render: () => (
    <ToggleGroup className="tale-toggle-group" multiple>
      <Toggle className="tale-toggle" value="bold">B</Toggle>
      <Toggle className="tale-toggle" value="italic">I</Toggle>
      <Toggle className="tale-toggle" value="underline">U</Toggle>
    </ToggleGroup>
  ),
};
