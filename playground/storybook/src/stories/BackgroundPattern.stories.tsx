import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackgroundPattern } from '@tale-ui/react/background-pattern';

type Args = {
  pattern: 'circle' | 'square' | 'grid' | 'grid-check';
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/BackgroundPattern',
  parameters: { layout: 'centered' },
  argTypes: {
    pattern: { control: 'select', options: ['circle', 'square', 'grid', 'grid-check'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { pattern: 'circle', size: 'lg' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <BackgroundPattern pattern={args.pattern} size={args.size as any} />;
  },
};

export const AllPatterns: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <p className="story-label">circle (lg)</p>
          <BackgroundPattern pattern="circle" size="lg" />
        </div>
        <div>
          <p className="story-label">square (lg)</p>
          <BackgroundPattern pattern="square" size="lg" />
        </div>
        <div>
          <p className="story-label">grid (lg)</p>
          <BackgroundPattern pattern="grid" size="lg" />
        </div>
        <div>
          <p className="story-label">grid-check (md)</p>
          <BackgroundPattern pattern="grid-check" size="md" />
        </div>
      </div>
    );
  },
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        <div>
          <p className="story-label">sm</p>
          <BackgroundPattern pattern="grid" size="sm" />
        </div>
        <div>
          <p className="story-label">md</p>
          <BackgroundPattern pattern="grid" size="md" />
        </div>
        <div>
          <p className="story-label">lg</p>
          <BackgroundPattern pattern="grid" size="lg" />
        </div>
      </div>
    );
  },
};

export const CustomColor: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <p className="story-label">default (--neutral-20)</p>
          <BackgroundPattern pattern="circle" size="md" />
        </div>
        <div>
          <p className="story-label">brand (--color-30)</p>
          <BackgroundPattern pattern="circle" size="md" style={{ color: 'var(--color-30)' }} />
        </div>
      </div>
    );
  },
};

export const AsBackground: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ position: 'relative', width: '400px', height: '300px', overflow: 'hidden', borderRadius: '1rem', border: '1px solid var(--neutral-20)' }}>
        <BackgroundPattern
          pattern="grid"
          size="lg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
          <h3 style={{ margin: 0 }}>Content on top</h3>
          <p>The grid pattern sits behind this text.</p>
        </div>
      </div>
    );
  },
};
