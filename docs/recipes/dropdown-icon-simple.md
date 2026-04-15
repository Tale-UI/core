# Dropdown — Icon Button (Simple)

A compact dropdown triggered by a three-dot (ellipsis) icon button. Common for row-level actions in tables and list cards.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `IconButton` from `@tale-ui/react/icon-button`
- `Icon` from `@tale-ui/react/icon`
- `MoreHorizontal` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { MoreHorizontal } from 'lucide-react';

export function IconDropdown({ itemId }: { itemId: string }) {
  return (
    <Menu.Root onAction={(key) => { console.log(itemId, key); }}>
      <Menu.Trigger>
        <IconButton aria-label="Row actions" variant="ghost" size="sm">
          <Icon icon={MoreHorizontal} size="sm" />
        </IconButton>
      </Menu.Trigger>
      <Menu.Popover placement="bottom end" offset={4}>
        <Menu.MenuList>
          <Menu.Item id="edit">Edit</Menu.Item>
          <Menu.Item id="duplicate">Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="delete">Delete</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- **Do not nest `<IconButton>` inside `Menu.Trigger` as JSX** — `Menu.Trigger` clones its child to inject ARIA and event props. Nesting a Tale UI `<IconButton>` here is allowed because `IconButton` forwards refs and spreads unknown props.
- `aria-label="Row actions"` is required on the `IconButton` — icon-only controls must have an accessible name.
- `placement="bottom end"` aligns the popover's right edge with the trigger's right edge — ideal for table row actions near the right side of the viewport.
- `MoreVertical` (vertical dots) is an alternative icon; use whichever is consistent with your design language.
