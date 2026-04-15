import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoPlayer } from '@tale-ui/react/video-player';

// A freely-licensed short video for demo purposes
const DEMO_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';
const DEMO_THUMB = 'https://placehold.co/640x360/1e293b/ffffff?text=▶+Play+Video';

type Args = {
  size?: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/VideoPlayer',
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <VideoPlayer.Root
        src={DEMO_VIDEO}
        size={args.size}
        thumbnailUrl={DEMO_THUMB}
        thumbnailAlt="Play demo video"
      />
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', width: '100%', maxWidth: 640 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)', marginBottom: '0.4rem' }}>
            {size}
          </p>
          <VideoPlayer.Root
            src={DEMO_VIDEO}
            size={size}
            thumbnailUrl={DEMO_THUMB}
            thumbnailAlt={`Video (${size})`}
          />
        </div>
      ))}
    </div>
  ),
};

export const WithoutThumbnail: Story = {
  name: 'Without Thumbnail',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <VideoPlayer.Root src={DEMO_VIDEO} size="md" />
    </div>
  ),
};
