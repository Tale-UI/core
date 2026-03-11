import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Meter } from '@tale-ui/react/meter';

type Args = {
  value?: number;
  min?: number;
  max?: number;
};

const meta: Meta<Args> = {
  title: 'Feedback/Meter',
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: {
    value: 65,
    min: 0,
    max: 100,
  },
  render: ({ value = 65, min, max }) => (
    <div style={{ width: '36rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Meter.Label className="tale-meter__label">Disk Usage</Meter.Label>
        <Meter.Value className="tale-meter__value">
          {(formattedValue) => (
            <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>
              {formattedValue}
            </span>
          )}
        </Meter.Value>
      </div>
      <Meter.Root className="tale-meter" value={value} min={min} max={max}>
        <Meter.Track className="tale-meter__track">
          <Meter.Indicator className="tale-meter__indicator" />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const AllStates: Story = {
  name: 'All Values',
  render: () => (
    <div style={{ width: '36rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {[
        { label: '25% — Low', value: 25 },
        { label: '60% — Medium', value: 60 },
        { label: '90% — High', value: 90 },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>{label}</span>
          <Meter.Root className="tale-meter" value={value}>
            <Meter.Track className="tale-meter__track">
              <Meter.Indicator className="tale-meter__indicator" />
            </Meter.Track>
          </Meter.Root>
        </div>
      ))}
    </div>
  ),
};
