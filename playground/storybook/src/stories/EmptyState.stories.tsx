import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '@tale-ui/react/empty-state';
import { Button } from '@tale-ui/react/button';

type Args = {
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/EmptyState',
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <EmptyState.Root size={args.size}>
        <EmptyState.Title>No items</EmptyState.Title>
        <EmptyState.Description>Nothing here yet.</EmptyState.Description>
      </EmptyState.Root>
    );
  },
};

export const WithActions: Story = {
  render(args) {
    return (
      <EmptyState.Root size={args.size}>
        <EmptyState.Title>No projects</EmptyState.Title>
        <EmptyState.Description>
          Get started by creating your first project.
        </EmptyState.Description>
        <EmptyState.Actions>
          <Button variant="primary">Create project</Button>
          <Button variant="ghost">Learn more</Button>
        </EmptyState.Actions>
      </EmptyState.Root>
    );
  },
};

export const Small: Story = {
  render() {
    return (
      <EmptyState.Root size="sm">
        <EmptyState.Title>No results</EmptyState.Title>
        <EmptyState.Description>Try adjusting your filters.</EmptyState.Description>
      </EmptyState.Root>
    );
  },
};

export const Large: Story = {
  render() {
    return (
      <EmptyState.Root size="lg">
        <EmptyState.Title>Welcome</EmptyState.Title>
        <EmptyState.Description>
          Your dashboard is empty. Start by adding some widgets.
        </EmptyState.Description>
        <EmptyState.Actions>
          <Button variant="primary">Add widget</Button>
        </EmptyState.Actions>
      </EmptyState.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {sizes.map((size) => (
          <EmptyState.Root key={size} size={size}>
            <EmptyState.Title>No items ({size})</EmptyState.Title>
            <EmptyState.Description>
              This is the {size} empty state with actions.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="primary">Create</Button>
              <Button variant="ghost">Learn more</Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ))}
      </div>
    );
  },
};
