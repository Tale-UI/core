import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@tale-ui/react/select';

type Args = {
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Select',
  decorators: [
    (Story) => (
      <div className="story-field">
        <Story />
      </div>
    ),
  ],
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
    <Select.Root isDisabled={args.isDisabled} placeholder="Select a fruit…">
      <Select.Trigger>
        <Select.Value />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
          <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
          <Select.Item id="cherry" textValue="Cherry">Cherry</Select.Item>
          <Select.Item id="grape" textValue="Grape">Grape</Select.Item>
          <Select.Item id="orange" textValue="Orange">Orange</Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <Select.Root isDisabled={args.isDisabled} placeholder="Choose one…">
      <Select.Label>Favorite fruit</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
          <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
          <Select.Item id="cherry" textValue="Cherry">Cherry</Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const WithGroups: Story = {
  render: (args) => (
    <Select.Root isDisabled={args.isDisabled} placeholder="Select a food…">
      <Select.Label>Food</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Section>
            <Select.Header>Fruits</Select.Header>
            <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
            <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
            <Select.Item id="cherry" textValue="Cherry">Cherry</Select.Item>
          </Select.Section>
          <Select.Section>
            <Select.Header>Vegetables</Select.Header>
            <Select.Item id="carrot" textValue="Carrot">Carrot</Select.Item>
            <Select.Item id="broccoli" textValue="Broccoli">Broccoli</Select.Item>
            <Select.Item id="spinach" textValue="Spinach">Spinach</Select.Item>
          </Select.Section>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const WithDisabledItems: Story = {
  render: (args) => (
    <Select.Root isDisabled={args.isDisabled} placeholder="Select…">
      <Select.Label>Available options</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
          <Select.Item id="banana" textValue="Banana" isDisabled>Banana (sold out)</Select.Item>
          <Select.Item id="cherry" textValue="Cherry">Cherry</Select.Item>
          <Select.Item id="grape" textValue="Grape" isDisabled>Grape (sold out)</Select.Item>
          <Select.Item id="orange" textValue="Orange">Orange</Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <Select.Root isDisabled={args.isDisabled} placeholder="Cannot select…">
      <Select.Label>Disabled select</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  ),
};
