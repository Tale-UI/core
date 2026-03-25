import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '@tale-ui/react/combobox';

type Args = {
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Combobox',
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
    <Combobox.Root isDisabled={args.isDisabled}>
      <Combobox.InputGroup>
        <Combobox.Input />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover>
        <Combobox.ListBox>
          <Combobox.Item id="apple" textValue="Apple">Apple</Combobox.Item>
          <Combobox.Item id="banana" textValue="Banana">Banana</Combobox.Item>
          <Combobox.Item id="cherry" textValue="Cherry">Cherry</Combobox.Item>
          <Combobox.Item id="grape" textValue="Grape">Grape</Combobox.Item>
          <Combobox.Item id="orange" textValue="Orange">Orange</Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <Combobox.Root isDisabled={args.isDisabled}>
      <Combobox.Label>Favorite fruit</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover>
        <Combobox.ListBox>
          <Combobox.Item id="apple" textValue="Apple">Apple</Combobox.Item>
          <Combobox.Item id="banana" textValue="Banana">Banana</Combobox.Item>
          <Combobox.Item id="cherry" textValue="Cherry">Cherry</Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const WithInputGroup: Story = {
  render: (args) => (
    <Combobox.Root isDisabled={args.isDisabled}>
      <Combobox.Label>Search countries</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Type to search…" />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover>
        <Combobox.ListBox>
          <Combobox.Item id="us" textValue="United States">United States</Combobox.Item>
          <Combobox.Item id="ca" textValue="Canada">Canada</Combobox.Item>
          <Combobox.Item id="mx" textValue="Mexico">Mexico</Combobox.Item>
          <Combobox.Item id="br" textValue="Brazil">Brazil</Combobox.Item>
          <Combobox.Item id="uk" textValue="United Kingdom">United Kingdom</Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const WithSections: Story = {
  render: (args) => (
    <Combobox.Root isDisabled={args.isDisabled}>
      <Combobox.Label>Food</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Search food…" />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover>
        <Combobox.ListBox>
          <Combobox.Section>
            <Combobox.Header>Fruits</Combobox.Header>
            <Combobox.Item id="apple" textValue="Apple">Apple</Combobox.Item>
            <Combobox.Item id="banana" textValue="Banana">Banana</Combobox.Item>
            <Combobox.Item id="cherry" textValue="Cherry">Cherry</Combobox.Item>
          </Combobox.Section>
          <Combobox.Section>
            <Combobox.Header>Vegetables</Combobox.Header>
            <Combobox.Item id="carrot" textValue="Carrot">Carrot</Combobox.Item>
            <Combobox.Item id="broccoli" textValue="Broccoli">Broccoli</Combobox.Item>
            <Combobox.Item id="spinach" textValue="Spinach">Spinach</Combobox.Item>
          </Combobox.Section>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Combobox.Root isDisabled={args.isDisabled}>
      <Combobox.Label>Search (try typing something not in list)</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Type to filter…" />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover>
        <Combobox.ListBox>
          <Combobox.Empty>No results found.</Combobox.Empty>
          <Combobox.Item id="apple" textValue="Apple">Apple</Combobox.Item>
          <Combobox.Item id="banana" textValue="Banana">Banana</Combobox.Item>
          <Combobox.Item id="cherry" textValue="Cherry">Cherry</Combobox.Item>
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  ),
};
