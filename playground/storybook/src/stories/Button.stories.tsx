import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@tale-ui/react/button';

type Args = {
  variant?: 'primary' | 'neutral' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  disabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'neutral', 'ghost', 'danger'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  render: ({ variant = 'primary', size = 'md', ...args }) => (
    <Button variant={variant} size={size} {...args} />
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Neutral: Story = { args: { variant: 'neutral' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger' } };

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
      {(['primary', 'neutral', 'ghost', 'danger'] as const).map((v) => (
        <Button key={v} variant={v}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Button key={s} variant="primary" size={s}>
          {s.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
};
