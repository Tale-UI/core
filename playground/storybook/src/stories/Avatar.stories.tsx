import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@tale-ui/react/avatar';

type Args = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  fallback?: string;
};

const meta: Meta<Args> = {
  title: 'Display/Avatar',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg', 'xl'] },
    src: { control: 'text' },
    fallback: { control: 'text' },
  },
  args: {
    size: 'md',
    src: 'https://avatars.githubusercontent.com/u/1',
    fallback: 'AB',
  },
  render: ({ size = 'md', src, fallback }) => (
    <Avatar.Root size={size}>
      <Avatar.Image src={src} alt="User avatar" />
      <Avatar.Fallback>{fallback}</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const WithImage: Story = { name: 'With Image' };

export const Fallback: Story = {
  name: 'Fallback (No Image)',
  args: { src: undefined },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar.Root key={size} size={size}>
          <Avatar.Image src={undefined} alt="" />
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  ),
};

export const Group: Story = {
  name: 'Avatar Group',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {['AB', 'CD', 'EF', 'GH'].map((initials, i) => (
        <Avatar.Root
          key={initials}
          size="md"
          style={{ marginLeft: i === 0 ? 0 : '-0.8rem', boxShadow: '0 0 0 2px var(--neutral-10)', zIndex: 4 - i }}
        >
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  ),
};
