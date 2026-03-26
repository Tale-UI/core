import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '@tale-ui/react/spinner';

type Args = {
  variant: 'circle' | 'line' | 'dots';
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/Spinner',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['circle', 'line', 'dots'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    variant: 'circle',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <Spinner variant={args.variant} size={args.size} />;
  },
};

export const Variants: Story = {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.4rem' }}>
        <Spinner variant="circle" />
        <Spinner variant="dots" />
        <div style={{ width: 200 }}>
          <Spinner variant="line" />
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.4rem' }}>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    );
  },
};

export const DotsSizes: Story = {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.4rem' }}>
        <Spinner variant="dots" size="sm" />
        <Spinner variant="dots" size="md" />
        <Spinner variant="dots" size="lg" />
      </div>
    );
  },
};
