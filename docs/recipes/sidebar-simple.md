# Sidebar — Simple

A single-tier sidebar with logo, navigation items, and an account card at the bottom. Collapses into a modal drawer on mobile via `Sidebar.MobileTrigger`.

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Home`, `FileText`, `Users`, `Settings` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Home, FileText, Users, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home, current: true },
  { href: '/documents', label: 'Documents', icon: FileText, current: false },
  { href: '/team', label: 'Team', icon: Users, current: false },
  { href: '/settings', label: 'Settings', icon: Settings, current: false },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar.Root>
        <Sidebar.Header>
          <a href="/" style={{ fontWeight: 700, fontSize: 'var(--label-l-font-size)', textDecoration: 'none', color: 'var(--neutral-90)' }}>
            Acme
          </a>
          <Sidebar.MobileTrigger />
        </Sidebar.Header>

        <Sidebar.NavList>
          {navItems.map((item) => (
            <Sidebar.NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              current={item.current}
            >
              {item.label}
            </Sidebar.NavItem>
          ))}
        </Sidebar.NavList>

        <Sidebar.AccountCard
          name="Alex Chen"
          email="alex@acme.com"
          avatarSrc="/avatars/alex.jpg"
        />
      </Sidebar.Root>

      <main style={{ flex: 1, padding: 'var(--space-l)' }}>
        {children}
      </main>
    </div>
  );
}
```

## Notes

- `Sidebar.Root` renders a `<aside>` with `role="navigation"` and the `tale-sidebar` BEM class.
- `Sidebar.NavItem` applies `aria-current="page"` when `current` is `true` and renders the icon + label automatically.
- `Sidebar.MobileTrigger` renders a hamburger button that opens a modal drawer on screens ≤ 768 px. On wider screens it is hidden.
- `Sidebar.AccountCard` renders the user's avatar (image → initials → placeholder fallback), name, email, and a chevron trigger for an account menu.
- To highlight the active item, pass `current={pathname === item.href}` using your router's current path.
