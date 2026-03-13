import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '@tale-ui/react-styled/menu';
import { Button } from '@tale-ui/react-styled/button';

type Args = {
  disabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Navigation/Menu',
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Menu.Root disabled={args.disabled}>
      <Menu.Trigger render={<Button variant="neutral">Options ▾</Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            <Menu.Item onClick={() => {}}>Edit</Menu.Item>
            <Menu.Item onClick={() => {}}>Duplicate</Menu.Item>
            <Menu.Separator />
            <Menu.Item onClick={() => {}}>Share</Menu.Item>
            <Menu.Separator />
            <Menu.Item onClick={() => {}}>Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const WithGroupLabels: Story = {
  name: 'With Group Labels',
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="neutral">Account ▾</Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>Account</Menu.GroupLabel>
              <Menu.Item>Profile</Menu.Item>
              <Menu.Item>Settings</Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.GroupLabel>Danger Zone</Menu.GroupLabel>
              <Menu.Item>Sign out</Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const WithCheckboxItems: Story = {
  name: 'Checkbox Items',
  render: () => {
    const [checked, setChecked] = React.useState({ bold: false, italic: true, underline: false });
    return (
      <Menu.Root>
        <Menu.Trigger render={<Button variant="neutral">Format ▾</Button>} />
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup>
              {(Object.keys(checked) as (keyof typeof checked)[]).map((key) => (
                <Menu.CheckboxItem
                  key={key}
                 
                  checked={checked[key]}
                  onCheckedChange={(val) => setChecked((prev) => ({ ...prev, [key]: val }))}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Menu.CheckboxItem>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    );
  },
};

export const WithSubMenu: Story = {
  name: 'With Submenu',
  render: () => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="neutral">More ▾</Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            <Menu.Item>Edit</Menu.Item>
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger>Export</Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner side="right" sideOffset={4}>
                  <Menu.Popup>
                    <Menu.Item>PNG</Menu.Item>
                    <Menu.Item>SVG</Menu.Item>
                    <Menu.Item>PDF</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
            <Menu.Separator />
            <Menu.Item>Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};
