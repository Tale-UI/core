import { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@tale-ui/react/button';
import type { ButtonProps } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Plus, ChevronRight } from 'lucide-react';

type Args = {
  variant: 'primary' | 'neutral' | 'ghost' | 'danger' | 'danger-neutral' | 'danger-ghost' | 'inverse';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  pending: boolean;
  showTextWhileLoading: boolean;
  children: string;
};

const meta: Meta<Args> = {
  title: 'Components/Button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'ghost', 'danger', 'danger-neutral', 'danger-ghost', 'inverse'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    pending: { control: 'boolean' },
    showTextWhileLoading: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    pending: false,
    showTextWhileLoading: false,
    children: 'Button',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Button variant={args.variant} size={args.size} isDisabled={args.disabled} isPending={args.pending} showTextWhileLoading={args.showTextWhileLoading}>
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
      <Button variant="danger-neutral">Danger Neutral</Button>
      <Button variant="danger-ghost">Danger Ghost</Button>
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
      <Button variant="danger-neutral" isDisabled>Danger Neutral</Button>
      <Button variant="danger-ghost" isDisabled>Danger Ghost</Button>
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
      <Button variant="danger-neutral" isPending>Danger Neutral</Button>
      <Button variant="danger-ghost" isPending>Danger Ghost</Button>
      <Button variant="inverse" isPending>Inverse</Button>
    </div>
  ),
};

export const PendingWithText: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--s">
      <Button variant="primary" isPending showTextWhileLoading>Saving…</Button>
      <Button variant="neutral" isPending showTextWhileLoading>Loading</Button>
      <Button variant="danger" isPending showTextWhileLoading>Deleting…</Button>
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

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['primary', 'neutral', 'ghost', 'danger', 'danger-neutral', 'danger-ghost', 'inverse'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div className="story-sections">
        <div>
          <div className="story-heading">Default</div>
          <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${sizes.length}, auto)`, gap: '0.8rem', alignItems: 'center' }}>
            <div />
            {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
            {variants.map((v) => (
              <>
                <div key={`label-${v}`} className="story-label">{v}</div>
                {sizes.map((s) => <Button key={`${v}-${s}`} variant={v} size={s}>{v}</Button>)}
              </>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">Disabled</div>
          <div className="story-row story-row--s">
            {variants.map((v) => <Button key={v} variant={v} isDisabled>{v}</Button>)}
          </div>
        </div>
        <div>
          <div className="story-heading">Pending</div>
          <div className="story-row story-row--s">
            {variants.map((v) => <Button key={v} variant={v} isPending>{v}</Button>)}
          </div>
        </div>
        <div>
          <div className="story-heading">Pending with text</div>
          <div className="story-row story-row--s">
            {variants.map((v) => <Button key={v} variant={v} isPending showTextWhileLoading>{v}</Button>)}
          </div>
        </div>
      </div>
    );
  },
};
