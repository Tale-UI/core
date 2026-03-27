import type { Meta, StoryObj } from '@storybook/react';
import { SelectNative } from '@tale-ui/react/select-native';

type Args = {
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/SelectNative',
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <SelectNative size="sm">
          <option>Small</option>
        </SelectNative>
        <SelectNative size="md">
          <option>Medium</option>
        </SelectNative>
        <SelectNative size="lg">
          <option>Large</option>
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
