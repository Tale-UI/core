import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@tale-ui/react-styled/dialog';
import { Button } from '@tale-ui/react-styled/button';

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="16" height="16">
    <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

type Args = {
  modal?: boolean;
  title?: string;
  description?: string;
};

const meta: Meta<Args> = {
  title: 'Overlay/Dialog',
  parameters: { layout: 'centered' },
  argTypes: {
    modal: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    modal: true,
    title: 'Dialog Title',
    description: 'This is a modal dialog. It traps focus and requires the user to take action before returning to the page.',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Dialog.Root modal={args.modal}>
      <Dialog.Trigger render={<Button variant="primary">Open Dialog</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Close aria-label="Close">
            <XIcon />
          </Dialog.Close>
          <Dialog.Title>{args.title}</Dialog.Title>
          <Dialog.Description>
            {args.description}
          </Dialog.Description>
          <div className="tale-dialog__actions">
            <Dialog.Close render={<Button variant="neutral">Cancel</Button>} />
            <Dialog.Close render={<Button variant="primary">Confirm</Button>} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="danger">Delete Account</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Title>Delete Account?</Dialog.Title>
          <Dialog.Description>
            This action cannot be undone. All your data will be permanently removed from our servers.
          </Dialog.Description>
          <div className="tale-dialog__actions">
            <Dialog.Close render={<Button variant="neutral">Cancel</Button>} />
            <Dialog.Close render={<Button variant="danger">Delete</Button>} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

export const LongContent: Story = {
  name: 'Scrollable Content',
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="neutral">Open Long Dialog</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Close aria-label="Close"><XIcon /></Dialog.Close>
          <Dialog.Title>Terms of Service</Dialog.Title>
          <Dialog.Description>
            {Array.from({ length: 8 }, (_, i) => (
              <p key={i} style={{ margin: '0 0 1rem' }}>
                Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>
            ))}
          </Dialog.Description>
          <div className="tale-dialog__actions">
            <Dialog.Close render={<Button variant="primary">Accept</Button>} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};
