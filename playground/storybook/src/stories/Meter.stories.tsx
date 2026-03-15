import type { Meta, StoryObj } from '@storybook/react';
import { Meter } from '@tale-ui/react/meter';

type Args = {
  value?: number;
  minValue?: number;
  maxValue?: number;
};

const meta: Meta<Args> = {
  title: 'Components/Meter',
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    minValue: { control: 'number' },
    maxValue: { control: 'number' },
  },
  args: {
    value: 60,
    minValue: 0,
    maxValue: 100,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Meter.Root value={args.value} minValue={args.minValue} maxValue={args.maxValue}>
        <Meter.Track>
          <Meter.Indicator value={args.value} />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ width: '300px' }}>
      <Meter.Root value={60} minValue={0} maxValue={100}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
          <Meter.Label>Storage</Meter.Label>
          <Meter.Value>60%</Meter.Value>
        </div>
        <Meter.Track>
          <Meter.Indicator value={60} />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const AllValues: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)', width: '300px' }}>
      {[10, 40, 70, 90].map((value) => (
        <Meter.Root key={value} value={value} minValue={0} maxValue={100}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
            <Meter.Label>Usage</Meter.Label>
            <Meter.Value>{value}%</Meter.Value>
          </div>
          <Meter.Track>
            <Meter.Indicator value={value} />
          </Meter.Track>
        </Meter.Root>
      ))}
    </div>
  ),
};
