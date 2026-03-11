import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@tale-ui/react/checkbox';

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="6" x2="10" y2="6" />
  </svg>
);

type Args = {
  disabled?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  readOnly?: boolean;
};

const meta: Meta<Args> = {
  title: 'Form Controls/Checkbox',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  args: {
    disabled: false,
    defaultChecked: false,
    indeterminate: false,
    readOnly: false,
  },
  render: ({ disabled, defaultChecked, indeterminate, readOnly }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Checkbox.Root
        className="tale-checkbox"
        disabled={disabled}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        readOnly={readOnly}
      >
        <Checkbox.Indicator className="tale-checkbox__indicator">
          {indeterminate ? <MinusIcon /> : <CheckIcon />}
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
        Accept terms and conditions
      </span>
    </div>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = {
  name: 'Disabled + Checked',
  args: { disabled: true, defaultChecked: true },
};

export const Indeterminate: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Checkbox.Root className="tale-checkbox" indeterminate>
        <Checkbox.Indicator className="tale-checkbox__indicator">
          <MinusIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
        Indeterminate
      </span>
    </div>
  ),
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {[
        { label: 'Unchecked', checked: false },
        { label: 'Checked', checked: true },
        { label: 'Disabled', checked: false, disabled: true },
        { label: 'Disabled + Checked', checked: true, disabled: true },
      ].map(({ label, checked, disabled }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Checkbox.Root className="tale-checkbox" defaultChecked={checked} disabled={disabled}>
            <Checkbox.Indicator className="tale-checkbox__indicator">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  ),
};
