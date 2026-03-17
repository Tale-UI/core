import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from '@tale-ui/react/fieldset';
import { TextField } from '@tale-ui/react/text-field';

type Args = {
  disabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Fieldset',
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: '500px', padding: 'var(--space-m)' }}>
      <Fieldset.Root disabled={args.disabled}>
        <Fieldset.Legend>Personal Information</Fieldset.Legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
          <TextField.Root>
            <TextField.Label>First Name</TextField.Label>
            <TextField.Input placeholder="John" />
          </TextField.Root>
          <TextField.Root>
            <TextField.Label>Last Name</TextField.Label>
            <TextField.Input placeholder="Doe" />
          </TextField.Root>
          <TextField.Root type="email">
            <TextField.Label>Email</TextField.Label>
            <TextField.Input placeholder="john@example.com" />
          </TextField.Root>
        </div>
      </Fieldset.Root>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '500px', padding: 'var(--space-m)' }}>
      <Fieldset.Root disabled>
        <Fieldset.Legend>Billing Address (disabled)</Fieldset.Legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
          <TextField.Root>
            <TextField.Label>Street</TextField.Label>
            <TextField.Input placeholder="123 Main St" />
          </TextField.Root>
          <TextField.Root>
            <TextField.Label>City</TextField.Label>
            <TextField.Input placeholder="Anytown" />
          </TextField.Root>
          <TextField.Root>
            <TextField.Label>Zip Code</TextField.Label>
            <TextField.Input placeholder="12345" />
          </TextField.Root>
        </div>
      </Fieldset.Root>
    </div>
  ),
};
