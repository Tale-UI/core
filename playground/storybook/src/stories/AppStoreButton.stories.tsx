import type { Meta, StoryObj } from '@storybook/react';
import { AppStoreButton } from '@tale-ui/react/app-store-button';

type Args = {
  store: 'apple' | 'google';
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/AppStoreButton',
  parameters: { layout: 'centered' },
  argTypes: {
    store: { control: 'select', options: ['apple', 'google'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    store: 'apple',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <AppStoreButton store={args.store} size={args.size} href="#" />;
  },
};

export const BothStores: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        <AppStoreButton store="apple" href="#" />
        <AppStoreButton store="google" href="#" />
      </div>
    );
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' }}>
        <AppStoreButton store="apple" size="sm" href="#" />
        <AppStoreButton store="apple" size="md" href="#" />
        <AppStoreButton store="apple" size="lg" href="#" />
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const stores = ['apple', 'google'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, auto)', gap: '1.2rem', alignItems: 'center' }}>
        <div />
        {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
        {stores.map((store) => (
          <>
            <div key={`label-${store}`} className="story-label">{store}</div>
            {sizes.map((s) => <AppStoreButton key={`${store}-${s}`} store={store} size={s} href="#" />)}
          </>
        ))}
      </div>
    );
  },
};
