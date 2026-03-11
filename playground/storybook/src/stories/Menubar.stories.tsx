import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menubar } from '@tale-ui/react/menubar';
import { Menu } from '@tale-ui/react/menu';

const meta: Meta = {
  title: 'Navigation/Menubar',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Menubar className="tale-menubar">
      {(['File', 'Edit', 'View', 'Help'] as const).map((label) => (
        <Menu.Root key={label}>
          <Menu.Trigger className="tale-menubar__item">{label}</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={4} align="start">
              <Menu.Popup className="tale-menu__popup">
                <Menu.Item className="tale-menu__item">{label} → Option 1</Menu.Item>
                <Menu.Item className="tale-menu__item">{label} → Option 2</Menu.Item>
                <Menu.Separator className="tale-menu__separator" />
                <Menu.Item className="tale-menu__item">{label} → Option 3</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      ))}
    </Menubar>
  ),
};
