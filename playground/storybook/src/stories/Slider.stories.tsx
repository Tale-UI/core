import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@tale-ui/react/slider';

type Args = {
  value?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Slider',
  argTypes: {
    value: { control: 'number' },
    minValue: { control: 'number' },
    maxValue: { control: 'number' },
    step: { control: 'number' },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    isDisabled: { control: 'boolean' },
  },
  args: {
    value: 50,
    minValue: 0,
    maxValue: 100,
    step: 1,
    orientation: 'horizontal',
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '560px', maxWidth: '100%', padding: 'var(--space-m)' }}>
      <Slider.Root
        key={`${args.value}-${args.minValue}-${args.maxValue}-${args.step}-${args.orientation}`}
        defaultValue={args.value}
        minValue={args.minValue}
        maxValue={args.maxValue}
        step={args.step}
        orientation={args.orientation}
        isDisabled={args.isDisabled}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
          <Slider.Label>Volume</Slider.Label>
          <Slider.Output />
        </div>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ width: '560px', maxWidth: '100%', padding: 'var(--space-m)' }}>
      <Slider.Root defaultValue={30}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
          <Slider.Label>Brightness</Slider.Label>
          <Slider.Output />
        </div>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Range: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ width: '560px', maxWidth: '100%', padding: 'var(--space-m)' }}>
      <Slider.Root defaultValue={[20, 80]}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
          <Slider.Label>Price Range</Slider.Label>
          <Slider.Output />
        </div>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Steps: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ width: '560px', maxWidth: '100%', padding: 'var(--space-m)' }}>
      <Slider.Root defaultValue={50} step={10}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
          <Slider.Label>Quality</Slider.Label>
          <Slider.Output />
        </div>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ width: '560px', maxWidth: '100%', padding: 'var(--space-m)' }}>
      <Slider.Root defaultValue={60} isDisabled>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
          <Slider.Label>Disabled Slider</Slider.Label>
          <Slider.Output />
        </div>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ width: '120px', height: '250px', padding: 'var(--space-m)' }}>
      <Slider.Root defaultValue={40} orientation="vertical">
        <Slider.Label>Vertical</Slider.Label>
        <Slider.Output />
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};
