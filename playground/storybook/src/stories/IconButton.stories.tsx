import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { Search, Bell, Settings, Plus, Trash2, Heart, Download } from 'lucide-react';

type Args = {
  variant: 'primary' | 'neutral' | 'ghost' | 'danger' | 'inverse';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  pending: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/IconButton',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'ghost', 'danger', 'inverse'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    pending: { control: 'boolean' },
  },
  args: {
    variant: 'ghost',
    size: 'md',
    disabled: false,
    pending: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <IconButton variant={args.variant} size={args.size} isDisabled={args.disabled} isPending={args.pending} aria-label="Search">
      <Icon icon={Search} />
    </IconButton>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--s">
      <IconButton variant="primary" aria-label="Add">
        <Icon icon={Plus} />
      </IconButton>
      <IconButton variant="neutral" aria-label="Settings">
        <Icon icon={Settings} />
      </IconButton>
      <IconButton variant="ghost" aria-label="Search">
        <Icon icon={Search} />
      </IconButton>
      <IconButton variant="danger" aria-label="Delete">
        <Icon icon={Trash2} />
      </IconButton>
      <IconButton variant="inverse" aria-label="Download">
        <Icon icon={Download} />
      </IconButton>
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--s">
      <IconButton variant="neutral" size="sm" aria-label="Small">
        <Icon icon={Heart} />
      </IconButton>
      <IconButton variant="neutral" size="md" aria-label="Medium">
        <Icon icon={Heart} />
      </IconButton>
      <IconButton variant="neutral" size="lg" aria-label="Large">
        <Icon icon={Heart} />
      </IconButton>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--s">
      <IconButton variant="primary" isDisabled aria-label="Add">
        <Icon icon={Plus} />
      </IconButton>
      <IconButton variant="neutral" isDisabled aria-label="Settings">
        <Icon icon={Settings} />
      </IconButton>
      <IconButton variant="ghost" isDisabled aria-label="Search">
        <Icon icon={Search} />
      </IconButton>
      <IconButton variant="danger" isDisabled aria-label="Delete">
        <Icon icon={Trash2} />
      </IconButton>
      <IconButton variant="inverse" isDisabled aria-label="Download">
        <Icon icon={Download} />
      </IconButton>
    </div>
  ),
};

export const Pending: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--s">
      <IconButton variant="primary" isPending aria-label="Add">
        <Icon icon={Plus} />
      </IconButton>
      <IconButton variant="neutral" isPending aria-label="Settings">
        <Icon icon={Settings} />
      </IconButton>
      <IconButton variant="ghost" isPending aria-label="Search">
        <Icon icon={Search} />
      </IconButton>
      <IconButton variant="danger" isPending aria-label="Delete">
        <Icon icon={Trash2} />
      </IconButton>
      <IconButton variant="inverse" isPending aria-label="Download">
        <Icon icon={Download} />
      </IconButton>
    </div>
  ),
};

export const Toolbar: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row story-row--2xs">
      <IconButton variant="ghost" aria-label="Search">
        <Icon icon={Search} />
      </IconButton>
      <IconButton variant="ghost" aria-label="Notifications">
        <Icon icon={Bell} />
      </IconButton>
      <IconButton variant="ghost" aria-label="Download">
        <Icon icon={Download} />
      </IconButton>
      <IconButton variant="ghost" aria-label="Settings">
        <Icon icon={Settings} />
      </IconButton>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['primary', 'neutral', 'ghost', 'danger', 'inverse'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div className="story-sections">
        <div>
          <div className="story-heading">Default</div>
          <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${sizes.length}, auto)`, gap: '0.8rem', alignItems: 'center', justifyItems: 'center' }}>
            <div />
            {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
            {variants.map((v) => (
              <>
                <div key={`label-${v}`} className="story-label">{v}</div>
                {sizes.map((s) => (
                  <IconButton key={`${v}-${s}`} variant={v} size={s} aria-label={v}>
                    <Icon icon={Heart} />
                  </IconButton>
                ))}
              </>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">Disabled</div>
          <div className="story-row story-row--s">
            {variants.map((v) => (
              <IconButton key={v} variant={v} isDisabled aria-label={v}>
                <Icon icon={Heart} />
              </IconButton>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">Pending</div>
          <div className="story-row story-row--s">
            {variants.map((v) => (
              <IconButton key={v} variant={v} isPending aria-label={v}>
                <Icon icon={Heart} />
              </IconButton>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
