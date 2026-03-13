import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from '@tale-ui/react-styled/alert-dialog';
import { Button } from '@tale-ui/react-styled/button';

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
      <AlertDialog.Trigger render={<Button variant="danger">Delete Item</Button>} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Title>{args.title}</AlertDialog.Title>
          <AlertDialog.Description>
            {args.description}
          </AlertDialog.Description>
          <div className="tale-alert-dialog__actions">
            <AlertDialog.Close render={<Button variant="neutral">Cancel</Button>} />
            <AlertDialog.Close render={<Button variant="danger">Delete</Button>} />
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

export const Warning: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="neutral">Discard Changes</Button>} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Title>Discard unsaved changes?</AlertDialog.Title>
          <AlertDialog.Description>
            You have unsaved changes that will be lost if you navigate away. Do you want to continue?
          </AlertDialog.Description>
          <div className="tale-alert-dialog__actions">
            <AlertDialog.Close render={<Button variant="primary">Keep editing</Button>} />
            <AlertDialog.Close render={<Button variant="neutral">Discard</Button>} />
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};
