import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@tale-ui/react/badge';

type Args = {
  variant: 'neutral' | 'brand' | 'error' | 'warning' | 'success'
    | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
    | 'teal' | 'cyan' | 'sky' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
    | 'pink' | 'rose';
  size: 'sm' | 'md' | 'lg';
  type: 'pill' | 'rounded';
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
    type: {
      control: 'select',
      options: ['pill', 'rounded'],
    },
  },
  args: {
    variant: 'neutral',
    size: 'md',
    type: 'pill',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <Badge variant={args.variant} size={args.size} type={args.type}>Badge</Badge>;
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

export const AllTypes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Badge variant="neutral" type="pill">Neutral Pill</Badge>
        <Badge variant="neutral" type="rounded">Neutral Rounded</Badge>
        <Badge variant="brand" type="pill">Brand Pill</Badge>
        <Badge variant="brand" type="rounded">Brand Rounded</Badge>
      </div>
    );
  },
};

export const DeprecatedModernType: StoryObj = {
  parameters: { controls: { disable: true } },
  render() {
    return <Badge type="modern">Modern (deprecated)</Badge>;
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['neutral', 'brand', 'error', 'warning', 'success', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    const types = ['pill', 'rounded'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
        {types.map((t) => (
          <div key={t}>
            <div className="story-heading">Type: {t}</div>
            <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${sizes.length}, auto)`, gap: '0.4rem 0.8rem', alignItems: 'center' }}>
              <div />
              {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
              {variants.map((v) => (
                <React.Fragment>
                  <div key={`label-${v}`} className="story-label">{v}</div>
                  {sizes.map((s) => <Badge key={`${v}-${s}`} variant={v} size={s} type={t}>{v}</Badge>)}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
