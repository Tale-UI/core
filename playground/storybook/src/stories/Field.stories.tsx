import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@tale-ui/react/field';
import { Input } from '@tale-ui/react/input';

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
      <Field.Root className="tale-field" disabled={args.disabled} invalid={args.invalid}>
        <Field.Label className="tale-field__label">{args.label}</Field.Label>
        <Input className="tale-input" type="email" placeholder="you@example.com" disabled={args.disabled} />
        {args.invalid ? (
          <Field.Error className="tale-field__error">{args.errorMessage}</Field.Error>
        ) : (
          <Field.Description className="tale-field__description">{args.description}</Field.Description>
        )}
      </Field.Root>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div style={{ width: '32rem' }}>
      <Field.Root className="tale-field">
        <Field.Label className="tale-field__label">
          Full name <span style={{ color: 'var(--red-60)' }}>*</span>
        </Field.Label>
        <Input className="tale-input" required placeholder="John Doe" />
      </Field.Root>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '32rem' }}>
      <Field.Root className="tale-field" disabled>
        <Field.Label className="tale-field__label">Username</Field.Label>
        <Input className="tale-input" defaultValue="john_doe" disabled />
        <Field.Description className="tale-field__description">
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
        <Field.Root className="tale-field" invalid={isInvalid}>
          <Field.Label className="tale-field__label">Username</Field.Label>
          <Input
            className="tale-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="At least 3 characters"
          />
          {isInvalid && (
            <Field.Error className="tale-field__error">
              Username must be at least 3 characters.
            </Field.Error>
          )}
          {!isInvalid && (
            <Field.Description className="tale-field__description">
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
      <Field.Root className="tale-field">
        <Field.Label className="tale-field__label">Default</Field.Label>
        <Input className="tale-input" placeholder="Type here…" />
      </Field.Root>
      <Field.Root className="tale-field" disabled>
        <Field.Label className="tale-field__label">Disabled</Field.Label>
        <Input className="tale-input" disabled placeholder="Cannot edit" />
      </Field.Root>
      <Field.Root className="tale-field" invalid>
        <Field.Label className="tale-field__label">Invalid</Field.Label>
        <Input className="tale-input" defaultValue="bad value" />
        <Field.Error className="tale-field__error">This field has an error.</Field.Error>
      </Field.Root>
    </div>
  ),
};
