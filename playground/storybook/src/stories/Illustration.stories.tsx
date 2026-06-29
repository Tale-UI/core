import type { Meta, StoryObj } from '@storybook/react-vite';
import { Illustration } from '@tale-ui/react/illustration';
import { UploadCloud, Cloud, FileText, CreditCard } from 'lucide-react';

type Args = {
  type: 'box' | 'cloud' | 'documents' | 'credit-card';
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/Illustration',
  parameters: { layout: 'centered' },
  argTypes: {
    type: { control: 'select', options: ['box', 'cloud', 'documents', 'credit-card'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { type: 'box', size: 'lg' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <Illustration type={args.type} size={args.size} />;
  },
};

export const AllTypes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {(['box', 'cloud', 'documents', 'credit-card'] as const).map((t) => (
          <div key={t} style={{ textAlign: 'center' }}>
            <p className="story-label" style={{ marginBottom: '0.3125rem' }}>{t}</p>
            <Illustration type={t} size="md" />
          </div>
        ))}
      </div>
    );
  },
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <div key={s} style={{ textAlign: 'center' }}>
            <p className="story-label" style={{ marginBottom: '0.3125rem' }}>{s}</p>
            <Illustration type="box" size={s} />
          </div>
        ))}
      </div>
    );
  },
};

export const WithChildren: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const items = [
      { type: 'box' as const, icon: <UploadCloud style={{ width: 32, height: 32, color: 'var(--color-60)' }} /> },
      { type: 'cloud' as const, icon: <Cloud style={{ width: 32, height: 32, color: 'var(--color-60)' }} /> },
      { type: 'documents' as const, icon: <FileText style={{ width: 32, height: 32, color: 'var(--color-60)' }} /> },
      { type: 'credit-card' as const, icon: <CreditCard style={{ width: 32, height: 32, color: 'var(--color-60)' }} /> },
    ];
    return (
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {items.map(({ type, icon }) => (
          <div key={type} style={{ textAlign: 'center' }}>
            <p className="story-label" style={{ marginBottom: '0.3125rem' }}>{type}</p>
            <Illustration type={type} size="md">
              {icon}
            </Illustration>
          </div>
        ))}
      </div>
    );
  },
};
