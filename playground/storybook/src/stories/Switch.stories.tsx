import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@tale-ui/react/switch';

type Args = {
  isSelected?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md';
  slim?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Switch',
  argTypes: {
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    slim: { control: 'boolean' },
  },
  args: {
    isSelected: false,
    isDisabled: false,
    size: 'md',
    slim: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Switch.Root key={String(args.isSelected)} defaultSelected={args.isSelected} isDisabled={args.isDisabled} size={args.size} slim={args.slim}>
      <Switch.Thumb />
      Enable notifications
    </Switch.Root>
  ),
};

export const Selected: Story = {
  args: {
    isSelected: true,
    isDisabled: false,
  },
  render: (args) => (
    <Switch.Root key={String(args.isSelected)} defaultSelected={args.isSelected} isDisabled={args.isDisabled}>
      <Switch.Thumb />
      Dark mode
    </Switch.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isSelected: false,
    isDisabled: true,
  },
  render: (args) => (
    <Switch.Root key={String(args.isSelected)} defaultSelected={args.isSelected} isDisabled={args.isDisabled}>
      <Switch.Thumb />
      Disabled switch
    </Switch.Root>
  ),
};

export const DisabledSelected: Story = {
  args: {
    isSelected: true,
    isDisabled: true,
  },
  render: (args) => (
    <Switch.Root key={String(args.isSelected)} defaultSelected={args.isSelected} isDisabled={args.isDisabled}>
      <Switch.Thumb />
      Disabled and on
    </Switch.Root>
  ),
};

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-col story-col--m">
      <Switch.Root>
        <Switch.Thumb />
        Default (off)
      </Switch.Root>

      <Switch.Root defaultSelected>
        <Switch.Thumb />
        Default (on)
      </Switch.Root>

      <Switch.Root isDisabled>
        <Switch.Thumb />
        Disabled (off)
      </Switch.Root>

      <Switch.Root isDisabled defaultSelected>
        <Switch.Thumb />
        Disabled (on)
      </Switch.Root>
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-col story-col--m">
      <Switch.Root size="md">
        <Switch.Thumb />
        Medium (default)
      </Switch.Root>

      <Switch.Root size="md" defaultSelected>
        <Switch.Thumb />
        Medium (on)
      </Switch.Root>

      <Switch.Root size="sm">
        <Switch.Thumb />
        Small
      </Switch.Root>

      <Switch.Root size="sm" defaultSelected>
        <Switch.Thumb />
        Small (on)
      </Switch.Root>
    </div>
  ),
};

export const Slim: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-col story-col--m">
      <Switch.Root slim>
        <Switch.Thumb />
        Slim (off)
      </Switch.Root>

      <Switch.Root slim defaultSelected>
        <Switch.Thumb />
        Slim (on)
      </Switch.Root>
    </div>
  ),
};

export const SlimSmall: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-col story-col--m">
      <Switch.Root size="sm" slim>
        <Switch.Thumb />
        Slim + Small (off)
      </Switch.Root>

      <Switch.Root size="sm" slim defaultSelected>
        <Switch.Thumb />
        Slim + Small (on)
      </Switch.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const configs = [
      { size: 'md' as const, slim: false, label: 'md' },
      { size: 'sm' as const, slim: false, label: 'sm' },
      { size: 'md' as const, slim: true, label: 'md slim' },
      { size: 'sm' as const, slim: true, label: 'sm slim' },
    ];
    const states = [
      { label: 'Off', props: {} },
      { label: 'On', props: { defaultSelected: true } },
      { label: 'Disabled off', props: { isDisabled: true } },
      { label: 'Disabled on', props: { isDisabled: true, defaultSelected: true } },
    ] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${configs.length}, auto)`, gap: '0.8rem 1.6rem', alignItems: 'center' }}>
        <div />
        {configs.map((c) => <div key={c.label} className="story-label">{c.label}</div>)}
        {states.map((state) => (
          <>
            <div key={`label-${state.label}`} className="story-label">{state.label}</div>
            {configs.map((c) => (
              <Switch.Root key={`${state.label}-${c.label}`} size={c.size} slim={c.slim} {...state.props}>
                <Switch.Thumb />
              </Switch.Root>
            ))}
          </>
        ))}
      </div>
    );
  },
};
