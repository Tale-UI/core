import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@tale-ui/react/switch';

type Args = {
  disabled?: boolean;
  defaultChecked?: boolean;
};

const meta: Meta<Args> = {
  title: 'Form Controls/Switch',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  args: {
    disabled: false,
    defaultChecked: false,
  },
  render: ({ disabled, defaultChecked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
      <Switch.Root className="tale-switch" disabled={disabled} defaultChecked={defaultChecked}>
        <Switch.Thumb className="tale-switch__thumb" />
      </Switch.Root>
      <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
        Enable notifications
      </span>
    </div>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Off: Story = { name: 'Off (Default)' };

export const On: Story = {
  name: 'On',
  args: { defaultChecked: true },
};

export const Disabled: Story = { args: { disabled: true } };

export const DisabledOn: Story = {
  name: 'Disabled + On',
  args: { disabled: true, defaultChecked: true },
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      {[
        { label: 'Off', checked: false },
        { label: 'On', checked: true },
        { label: 'Disabled (Off)', checked: false, disabled: true },
        { label: 'Disabled (On)', checked: true, disabled: true },
      ].map(({ label, checked, disabled }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <Switch.Root className="tale-switch" defaultChecked={checked} disabled={disabled}>
            <Switch.Thumb className="tale-switch__thumb" />
          </Switch.Root>
          <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  ),
};
