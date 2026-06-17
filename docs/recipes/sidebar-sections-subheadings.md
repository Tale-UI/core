# Sidebar — Sections with Subheadings

A sidebar with named section subheadings above each group of nav items. Use when sections need a visible label — for example "Workspace", "Projects", and "Account".

## Components Used

- `Sidebar` from `@tale-ui/react/sidebar`
- `Home`, `FolderKanban`, `BarChart2`, `Users`, `Settings`, `HelpCircle`, `CreditCard` from `lucide-react`

## Code

```tsx
import { Sidebar } from '@tale-ui/react/sidebar';
import { Home, FolderKanban, BarChart2, Users, Settings, HelpCircle, CreditCard } from 'lucide-react';

export function SectionsSubheadingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar.Root>
        <Sidebar.Header>
          <a href="/" style={{ fontWeight: 700, fontSize: 'var(--label-l-font-size)', textDecoration: 'none', color: 'var(--neutral-90)' }}>
            Acme
          </a>
          <Sidebar.MobileTrigger logo={<span>Acme</span>}>
            <Sidebar.NavList aria-label="Workspace">
              <Sidebar.NavItem href="/" icon={Home} current>Dashboard</Sidebar.NavItem>
              <Sidebar.NavItem href="/projects" icon={FolderKanban}>Projects</Sidebar.NavItem>
              <Sidebar.NavItem href="/analytics" icon={BarChart2}>Analytics</Sidebar.NavItem>
            </Sidebar.NavList>
            <Sidebar.Divider />
            <Sidebar.NavList aria-label="Account">
              <Sidebar.NavItem href="/settings" icon={Settings}>Settings</Sidebar.NavItem>
              <Sidebar.NavItem href="/billing" icon={CreditCard}>Billing</Sidebar.NavItem>
              <Sidebar.NavItem href="/help" icon={HelpCircle}>Help & Support</Sidebar.NavItem>
            </Sidebar.NavList>
          </Sidebar.MobileTrigger>
        </Sidebar.Header>

        {/* Workspace section */}
        <Sidebar.NavList aria-labelledby="sidebar-workspace-heading">
          <li role="presentation">
            <span id="sidebar-workspace-heading" className="tale-sidebar__section-heading">
              Workspace
            </span>
          </li>
          <Sidebar.NavItem href="/" icon={Home} current>Dashboard</Sidebar.NavItem>
          <Sidebar.NavItem href="/projects" icon={FolderKanban}>Projects</Sidebar.NavItem>
          <Sidebar.NavItem href="/analytics" icon={BarChart2}>Analytics</Sidebar.NavItem>
        </Sidebar.NavList>

        {/* People section */}
        <Sidebar.NavList aria-labelledby="sidebar-people-heading" style={{ marginTop: 'var(--space-s)' }}>
          <li role="presentation">
            <span id="sidebar-people-heading" className="tale-sidebar__section-heading">
              People
            </span>
          </li>
          <Sidebar.NavItem href="/team" icon={Users}>Team</Sidebar.NavItem>
        </Sidebar.NavList>

        {/* Account section */}
        <Sidebar.NavList aria-labelledby="sidebar-account-heading" style={{ marginTop: 'var(--space-s)' }}>
          <li role="presentation">
            <span id="sidebar-account-heading" className="tale-sidebar__section-heading">
              Account
            </span>
          </li>
          <Sidebar.NavItem href="/settings" icon={Settings}>Settings</Sidebar.NavItem>
          <Sidebar.NavItem href="/billing" icon={CreditCard}>Billing</Sidebar.NavItem>
          <Sidebar.NavItem href="/help" icon={HelpCircle}>Help & Support</Sidebar.NavItem>
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

- Section headings use `tale-sidebar__section-heading` — a styled `<span>` that renders as a small all-caps label. It is placed as a `role="presentation"` `<li>` so screen readers don't announce it as a list item, but the `aria-labelledby` on the parent `<ul>` still associates the heading with the group.
- `Sidebar.Divider` is intentionally omitted here — the subheading itself provides sufficient visual separation. Add `<Sidebar.Divider />` before each `NavList` if you prefer an explicit rule between sections.
- Keep section headings short (1–2 words). If a heading needs more than 3 words, the taxonomy is probably too granular and sections should be merged.
- This pattern combines well with [Sidebar — Dual Tier](sidebar-dual-tier.md) — use the slim rail for top-level sections and this subheading pattern in the secondary panel.
