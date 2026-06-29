import type { Meta, StoryObj } from '@storybook/react-vite';
import { QRCode } from '@tale-ui/react/qr-code';

type Args = {
  value: string;
  size?: 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/QRCode',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['md', 'lg'] },
  },
  args: {
    value: 'https://tale-ui.com',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <QRCode.Root value={args.value} size={args.size} />
  ),
};

export const BothSizes: Story = {
  name: 'Both Sizes',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <QRCode.Root value="https://tale-ui.com" size="md" />
        <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>md</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <QRCode.Root value="https://tale-ui.com" size="lg" />
        <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>lg</span>
      </div>
    </div>
  ),
};

export const WithScanOverlay: Story = {
  name: 'With Scan Overlay',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <QRCode.Root value="https://tale-ui.com" size="lg" />
      <QRCode.Scan />
    </div>
  ),
};

export const CustomOptions: Story = {
  name: 'Custom Options',
  parameters: { controls: { disable: true } },
  render: () => (
    <QRCode.Root
      value="https://tale-ui.com"
      size="lg"
      options={{
        dotsOptions: { color: '#7c3aed', type: 'rounded' },
        backgroundOptions: { color: '#f3f0ff' },
        cornersSquareOptions: { color: '#6d28d9' },
        cornersDotOptions: { color: '#5b21b6' },
      }}
    />
  ),
};
