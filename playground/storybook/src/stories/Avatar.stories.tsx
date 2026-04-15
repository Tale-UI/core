import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@tale-ui/react/avatar';
import { DotIcon } from '@tale-ui/react/dot-icon';

type Args = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

const meta: Meta<Args> = {
  title: 'Components/Avatar',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
  },
  args: {
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Avatar.Root size={args.size}>
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--m">
      <Avatar.Root size="xs">
        <Avatar.Fallback>XS</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="sm">
        <Avatar.Fallback>SM</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="md">
        <Avatar.Fallback>MD</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="lg">
        <Avatar.Fallback>LG</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Fallback>XL</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="2xl">
        <Avatar.Fallback>2X</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};

export const WithImage: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    // In practice, set src on Avatar.Image to display a real avatar photo.
    // The Fallback content is shown when no image src is provided or the image fails to load.
    <div className="story-row story-row--m">
      <Avatar.Root size="lg">
        <Avatar.Image src="https://placehold.co/96x96" alt="User avatar" />
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Image src="https://placehold.co/160x160" alt="User avatar" />
        <Avatar.Fallback>CD</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};

export const GroupWithCount: Story = {
  parameters: {
    controls: { disable: true },
  },
  render() {
    return (
      <Avatar.Group size="md">
        <Avatar.Root>
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>CD</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>EF</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Count>+5</Avatar.Count>
      </Avatar.Group>
    );
  },
};

export const GroupSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
          <Avatar.Group key={size} size={size}>
            <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
            <Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
            <Avatar.Count>+3</Avatar.Count>
          </Avatar.Group>
        ))}
      </div>
    );
  },
};

export const WithIndicator: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--m">
      <Avatar.Indicator badge={<DotIcon color="success" />}>
        <Avatar.Root size="sm">
          <Avatar.Image src="https://placehold.co/48x48" alt="User" />
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Indicator>
      <Avatar.Indicator badge={<DotIcon color="success" />}>
        <Avatar.Root size="md">
          <Avatar.Image src="https://placehold.co/72x72" alt="User" />
          <Avatar.Fallback>CD</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Indicator>
      <Avatar.Indicator badge={<DotIcon color="error" />}>
        <Avatar.Root size="lg">
          <Avatar.Image src="https://placehold.co/96x96" alt="User" />
          <Avatar.Fallback>EF</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Indicator>
      <Avatar.Indicator badge={<DotIcon color="neutral" />} position="top-right">
        <Avatar.Root size="xl">
          <Avatar.Image src="https://placehold.co/160x160" alt="User" />
          <Avatar.Fallback>GH</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Indicator>
    </div>
  ),
};

export const LabelGroupStory: Story = {
  name: 'LabelGroup',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      <Avatar.LabelGroup size="sm">
        <Avatar.Root>
          <Avatar.Image src="https://placehold.co/48x48" alt="User" />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
        <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
      </Avatar.LabelGroup>
      <Avatar.LabelGroup size="md">
        <Avatar.Root>
          <Avatar.Image src="https://placehold.co/72x72" alt="User" />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
        <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
      </Avatar.LabelGroup>
      <Avatar.LabelGroup size="lg">
        <Avatar.Root>
          <Avatar.Image src="https://placehold.co/96x96" alt="User" />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
        <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
      </Avatar.LabelGroup>
    </div>
  ),
};

export const LabelGroupWithIndicator: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      <Avatar.LabelGroup size="md">
        <Avatar.Indicator badge={<DotIcon color="success" />}>
          <Avatar.Root>
            <Avatar.Image src="https://placehold.co/72x72" alt="User" />
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar.Root>
        </Avatar.Indicator>
        <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
        <Avatar.LabelGroupSubtitle>Online</Avatar.LabelGroupSubtitle>
      </Avatar.LabelGroup>
      <Avatar.LabelGroup size="lg">
        <Avatar.Indicator badge={<DotIcon color="error" />}>
          <Avatar.Root>
            <Avatar.Image src="https://placehold.co/96x96" alt="User" />
            <Avatar.Fallback>AB</Avatar.Fallback>
          </Avatar.Root>
        </Avatar.Indicator>
        <Avatar.LabelGroupTitle>Alex Brown</Avatar.LabelGroupTitle>
        <Avatar.LabelGroupSubtitle>Offline</Avatar.LabelGroupSubtitle>
      </Avatar.LabelGroup>
    </div>
  ),
};

export const AddButtonSizes: Story = {
  name: 'AddButton — Sizes',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--m" style={{ alignItems: 'center' }}>
        <Avatar.AddButton size="xs" aria-label="Add (xs)" />
        <Avatar.AddButton size="sm" aria-label="Add (sm)" />
        <Avatar.AddButton size="md" aria-label="Add (md)" />
      </div>
    );
  },
};

export const AddButtonInGroup: Story = {
  name: 'AddButton — In Group',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <Avatar.Group size="md">
        <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
        <Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
        <Avatar.Root><Avatar.Fallback>EF</Avatar.Fallback></Avatar.Root>
        <Avatar.AddButton size="md" aria-label="Add team member" />
      </Avatar.Group>
    );
  },
};

export const CompanyIconSizes: Story = {
  name: 'CompanyIcon — Sizes',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--m" style={{ alignItems: 'center' }}>
        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Avatar.CompanyIcon key={size} src="https://placehold.co/64x64/6366f1/ffffff" alt="Company" size={size}>
            <Avatar.Root size={size}>
              <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar.Root>
          </Avatar.CompanyIcon>
        ))}
      </div>
    );
  },
};

export const VerifiedTickSizes: Story = {
  name: 'VerifiedTick — Sizes',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--m" style={{ alignItems: 'center' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const).map((size) => (
          <div key={size} className="story-col" style={{ alignItems: 'center' }}>
            <Avatar.VerifiedTick size={size} />
            <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>{size}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const VerifiedTickOnIndicator: Story = {
  name: 'VerifiedTick — On Indicator',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--m" style={{ alignItems: 'center' }}>
        <Avatar.Indicator badge={<Avatar.VerifiedTick size="xs" />}>
          <Avatar.Root size="sm"><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
        </Avatar.Indicator>
        <Avatar.Indicator badge={<Avatar.VerifiedTick size="sm" />}>
          <Avatar.Root size="md"><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
        </Avatar.Indicator>
        <Avatar.Indicator badge={<Avatar.VerifiedTick size="md" />}>
          <Avatar.Root size="lg"><Avatar.Fallback>EF</Avatar.Fallback></Avatar.Root>
        </Avatar.Indicator>
      </div>
    );
  },
};

export const ProfilePhotoSizes: Story = {
  name: 'ProfilePhoto — Sizes',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--m" style={{ alignItems: 'center' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} className="story-col" style={{ alignItems: 'center' }}>
            <Avatar.ProfilePhoto size={size}>
              <Avatar.Image src="https://placehold.co/160x160" alt="User" />
              <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar.ProfilePhoto>
            <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>{size}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const ProfilePhotoWithBadge: Story = {
  name: 'ProfilePhoto — With VerifiedTick',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--m" style={{ alignItems: 'center' }}>
        <Avatar.ProfilePhoto size="sm" badge={<Avatar.VerifiedTick size="xs" />}>
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.ProfilePhoto>
        <Avatar.ProfilePhoto size="md" badge={<Avatar.VerifiedTick size="sm" />}>
          <Avatar.Fallback>CD</Avatar.Fallback>
        </Avatar.ProfilePhoto>
        <Avatar.ProfilePhoto size="lg" badge={<Avatar.VerifiedTick size="md" />}>
          <Avatar.Image src="https://placehold.co/160x160" alt="User" />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.ProfilePhoto>
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    return (
      <div className="story-sections">
        <div>
          <div className="story-heading">Sizes (fallback)</div>
          <div className="story-row story-row--m">
            {sizes.map((s) => (
              <div key={s} className="story-col" style={{ alignItems: 'center' }}>
                <Avatar.Root size={s}><Avatar.Fallback>{s.toUpperCase()}</Avatar.Fallback></Avatar.Root>
                <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">With image</div>
          <div className="story-row story-row--m">
            {sizes.map((s) => (
              <Avatar.Root key={s} size={s}>
                <Avatar.Image src="https://placehold.co/160x160" alt="User" />
                <Avatar.Fallback>{s.toUpperCase()}</Avatar.Fallback>
              </Avatar.Root>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">With indicator</div>
          <div className="story-row story-row--m">
            {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <Avatar.Indicator key={s} badge={<DotIcon color="success" />}>
                <Avatar.Root size={s}><Avatar.Fallback>{s.toUpperCase()}</Avatar.Fallback></Avatar.Root>
              </Avatar.Indicator>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">Groups</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Avatar.Group key={s} size={s}>
                <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
                <Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
                <Avatar.Root><Avatar.Fallback>EF</Avatar.Fallback></Avatar.Root>
                <Avatar.Count>+3</Avatar.Count>
              </Avatar.Group>
            ))}
          </div>
        </div>
        <div>
          <div className="story-heading">LabelGroup sizes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Avatar.LabelGroup key={s} size={s}>
                <Avatar.Root><Avatar.Fallback>JD</Avatar.Fallback></Avatar.Root>
                <Avatar.LabelGroupTitle>Jane Doe ({s})</Avatar.LabelGroupTitle>
                <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
              </Avatar.LabelGroup>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
