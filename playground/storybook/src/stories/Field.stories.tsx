import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@tale-ui/react-styled/field';
import { Input } from '@tale-ui/react-styled/input';

type Args = {
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
};

const meta: Meta<Args> = {
  title: 'Form/Field',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    disabled: false,
    invalid: false,
    label: 'Email address',
    description: 'We\'ll never share your email with anyone.',
    errorMessage: 'Please enter a valid email address.',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '32rem' }}>
      <Field.Root disabled={args.disabled} invalid={args.invalid}>
        <Field.Label>{args.label}</Field.Label>
        <Input type="email" placeholder="you@example.com" disabled={args.disabled} />
        {args.invalid ? (
          <Field.Error>{args.errorMessage}</Field.Error>
        ) : (
          <Field.Description>{args.description}</Field.Description>
        )}
      </Field.Root>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div style={{ width: '32rem' }}>
      <Field.Root>
        <Field.Label>
          Full name <span style={{ color: 'var(--red-60)' }}>*</span>
        </Field.Label>
        <Input required placeholder="John Doe" />
      </Field.Root>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '32rem' }}>
      <Field.Root disabled>
        <Field.Label>Username</Field.Label>
        <Input defaultValue="john_doe" disabled />
        <Field.Description>
          Username cannot be changed.
        </Field.Description>
      </Field.Root>
    </div>
  ),
};

export const WithValidation: Story = {
  name: 'With Validation',
  render: () => {
    const [value, setValue] = React.useState('');
    const [touched, setTouched] = React.useState(false);
    const isInvalid = touched && value.length < 3;

    return (
      <div style={{ width: '32rem' }}>
        <Field.Root invalid={isInvalid}>
          <Field.Label>Username</Field.Label>
          <Input
           
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="At least 3 characters"
          />
          {isInvalid && (
            <Field.Error>
              Username must be at least 3 characters.
            </Field.Error>
          )}
          {!isInvalid && (
            <Field.Description>
              Choose a unique username.
            </Field.Description>
          )}
        </Field.Root>
      </div>
    );
  },
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ width: '32rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Field.Root>
        <Field.Label>Default</Field.Label>
        <Input placeholder="Type here…" />
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>Disabled</Field.Label>
        <Input disabled placeholder="Cannot edit" />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>Invalid</Field.Label>
        <Input defaultValue="bad value" />
        <Field.Error>This field has an error.</Field.Error>
      </Field.Root>
    </div>
  ),
};
