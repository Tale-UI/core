import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@tale-ui/react/avatar';

type Args = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const meta: Meta<Args> = {
  title: 'Components/Avatar',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
  args: {
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Avatar.Root size={args.size}>
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)' }}>
      <Avatar.Root size="sm">
        <Avatar.Fallback>SM</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="md">
        <Avatar.Fallback>MD</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="lg">
        <Avatar.Fallback>LG</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Fallback>XL</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};

export const WithImage: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    // In practice, set src on Avatar.Image to display a real avatar photo.
    // The Fallback content is shown when no image src is provided or the image fails to load.
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)' }}>
      <Avatar.Root size="lg">
        <Avatar.Image src="" alt="User avatar" />
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="lg">
        <Avatar.Fallback>CD</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};
