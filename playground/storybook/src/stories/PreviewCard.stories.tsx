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
          <div className="story-preview-content">
            <h4 className="story-preview-title">Preview Title</h4>
            <p className="story-preview-text">
              This is a preview card with some descriptive text content that appears on hover.
            </p>
          </div>
        </PreviewCard.Content>
      </PreviewCard.Popup>
    </PreviewCard.Root>
  ),
};

export const WithArrow: Story = {
  render: (args) => (
    <PreviewCard.Root>
      <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
      <PreviewCard.Popup placement={args.placement} offset={args.offset}>
        <PreviewCard.Arrow />
        <PreviewCard.Content aria-label="Preview">
          <div className="story-preview-content">
            <h4 className="story-preview-title">Arrow Preview</h4>
            <p className="story-preview-text">
              This preview card includes an arrow pointing to the trigger.
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
          <div className="story-preview-image-wrap">
            <div className="story-image-placeholder">
              Image placeholder
            </div>
            <div className="story-preview-body">
              <h4 className="story-preview-title">Card with Image</h4>
              <p className="story-preview-text">
                A preview card that includes an image area above the text content.
              </p>
            </div>
          </div>
        </PreviewCard.Content>
      </PreviewCard.Popup>
    </PreviewCard.Root>
  ),
};
