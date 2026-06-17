# Dropdown — Account Card (SM)

A small account card showing name and email that opens a menu on click. The most common size for sidebar footers and compact navigation.

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

type User = { name: string; email: string; avatarSrc?: string };

export function AccountCardSM({ user }: { user: User }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <Menu.Root>
      <Menu.Trigger>
        <button
          type="button"
          aria-label={`Account: ${user.name}`}
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
            {user.avatarSrc ? <Avatar.Image src={user.avatarSrc} alt={user.name} /> : null}
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
      <Menu.Popover placement="top start" offset={4} style={{ minWidth: 220 }}>
        <div style={{ padding: 'var(--space-xs) var(--space-s)', borderBottom: '1px solid var(--neutral-16)' }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--label-s-font-size)' }}>{user.name}</div>
          <div style={{ color: 'var(--neutral-50)', fontSize: 'var(--text-xs-font-size)' }}>{user.email}</div>
        </div>
        <Menu.MenuList onAction={(key) => { console.log('account:', key); }}>
          <Menu.Item id="profile">My profile</Menu.Item>
          <Menu.Item id="settings">Account settings</Menu.Item>
          <Menu.Item id="notifications">Notifications</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="invite">Invite teammates</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="sign-out">Sign out</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- The non-interactive user info header at the top of the popover repeats the name and email for confirmation — this helps users verify they are in the right account before acting.
- `Avatar.Root size="sm"` is 32 × 32 px. At this size, initials are readable but avatars with fine details (e.g., photographs) may look blurry on standard-DPI screens.
- `minWidth: 220` on `Menu.Popover` matches the trigger width in a 240 px sidebar. Set it to match your sidebar width to avoid a narrower-than-trigger popover.
- This is the most commonly used size. See [XS](dropdown-account-card-xs.md) for denser layouts and [MD](dropdown-account-card-md.md) for a richer card with a larger avatar.

## Preview

```tsx
const demoUser = { name: 'Alex Chen', email: 'alex@acme.com' };

export function Example() {
  return (
    <div style={{ width: 240, padding: 'var(--space-m)' }}>
      <AccountCardSM user={demoUser} />
    </div>
  );
}
```
