import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@tale-ui/react/radio';

type Args = {
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Radio',
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
    <Radio.Group label="Favorite color" isDisabled={args.isDisabled}>
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
    </Radio.Group>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <Radio.Group label="Disabled group" isDisabled={args.isDisabled}>
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
    </Radio.Group>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <Radio.Group label="Plan" orientation="horizontal" isDisabled={args.isDisabled}>
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
    </Radio.Group>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-l)' }}>
      <Radio.Group label="Small radios">
        <Radio.Root value="a" size="sm">
          <Radio.Indicator />
          Small option A
        </Radio.Root>
        <Radio.Root value="b" size="sm">
          <Radio.Indicator />
          Small option B
        </Radio.Root>
      </Radio.Group>

      <Radio.Group label="Medium radios">
        <Radio.Root value="a" size="md">
          <Radio.Indicator />
          Medium option A
        </Radio.Root>
        <Radio.Root value="b" size="md">
          <Radio.Indicator />
          Medium option B
        </Radio.Root>
      </Radio.Group>

      <Radio.Group label="Large radios">
        <Radio.Root value="a" size="lg">
          <Radio.Indicator />
          Large option A
        </Radio.Root>
        <Radio.Root value="b" size="lg">
          <Radio.Indicator />
          Large option B
        </Radio.Root>
      </Radio.Group>
    </div>
  ),
};
