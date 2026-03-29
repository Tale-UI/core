import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from '@tale-ui/react/radio-group';
import { Radio } from '@tale-ui/react/radio';

type Args = {
  isDisabled?: boolean;
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/RadioGroup',
  argTypes: {
    isDisabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    isDisabled: false,
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup label="Favorite color" isDisabled={args.isDisabled} size={args.size}>
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
    <RadioGroup label="Disabled group" isDisabled={args.isDisabled} size={args.size}>
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
    <RadioGroup label="Plan" orientation="horizontal" isDisabled={args.isDisabled} size={args.size}>
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

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div className="story-sections">
        {sizes.map((size) => (
          <div key={size}>
            <div className="story-heading">Size: {size}</div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <RadioGroup label="Default" size={size}>
                <Radio.Root value="a"><Radio.Indicator />Option A</Radio.Root>
                <Radio.Root value="b"><Radio.Indicator />Option B</Radio.Root>
              </RadioGroup>
              <RadioGroup label="Disabled" size={size} isDisabled>
                <Radio.Root value="a"><Radio.Indicator />Option A</Radio.Root>
                <Radio.Root value="b"><Radio.Indicator />Option B</Radio.Root>
              </RadioGroup>
              <RadioGroup label="Horizontal" size={size} orientation="horizontal">
                <Radio.Root value="a"><Radio.Indicator />Option A</Radio.Root>
                <Radio.Root value="b"><Radio.Indicator />Option B</Radio.Root>
              </RadioGroup>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
