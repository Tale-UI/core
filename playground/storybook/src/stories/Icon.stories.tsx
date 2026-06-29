import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@tale-ui/react/icon';
import { Button } from '@tale-ui/react/button';
import {
  Heart,
  Star,
  Bell,
  Settings,
  Search,
  Plus,
  Trash2,
  Download,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Mail,
  User,
  Home,
  ArrowRight,
} from 'lucide-react';

type Args = {
  size: 'sm' | 'md' | 'lg' | 'xl';
  label: string;
};

const meta: Meta<Args> = {
  title: 'Components/Icon',
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    label: { control: 'text' },
  },
  args: {
    size: 'md',
    label: '',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Icon icon={Heart} size={args.size} label={args.label || undefined} />
  ),
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--m">
      <div className="story-col" style={{ alignItems: 'center' }}>
        <Icon icon={Star} size="sm" />
        <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>sm</span>
      </div>
      <div className="story-col" style={{ alignItems: 'center' }}>
        <Icon icon={Star} size="md" />
        <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>md</span>
      </div>
      <div className="story-col" style={{ alignItems: 'center' }}>
        <Icon icon={Star} size="lg" />
        <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>lg</span>
      </div>
      <div className="story-col" style={{ alignItems: 'center' }}>
        <Icon icon={Star} size="xl" />
        <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>xl</span>
      </div>
    </div>
  ),
};

export const IconGallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--m" style={{ flexWrap: 'wrap' }}>
      {[Heart, Star, Bell, Settings, Search, Plus, Trash2, Download,
        AlertCircle, CheckCircle, Info, Mail, User, Home, ArrowRight, ChevronRight,
      ].map((IconComp, i) => (
        <div key={i} className="story-col" style={{ alignItems: 'center', width: '60px' }}>
          <Icon icon={IconComp} />
          <span style={{ fontSize: '0.5625rem', color: 'var(--neutral-50)' }}>
            {IconComp.displayName}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const InheritColor: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--m">
      <span style={{ color: 'var(--color-60)' }}><Icon icon={Heart} /></span>
      <span style={{ color: 'var(--neutral-50)' }}><Icon icon={Heart} /></span>
      <span style={{ color: 'var(--neutral-80)' }}><Icon icon={Heart} /></span>
    </div>
  ),
};

export const WithButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--s">
      <Button variant="primary">
        <Icon icon={Plus} size="sm" />
        Add Item
      </Button>
      <Button variant="neutral">
        <Icon icon={Download} size="sm" />
        Download
      </Button>
      <Button variant="ghost">
        <Icon icon={Settings} size="sm" />
        Settings
      </Button>
      <Button variant="danger">
        <Icon icon={Trash2} size="sm" />
        Delete
      </Button>
    </div>
  ),
};


export const Accessible: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-col story-col--s">
      <div className="story-row story-row--s" style={{ alignItems: 'center' }}>
        <Icon icon={AlertCircle} label="Warning" style={{ color: 'var(--color-60)' }} />
        <span>This icon has an accessible label (role="img", aria-label="Warning")</span>
      </div>
      <div className="story-row story-row--s" style={{ alignItems: 'center' }}>
        <Icon icon={CheckCircle} />
        <span>This icon is decorative (aria-hidden="true")</span>
      </div>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    const icons = [Heart, Star, Bell, Settings, Search, AlertCircle, CheckCircle, Info] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${sizes.length}, auto)`, gap: '0.75rem', alignItems: 'center' }}>
        <div />
        {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
        {icons.map((IconComp, i) => (
          <React.Fragment>
            <div key={`label-${i}`} className="story-label">{IconComp.displayName}</div>
            {sizes.map((s) => <Icon key={`${i}-${s}`} icon={IconComp} size={s} />)}
          </React.Fragment>
        ))}
      </div>
    );
  },
};
