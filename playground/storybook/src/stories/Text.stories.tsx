import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '@tale-ui/react/text';

type Args = {
  variant: 'display' | 'heading' | 'title' | 'label' | 'text' | 'mono';
  size: 'xs' | 's' | 'm' | 'l';
  color: 'default' | 'muted' | 'accent';
  as: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
};

const meta: Meta<Args> = {
  title: 'Components/Text',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['display', 'heading', 'title', 'label', 'text', 'mono'] },
    size: { control: 'select', options: ['xs', 's', 'm', 'l'] },
    color: { control: 'select', options: ['default', 'muted', 'accent'] },
    as: { control: 'select', options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'] },
  },
  args: { variant: 'text', size: 'm', color: 'default', as: 'span' },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <Text variant={args.variant} size={args.size} color={args.color} as={args.as}>The quick brown fox</Text>;
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['display', 'heading', 'title', 'label', 'text', 'mono'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {variants.map((v) => (
          <Text key={v} variant={v} size="m">{v} — The quick brown fox</Text>
        ))}
      </div>
    );
  },
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['xs', 's', 'm', 'l'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {sizes.map((s) => (
          <Text key={s} variant="text" size={s}>Size {s} — The quick brown fox</Text>
        ))}
      </div>
    );
  },
};

export const Colors: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <Text color="default">Default colour</Text>
        <Text color="muted">Muted colour</Text>
        <Text color="accent">Accent colour</Text>
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['display', 'heading', 'title', 'label', 'text', 'mono'] as const;
    const sizes = ['xs', 's', 'm', 'l'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
        {variants.map((v) => (
          <div key={v}>
            <div className="story-heading">{v}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {sizes.map((s) => (
                <Text key={s} variant={v} size={s}>{v}-{s}</Text>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
