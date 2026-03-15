import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@tale-ui/react/separator';

type Args = {
  orientation?: 'horizontal' | 'vertical';
};

const meta: Meta<Args> = {
  title: 'Components/Separator',
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div
      style={{
        width: args.orientation === 'vertical' ? undefined : '300px',
        height: args.orientation === 'vertical' ? '200px' : undefined,
        display: args.orientation === 'vertical' ? 'flex' : undefined,
        alignItems: args.orientation === 'vertical' ? 'center' : undefined,
        justifyContent: args.orientation === 'vertical' ? 'center' : undefined,
      }}
    >
      <Separator orientation={args.orientation} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '200px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 'var(--space-m)' }}>
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
};

export const InContent: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <p style={{ margin: 0, padding: 'var(--space-s) 0' }}>
        This is the first block of content above the separator.
      </p>
      <Separator />
      <p style={{ margin: 0, padding: 'var(--space-s) 0' }}>
        This is the second block of content below the separator.
      </p>
    </div>
  ),
};
