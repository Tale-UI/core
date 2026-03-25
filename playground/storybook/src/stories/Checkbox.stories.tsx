import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Icon } from '@tale-ui/react/icon';
import { Check, Minus } from 'lucide-react';

type Args = {
  isSelected: boolean;
  isDisabled: boolean;
  isIndeterminate: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Checkbox',
  args: {
    isSelected: false,
    isDisabled: false,
    isIndeterminate: false,
  },
  argTypes: {
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isIndeterminate: { control: 'boolean' },
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
    >
      <Checkbox.Indicator>
        <Icon icon={Minus} size="sm" />
      </Checkbox.Indicator>
      Indeterminate state
    </Checkbox.Root>
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
