import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '@tale-ui/react/progress-bar';

type Args = {
  value?: number;
  minValue?: number;
  maxValue?: number;
  isIndeterminate?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/ProgressBar',
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    isIndeterminate: { control: 'boolean' },
  },
  args: {
    value: 60,
    isIndeterminate: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div className="story-progress">
      <ProgressBar.Root
        {...(args.isIndeterminate ? { isIndeterminate: true } : { value: args.value })}
        minValue={0}
        maxValue={100}
      >
        <ProgressBar.Track>
          <ProgressBar.Indicator {...(args.isIndeterminate ? {} : { value: args.value })} />
        </ProgressBar.Track>
      </ProgressBar.Root>
    </div>
  ),
};

export const Indeterminate: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress">
      <ProgressBar.Root isIndeterminate minValue={0} maxValue={100}>
        <ProgressBar.Label>Loading...</ProgressBar.Label>
        <ProgressBar.Track>
          <ProgressBar.Indicator />
        </ProgressBar.Track>
      </ProgressBar.Root>
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress">
      <ProgressBar.Root value={60} minValue={0} maxValue={100}>
        <ProgressBar.Header>
          <ProgressBar.Label>Uploading...</ProgressBar.Label>
          <ProgressBar.Value>60%</ProgressBar.Value>
        </ProgressBar.Header>
        <ProgressBar.Track>
          <ProgressBar.Indicator value={60} />
        </ProgressBar.Track>
      </ProgressBar.Root>
    </div>
  ),
};

export const AllValues: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-progress story-col story-col--m">
      {[0, 25, 50, 75, 100].map((value) => (
        <ProgressBar.Root key={value} value={value} minValue={0} maxValue={100}>
          <ProgressBar.Header>
            <ProgressBar.Label>Progress</ProgressBar.Label>
            <ProgressBar.Value>{value}%</ProgressBar.Value>
          </ProgressBar.Header>
          <ProgressBar.Track>
            <ProgressBar.Indicator value={value} />
          </ProgressBar.Track>
        </ProgressBar.Root>
      ))}
    </div>
  ),
};
