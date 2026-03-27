# Header Navigation

A horizontal navigation bar with logo, links, and right-aligned action buttons.

## Components Used

- `NavigationMenu` from `@tale-ui/react/navigation-menu`
- `Button` from `@tale-ui/react/button`
- `IconButton` from `@tale-ui/react/icon-button`
- `Icon` from `@tale-ui/react/icon`
- `Separator` from `@tale-ui/react/separator`
- `Bell`, `Search` from `lucide-react`

## Code

```tsx
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { Button } from '@tale-ui/react/button';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { Separator } from '@tale-ui/react/separator';
import { Bell, Search } from 'lucide-react';

function AppHeader() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', padding: 'var(--space-xs) var(--space-m)', borderBottom: '1px solid var(--neutral-16)' }}>
      {/* Logo */}
      <a href="/" style={{ fontWeight: 700, fontSize: 'var(--label-l-font-size)', marginRight: 'var(--space-m)', textDecoration: 'none', color: 'var(--neutral-90)' }}>
        Acme
      </a>

      {/* Navigation links */}
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/products">Products</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {/* Right-aligned actions */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)' }}>
        <IconButton aria-label="Search" variant="ghost" size="sm">
          <Icon icon={Search} size="sm" />
        </IconButton>
        <IconButton aria-label="Notifications" variant="ghost" size="sm">
          <Icon icon={Bell} size="sm" />
        </IconButton>
        <Separator orientation="vertical" style={{ height: '2rem' }} />
        <Button variant="primary" size="sm">Sign in</Button>
      </div>
    </header>
  );
}
```

## Customization Points

- Replace the logo `<a>` with your brand component or image.
- Add dropdown menus using `NavigationMenu.Trigger` and `NavigationMenu.Popup` for nested navigation.
- Use `aria-current="page"` on the active link (React Aria handles this automatically when `href` matches).
- For a sticky header, add `position: sticky; top: 0; z-index: 10; background: var(--neutral-5)` to the `<header>`.
- Combine with the [Sidebar Navigation](sidebar-navigation.md) recipe for a sidebar + header layout.
