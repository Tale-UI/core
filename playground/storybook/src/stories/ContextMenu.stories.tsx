import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from '@tale-ui/react/context-menu';
import { Menu } from '@tale-ui/react/menu';

const meta: Meta = {
  title: 'Navigation/ContextMenu',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div style={{
          width: '32rem',
          height: '16rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed var(--neutral-26)',
          borderRadius: '0.8rem',
          color: 'var(--neutral-60)',
          fontFamily: 'var(--body-font-family)',
          fontSize: 'var(--text-m-font-size)',
          cursor: 'context-menu',
          userSelect: 'none',
        }}>
          Right-click me
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup className="tale-menu__popup">
            <Menu.Item className="tale-menu__item">View</Menu.Item>
            <Menu.Item className="tale-menu__item">Edit</Menu.Item>
            <Menu.Item className="tale-menu__item">Copy</Menu.Item>
            <Menu.Separator className="tale-menu__separator" />
            <Menu.Item className="tale-menu__item">Delete</Menu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};
