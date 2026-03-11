import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '@tale-ui/react/menu';
import { Button } from '@tale-ui/react/button';

const CheckIcon = () => (
  <svg className="tale-menu__item-indicator" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="2,7 5.5,10.5 12,3.5" />
  </svg>
);

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
      <Menu.Trigger render={<Button className="tale-button tale-button--neutral">Options ▾</Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup className="tale-menu__popup">
            <Menu.Item className="tale-menu__item" onClick={() => {}}>Edit</Menu.Item>
            <Menu.Item className="tale-menu__item" onClick={() => {}}>Duplicate</Menu.Item>
            <Menu.Separator className="tale-menu__separator" />
            <Menu.Item className="tale-menu__item" onClick={() => {}}>Share</Menu.Item>
            <Menu.Separator className="tale-menu__separator" />
            <Menu.Item className="tale-menu__item" onClick={() => {}}>Delete</Menu.Item>
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
      <Menu.Trigger render={<Button className="tale-button tale-button--neutral">Account ▾</Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup className="tale-menu__popup">
            <Menu.Group>
              <Menu.GroupLabel className="tale-menu__group-label">Account</Menu.GroupLabel>
              <Menu.Item className="tale-menu__item">Profile</Menu.Item>
              <Menu.Item className="tale-menu__item">Settings</Menu.Item>
            </Menu.Group>
            <Menu.Separator className="tale-menu__separator" />
            <Menu.Group>
              <Menu.GroupLabel className="tale-menu__group-label">Danger Zone</Menu.GroupLabel>
              <Menu.Item className="tale-menu__item">Sign out</Menu.Item>
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
        <Menu.Trigger render={<Button className="tale-button tale-button--neutral">Format ▾</Button>} />
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup className="tale-menu__popup">
              {(Object.keys(checked) as (keyof typeof checked)[]).map((key) => (
                <Menu.CheckboxItem
                  key={key}
                  className="tale-menu__checkbox-item"
                  checked={checked[key]}
                  onCheckedChange={(val) => setChecked((prev) => ({ ...prev, [key]: val }))}
                >
                  {checked[key] && <CheckIcon />}
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
      <Menu.Trigger render={<Button className="tale-button tale-button--neutral">More ▾</Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup className="tale-menu__popup">
            <Menu.Item className="tale-menu__item">Edit</Menu.Item>
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger className="tale-menu__submenu-trigger">Export</Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner side="right" sideOffset={4}>
                  <Menu.Popup className="tale-menu__popup">
                    <Menu.Item className="tale-menu__item">PNG</Menu.Item>
                    <Menu.Item className="tale-menu__item">SVG</Menu.Item>
                    <Menu.Item className="tale-menu__item">PDF</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
            <Menu.Separator className="tale-menu__separator" />
            <Menu.Item className="tale-menu__item">Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};
