import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberField } from '@tale-ui/react-styled/number-field';

type Args = {
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
};

const meta: Meta<Args> = {
  title: 'Form Controls/NumberField',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    defaultValue: { control: 'number' },
  },
  args: {
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
  },
  render: ({ disabled, min, max, step, defaultValue }) => (
    <NumberField.Root
     
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
    >
      <NumberField.Group>
        <NumberField.Decrement>−</NumberField.Decrement>
        <NumberField.Input />
        <NumberField.Increment>+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithBounds: Story = {
  name: 'With Min/Max',
  args: { min: 1, max: 10, defaultValue: 5 },
};

export const WithStep: Story = {
  name: 'Step = 5',
  args: { step: 5, min: 0, max: 100, defaultValue: 25 },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 42 } };
