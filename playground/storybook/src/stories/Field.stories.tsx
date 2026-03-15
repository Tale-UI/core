import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@tale-ui/react/field';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Field',
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: 'var(--space-m)' }}>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input className="tale-input" placeholder="Enter your name" />
        </Field.Control>
      </Field.Root>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: 'var(--space-m)' }}>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input className="tale-input" type="email" placeholder="you@example.com" />
        </Field.Control>
        <Field.Description>We will never share your email with anyone.</Field.Description>
      </Field.Root>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: 'var(--space-m)' }}>
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <Field.Control>
          <input className="tale-input" type="password" />
        </Field.Control>
        <Field.Description>Must be at least 8 characters long.</Field.Description>
        <Field.Error>This field is required.</Field.Error>
      </Field.Root>
    </div>
  ),
};

