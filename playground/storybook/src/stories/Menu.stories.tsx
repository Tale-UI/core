import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '@tale-ui/react/menu';

type Args = {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
};

const meta: Meta<Args> = {
  title: 'Components/Menu',
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    offset: { control: 'number' },
  },
  args: {
    placement: 'bottom',
    offset: 4,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 'var(--space-4xl)' }}>
      <Menu.Root>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options ▾</Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="File actions">
            <Menu.Item id="new" textValue="New File">New File</Menu.Item>
            <Menu.Item id="open" textValue="Open">Open</Menu.Item>
            <Menu.Separator />
            <Menu.Item id="save" textValue="Save">Save</Menu.Item>
            <Menu.Item id="save-as" textValue="Save As…">Save As…</Menu.Item>
            <Menu.Separator />
            <Menu.Item id="close" textValue="Close">Close</Menu.Item>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const WithGroups: Story = {
  render: (args) => (
    <div style={{ padding: 'var(--space-4xl)' }}>
      <Menu.Root>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Actions ▾</Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="Actions">
            <Menu.Group>
              <Menu.Header>Edit</Menu.Header>
              <Menu.Item id="cut" textValue="Cut">Cut</Menu.Item>
              <Menu.Item id="copy" textValue="Copy">Copy</Menu.Item>
              <Menu.Item id="paste" textValue="Paste">Paste</Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.Header>View</Menu.Header>
              <Menu.Item id="zoom-in" textValue="Zoom In">Zoom In</Menu.Item>
              <Menu.Item id="zoom-out" textValue="Zoom Out">Zoom Out</Menu.Item>
              <Menu.Item id="reset-zoom" textValue="Reset Zoom">Reset Zoom</Menu.Item>
            </Menu.Group>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const WithDisabledItems: Story = {
  render: (args) => (
    <div style={{ padding: 'var(--space-4xl)' }}>
      <Menu.Root>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Edit ▾</Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="Edit actions">
            <Menu.Item id="undo" textValue="Undo">Undo</Menu.Item>
            <Menu.Item id="redo" textValue="Redo" isDisabled>
              Redo
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item id="cut" textValue="Cut">Cut</Menu.Item>
            <Menu.Item id="copy" textValue="Copy">Copy</Menu.Item>
            <Menu.Item id="paste" textValue="Paste" isDisabled>
              Paste
            </Menu.Item>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ padding: 'var(--space-4xl)' }}>
      <Menu.Root isDisabled>
        <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Disabled Menu ▾</Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList aria-label="Menu">
            <Menu.Item id="a" textValue="Item A">Item A</Menu.Item>
            <Menu.Item id="b" textValue="Item B">Item B</Menu.Item>
            <Menu.Item id="c" textValue="Item C">Item C</Menu.Item>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};
