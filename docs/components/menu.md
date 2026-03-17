# Menu

`import { Menu } from '@tale-ui/react/menu';`

A dropdown menu triggered by a button, with items, groups, headers, and separators.

## Parts

| Part | Description |
|------|-------------|
| `Menu.Root` | Manages open/close state. Accepts `isDisabled`. |
| `Menu.Trigger` | Button that opens the menu. |
| `Menu.Popover` | Positioned popover container. Accepts `placement` and `offset`. |
| `Menu.MenuList` | The menu list (`role="menu"`). |
| `Menu.Item` | A menu item. Accepts `id`, `isDisabled`, `onAction`. |
| `Menu.Group` | Groups items under a section (MenuSection). |
| `Menu.Header` | Section header label inside a `Group`. |
| `Menu.Separator` | Visual separator between items or groups. |

## Basic Usage

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Button } from '@tale-ui/react/button';

<Menu.Root>
  <Menu.Trigger>
    <Button>Options</Button>
  </Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList>
      <Menu.Item id="new">New File</Menu.Item>
      <Menu.Item id="open">Open</Menu.Item>
      <Menu.Separator />
      <Menu.Item id="save">Save</Menu.Item>
      <Menu.Item id="save-as">Save As...</Menu.Item>
      <Menu.Separator />
      <Menu.Item id="close">Close</Menu.Item>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

## Examples

### With Groups

```tsx
<Menu.Root>
  <Menu.Trigger>
    <Button>Actions</Button>
  </Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList>
      <Menu.Group>
        <Menu.Header>Edit</Menu.Header>
        <Menu.Item id="cut">Cut</Menu.Item>
        <Menu.Item id="copy">Copy</Menu.Item>
        <Menu.Item id="paste">Paste</Menu.Item>
      </Menu.Group>
      <Menu.Separator />
      <Menu.Group>
        <Menu.Header>View</Menu.Header>
        <Menu.Item id="zoom-in">Zoom In</Menu.Item>
        <Menu.Item id="zoom-out">Zoom Out</Menu.Item>
        <Menu.Item id="reset-zoom">Reset Zoom</Menu.Item>
      </Menu.Group>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

### With Disabled Items

```tsx
<Menu.Root>
  <Menu.Trigger>
    <Button>Edit</Button>
  </Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList>
      <Menu.Item id="undo">Undo</Menu.Item>
      <Menu.Item id="redo" isDisabled>Redo</Menu.Item>
      <Menu.Separator />
      <Menu.Item id="cut">Cut</Menu.Item>
      <Menu.Item id="copy">Copy</Menu.Item>
      <Menu.Item id="paste" isDisabled>Paste</Menu.Item>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

### Disabled Menu

```tsx
<Menu.Root isDisabled>
  <Menu.Trigger>
    <Button>Disabled Menu</Button>
  </Menu.Trigger>
  <Menu.Popover placement="bottom" offset={4}>
    <Menu.MenuList>
      <Menu.Item id="a">Item A</Menu.Item>
      <Menu.Item id="b">Item B</Menu.Item>
    </Menu.MenuList>
  </Menu.Popover>
</Menu.Root>
```

## CSS Classes

- `.tale-menu__trigger` — Trigger button
- `.tale-menu__popover` — Popover container
- `.tale-menu__popup` — Menu list
- `.tale-menu__item` — Menu item
- `.tale-menu__header` — Group header
- `.tale-menu__separator` — Separator line

## Notes

- Each `Menu.Item` requires a unique `id` prop.
- Use `isDisabled` on individual items or on `Menu.Root` to disable the entire menu.
- **Wrap `<Button>` inside `<Menu.Trigger>`.** `Menu.Trigger` renders a plain `<button>` with `tale-menu__trigger` — it has no button styling. Place a `<Button variant="...">` component as its child for proper styling. This is required for React Aria's keyboard and focus handling to work correctly.
