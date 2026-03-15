import type { Meta, StoryObj } from '@storybook/react';
import { PreviewCard } from '@tale-ui/react/preview-card';

type Args = {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
};

const meta: Meta<Args> = {
  title: 'Components/PreviewCard',
  parameters: { layout: 'centered' },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    offset: { control: 'number' },
  },
  args: {
    placement: 'bottom',
    offset: 8,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <PreviewCard.Root>
      <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
      <PreviewCard.Popup placement={args.placement} offset={args.offset}>
        <PreviewCard.Content aria-label="Preview">
          <div style={{ maxWidth: '280px' }}>
            <h4 style={{ margin: '0 0 var(--space-xs) 0' }}>Preview Title</h4>
            <p style={{ margin: 0, fontSize: 'var(--text-s-font-size)' }}>
              This is a preview card with some descriptive text content that appears on hover.
            </p>
          </div>
        </PreviewCard.Content>
      </PreviewCard.Popup>
    </PreviewCard.Root>
  ),
};

export const WithImage: Story = {
  render: () => (
    <PreviewCard.Root>
      <PreviewCard.Trigger>Preview with image</PreviewCard.Trigger>
      <PreviewCard.Popup placement="bottom" offset={8}>
        <PreviewCard.Content aria-label="Image preview">
          <div style={{ maxWidth: '300px' }}>
            <div
              style={{
                width: '100%',
                height: '120px',
                background: 'var(--neutral-20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-s-font-size)',
                color: 'var(--neutral-60-fg)',
                borderRadius: 'var(--space-2xs) var(--space-2xs) 0 0',
              }}
            >
              Image placeholder
            </div>
            <div style={{ padding: 'var(--space-xs)' }}>
              <h4 style={{ margin: '0 0 var(--space-xs) 0' }}>Card with Image</h4>
              <p style={{ margin: 0, fontSize: 'var(--text-s-font-size)' }}>
                A preview card that includes an image area above the text content.
              </p>
            </div>
          </div>
        </PreviewCard.Content>
      </PreviewCard.Popup>
    </PreviewCard.Root>
  ),
};
