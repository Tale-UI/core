# Dropdown — With Search (Advanced)

A searchable dropdown with grouped results, item metadata, and an async-ready loading state. Triggered by a button.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `SearchField` from `@tale-ui/react/search-field`
- `Avatar` from `@tale-ui/react/avatar`
- `Spinner` from `@tale-ui/react/spinner`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { SearchField } from '@tale-ui/react/search-field';
import { Avatar } from '@tale-ui/react/avatar';
import { Spinner } from '@tale-ui/react/spinner';
import { useState, useDeferredValue } from 'react';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  team: 'Engineering' | 'Design' | 'Marketing';
  avatarSrc?: string;
};

const members: TeamMember[] = [
  { id: '1', name: 'Alex Chen', email: 'alex@acme.com', team: 'Engineering', avatarSrc: '/avatars/alex.jpg' },
  { id: '2', name: 'Sam Rivera', email: 'sam@acme.com', team: 'Design' },
  { id: '3', name: 'Jordan Lee', email: 'jordan@acme.com', team: 'Engineering' },
  { id: '4', name: 'Taylor Kim', email: 'taylor@acme.com', team: 'Marketing' },
];

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const group = String(item[key]);
    acc[group] = [...(acc[group] ?? []), item];
    return acc;
  }, {});
}

export function AdvancedSearchDropdown({ onAssign }: { onAssign: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(deferredQuery.toLowerCase())
  );
  const groups = groupBy(filtered, 'team');

  return (
    <Menu.Root onAction={(key) => { onAssign(String(key)); }}>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        Assign to ▾
      </Menu.Trigger>
      <Menu.Popover placement="bottom start" offset={4} style={{ width: 300 }}>
        <div style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--neutral-16)' }}>
          <SearchField.Root aria-label="Search team members" value={query} onChange={setQuery}>
            <SearchField.Input placeholder="Search by name or email…" autoFocus />
          </SearchField.Root>
        </div>

        <div style={{ maxHeight: 320, overflowY: 'auto', opacity: isStale ? 0.6 : 1 }}>
          {isStale && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-xs)' }}>
              <Spinner size="sm" />
            </div>
          )}
          <Menu.MenuList>
            {Object.keys(groups).length > 0 ? (
              Object.entries(groups).map(([team, teamMembers]) => (
                <Menu.Group key={team}>
                  <Menu.Header>{team}</Menu.Header>
                  {teamMembers.map((member) => (
                    <Menu.Item key={member.id} id={member.id}>
                      <Avatar.Root size="sm">
                        {member.avatarSrc ? (
                          <Avatar.Image src={member.avatarSrc} alt={member.name} />
                        ) : null}
                        <Avatar.Fallback>
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <div>
                        <div style={{ fontWeight: 500 }}>{member.name}</div>
                        <div style={{ fontSize: 'var(--text-xs-font-size)', color: 'var(--neutral-50)' }}>
                          {member.email}
                        </div>
                      </div>
                    </Menu.Item>
                  ))}
                </Menu.Group>
              ))
            ) : (
              <div style={{ padding: 'var(--space-s)', color: 'var(--neutral-50)', fontSize: 'var(--text-s-font-size)', textAlign: 'center' }}>
                No team members found
              </div>
            )}
          </Menu.MenuList>
        </div>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `useDeferredValue` defers the expensive filter render until the browser is idle, keeping the input responsive. The `isStale` indicator shows a `Spinner` during the transition.
- A fixed `style={{ width: 300 }}` on `Menu.Popover` keeps the list from reflowing as results change. Adjust to suit your layout.
- `maxHeight` on the scroll container prevents the popover from growing beyond the viewport. Combine with `overflow-y: auto` for a scrollable list.
- For true async search, replace the local filter with a `useEffect` + `fetch` call and keep the `Spinner` visible until the response arrives.
