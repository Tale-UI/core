import type { Meta, StoryObj } from '@storybook/react-vite';
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
            <Menu.MenuList aria-label="File">
              <Menu.Item id="new" textValue="New">New</Menu.Item>
              <Menu.Item id="open" textValue="Open">Open</Menu.Item>
              <Menu.Separator />
              <Menu.Item id="save" textValue="Save">Save</Menu.Item>
              <Menu.Item id="save-as" textValue="Save As...">Save As...</Menu.Item>
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>
      </Menubar.Item>
      <Menubar.Item>
        <Menu.Root>
          <Menu.Trigger>Edit</Menu.Trigger>
          <Menu.Popover>
            <Menu.MenuList aria-label="Edit">
              <Menu.Item id="undo" textValue="Undo">Undo</Menu.Item>
              <Menu.Item id="redo" textValue="Redo">Redo</Menu.Item>
              <Menu.Separator />
              <Menu.Item id="cut" textValue="Cut">Cut</Menu.Item>
              <Menu.Item id="copy" textValue="Copy">Copy</Menu.Item>
              <Menu.Item id="paste" textValue="Paste">Paste</Menu.Item>
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>
      </Menubar.Item>
      <Menubar.Item>
        <Menu.Root>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Popover>
            <Menu.MenuList aria-label="View">
              <Menu.Item id="zoom-in" textValue="Zoom In">Zoom In</Menu.Item>
              <Menu.Item id="zoom-out" textValue="Zoom Out">Zoom Out</Menu.Item>
              <Menu.Separator />
              <Menu.Item id="fullscreen" textValue="Fullscreen">Fullscreen</Menu.Item>
            </Menu.MenuList>
          </Menu.Popover>
        </Menu.Root>
      </Menubar.Item>
    </Menubar.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
        <span className="story-label">Default Menubar</span>
        <Menubar.Root>
          <Menubar.Item>
            <Menu.Root>
              <Menu.Trigger>File</Menu.Trigger>
              <Menu.Popover>
                <Menu.MenuList aria-label="File">
                  <Menu.Item id="av-new" textValue="New">New</Menu.Item>
                  <Menu.Item id="av-open" textValue="Open">Open</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="av-save" textValue="Save">Save</Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Menubar.Item>
          <Menubar.Item>
            <Menu.Root>
              <Menu.Trigger>Edit</Menu.Trigger>
              <Menu.Popover>
                <Menu.MenuList aria-label="Edit">
                  <Menu.Item id="av-undo" textValue="Undo">Undo</Menu.Item>
                  <Menu.Item id="av-redo" textValue="Redo">Redo</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="av-cut" textValue="Cut">Cut</Menu.Item>
                  <Menu.Item id="av-copy" textValue="Copy">Copy</Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Menubar.Item>
          <Menubar.Item>
            <Menu.Root>
              <Menu.Trigger>View</Menu.Trigger>
              <Menu.Popover>
                <Menu.MenuList aria-label="View">
                  <Menu.Item id="av-zoom-in" textValue="Zoom In">Zoom In</Menu.Item>
                  <Menu.Item id="av-zoom-out" textValue="Zoom Out">Zoom Out</Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Menubar.Item>
        </Menubar.Root>
      </div>
    );
  },
};
