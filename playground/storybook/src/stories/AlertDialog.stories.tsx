import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Button } from '@tale-ui/react/button';

type Args = {
  title?: string;
  description?: string;
};

const meta: Meta<Args> = {
  title: 'Overlay/AlertDialog',
  parameters: { layout: 'centered' },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'Are you sure?',
    description: 'This will permanently delete the item. This action cannot be undone.',
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button className="tale-button tale-button--danger">Delete Item</Button>} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="tale-alert-dialog__backdrop" />
        <AlertDialog.Popup className="tale-alert-dialog__popup">
          <AlertDialog.Title className="tale-alert-dialog__title">{args.title}</AlertDialog.Title>
          <AlertDialog.Description className="tale-alert-dialog__description">
            {args.description}
          </AlertDialog.Description>
          <div className="tale-alert-dialog__actions">
            <AlertDialog.Close render={<Button className="tale-button tale-button--neutral">Cancel</Button>} />
            <AlertDialog.Close render={<Button className="tale-button tale-button--danger">Delete</Button>} />
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

export const Warning: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button className="tale-button tale-button--neutral">Discard Changes</Button>} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="tale-alert-dialog__backdrop" />
        <AlertDialog.Popup className="tale-alert-dialog__popup">
          <AlertDialog.Title className="tale-alert-dialog__title">Discard unsaved changes?</AlertDialog.Title>
          <AlertDialog.Description className="tale-alert-dialog__description">
            You have unsaved changes that will be lost if you navigate away. Do you want to continue?
          </AlertDialog.Description>
          <div className="tale-alert-dialog__actions">
            <AlertDialog.Close render={<Button className="tale-button tale-button--primary">Keep editing</Button>} />
            <AlertDialog.Close render={<Button className="tale-button tale-button--neutral">Discard</Button>} />
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};
