import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible } from '@tale-ui/react/collapsible';

type Args = {
  disabled?: boolean;
  defaultOpen?: boolean;
};

const meta: Meta<Args> = {
  title: 'Layout/Collapsible',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
  args: {
    disabled: false,
    defaultOpen: false,
  },
  render: (args) => (
    <div style={{ width: '36rem' }}>
      <Collapsible.Root className="tale-collapsible" disabled={args.disabled} defaultOpen={args.defaultOpen}>
        <Collapsible.Trigger className="tale-collapsible__trigger">
          {args.defaultOpen ? 'Hide details' : 'Toggle details'}
        </Collapsible.Trigger>
        <Collapsible.Panel className="tale-collapsible__panel">
          <div style={{ padding: '1.2rem 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)', lineHeight: '1.6' }}>
            This content is revealed when you click the trigger above. Collapsible is useful for hiding secondary content that the user can show on demand.
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  ),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const DefaultOpen: Story = {
  name: 'Default Open',
  args: { defaultOpen: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
