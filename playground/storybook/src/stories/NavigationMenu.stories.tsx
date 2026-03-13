import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';

const meta: Meta = {
  title: 'Navigation/NavigationMenu',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>
            Products
          </NavigationMenu.Trigger>
          <NavigationMenu.Portal>
            <NavigationMenu.Positioner sideOffset={8}>
              <NavigationMenu.Popup>
                <NavigationMenu.Content>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    {['Components', 'Tokens', 'Icons', 'Themes'].map((item) => (
                      <div key={item} style={{ padding: '0.8rem', borderRadius: '0.6rem', background: 'var(--neutral-12)', cursor: 'pointer' }}>
                        <div style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', fontWeight: 'var(--label-font-weight)', color: 'var(--neutral-90)' }}>{item}</div>
                        <div style={{ fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-60)', marginTop: '0.4rem' }}>Browse {item.toLowerCase()}</div>
                      </div>
                    ))}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Popup>
            </NavigationMenu.Positioner>
          </NavigationMenu.Portal>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Docs</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Blog</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};
