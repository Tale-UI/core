# Dropdown — Avatar Trigger

A user account dropdown triggered by clicking an avatar. Common in top navigation bars for accessing profile, settings, and sign-out.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Avatar` from `@tale-ui/react/avatar`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Avatar } from '@tale-ui/react/avatar';

type User = {
  name: string;
  email: string;
  avatarSrc?: string;
};

export function AvatarDropdown({ user }: { user: User }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <Menu.Root onAction={(key) => { console.log('account action:', key); }}>
      <Menu.Trigger>
        <button type="button" aria-label={`Account menu for ${user.name}`} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, borderRadius: '50%' }}>
          <Avatar.Root size="md">
            {user.avatarSrc ? (
              <Avatar.Image src={user.avatarSrc} alt={user.name} />
            ) : null}
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar.Root>
        </button>
      </Menu.Trigger>
      <Menu.Popover placement="bottom end" offset={8}>
        {/* User info header — not interactive */}
        <div style={{ padding: 'var(--space-xs) var(--space-s)', borderBottom: '1px solid var(--neutral-16)' }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--label-s-font-size)' }}>{user.name}</div>
          <div style={{ color: 'var(--neutral-50)', fontSize: 'var(--text-xs-font-size)' }}>{user.email}</div>
        </div>
        <Menu.MenuList>
          <Menu.Item id="profile">My profile</Menu.Item>
          <Menu.Item id="settings">Settings</Menu.Item>
          <Menu.Item id="notifications">Notifications</Menu.Item>
          <Menu.Separator />
          <Menu.LinkItem href="https://help.acme.com" target="_blank">Help ↗</Menu.LinkItem>
          <Menu.Separator />
          <Menu.Item id="sign-out">Sign out</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- Wrap the `Avatar.Root` in a plain `<button>` rather than using `<IconButton>`, because the avatar is its own visual — `IconButton` adds extra padding and sizing that does not match avatar dimensions.
- `aria-label` on the `<button>` must name the control for screen readers; include the user's name so it reads "Account menu for Alex Chen".
- The non-interactive user info header at the top of the popover is a `<div>`, not a `Menu.Item`. This is intentional — it provides context without being focusable or selectable.
- `placement="bottom end"` aligns the popover's right edge with the trigger's right edge — keeps the menu within the viewport when the avatar is near the right edge.
- `Menu.Indicator` (from `Avatar.Indicator`) can be composed over the avatar to show online/offline status independently of this menu.

## Preview

```tsx
const demoUser = { name: 'Alex Chen', email: 'alex@acme.com' };

export function Example() {
  return <AvatarDropdown user={demoUser} />;
}
```
