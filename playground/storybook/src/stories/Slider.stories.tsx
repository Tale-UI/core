import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@tale-ui/react/slider';

type Args = {
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
};

const meta: Meta<Args> = {
  title: 'Form Controls/Slider',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  args: {
    disabled: false,
    orientation: 'horizontal',
    defaultValue: [40],
    min: 0,
    max: 100,
    step: 1,
  },
  render: ({ disabled, orientation, defaultValue, min, max, step }) => (
    <div style={{ width: orientation === 'horizontal' ? '28rem' : '4rem', height: orientation === 'vertical' ? '20rem' : 'auto' }}>
      <Slider.Root
        className="tale-slider"
        disabled={disabled}
        orientation={orientation}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Control className="tale-slider__control">
          <Slider.Track className="tale-slider__track">
            <Slider.Indicator className="tale-slider__indicator" />
            <Slider.Thumb className="tale-slider__thumb" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical', defaultValue: [60] },
};

export const Disabled: Story = { args: { disabled: true } };

export const Range: Story = {
  name: 'Range (Two Thumbs)',
  args: { defaultValue: [20, 80] },
  render: ({ disabled, orientation, defaultValue, min, max, step }) => (
    <div style={{ width: '28rem' }}>
      <Slider.Root
        className="tale-slider"
        disabled={disabled}
        orientation={orientation}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Control className="tale-slider__control">
          <Slider.Track className="tale-slider__track">
            <Slider.Indicator className="tale-slider__indicator" />
            <Slider.Thumb className="tale-slider__thumb" index={0} />
            <Slider.Thumb className="tale-slider__thumb" index={1} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </div>
  ),
};
