import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Icon } from '@tale-ui/react/icon';
import { Check, Minus } from 'lucide-react';

type Args = {
  isSelected: boolean;
  isDisabled: boolean;
  isIndeterminate: boolean;
  size: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Components/Checkbox',
  args: {
    isSelected: false,
    isDisabled: false,
    isIndeterminate: false,
    size: 'md',
  },
  argTypes: {
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isIndeterminate: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;

type Story = StoryObj<Args>;


export const Default: Story = {
  render: (args) => (
    <Checkbox.Root
      key={`${args.isSelected}-${args.isIndeterminate}`}
      defaultSelected={args.isSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
      </Checkbox.Indicator>
      Accept terms and conditions
    </Checkbox.Root>
  ),
};

export const Checked: Story = {
  args: {
    isSelected: true,
    isDisabled: false,
    isIndeterminate: false,
  },
  render: (args) => (
    <Checkbox.Root
      key={`${args.isSelected}-${args.isIndeterminate}`}
      defaultSelected={args.isSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
      </Checkbox.Indicator>
      Checked by default
    </Checkbox.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isSelected: false,
    isDisabled: true,
    isIndeterminate: false,
  },
  render: (args) => (
    <Checkbox.Root
      key={`${args.isSelected}-${args.isIndeterminate}`}
      defaultSelected={args.isSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
      </Checkbox.Indicator>
      Disabled checkbox
    </Checkbox.Root>
  ),
};

export const DisabledChecked: Story = {
  args: {
    isSelected: true,
    isDisabled: true,
    isIndeterminate: false,
  },
  render: (args) => (
    <Checkbox.Root
      key={`${args.isSelected}-${args.isIndeterminate}`}
      defaultSelected={args.isSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
      </Checkbox.Indicator>
      Disabled and checked
    </Checkbox.Root>
  ),
};

export const Indeterminate: Story = {
  args: {
    isSelected: false,
    isDisabled: false,
    isIndeterminate: true,
  },
  render: (args) => (
    <Checkbox.Root
      key={`${args.isSelected}-${args.isIndeterminate}`}
      defaultSelected={args.isSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
      size={args.size}
    >
      <Checkbox.Indicator>
        <Icon icon={Minus} size="sm" />
      </Checkbox.Indicator>
      Indeterminate state
    </Checkbox.Root>
  ),
};

export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-checkbox-grid">
      <Checkbox.Root size="sm" defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Small
      </Checkbox.Root>

      <Checkbox.Root size="md" defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Medium (default)
      </Checkbox.Root>

      <Checkbox.Root size="lg" defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Large
      </Checkbox.Root>
    </div>
  ),
};

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-checkbox-grid">
      <Checkbox.Root>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Unchecked
      </Checkbox.Root>

      <Checkbox.Root defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Checked
      </Checkbox.Root>

      <Checkbox.Root isIndeterminate>
        <Checkbox.Indicator>
          <Icon icon={Minus} size="sm" />
        </Checkbox.Indicator>
        Indeterminate
      </Checkbox.Root>

      <Checkbox.Root isDisabled>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Disabled
      </Checkbox.Root>

      <Checkbox.Root isDisabled defaultSelected>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Disabled + Checked
      </Checkbox.Root>

      <Checkbox.Root isDisabled isIndeterminate>
        <Checkbox.Indicator>
          <Icon icon={Minus} size="sm" />
        </Checkbox.Indicator>
        Disabled + Indeterminate
      </Checkbox.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const sizes = ['sm', 'md', 'lg'] as const;
    const states = [
      { label: 'Unchecked', props: {} },
      { label: 'Checked', props: { defaultSelected: true } },
      { label: 'Indeterminate', props: { isIndeterminate: true } },
      { label: 'Disabled', props: { isDisabled: true } },
      { label: 'Disabled + Checked', props: { isDisabled: true, defaultSelected: true } },
      { label: 'Disabled + Indeterminate', props: { isDisabled: true, isIndeterminate: true } },
    ] as const;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${sizes.length}, auto)`, gap: '0.8rem 1.6rem', alignItems: 'center' }}>
        <div />
        {sizes.map((s) => <div key={s} className="story-label">{s}</div>)}
        {states.map((state) => (
          <>
            <div key={`label-${state.label}`} className="story-label">{state.label}</div>
            {sizes.map((s) => (
              <Checkbox.Root key={`${state.label}-${s}`} size={s} {...state.props}>
                <Checkbox.Indicator>
                  <Icon icon={state.label.includes('Indeterminate') ? Minus : Check} size="sm" />
                </Checkbox.Indicator>
                {state.label}
              </Checkbox.Root>
            ))}
          </>
        ))}
      </div>
    );
  },
};
