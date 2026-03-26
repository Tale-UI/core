import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from '@tale-ui/react/radio-group';
import { Radio } from '@tale-ui/react/radio';

type Args = {
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/RadioGroup',
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
  args: {
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup label="Favorite color" isDisabled={args.isDisabled}>
      <Radio.Root value="red">
        <Radio.Indicator />
        Red
      </Radio.Root>
      <Radio.Root value="green">
        <Radio.Indicator />
        Green
      </Radio.Root>
      <Radio.Root value="blue">
        <Radio.Indicator />
        Blue
      </Radio.Root>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <RadioGroup label="Disabled group" isDisabled={args.isDisabled}>
      <Radio.Root value="red">
        <Radio.Indicator />
        Red
      </Radio.Root>
      <Radio.Root value="green">
        <Radio.Indicator />
        Green
      </Radio.Root>
      <Radio.Root value="blue">
        <Radio.Indicator />
        Blue
      </Radio.Root>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup label="Plan" orientation="horizontal" isDisabled={args.isDisabled}>
      <Radio.Root value="free">
        <Radio.Indicator />
        Free
      </Radio.Root>
      <Radio.Root value="pro">
        <Radio.Indicator />
        Pro
      </Radio.Root>
      <Radio.Root value="enterprise">
        <Radio.Indicator />
        Enterprise
      </Radio.Root>
    </RadioGroup>
  ),
};
