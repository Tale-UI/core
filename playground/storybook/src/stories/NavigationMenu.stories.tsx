import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/NavigationMenu',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">About</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Contact</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};

function WithDropdownExample() {
  const [open, setOpen] = useState(false);

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger onClick={() => setOpen(!open)}>
            Products ▾
          </NavigationMenu.Trigger>
          {open && (
            <NavigationMenu.Popup>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="#">Widget Pro</NavigationMenu.Link>
                <NavigationMenu.Link href="#">Gadget Plus</NavigationMenu.Link>
                <NavigationMenu.Link href="#">Tool Suite</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Popup>
          )}
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Contact</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export const WithDropdown: Story = {
  render: () => <WithDropdownExample />,
};
