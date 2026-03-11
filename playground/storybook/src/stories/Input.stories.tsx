import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@tale-ui/react/input';

type Args = Omit<React.ComponentProps<typeof Input>, 'size'> & {
  size?: 'sm' | 'md' | 'lg';
};

const meta: Meta<Args> = {
  title: 'Form Controls/Input',
  component: Input,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Enter text…',
    size: 'md',
    disabled: false,
  },
  render: ({ size = 'md', ...args }) => (
    <div style={{ width: '28rem' }}>
      <Input
        className={`tale-input${size !== 'md' ? ` tale-input--${size}` : ''}`}
        {...args}
      />
    </div>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };

export const Large: Story = { args: { size: 'lg' } };

export const Disabled: Story = { args: { disabled: true } };

export const WithValue: Story = {
  name: 'With Value',
  args: { defaultValue: 'hello@example.com', placeholder: 'Email' },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '28rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input
          key={size}
          className={`tale-input tale-input--${size}`}
          placeholder={`${size.toUpperCase()} input`}
        />
      ))}
    </div>
  ),
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '28rem' }}>
      <Input className="tale-input" placeholder="Default" />
      <Input className="tale-input" defaultValue="With value" />
      <Input className="tale-input" disabled placeholder="Disabled" />
    </div>
  ),
};
