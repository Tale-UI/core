import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@tale-ui/react/dialog';
import { Button } from '@tale-ui/react/button';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Dialog',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<Args>;

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="16" height="16">
    <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

function DialogDemo({ triggerLabel, triggerVariant = 'primary', title, description, children }: {
  triggerLabel: string;
  triggerVariant?: 'primary' | 'neutral' | 'danger';
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={`tale-button--${triggerVariant}`}>{triggerLabel}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Popup>
        <Dialog.Close aria-label="Close"><XIcon /></Dialog.Close>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        {children ?? (
          <div className="tale-dialog__actions">
            <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onPress={() => setOpen(false)}>Confirm</Button>
          </div>
        )}
      </Dialog.Popup>
    </Dialog.Root>
  );
}

export const Default: Story = {
  render: () => (
    <DialogDemo
      triggerLabel="Open Dialog"
      title="Confirm action"
      description="Are you sure you want to proceed? This action can be undone later."
    />
  ),
};

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="tale-button--danger">Delete Account</Dialog.Trigger>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Close aria-label="Close"><XIcon /></Dialog.Close>
          <Dialog.Title>Delete account</Dialog.Title>
          <Dialog.Description>
            This action is permanent and cannot be undone. All your data will be lost.
          </Dialog.Description>
          <div className="tale-dialog__actions">
            <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onPress={() => setOpen(false)}>Delete</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Root>
    );
  },
};

export const ScrollableContent: Story = {
  name: 'Scrollable Content',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="tale-button--primary">Terms &amp; Conditions</Dialog.Trigger>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Close aria-label="Close"><XIcon /></Dialog.Close>
          <Dialog.Title>Terms of Service</Dialog.Title>
          <Dialog.Description>Please read the following terms carefully.</Dialog.Description>
          <div
            style={{
              maxHeight: '300px',
              overflow: 'auto',
              marginTop: 'var(--space-m)',
              padding: 'var(--space-s)',
              border: '1px solid var(--neutral-20)',
              borderRadius: 'var(--radius-m)',
            }}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} style={{ marginBottom: 'var(--space-s)' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            ))}
          </div>
          <div className="tale-dialog__actions">
            <Button variant="neutral" onPress={() => setOpen(false)}>Decline</Button>
            <Button variant="primary" onPress={() => setOpen(false)}>Accept</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Root>
    );
  },
};

export const NonModal: Story = {
  name: 'Non-Modal',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="tale-button--neutral">Open Non-Modal</Dialog.Trigger>
        <Dialog.Popup modalProps={{ isDismissable: true }}>
          <Dialog.Title>Notification</Dialog.Title>
          <Dialog.Description>
            This is a non-modal dialog. You can still interact with the page behind it.
          </Dialog.Description>
          <div className="tale-dialog__actions">
            <Button variant="neutral" onPress={() => setOpen(false)}>Dismiss</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Root>
    );
  },
};
