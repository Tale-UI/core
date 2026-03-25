import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Field } from '@tale-ui/react/field';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

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


export const Default: Story = {
  render: (args) => (
    <CheckboxGroup label="Favorite fruits" isDisabled={args.isDisabled}>
      <Checkbox.Root value="apple">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Apple
      </Checkbox.Root>
      <Checkbox.Root value="banana">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Banana
      </Checkbox.Root>
      <Checkbox.Root value="cherry">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
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
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Apple
      </Checkbox.Root>
      <Checkbox.Root value="banana">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Banana
      </Checkbox.Root>
      <Checkbox.Root value="cherry">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
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
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Email
      </Checkbox.Root>
      <Checkbox.Root value="sms">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        SMS
      </Checkbox.Root>
      <Checkbox.Root value="push">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
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
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Cheese
      </Checkbox.Root>
      <Checkbox.Root value="pepperoni">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Pepperoni
      </Checkbox.Root>
      <Checkbox.Root value="mushrooms">
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        Mushrooms
      </Checkbox.Root>
    </CheckboxGroup>
  ),
};
