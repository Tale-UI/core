import type { Meta, StoryObj } from '@storybook/react';
import { SearchField } from '@tale-ui/react/search-field';

type Args = {
  isDisabled?: boolean;
  placeholder?: string;
};

const meta: Meta<Args> = {
  title: 'Components/SearchField',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', width: '320px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isDisabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    isDisabled: false,
    placeholder: 'Search...',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <SearchField.Root isDisabled={args.isDisabled}>
      <SearchField.Input placeholder={args.placeholder} />
    </SearchField.Root>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <SearchField.Root {...args}>
      <SearchField.Label>Search</SearchField.Label>
      <SearchField.Input placeholder={args.placeholder} />
    </SearchField.Root>
  ),
};

export const WithClearButton: Story = {
  render: (args) => (
    <SearchField.Root defaultValue="React" {...args}>
      <SearchField.Label>Search</SearchField.Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)' }}>
        <SearchField.Input placeholder={args.placeholder} />
        <SearchField.ClearButton>&times;</SearchField.ClearButton>
      </div>
    </SearchField.Root>
  ),
};
