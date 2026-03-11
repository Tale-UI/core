import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from '@tale-ui/react/fieldset';
import { Field } from '@tale-ui/react/field';
import { Input } from '@tale-ui/react/input';

type Args = {
  disabled?: boolean;
  legend?: string;
};

const meta: Meta<Args> = {
  title: 'Form/Fieldset',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    legend: { control: 'text' },
  },
  args: {
    disabled: false,
    legend: 'Personal Information',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '40rem' }}>
      <Fieldset.Root className="tale-fieldset" disabled={args.disabled}>
        <Fieldset.Legend className="tale-fieldset__legend">{args.legend}</Fieldset.Legend>
        <Field.Root className="tale-field">
          <Field.Label className="tale-field__label">First name</Field.Label>
          <Input className="tale-input" placeholder="John" />
        </Field.Root>
        <Field.Root className="tale-field">
          <Field.Label className="tale-field__label">Last name</Field.Label>
          <Input className="tale-input" placeholder="Doe" />
        </Field.Root>
        <Field.Root className="tale-field">
          <Field.Label className="tale-field__label">Email</Field.Label>
          <Input className="tale-input" type="email" placeholder="john@example.com" />
          <Field.Description className="tale-field__description">
            Used for account notifications.
          </Field.Description>
        </Field.Root>
      </Fieldset.Root>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '40rem' }}>
      <Fieldset.Root className="tale-fieldset" disabled>
        <Fieldset.Legend className="tale-fieldset__legend">Locked Settings</Fieldset.Legend>
        <Field.Root className="tale-field">
          <Field.Label className="tale-field__label">Username</Field.Label>
          <Input className="tale-input" defaultValue="john_doe" disabled />
        </Field.Root>
        <Field.Root className="tale-field">
          <Field.Label className="tale-field__label">Account ID</Field.Label>
          <Input className="tale-input" defaultValue="usr_12345" disabled />
        </Field.Root>
      </Fieldset.Root>
    </div>
  ),
};
