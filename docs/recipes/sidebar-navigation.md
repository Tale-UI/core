# Sidebar Navigation

A responsive sidebar that collapses into a mobile drawer on small screens.

## Components Used

- `NavigationMenu` from `@tale-ui/react/navigation-menu`
- `Drawer` from `@tale-ui/react/drawer`
- `IconButton` from `@tale-ui/react/icon-button`
- `Icon` from `@tale-ui/react/icon`
- `Separator` from `@tale-ui/react/separator`
- `Menu`, `Home`, `Settings`, `Users`, `FileText` from `lucide-react`

## Code

```tsx
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { Drawer } from '@tale-ui/react/drawer';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { Separator } from '@tale-ui/react/separator';
import { Menu, Home, Settings, Users, FileText } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function NavContent() {
  return (
    <NavigationMenu.Root>
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar — hidden on mobile via CSS */}
      <aside className="sidebar-desktop" style={{ width: 240, padding: 'var(--space-s)' }}>
        <NavContent />
      </aside>

      <Separator orientation="vertical" className="sidebar-desktop" />

      {/* Mobile drawer */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Trigger className="sidebar-mobile-trigger">
          <IconButton aria-label="Open menu" variant="ghost">
            <Icon icon={Menu} />
          </IconButton>
        </Drawer.Trigger>
        <Drawer.Backdrop />
        <Drawer.Popup style={{ width: 280, minHeight: '100vh', padding: 'var(--space-s)' }}>
          <Drawer.Title>Navigation</Drawer.Title>
          <NavContent />
        </Drawer.Popup>
      </Drawer.Root>

      <main style={{ flex: 1, padding: 'var(--space-l)' }}>
        {children}
      </main>
    </div>
  );
}
```

```css
/* Add to your app CSS */
.sidebar-mobile-trigger { display: none; }

@media (max-width: 768px) {
  .sidebar-desktop { display: none; }
  .sidebar-mobile-trigger { display: block; }
}
```

## Customization Points

- Replace `navItems` with your app's route structure.
- Add nested navigation by using `NavigationMenu.Trigger` and `NavigationMenu.Popup` for dropdowns.
- Use `aria-current="page"` on the active link (React Aria handles this automatically when `href` matches).
- Adjust the `768px` breakpoint to match your design requirements.
- `Drawer.Root` uses `open`/`onOpenChange` (not `isOpen`) — it's a custom component.
- `NavigationMenu.Root` has no `orientation` prop; make the sidebar presentation vertical with your wrapper CSS.
