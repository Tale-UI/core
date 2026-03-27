import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@tale-ui/react/badge';

type Args = {
  variant: 'neutral' | 'brand' | 'error' | 'warning' | 'success'
    | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
    | 'teal' | 'cyan' | 'sky' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
    | 'pink' | 'rose';
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/Badge',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'error', 'warning', 'success', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    variant: 'neutral',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <Badge variant={args.variant} size={args.size}>Badge</Badge>;
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="brand">Brand</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="success">Success</Badge>
      </div>
    );
  },
};

export const NamedColors: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
        <Badge variant="red">Red</Badge>
        <Badge variant="orange">Orange</Badge>
        <Badge variant="amber">Amber</Badge>
        <Badge variant="yellow">Yellow</Badge>
        <Badge variant="lime">Lime</Badge>
        <Badge variant="green">Green</Badge>
        <Badge variant="emerald">Emerald</Badge>
        <Badge variant="teal">Teal</Badge>
        <Badge variant="cyan">Cyan</Badge>
        <Badge variant="sky">Sky</Badge>
        <Badge variant="indigo">Indigo</Badge>
        <Badge variant="violet">Violet</Badge>
        <Badge variant="purple">Purple</Badge>
        <Badge variant="fuchsia">Fuchsia</Badge>
        <Badge variant="pink">Pink</Badge>
        <Badge variant="rose">Rose</Badge>
      </div>
    );
  },
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    );
  },
};
