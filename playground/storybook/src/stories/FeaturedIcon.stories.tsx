import type { Meta, StoryObj } from '@storybook/react';
import { FeaturedIcon } from '@tale-ui/react/featured-icon';
import { Icon } from '@tale-ui/react/icon';
import { Star, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type Args = {
  variant: 'brand' | 'error' | 'warning' | 'success' | 'neutral';
  shape: 'circle' | 'square';
  size: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'light' | 'gradient' | 'dark' | 'outline' | 'modern' | 'modern-neue';
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
      options: ['sm', 'md', 'lg', 'xl'],
    },
    theme: {
      control: 'select',
      options: ['light', 'gradient', 'dark', 'outline', 'modern', 'modern-neue'],
    },
  },
  args: {
    variant: 'brand',
    shape: 'circle',
    size: 'md',
    theme: 'light',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <FeaturedIcon variant={args.variant} shape={args.shape} size={args.size} theme={args.theme}>
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

export const AllThemes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
        <FeaturedIcon variant="brand" theme="light"><Icon icon={Star} /></FeaturedIcon>
        <FeaturedIcon variant="brand" theme="gradient"><Icon icon={Star} /></FeaturedIcon>
        <FeaturedIcon variant="brand" theme="dark"><Icon icon={Star} /></FeaturedIcon>
        <FeaturedIcon variant="brand" theme="outline"><Icon icon={Star} /></FeaturedIcon>
        <FeaturedIcon variant="brand" theme="modern"><Icon icon={Star} /></FeaturedIcon>
        <FeaturedIcon variant="brand" theme="modern-neue"><Icon icon={Star} /></FeaturedIcon>
      </div>
    );
  },
};

export const ThemeVariantGrid: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const themes = ['light', 'gradient', 'dark', 'outline', 'modern', 'modern-neue'] as const;
    const variants = ['brand', 'error', 'warning', 'success', 'neutral'] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${themes.length}, auto)`, gap: '1.2rem', alignItems: 'center' }}>
        {variants.map((v) =>
          themes.map((t) => (
            <FeaturedIcon key={`${v}-${t}`} variant={v} theme={t}>
              <Icon icon={Star} />
            </FeaturedIcon>
          )),
        )}
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['brand', 'error', 'warning', 'success', 'neutral'] as const;
    const themes = ['light', 'gradient', 'dark', 'outline', 'modern', 'modern-neue'] as const;
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    const shapes = ['circle', 'square'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
        {shapes.map((shape) => (
          <div key={shape}>
            <div className="story-label" style={{ marginBottom: '1.2rem' }}>Shape: {shape}</div>
            {sizes.map((size) => (
              <div key={size} style={{ marginBottom: '1.6rem' }}>
                <div className="story-heading">Size: {size}</div>
                <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${themes.length}, auto)`, gap: '0.8rem', alignItems: 'center' }}>
                  <div />
                  {themes.map((t) => <div key={t} className="story-label" style={{ textAlign: 'center' }}>{t}</div>)}
                  {variants.map((v) => (
                    <>
                      <div key={`label-${v}`} className="story-label">{v}</div>
                      {themes.map((t) => (
                        <FeaturedIcon key={`${v}-${t}`} variant={v} theme={t} shape={shape} size={size}>
                          <Icon icon={Star} />
                        </FeaturedIcon>
                      ))}
                    </>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
