# Dropdown — Account Card (MD)

A medium account card with a larger avatar and role/team info below the user's name. Best for apps where the user's identity and role are prominent — e.g., admin panels or team dashboards.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Avatar` from `@tale-ui/react/avatar`
- `Badge` from `@tale-ui/react/badge`
- `Icon` from `@tale-ui/react/icon`
- `ChevronsUpDown`, `LogOut`, `Settings`, `User` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Avatar } from '@tale-ui/react/avatar';
import { Badge } from '@tale-ui/react/badge';
import { Icon } from '@tale-ui/react/icon';
import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';

type UserProfile = {
  name: string;
  email: string;
  role: string;
  plan: 'free' | 'pro' | 'enterprise';
  avatarSrc?: string;
};

const planVariant: Record<string, 'neutral' | 'brand' | 'success'> = {
  free: 'neutral',
  pro: 'brand',
  enterprise: 'success',
};

export function AccountCardMD({ user }: { user: UserProfile }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <Menu.Root onAction={(key) => { console.log('account:', key); }}>
      <Menu.Trigger>
        <button
          type="button"
          aria-label={`Account: ${user.name}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-s)',
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--space-s)',
            borderRadius: 'var(--radius-m)',
            textAlign: 'left',
          }}
        >
          <Avatar.Root size="md">
            {user.avatarSrc ? <Avatar.Image src={user.avatarSrc} alt={user.name} /> : null}
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar.Root>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)' }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--label-m-font-size)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </span>
              <Badge variant={planVariant[user.plan]} size="sm">
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </Badge>
            </div>
            <div style={{ fontSize: 'var(--text-xs-font-size)', color: 'var(--neutral-50)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.role} · {user.email}
            </div>
          </div>
          <Icon icon={ChevronsUpDown} size="sm" style={{ color: 'var(--neutral-40)', flexShrink: 0 }} />
        </button>
      </Menu.Trigger>
      <Menu.Popover placement="top start" offset={4} style={{ minWidth: 260 }}>
        {/* Expanded identity header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)', padding: 'var(--space-s)', borderBottom: '1px solid var(--neutral-16)' }}>
          <Avatar.Root size="md">
            {user.avatarSrc ? <Avatar.Image src={user.avatarSrc} alt={user.name} /> : null}
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar.Root>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--label-m-font-size)' }}>{user.name}</div>
            <div style={{ fontSize: 'var(--text-xs-font-size)', color: 'var(--neutral-50)' }}>{user.email}</div>
            <div style={{ fontSize: 'var(--text-xs-font-size)', color: 'var(--neutral-40)', marginTop: 2 }}>{user.role}</div>
          </div>
        </div>
        <Menu.MenuList>
          <Menu.Item id="profile">
            <Icon icon={User} size="sm" />
            My profile
          </Menu.Item>
          <Menu.Item id="settings">
            <Icon icon={Settings} size="sm" />
            Account settings
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item id="sign-out">
            <Icon icon={LogOut} size="sm" />
            Sign out
          </Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- The `Badge` inside the trigger label shows the user's plan level. Use `variant="brand"` for paid tiers and `variant="neutral"` for the free tier to create a clear visual hierarchy.
- The popover header repeats the avatar at `size="md"` (40 × 40 px) so the user can confirm their identity at a glance before taking account actions.
- `role` and `email` combined in a single line with `·` as a separator keeps it compact. Split onto separate lines if your roles are long (> 20 characters).
- Use this size when user identity is a primary app concept — e.g., multi-account apps, admin panels, or dashboards where the active user's role affects what they see.

## Preview

```tsx
const demoUser = {
  name: 'Alex Chen',
  email: 'alex@acme.com',
  role: 'Admin',
  plan: 'pro' as const,
};

export function Example() {
  return (
    <div style={{ width: 280, padding: 'var(--space-m)' }}>
      <AccountCardMD user={demoUser} />
    </div>
  );
}
```
