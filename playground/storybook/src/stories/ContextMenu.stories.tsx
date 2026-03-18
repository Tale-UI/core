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
        <ContextMenu.MenuList aria-label="Context actions">
          <ContextMenu.Item id="cut" textValue="Cut" onAction={() => console.log('Cut')}>Cut</ContextMenu.Item>
          <ContextMenu.Item id="copy" textValue="Copy" onAction={() => console.log('Copy')}>Copy</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item id="paste" textValue="Paste" onAction={() => console.log('Paste')}>Paste</ContextMenu.Item>
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
        <ContextMenu.MenuList aria-label="Context actions">
          <ContextMenu.Group>
            <ContextMenu.Item id="cut" textValue="Cut">Cut</ContextMenu.Item>
            <ContextMenu.Item id="copy" textValue="Copy">Copy</ContextMenu.Item>
            <ContextMenu.Item id="paste" textValue="Paste">Paste</ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item id="select-all" textValue="Select All">Select All</ContextMenu.Item>
            <ContextMenu.Item id="find" textValue="Find...">Find...</ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item id="inspect" textValue="Inspect Element">Inspect Element</ContextMenu.Item>
          </ContextMenu.Group>
        </ContextMenu.MenuList>
      </ContextMenu.Popup>
    </ContextMenu.Root>
  ),
};
