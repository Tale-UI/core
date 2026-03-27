import type { Meta, StoryObj } from '@storybook/react';
import { RatingStars } from '@tale-ui/react/rating-stars';
import { RatingBadge } from '@tale-ui/react/rating-badge';

/* ─── RatingStars ──────────────────────────────────────────────────────────── */

type StarsArgs = {
  value: number;
  max: number;
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<StarsArgs> = {
  title: 'Components/RatingStars',
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
    max: { control: { type: 'number', min: 1, max: 10 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    value: 3.5,
    max: 5,
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<StarsArgs>;

export const Default: Story = {
  render(args) {
    return <RatingStars value={args.value} max={args.max} size={args.size} />;
  },
};

export const HalfStars: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <RatingStars value={0.5} />
        <RatingStars value={1.5} />
        <RatingStars value={2.5} />
        <RatingStars value={3.5} />
        <RatingStars value={4.5} />
      </div>
    );
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <RatingStars value={4} size="sm" />
        <RatingStars value={4} size="md" />
        <RatingStars value={4} size="lg" />
      </div>
    );
  },
};

/* ─── RatingBadge ──────────────────────────────────────────────────────────── */

type BadgeArgs = {
  value: number;
  size: 'sm' | 'md' | 'lg';
};

export const BadgeDefault: StoryObj<BadgeArgs> = {
  name: 'RatingBadge',
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { value: 4.5, size: 'md' },
  render(args) {
    return <RatingBadge value={args.value} size={args.size} />;
  },
};

export const BadgeSizes: StoryObj<BadgeArgs> = {
  name: 'RatingBadge Sizes',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <RatingBadge value={4.5} size="sm" />
        <RatingBadge value={4.5} size="md" />
        <RatingBadge value={4.5} size="lg" />
      </div>
    );
  },
};
