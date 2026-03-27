import type { Meta, StoryObj } from '@storybook/react';
import { FeaturedIcon } from '@tale-ui/react/featured-icon';
import { Icon } from '@tale-ui/react/icon';
import { Star, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type Args = {
  variant: 'brand' | 'error' | 'warning' | 'success' | 'neutral';
  shape: 'circle' | 'square';
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/FeaturedIcon',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['brand', 'error', 'warning', 'success', 'neutral'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    variant: 'brand',
    shape: 'circle',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <FeaturedIcon variant={args.variant} shape={args.shape} size={args.size}>
        <Icon icon={Star} />
      </FeaturedIcon>
    );
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <FeaturedIcon variant="brand"><Icon icon={Star} /></FeaturedIcon>
        <FeaturedIcon variant="error"><Icon icon={AlertCircle} /></FeaturedIcon>
        <FeaturedIcon variant="warning"><Icon icon={AlertTriangle} /></FeaturedIcon>
        <FeaturedIcon variant="success"><Icon icon={CheckCircle} /></FeaturedIcon>
        <FeaturedIcon variant="neutral"><Icon icon={Info} /></FeaturedIcon>
      </div>
    );
  },
};

export const Shapes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <FeaturedIcon variant="brand" shape="circle"><Icon icon={Star} /></FeaturedIcon>
        <FeaturedIcon variant="brand" shape="square"><Icon icon={Star} /></FeaturedIcon>
      </div>
    );
  },
};
