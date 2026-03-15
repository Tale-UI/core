import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from '@tale-ui/react/context-menu';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/ContextMenu',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
      <ContextMenu.Popup>
        <ContextMenu.MenuList>
          <ContextMenu.Item id="cut" onAction={() => console.log('Cut')}>Cut</ContextMenu.Item>
          <ContextMenu.Item id="copy" onAction={() => console.log('Copy')}>Copy</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item id="paste" onAction={() => console.log('Paste')}>Paste</ContextMenu.Item>
        </ContextMenu.MenuList>
      </ContextMenu.Popup>
    </ContextMenu.Root>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          style={{
            padding: 'var(--space-xl)',
            border: '2px dashed var(--neutral-30)',
            borderRadius: 'var(--space-2xs)',
            textAlign: 'center',
            color: 'var(--neutral-60)',
          }}
        >
          Right-click this area
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Popup>
        <ContextMenu.MenuList>
          <ContextMenu.Group>
            <ContextMenu.Item id="cut">Cut</ContextMenu.Item>
            <ContextMenu.Item id="copy">Copy</ContextMenu.Item>
            <ContextMenu.Item id="paste">Paste</ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item id="select-all">Select All</ContextMenu.Item>
            <ContextMenu.Item id="find">Find...</ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item id="inspect">Inspect Element</ContextMenu.Item>
          </ContextMenu.Group>
        </ContextMenu.MenuList>
      </ContextMenu.Popup>
    </ContextMenu.Root>
  ),
};
