import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';

const ChevronIcon = () => (
  <svg className="tale-navigation-menu__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <polyline points="4,6 8,10 12,6" />
  </svg>
);

const meta: Meta = {
  title: 'Navigation/NavigationMenu',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <NavigationMenu.Root className="tale-navigation-menu">
      <NavigationMenu.List className="tale-navigation-menu__list">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="tale-navigation-menu__trigger">
            Products <ChevronIcon />
          </NavigationMenu.Trigger>
          <NavigationMenu.Portal>
            <NavigationMenu.Positioner sideOffset={8}>
              <NavigationMenu.Popup className="tale-navigation-menu__popup">
                <NavigationMenu.Content className="tale-navigation-menu__content">
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
          <NavigationMenu.Link className="tale-navigation-menu__link" href="#">Docs</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link className="tale-navigation-menu__link" href="#">Blog</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};
