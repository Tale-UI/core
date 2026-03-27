import type { Meta, StoryObj } from '@storybook/react';
import { DotIcon } from '@tale-ui/react/dot-icon';

type Args = {
  color: 'neutral' | 'brand' | 'error' | 'warning' | 'success';
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/DotIcon',
  parameters: { layout: 'centered' },
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'brand', 'error', 'warning', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    color: 'neutral',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <DotIcon color={args.color} size={args.size} />;
  },
};

export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <DotIcon color="neutral" />
        <DotIcon color="brand" />
        <DotIcon color="error" />
        <DotIcon color="warning" />
        <DotIcon color="success" />
      </div>
    );
  },
};
