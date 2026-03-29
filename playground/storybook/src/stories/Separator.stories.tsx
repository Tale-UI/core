import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@tale-ui/react/separator';

type Args = {
  orientation?: 'horizontal' | 'vertical';
};

const meta: Meta<Args> = {
  title: 'Components/Separator',
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div
      style={{
        width: args.orientation === 'vertical' ? undefined : '300px',
        height: args.orientation === 'vertical' ? '200px' : undefined,
        display: args.orientation === 'vertical' ? 'flex' : undefined,
        alignItems: args.orientation === 'vertical' ? 'center' : undefined,
        justifyContent: args.orientation === 'vertical' ? 'center' : undefined,
      }}
    >
      <Separator orientation={args.orientation} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="story-separator-vertical">
      <div className="story-separator-vertical-inner">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
};

export const InContent: Story = {
  render: () => (
    <div className="story-separator-content">
      <p className="story-separator-text">
        This is the first block of content above the separator.
      </p>
      <Separator />
      <p className="story-separator-text">
        This is the second block of content below the separator.
      </p>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: 300 }}>
          <div className="story-label">Horizontal</div>
          <Separator orientation="horizontal" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
          <div className="story-label">Vertical</div>
          <div style={{ height: 100, display: 'flex', alignItems: 'center' }}>
            <Separator orientation="vertical" />
          </div>
        </div>
      </div>
    );
  },
};
