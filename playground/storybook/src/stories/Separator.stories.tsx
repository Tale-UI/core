import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@tale-ui/react/separator';

type Args = {
  orientation?: 'horizontal' | 'vertical';
};

const meta: Meta<Args> = {
  title: 'Layout/Separator',
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  args: {
    orientation: 'horizontal',
  },
  render: (args) =>
    args.orientation === 'vertical' ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem', height: '4rem' }}>
        <span style={{ color: 'var(--neutral-70)', fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)' }}>Left</span>
        <Separator className="tale-separator tale-separator--vertical" />
        <span style={{ color: 'var(--neutral-70)', fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)' }}>Right</span>
      </div>
    ) : (
      <div style={{ width: '32rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <p style={{ margin: 0, color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Content above</p>
        <Separator className="tale-separator" />
        <p style={{ margin: 0, color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Content below</p>
      </div>
    ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};
