import { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@tale-ui/react/button';
import type { ButtonProps } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Plus, ChevronRight } from 'lucide-react';

type Args = {
  variant: 'primary' | 'neutral' | 'ghost' | 'danger' | 'inverse';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  pending: boolean;
  children: string;
};

const meta: Meta<Args> = {
  title: 'Components/Button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'ghost', 'danger', 'inverse'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    pending: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    pending: false,
    children: 'Button',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Button variant={args.variant} size={args.size} isDisabled={args.disabled} isPending={args.pending}>
      {args.children}
    </Button>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--s">
      <Button variant="primary">Primary</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="inverse">Inverse</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--s">
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--s">
      <Button variant="primary" isDisabled>Primary</Button>
      <Button variant="neutral" isDisabled>Neutral</Button>
      <Button variant="ghost" isDisabled>Ghost</Button>
      <Button variant="danger" isDisabled>Danger</Button>
      <Button variant="inverse" isDisabled>Inverse</Button>
    </div>
  ),
};

export const Pending: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--s">
      <Button variant="primary" isPending>Primary</Button>
      <Button variant="neutral" isPending>Neutral</Button>
      <Button variant="ghost" isPending>Ghost</Button>
      <Button variant="danger" isPending>Danger</Button>
      <Button variant="inverse" isPending>Inverse</Button>
    </div>
  ),
};

function SimulatedAsyncButton({ children, ...props }: ButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const handlePress = useCallback(() => {
    setIsPending(true);
    setTimeout(() => setIsPending(false), 3000);
  }, []);
  return (
    <Button {...props} isPending={isPending} onPress={handlePress}>
      {children}
    </Button>
  );
}

export const SimulatedAsync: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--s">
      <SimulatedAsyncButton variant="primary">Save</SimulatedAsyncButton>
      <SimulatedAsyncButton variant="neutral">Upload</SimulatedAsyncButton>
      <SimulatedAsyncButton variant="ghost">Refresh</SimulatedAsyncButton>
      <SimulatedAsyncButton variant="danger">Delete</SimulatedAsyncButton>
      <SimulatedAsyncButton variant="inverse">Submit</SimulatedAsyncButton>
    </div>
  ),
};

export const WithIcon: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--s">
      <Button variant="primary">
        <Icon icon={Plus} size="sm" />
        Add Item
      </Button>
      <Button variant="neutral">
        Next
        <Icon icon={ChevronRight} size="sm" />
      </Button>
    </div>
  ),
};
