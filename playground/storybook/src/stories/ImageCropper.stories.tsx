import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageCropper, makeAspectCrop, centerCrop } from '@tale-ui/react/image-cropper';
import type { Crop, PixelCrop } from '@tale-ui/react/image-cropper';

const meta: Meta = {
  title: 'Components/ImageCropper',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj;

const DEMO_IMG = 'https://placehold.co/600x400/6366f1/ffffff?text=Crop+Me';

export const Default: Story = {
  render: () => {
    const [crop, setCrop] = React.useState<Crop>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImageCropper.Root crop={crop} onChange={setCrop}>
          <ImageCropper.Img src={DEMO_IMG} alt="Demo image" />
        </ImageCropper.Root>
      </div>
    );
  },
};

export const WithAspectRatio: Story = {
  name: 'With Aspect Ratio (16:9)',
  render: () => {
    const [crop, setCrop] = React.useState<Crop>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImageCropper.Root crop={crop} onChange={setCrop} aspect={16 / 9}>
          <ImageCropper.Img src={DEMO_IMG} alt="Demo image" />
        </ImageCropper.Root>
      </div>
    );
  },
};

export const CircularCrop: Story = {
  name: 'Circular Crop (1:1)',
  render: () => {
    const [crop, setCrop] = React.useState<Crop>();
    return (
      <div style={{ maxWidth: 360 }}>
        <ImageCropper.Root crop={crop} onChange={setCrop} aspect={1} circularCrop>
          <ImageCropper.Img
            src="https://placehold.co/400x400/6366f1/ffffff?text=Avatar"
            alt="Avatar crop"
            onLoad={(entry) => {
              const { naturalWidth: w, naturalHeight: h } = entry.currentTarget;
              const initial = centerCrop(
                makeAspectCrop({ unit: '%', width: 80 }, 1, w, h),
                w,
                h,
              );
              setCrop(initial);
            }}
          />
        </ImageCropper.Root>
      </div>
    );
  },
};

export const WithRuleOfThirds: Story = {
  name: 'Rule of Thirds',
  render: () => {
    const [crop, setCrop] = React.useState<Crop>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImageCropper.Root crop={crop} onChange={setCrop} ruleOfThirds>
          <ImageCropper.Img src={DEMO_IMG} alt="Demo image" />
        </ImageCropper.Root>
      </div>
    );
  },
};
