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
      <Drawer.Trigger>Open Drawer</Drawer.Trigger>
      <Drawer.Popup>
        <p>Drawer content goes here.</p>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open Drawer</Drawer.Trigger>
      <Drawer.Popup>
        <Drawer.Title>Drawer Title</Drawer.Title>
        <Drawer.Description>This is a description of the drawer content.</Drawer.Description>
        <p style={{ marginTop: 'var(--space-s)' }}>
          Additional content can go here.
        </p>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const WithBackdrop: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open Drawer</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup>
        <Drawer.Title>Drawer with Backdrop</Drawer.Title>
        <Drawer.Description>Click the backdrop to close.</Drawer.Description>
        <Drawer.Close>×</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};
