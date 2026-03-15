import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from '@tale-ui/react/fieldset';

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
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>First Name</label>
            <input className="tale-input" placeholder="John" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>Last Name</label>
            <input className="tale-input" placeholder="Doe" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>Email</label>
            <input className="tale-input" type="email" placeholder="john@example.com" />
          </div>
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
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>Street</label>
            <input className="tale-input" placeholder="123 Main St" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>City</label>
            <input className="tale-input" placeholder="Anytown" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>Zip Code</label>
            <input className="tale-input" placeholder="12345" />
          </div>
        </div>
      </Fieldset.Root>
    </div>
  ),
};
