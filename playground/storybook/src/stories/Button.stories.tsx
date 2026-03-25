import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Plus, ChevronRight } from 'lucide-react';

type Args = {
  variant: 'primary' | 'neutral' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  children: string;
};

const meta: Meta<Args> = {
  title: 'Components/Button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: 'Button',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Button variant={args.variant} size={args.size} isDisabled={args.disabled}>
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
