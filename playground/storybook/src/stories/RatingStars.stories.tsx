import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg'] as const;
    const values = [0, 1.5, 3, 4.5, 5];
    return (
      <div className="story-sections">
        <div>
          <div className="story-heading">RatingStars</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(5, auto)', gap: '1rem', alignItems: 'center' }}>
            <div />
            {values.map((v) => <div key={v} className="story-label">{v}</div>)}
            {sizes.map((s) => (
              <React.Fragment>
                <div key={`label-${s}`} className="story-label">{s}</div>
                {values.map((v) => <RatingStars key={`${s}-${v}`} value={v} size={s} />)}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">RatingBadge</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {sizes.map((s) => <RatingBadge key={s} value={4.5} size={s} />)}
          </div>
        </div>
      </div>
    );
  },
};
