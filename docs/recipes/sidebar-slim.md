# Sidebar — Slim (Icon Only)

A permanent icon-only sidebar with tooltips. Use when screen real estate is tight and users are already familiar with the navigation icons.

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Tooltip` from `@tale-ui/react/tooltip`
- `Home`, `FileText`, `Users`, `Settings`, `HelpCircle` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Tooltip } from '@tale-ui/react/tooltip';
import { Home, FileText, Users, Settings, HelpCircle } from 'lucide-react';

const topItems = [
  { href: '/', label: 'Home', icon: Home, current: true },
  { href: '/documents', label: 'Documents', icon: FileText, current: false },
  { href: '/team', label: 'Team', icon: Users, current: false },
];

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings, current: false },
  { href: '/help', label: 'Help', icon: HelpCircle, current: false },
];

function NavButton({ href, label, icon, current }: { href: string; label: string; icon: React.ComponentType; current: boolean }) {
  return (
    <Tooltip.Root placement="right">
      <Tooltip.Trigger>
        <Sidebar.NavButton
          href={href}
          icon={icon}
          aria-label={label}
          current={current}
        />
      </Tooltip.Trigger>
      <Tooltip.Popup>
        <Tooltip.Title>{label}</Tooltip.Title>
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}

export function SlimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar.Root variant="slim">
        <Sidebar.Header>
          <img src="/logo-mark.svg" alt="Acme" width={28} height={28} />
          <Sidebar.MobileTrigger />
        </Sidebar.Header>

        <Sidebar.NavList style={{ flex: 1 }}>
          {topItems.map((item) => (
            <NavButton key={item.href} {...item} />
          ))}
        </Sidebar.NavList>

        <Sidebar.Divider />

        <Sidebar.NavList>
          {bottomItems.map((item) => (
            <NavButton key={item.href} {...item} />
          ))}
        </Sidebar.NavList>

        <Sidebar.AccountCard
          compact
          avatarSrc="/avatars/alex.jpg"
          name="Alex Chen"
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

- `Sidebar.Root variant="slim"` constrains the width to 64 px and removes text labels from NavItems.
- Every `Sidebar.NavButton` must have an `aria-label` and a paired `Tooltip` — icon-only controls without labels fail WCAG 2.1 SC 4.1.2.
- `Sidebar.Divider` renders a `<hr>` that visually separates the top navigation from the bottom utility links.
- `Sidebar.AccountCard compact` shows only the avatar (no name/email text) at the slim width.
- On mobile (≤ 768 px) `Sidebar.MobileTrigger` opens a full-width drawer that renders the items with labels.
