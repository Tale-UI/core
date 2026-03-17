# ContextMenu

`import { ContextMenu } from '@tale-ui/react/context-menu';`

A right-click context menu that appears at the cursor position.

## Parts

| Part | Description |
|------|-------------|
| `ContextMenu.Root` | Manages open/close state and cursor position. |
| `ContextMenu.Trigger` | The right-click target area. |
| `ContextMenu.Popup` | Positioned popover at cursor location. |
| `ContextMenu.MenuList` | The menu list. Auto-closes on item action. |
| `ContextMenu.Item` | A menu item. Accepts `id` and `onAction`. |
| `ContextMenu.Group` | Groups items into a section. |
| `ContextMenu.Separator` | Visual separator between items or groups. |

## Basic Usage

```tsx
import { ContextMenu } from '@tale-ui/react/context-menu';

<ContextMenu.Root>
  <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
  <ContextMenu.Popup>
    <ContextMenu.MenuList>
      <ContextMenu.Item id="cut">Cut</ContextMenu.Item>
      <ContextMenu.Item id="copy">Copy</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item id="paste">Paste</ContextMenu.Item>
    </ContextMenu.MenuList>
  </ContextMenu.Popup>
</ContextMenu.Root>
```

## Examples

### With Groups

```tsx
<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div style={{
      padding: 'var(--space-xl)',
      border: '2px dashed var(--neutral-30)',
      borderRadius: 'var(--space-2xs)',
      textAlign: 'center',
    }}>
      Right-click this area
    </div>
  </ContextMenu.Trigger>
  <ContextMenu.Popup>
    <ContextMenu.MenuList>
      <ContextMenu.Group>
        <ContextMenu.Item id="cut">Cut</ContextMenu.Item>
        <ContextMenu.Item id="copy">Copy</ContextMenu.Item>
        <ContextMenu.Item id="paste">Paste</ContextMenu.Item>
      </ContextMenu.Group>
      <ContextMenu.Separator />
      <ContextMenu.Group>
        <ContextMenu.Item id="select-all">Select All</ContextMenu.Item>
        <ContextMenu.Item id="find">Find...</ContextMenu.Item>
      </ContextMenu.Group>
      <ContextMenu.Separator />
      <ContextMenu.Group>
        <ContextMenu.Item id="inspect">Inspect Element</ContextMenu.Item>
      </ContextMenu.Group>
    </ContextMenu.MenuList>
  </ContextMenu.Popup>
</ContextMenu.Root>
```

## CSS Classes

- `.tale-context-menu__trigger` — Right-click target area
- `.tale-context-menu` — Popover container
- `.tale-context-menu__list` — Menu list
- `.tale-context-menu__item` — Menu item
- `.tale-context-menu__group` — Item group section
- `.tale-context-menu__separator` — Separator line

## Notes

- The menu appears at the cursor position using a virtual trigger element.
- `ContextMenu.MenuList` automatically closes the menu when any item action fires.
- The `Trigger` renders a `<div>` (not a button), so any content can be a right-click target.
- Clicking outside the menu closes it.
