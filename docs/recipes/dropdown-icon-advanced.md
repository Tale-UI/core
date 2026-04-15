# Dropdown — Icon Button (Advanced)

An ellipsis-triggered dropdown with grouped items, icons, and a submenu. Suitable for item cards or sidebar context actions.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `IconButton` from `@tale-ui/react/icon-button`
- `Icon` from `@tale-ui/react/icon`
- `MoreHorizontal`, `Pencil`, `Copy`, `FolderOpen`, `Share2`, `Trash2`, `ChevronRight` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { MoreHorizontal, Pencil, Copy, FolderOpen, Share2, Trash2 } from 'lucide-react';

export function AdvancedIconDropdown({ itemId }: { itemId: string }) {
  return (
    <Menu.Root onAction={(key) => { console.log(itemId, key); }}>
      <Menu.Trigger>
        <IconButton aria-label="Item actions" variant="ghost" size="sm">
          <Icon icon={MoreHorizontal} size="sm" />
        </IconButton>
      </Menu.Trigger>
      <Menu.Popover placement="bottom end" offset={4}>
        <Menu.MenuList>
          <Menu.Item id="edit">
            <Icon icon={Pencil} size="sm" />
            Edit
          </Menu.Item>
          <Menu.Item id="duplicate">
            <Icon icon={Copy} size="sm" />
            Duplicate
          </Menu.Item>

          <Menu.Separator />

          {/* Submenu */}
          <Menu.SubmenuTrigger>
            <Menu.Item id="move">
              <Icon icon={FolderOpen} size="sm" />
              Move to
            </Menu.Item>
            <Menu.Popover>
              <Menu.MenuList>
                <Menu.Item id="move-inbox">Inbox</Menu.Item>
                <Menu.Item id="move-archive">Archive</Menu.Item>
                <Menu.Item id="move-trash">Trash</Menu.Item>
              </Menu.MenuList>
            </Menu.Popover>
          </Menu.SubmenuTrigger>

          <Menu.Item id="share">
            <Icon icon={Share2} size="sm" />
            Share
          </Menu.Item>

          <Menu.Separator />

          <Menu.Item id="delete">
            <Icon icon={Trash2} size="sm" />
            Delete
          </Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `Menu.SubmenuTrigger` wraps a `Menu.Item` and a nested `Menu.Popover`. The item renders a trailing chevron automatically; the nested popover appears on hover (desktop) or press (touch).
- Submenus are keyboard-navigable: `ArrowRight` opens the submenu, `ArrowLeft` or `Escape` closes it and returns focus to the parent.
- Keep submenus shallow — maximum one level deep. Deeper nesting is hard to use with a keyboard and nearly impossible on touch.
- Icons in menu items should be 16 × 16 px (`size="sm"` on `<Icon>`); they should have `aria-hidden` which the `<Icon>` wrapper applies automatically.
