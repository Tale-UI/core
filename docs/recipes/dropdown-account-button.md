# Dropdown — Account Button

A button trigger that shows the signed-in user's name and opens an account menu. Designed for sidebar footers or compact app headers.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Avatar` from `@tale-ui/react/avatar`
- `Icon` from `@tale-ui/react/icon`
- `ChevronsUpDown` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Avatar } from '@tale-ui/react/avatar';
import { Icon } from '@tale-ui/react/icon';
import { ChevronsUpDown } from 'lucide-react';

type User = {
  name: string;
  email: string;
  avatarSrc?: string;
};

export function AccountButton({ user }: { user: User }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <Menu.Root onAction={(key) => { console.log('account:', key); }}>
      <Menu.Trigger>
        <button
          type="button"
          aria-label="Account menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--space-xs)',
            borderRadius: 'var(--radius-m)',
            textAlign: 'left',
          }}
        >
          <Avatar.Root size="sm">
            {user.avatarSrc ? (
              <Avatar.Image src={user.avatarSrc} alt={user.name} />
            ) : null}
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar.Root>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--label-s-font-size)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </div>
            <div style={{ fontSize: 'var(--text-xs-font-size)', color: 'var(--neutral-50)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
          </div>
          <Icon icon={ChevronsUpDown} size="sm" style={{ color: 'var(--neutral-40)', flexShrink: 0 }} />
        </button>
      </Menu.Trigger>
      <Menu.Popover placement="top start" offset={4}>
        <Menu.MenuList>
          <Menu.Item id="profile">My profile</Menu.Item>
          <Menu.Item id="settings">Account settings</Menu.Item>
          <Menu.Item id="plan">Upgrade plan</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="sign-out">Sign out</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `placement="top start"` opens the menu upward — when this component is at the bottom of a sidebar, an upward popover stays within the viewport.
- `width: 100%` on the inner button allows `AccountButton` to span the full sidebar width; the parent layout controls the outer width.
- Text truncation (`overflow: hidden; text-overflow: ellipsis`) on name and email prevents overflow for long values — always apply these when rendering user content in constrained widths.
- This component pairs directly with `Sidebar.AccountCard` — swap one for the other depending on whether you need the built-in card styling or a fully custom button.
