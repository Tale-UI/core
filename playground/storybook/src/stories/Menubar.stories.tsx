import type { Meta, StoryObj } from '@storybook/react';
import { Menubar } from '@tale-ui/react/menubar';
import { Menu } from '@tale-ui/react/menu';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/Menubar',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <Menubar.Root>
      <Menubar.Item>
        <Menu.Root>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Popover>
            <Menu.MenuList>
              <Menu.Item id="new">New</Menu.Item>
              <Menu.Item id="open">Open</Menu.Item>
              <Menu.Separator />
              <Menu.Item id="save">Save</Menu.Item>
              <Menu.Item id="save-as">Save As...</Menu.Item>
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>
      </Menubar.Item>
      <Menubar.Item>
        <Menu.Root>
          <Menu.Trigger>Edit</Menu.Trigger>
          <Menu.Popover>
            <Menu.MenuList>
              <Menu.Item id="undo">Undo</Menu.Item>
              <Menu.Item id="redo">Redo</Menu.Item>
              <Menu.Separator />
              <Menu.Item id="cut">Cut</Menu.Item>
              <Menu.Item id="copy">Copy</Menu.Item>
              <Menu.Item id="paste">Paste</Menu.Item>
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>
      </Menubar.Item>
      <Menubar.Item>
        <Menu.Root>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popover>
            <Menu.MenuList>
              <Menu.Item id="zoom-in">Zoom In</Menu.Item>
              <Menu.Item id="zoom-out">Zoom Out</Menu.Item>
              <Menu.Separator />
              <Menu.Item id="fullscreen">Fullscreen</Menu.Item>
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>
      </Menubar.Item>
    </Menubar.Root>
  ),
};
