import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@tale-ui/react/radio';
import { RadioGroup } from '@tale-ui/react/radio-group';

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
    <RadioGroup defaultValue="option-a" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {['Option A', 'Option B', 'Option C'].map((label, i) => {
        const value = `option-${String.fromCharCode(97 + i)}`;
        return (
          <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Radio.Root className={`tale-radio${size !== 'md' ? ` tale-radio--${size}` : ''}`} value={value} disabled={disabled}>
              <Radio.Indicator className="tale-radio__indicator" />
            </Radio.Root>
            <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
              {label}
            </span>
          </div>
        );
      })}
    </RadioGroup>
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
        <Radio.Root className="tale-radio" value="unchecked">
          <Radio.Indicator className="tale-radio__indicator" />
        </Radio.Root>
        <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Unchecked</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <RadioGroup value="checked">
          <Radio.Root className="tale-radio" value="checked">
            <Radio.Indicator className="tale-radio__indicator" />
          </Radio.Root>
        </RadioGroup>
        <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Checked</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Radio.Root className="tale-radio" value="disabled" disabled>
          <Radio.Indicator className="tale-radio__indicator" />
        </Radio.Root>
        <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Disabled</span>
      </div>
    </div>
  ),
};

export const WithGroup: Story = {
  name: 'Radio Group',
  render: () => (
    <RadioGroup defaultValue="b" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {['Small', 'Medium', 'Large'].map((size, i) => {
        const value = ['sm', 'md', 'lg'][i];
        return (
          <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Radio.Root className="tale-radio" value={value}>
              <Radio.Indicator className="tale-radio__indicator" />
            </Radio.Root>
            <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>
              {size}
            </span>
          </div>
        );
      })}
    </RadioGroup>
  ),
};
