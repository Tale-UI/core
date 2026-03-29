import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from '@tale-ui/react/banner';
import { Button } from '@tale-ui/react/button';

type Args = {
  variant: 'info' | 'success' | 'warning' | 'error';
  size: 'sm' | 'md';
};

const meta: Meta<Args> = {
  title: 'Components/Banner',
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    variant: 'info',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Banner.Root variant={args.variant} size={args.size}>
        <Banner.Title>Heads up</Banner.Title>
        <Banner.Description>Your trial expires in 3 days.</Banner.Description>
      </Banner.Root>
    );
  },
};

export const AllVariants: Story = {
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <Banner.Root variant="info">
          <Banner.Title>Info</Banner.Title>
          <Banner.Description>Informational message.</Banner.Description>
        </Banner.Root>
        <Banner.Root variant="success">
          <Banner.Title>Success</Banner.Title>
          <Banner.Description>Operation completed.</Banner.Description>
        </Banner.Root>
        <Banner.Root variant="warning">
          <Banner.Title>Warning</Banner.Title>
          <Banner.Description>Please review before continuing.</Banner.Description>
        </Banner.Root>
        <Banner.Root variant="error">
          <Banner.Title>Error</Banner.Title>
          <Banner.Description>Something went wrong.</Banner.Description>
        </Banner.Root>
      </div>
    );
  },
};

export const WithActions: Story = {
  render() {
    return (
      <Banner.Root variant="warning">
        <Banner.Title>Update available</Banner.Title>
        <Banner.Description>A new version is ready to install.</Banner.Description>
        <Banner.Actions>
          <Button variant="ghost" size="sm">Later</Button>
          <Button variant="primary" size="sm">Update</Button>
        </Banner.Actions>
      </Banner.Root>
    );
  },
};

export const Dismissible: Story = {
  render() {
    return (
      <Banner.Root variant="info">
        <Banner.Title>Tip</Banner.Title>
        <Banner.Description>You can customise your dashboard layout.</Banner.Description>
        <Banner.Close aria-label="Dismiss" />
      </Banner.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    const sizes = ['sm', 'md'] as const;
    return (
      <div className="story-sections">
        {sizes.map((size) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div className="story-label">Size: {size}</div>
            {variants.map((v) => (
              <Banner.Root key={`${v}-${size}`} variant={v} size={size}>
                <Banner.Title>{v.charAt(0).toUpperCase() + v.slice(1)}</Banner.Title>
                <Banner.Description>This is a {v} banner at {size} size.</Banner.Description>
                <Banner.Actions>
                  <Button variant="ghost" size="sm">Action</Button>
                </Banner.Actions>
                <Banner.Close aria-label="Dismiss" />
              </Banner.Root>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
