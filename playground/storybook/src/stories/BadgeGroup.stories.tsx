import type { Meta, StoryObj } from '@storybook/react-vite';
import { BadgeGroup } from '@tale-ui/react/badge-group';

type Args = {
  addonText: string;
  size: 'md' | 'lg';
  color: 'brand' | 'warning' | 'error' | 'gray' | 'success';
  theme: 'light' | 'modern';
  align: 'leading' | 'trailing';
};

const meta: Meta<Args> = {
  title: 'Components/BadgeGroup',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['md', 'lg'] },
    color: { control: 'select', options: ['brand', 'success', 'warning', 'error', 'gray'] },
    theme: { control: 'select', options: ['light', 'modern'] },
    align: { control: 'select', options: ['leading', 'trailing'] },
  },
  args: {
    addonText: 'v1.0',
    size: 'md',
    color: 'brand',
    theme: 'light',
    align: 'trailing',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <BadgeGroup.Root
        addonText={args.addonText}
        size={args.size}
        color={args.color}
        theme={args.theme}
        align={args.align}
      >
        New feature
      </BadgeGroup.Root>
    );
  },
};

export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const colors = ['brand', 'success', 'warning', 'error', 'gray'] as const;
    return (
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {colors.map((c) => (
          <BadgeGroup.Root key={c} color={c} addonText="New">
            {c}
          </BadgeGroup.Root>
        ))}
      </div>
    );
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const colors = ['brand', 'success', 'warning', 'error', 'gray'] as const;
    const themes = ['light', 'modern'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {themes.map((theme) => (
          <div key={theme} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="story-label">{theme}</span>
            {colors.map((c) => (
              <BadgeGroup.Root key={c} color={c} theme={theme} addonText="New">
                {c}
              </BadgeGroup.Root>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const LeadingAddon: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <BadgeGroup.Root align="leading" addonText="PRO" color="brand">
        Unlock all features
      </BadgeGroup.Root>
    );
  },
};
