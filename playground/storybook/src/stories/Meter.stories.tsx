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
    <div className="story-meter">
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
    <div className="story-meter">
      <Meter.Root value={60} minValue={0} maxValue={100}>
        <Meter.Header>
          <Meter.Label>Storage</Meter.Label>
          <Meter.Value>60%</Meter.Value>
        </Meter.Header>
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
    <div className="story-meter story-col story-col--m">
      {[10, 40, 70, 90].map((value) => (
        <Meter.Root key={value} value={value} minValue={0} maxValue={100}>
          <Meter.Header>
            <Meter.Label>Usage</Meter.Label>
            <Meter.Value>{value}%</Meter.Value>
          </Meter.Header>
          <Meter.Track>
            <Meter.Indicator value={value} />
          </Meter.Track>
        </Meter.Root>
      ))}
    </div>
  ),
};
