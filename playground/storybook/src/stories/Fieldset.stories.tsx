import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from '@tale-ui/react-styled/fieldset';
import { Field } from '@tale-ui/react-styled/field';
import { Input } from '@tale-ui/react-styled/input';

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
      <Fieldset.Root disabled={args.disabled}>
        <Fieldset.Legend>{args.legend}</Fieldset.Legend>
        <Field.Root>
          <Field.Label>First name</Field.Label>
          <Input placeholder="John" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Last name</Field.Label>
          <Input placeholder="Doe" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input type="email" placeholder="john@example.com" />
          <Field.Description>
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
      <Fieldset.Root disabled>
        <Fieldset.Legend>Locked Settings</Fieldset.Legend>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Input defaultValue="john_doe" disabled />
        </Field.Root>
        <Field.Root>
          <Field.Label>Account ID</Field.Label>
          <Input defaultValue="usr_12345" disabled />
        </Field.Root>
      </Fieldset.Root>
    </div>
  ),
};
