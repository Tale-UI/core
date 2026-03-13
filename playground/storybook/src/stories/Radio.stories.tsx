import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@tale-ui/react/radio';

type Args = {
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Form Controls/Radio',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    disabled: false,
    size: 'md',
  },
  render: ({ disabled, size }) => (
    <Radio.Group defaultValue="option-a" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {['Option A', 'Option B', 'Option C'].map((label, i) => {
        const value = `option-${String.fromCharCode(97 + i)}`;
        return (
          <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Radio.Root size={size} value={value} disabled={disabled}>
              <Radio.Indicator />
            </Radio.Root>
            <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
              {label}
            </span>
          </div>
        );
      })}
    </Radio.Group>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Radio.Root value="unchecked">
          <Radio.Indicator />
        </Radio.Root>
        <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Unchecked</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Radio.Group value="checked">
          <Radio.Root value="checked">
            <Radio.Indicator />
          </Radio.Root>
        </Radio.Group>
        <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Checked</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Radio.Root value="disabled" disabled>
          <Radio.Indicator />
        </Radio.Root>
        <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Disabled</span>
      </div>
    </div>
  ),
};

export const WithGroup: Story = {
  name: 'Radio Group',
  render: () => (
    <Radio.Group defaultValue="b" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {['Small', 'Medium', 'Large'].map((size, i) => {
        const value = ['sm', 'md', 'lg'][i];
        return (
          <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Radio.Root value={value}>
              <Radio.Indicator />
            </Radio.Root>
            <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
              {size}
            </span>
          </div>
        );
      })}
    </Radio.Group>
  ),
};
