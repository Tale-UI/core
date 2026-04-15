# Sidebar — Dual Tier

A two-column sidebar with a slim primary icon rail on the left and a secondary label panel that reveals on hover or keyboard focus. Ideal for applications with many top-level sections.

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Tooltip` from `@tale-ui/react/tooltip`
- `Home`, `FileText`, `Users`, `BarChart2`, `Settings` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Tooltip } from '@tale-ui/react/tooltip';
import { Home, FileText, Users, BarChart2, Settings } from 'lucide-react';
import { useState } from 'react';

const primaryItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

const secondaryItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function DualTierLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string | null>('home');
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Primary icon rail */}
      <Sidebar.Root
        variant="slim"
        onMouseEnter={() => { setExpanded(true); }}
        onMouseLeave={() => { setExpanded(false); }}
      >
        <Sidebar.Header>
          <img src="/logo.svg" alt="Acme" width={32} height={32} />
          <Sidebar.MobileTrigger />
        </Sidebar.Header>

        <Sidebar.NavList>
          {primaryItems.map((item) => (
            <Tooltip.Root key={item.id} placement="right">
              <Tooltip.Trigger>
                <Sidebar.NavButton
                  icon={item.icon}
                  aria-label={item.label}
                  current={activeSection === item.id}
                  onPress={() => { setActiveSection(item.id); }}
                />
              </Tooltip.Trigger>
              <Tooltip.Popup>
                <Tooltip.Title>{item.label}</Tooltip.Title>
              </Tooltip.Popup>
            </Tooltip.Root>
          ))}
        </Sidebar.NavList>

        <Sidebar.NavList>
          {secondaryItems.map((item) => (
            <Tooltip.Root key={item.href} placement="right">
              <Tooltip.Trigger>
                <Sidebar.NavButton
                  icon={item.icon}
                  aria-label={item.label}
                  href={item.href}
                />
              </Tooltip.Trigger>
              <Tooltip.Popup>
                <Tooltip.Title>{item.label}</Tooltip.Title>
              </Tooltip.Popup>
            </Tooltip.Root>
          ))}
        </Sidebar.NavList>

        <Sidebar.AccountCard compact avatarSrc="/avatars/alex.jpg" name="Alex Chen" />
      </Sidebar.Root>

      {/* Secondary label panel — shown when expanded */}
      {expanded && activeSection && (
        <Sidebar.Root variant="secondary" aria-label={`${activeSection} navigation`}>
          <Sidebar.Header>
            <span style={{ fontWeight: 600, fontSize: 'var(--label-m-font-size)', textTransform: 'capitalize' }}>
              {activeSection}
            </span>
          </Sidebar.Header>
          <Sidebar.NavList>
            {/* Render section-specific items here based on activeSection */}
            <Sidebar.NavItem href={`/${activeSection}`} current>
              Overview
            </Sidebar.NavItem>
            <Sidebar.NavItem href={`/${activeSection}/details`}>
              Details
            </Sidebar.NavItem>
          </Sidebar.NavList>
        </Sidebar.Root>
      )}

      <main style={{ flex: 1, padding: 'var(--space-l)' }}>
        {children}
      </main>
    </div>
  );
}
```

## Notes

- `Sidebar.Root variant="slim"` sets a narrower width (64 px by default) for the icon rail; `variant="secondary"` sets the full label panel width (240 px) with a distinct background.
- `Sidebar.NavButton` is an icon-only button with no label — always pair it with a `Tooltip` so the label is accessible.
- The expand-on-hover pattern uses local `expanded` state driven by `onMouseEnter`/`onMouseLeave` on the primary rail. For a motion-animated version, wrap the secondary panel in a `<motion.div>` with an `x` transform.
- For persistent expand/collapse (user-controlled), replace hover logic with a toggle button and store the preference in `localStorage`.
- On mobile, `Sidebar.MobileTrigger` renders both tiers inside the drawer.
