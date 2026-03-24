import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@tale-ui/react/drawer';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Drawer',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Popup>
        <p>Drawer content goes here.</p>
        <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Popup>
        <Drawer.Title>Drawer Title</Drawer.Title>
        <Drawer.Description>This is a description of the drawer content.</Drawer.Description>
        <p className="story-drawer-content">
          Additional content can go here.
        </p>
        <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithBackdrop: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup>
        <Drawer.Title>Drawer with Backdrop</Drawer.Title>
        <Drawer.Description>Click the backdrop to close.</Drawer.Description>
        <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithHandle: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup>
        <Drawer.Handle />
        <Drawer.Title>Drawer with Handle</Drawer.Title>
        <Drawer.Description>The handle bar indicates this drawer is draggable.</Drawer.Description>
        <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup>
        <Drawer.Handle />
        <Drawer.Title>Confirm Action</Drawer.Title>
        <Drawer.Description>
          Are you sure you want to proceed?
        </Drawer.Description>
        <div className="story-row story-row--s" style={{ marginTop: 'var(--space-m)' }}>
          <Drawer.Close className="tale-button tale-button--neutral">Cancel</Drawer.Close>
          <Drawer.Close className="tale-button tale-button--primary">Confirm</Drawer.Close>
        </div>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};
