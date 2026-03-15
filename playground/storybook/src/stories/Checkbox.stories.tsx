import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@tale-ui/react/checkbox';

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

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MinusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Default: Story = {
  render: (args) => (
    <Checkbox.Root
      key={`${args.isSelected}-${args.isIndeterminate}`}
      defaultSelected={args.isSelected}
      isDisabled={args.isDisabled}
      isIndeterminate={args.isIndeterminate}
    >
      <Checkbox.Indicator>
        <CheckIcon />
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
        <CheckIcon />
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
        <CheckIcon />
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
        <CheckIcon />
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
        <MinusIcon />
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
        gap: 'var(--space-m)',
        alignItems: 'start',
      }}
    >
      <Checkbox.Root>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Unchecked
      </Checkbox.Root>

      <Checkbox.Root defaultSelected>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Checked
      </Checkbox.Root>

      <Checkbox.Root isIndeterminate>
        <Checkbox.Indicator>
          <MinusIcon />
        </Checkbox.Indicator>
        Indeterminate
      </Checkbox.Root>

      <Checkbox.Root isDisabled>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Disabled
      </Checkbox.Root>

      <Checkbox.Root isDisabled defaultSelected>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Disabled + Checked
      </Checkbox.Root>

      <Checkbox.Root isDisabled isIndeterminate>
        <Checkbox.Indicator>
          <MinusIcon />
        </Checkbox.Indicator>
        Disabled + Indeterminate
      </Checkbox.Root>
    </div>
  ),
};
