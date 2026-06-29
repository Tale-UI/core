import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectNative } from '@tale-ui/react/select-native';

type Args = {
  size: 'sm' | 'md';
  disabled: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/SelectNative',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
  args: {
    size: 'md',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <SelectNative size={args.size} disabled={args.disabled}>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
        <option value="c">Option C</option>
      </SelectNative>
    );
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SelectNative size="sm">
          <option>Small</option>
        </SelectNative>
        <SelectNative size="md">
          <option>Medium</option>
        </SelectNative>
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <SelectNative disabled>
        <option>Cannot select</option>
      </SelectNative>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md'] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(2, auto)', gap: '0.5rem 0.75rem', alignItems: 'center' }}>
        <div />
        {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
        <div className="story-label">Default</div>
        {sizes.map((s) => (
          <SelectNative key={`default-${s}`} size={s}>
            <option>Option A</option>
            <option>Option B</option>
          </SelectNative>
        ))}
        <div className="story-label">Disabled</div>
        {sizes.map((s) => (
          <SelectNative key={`disabled-${s}`} size={s} disabled>
            <option>Disabled</option>
          </SelectNative>
        ))}
      </div>
    );
  },
};
