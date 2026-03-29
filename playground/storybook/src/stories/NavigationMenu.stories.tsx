import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
            Products <NavigationMenu.Icon />
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

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">Default</span>
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
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="story-label">With Dropdown</span>
          <WithDropdownExample />
        </div>
      </div>
    );
  },
};
