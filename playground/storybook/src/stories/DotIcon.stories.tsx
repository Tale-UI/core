import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotIcon } from '@tale-ui/react/dot-icon';

type Args = {
  color: 'neutral' | 'brand' | 'error' | 'warning' | 'success';
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/DotIcon',
  parameters: { layout: 'centered' },
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'brand', 'error', 'warning', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    color: 'neutral',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <DotIcon color={args.color} size={args.size} />;
  },
};

export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <DotIcon color="neutral" />
        <DotIcon color="brand" />
        <DotIcon color="error" />
        <DotIcon color="warning" />
        <DotIcon color="success" />
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const colors = ['neutral', 'brand', 'error', 'warning', 'success'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, auto)', gap: '1.2rem', alignItems: 'center' }}>
        <div />
        {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
        {colors.map((c) => (
          <React.Fragment>
            <div key={`label-${c}`} className="story-label">{c}</div>
            {sizes.map((s) => <DotIcon key={`${c}-${s}`} color={c} size={s} />)}
          </React.Fragment>
        ))}
      </div>
    );
  },
};
