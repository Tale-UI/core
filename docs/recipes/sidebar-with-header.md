# Sidebar with Header

A two-region layout with a fixed sidebar, top header bar, and scrollable main content.

## Components Used

- `NavigationMenu` from `@tale-ui/react/navigation-menu`
- `Drawer` from `@tale-ui/react/drawer`
- `IconButton` from `@tale-ui/react/icon-button`
- `Icon` from `@tale-ui/react/icon`
- `Separator` from `@tale-ui/react/separator`
- `Button` from `@tale-ui/react/button`
- `Menu`, `Home`, `Settings`, `Users`, `FileText`, `Bell` from `lucide-react`

## Code

```tsx
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { Drawer } from '@tale-ui/react/drawer';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { Separator } from '@tale-ui/react/separator';
import { Button } from '@tale-ui/react/button';
import { Menu, Home, Settings, Users, FileText, Bell } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function SidebarNav() {
  return (
    <NavigationMenu.Root orientation="vertical">
      <NavigationMenu.List>
        {navItems.map((item) => (
          <NavigationMenu.Item key={item.href}>
            <NavigationMenu.Link href={item.href}>
              <NavigationMenu.Icon><Icon icon={item.icon} size="sm" /></NavigationMenu.Icon>
              {item.label}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Desktop sidebar */}
      <aside className="app-sidebar">
        <div style={{ padding: 'var(--space-m)', fontWeight: 700, fontSize: 'var(--label-l-font-size)' }}>
          Acme
        </div>
        <Separator />
        <div style={{ padding: 'var(--space-s)' }}>
          <SidebarNav />
        </div>
      </aside>

      <div className="app-main">
        {/* Header */}
        <header className="app-header">
          {/* Mobile menu trigger */}
          <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Drawer.Trigger className="mobile-menu-trigger">
              <IconButton aria-label="Open menu" variant="ghost">
                <Icon icon={Menu} />
              </IconButton>
            </Drawer.Trigger>
            <Drawer.Backdrop />
            <Drawer.Popup side="left" style={{ width: 280, padding: 'var(--space-s)' }}>
              <Drawer.Title>Navigation</Drawer.Title>
              <SidebarNav />
            </Drawer.Popup>
          </Drawer.Root>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)' }}>
            <IconButton aria-label="Notifications" variant="ghost" size="sm">
              <Icon icon={Bell} size="sm" />
            </IconButton>
            <Button variant="ghost" size="sm">Account</Button>
          </div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, padding: 'var(--space-l)', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
```

```css
/* Add to your app CSS */
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-sidebar {
  width: 240px;
  border-right: 1px solid var(--neutral-16);
  flex-shrink: 0;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-header {
  display: flex;
  align-items: center;
  padding: var(--space-xs) var(--space-m);
  border-bottom: 1px solid var(--neutral-16);
}

.mobile-menu-trigger { display: none; }

@media (max-width: 768px) {
  .app-sidebar { display: none; }
  .mobile-menu-trigger { display: block; }
}
```

## Customization Points

- Replace the logo text with your brand component or image.
- Add a user avatar or profile dropdown in the header's right section.
- Use `aria-current="page"` on the active nav link for screen reader support.
- For a collapsible sidebar (icon-only mode), toggle the sidebar width between `240px` and `64px` and conditionally hide link labels.
- Adjust the `768px` breakpoint to match your design requirements.
- `Drawer.Root` uses `open`/`onOpenChange` (not `isOpen`) — it's a custom component.
