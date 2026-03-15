import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '@tale-ui/react/menu';
import { Button } from '@tale-ui/react/button';

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
        <Menu.Trigger>
          <Button>Options ▾</Button>
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList>
            <Menu.Item id="new">New File</Menu.Item>
            <Menu.Item id="open">Open</Menu.Item>
            <Menu.Separator />
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="save-as">Save As…</Menu.Item>
            <Menu.Separator />
            <Menu.Item id="close">Close</Menu.Item>
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
        <Menu.Trigger>
          <Button>Actions ▾</Button>
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList>
            <Menu.Group>
              <Menu.Header>Edit</Menu.Header>
              <Menu.Item id="cut">Cut</Menu.Item>
              <Menu.Item id="copy">Copy</Menu.Item>
              <Menu.Item id="paste">Paste</Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.Header>View</Menu.Header>
              <Menu.Item id="zoom-in">Zoom In</Menu.Item>
              <Menu.Item id="zoom-out">Zoom Out</Menu.Item>
              <Menu.Item id="reset-zoom">Reset Zoom</Menu.Item>
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
        <Menu.Trigger>
          <Button>Edit ▾</Button>
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList>
            <Menu.Item id="undo">Undo</Menu.Item>
            <Menu.Item id="redo" isDisabled>
              Redo
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item id="cut">Cut</Menu.Item>
            <Menu.Item id="copy">Copy</Menu.Item>
            <Menu.Item id="paste" isDisabled>
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
        <Menu.Trigger>
          <Button>Disabled Menu ▾</Button>
        </Menu.Trigger>
        <Menu.Popover placement={args.placement} offset={args.offset}>
          <Menu.MenuList>
            <Menu.Item id="a">Item A</Menu.Item>
            <Menu.Item id="b">Item B</Menu.Item>
            <Menu.Item id="c">Item C</Menu.Item>
          </Menu.MenuList>
        </Menu.Popover>
      </Menu.Root>
    </div>
  ),
};
