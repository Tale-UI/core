import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Field } from '@tale-ui/react/field';

type Args = {
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/CheckboxGroup',
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
  args: {
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Default: Story = {
  render: (args) => (
    <CheckboxGroup label="Favorite fruits" isDisabled={args.isDisabled}>
      <Checkbox.Root value="apple">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Apple
      </Checkbox.Root>
      <Checkbox.Root value="banana">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Banana
      </Checkbox.Root>
      <Checkbox.Root value="cherry">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Cherry
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <CheckboxGroup label="Disabled group" isDisabled={args.isDisabled}>
      <Checkbox.Root value="apple">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Apple
      </Checkbox.Root>
      <Checkbox.Root value="banana">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Banana
      </Checkbox.Root>
      <Checkbox.Root value="cherry">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Cherry
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <CheckboxGroup
      label="Notification preferences"
      isDisabled={args.isDisabled}
    >
      <Field.Description>Select how you would like to be notified.</Field.Description>
      <Checkbox.Root value="email">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Email
      </Checkbox.Root>
      <Checkbox.Root value="sms">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        SMS
      </Checkbox.Root>
      <Checkbox.Root value="push">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Push notification
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <CheckboxGroup
      label="Pick toppings"
      isDisabled={args.isDisabled}
      className="story-checkbox-horizontal"
    >
      <Checkbox.Root value="cheese">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Cheese
      </Checkbox.Root>
      <Checkbox.Root value="pepperoni">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Pepperoni
      </Checkbox.Root>
      <Checkbox.Root value="mushrooms">
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
        Mushrooms
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};
