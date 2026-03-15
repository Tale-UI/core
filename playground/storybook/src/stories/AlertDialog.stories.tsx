import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Button } from '@tale-ui/react/button';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/AlertDialog',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Open Alert</AlertDialog.Trigger>
      <AlertDialog.Backdrop />
      <AlertDialog.Popup>
        <AlertDialog.Content>
          <AlertDialog.Title>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
          <div style={{ display: 'flex', gap: 'var(--space-s)', justifyContent: 'flex-end', marginTop: 'var(--space-m)' }}>
            <AlertDialog.Close>Cancel</AlertDialog.Close>
            <AlertDialog.Close>Confirm</AlertDialog.Close>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
};

export const Destructive: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button>Delete Account</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop />
      <AlertDialog.Popup>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Account</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete your account? All of your data will be permanently removed.
            This action cannot be undone.
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: 'var(--space-s)', justifyContent: 'flex-end', marginTop: 'var(--space-m)' }}>
            <AlertDialog.Close>Cancel</AlertDialog.Close>
            <AlertDialog.Close>
              <Button style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-fg)' }}>
                Delete
              </Button>
            </AlertDialog.Close>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  ),
};
