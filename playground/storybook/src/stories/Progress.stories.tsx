import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '@tale-ui/react/progress';

type Args = {
  value?: number | null;
  max?: number;
};

const meta: Meta<Args> = {
  title: 'Feedback/Progress',
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: {
    value: 60,
    max: 100,
  },
  render: ({ value, max }) => (
    <div style={{ width: '36rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Progress</span>
        <Progress.Value className="tale-progress__value">
          {(formattedValue) => (
            <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>
              {formattedValue ?? '—'}
            </span>
          )}
        </Progress.Value>
      </div>
      <Progress.Root className="tale-progress" value={value ?? null} max={max}>
        <Progress.Track className="tale-progress__track">
          <Progress.Indicator className="tale-progress__indicator" />
        </Progress.Track>
      </Progress.Root>
    </div>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = { args: { value: 60 } };

export const Low: Story = { args: { value: 20 } };

export const Complete: Story = { args: { value: 100 } };

export const Indeterminate: Story = {
  args: { value: null },
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ width: '36rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {[
        { label: '20% — Low', value: 20 },
        { label: '60% — Mid', value: 60 },
        { label: '100% — Complete', value: 100 },
        { label: 'Indeterminate', value: null },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>{label}</span>
          <Progress.Root className="tale-progress" value={value}>
            <Progress.Track className="tale-progress__track">
              <Progress.Indicator className="tale-progress__indicator" />
            </Progress.Track>
          </Progress.Root>
        </div>
      ))}
    </div>
  ),
};
