# Menu

`import { Menu } from '@tale-ui/react/menu';`

A dropdown menu triggered by a button, with items, groups, headers, and separators.

## Parts

| Part | Description |
|------|-------------|
| `Menu.Root` | Manages open/close state. Accepts `isDisabled`. |
| `Menu.Trigger` | Button that opens the menu. Style with `className="tale-button tale-button--{variant} tale-button--{size}"`. |
| `Menu.Popover` | Positioned popover container. Accepts `placement` and `offset`. |
| `Menu.MenuList` | The menu list (`role="menu"`). |
| `Menu.Item` | A menu item. Accepts `id`, `isDisabled`, `onAction`. |
| `Menu.Group` | Groups items under a section (MenuSection). |
| `Menu.Header` | Section header label inside a `Group`. |
| `Menu.Separator` | Visual separator between items or groups. |

## Basic Usage

```tsx
import { Menu } from '@tale-ui/react/menu';

<Menu.Root>
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options ▾</Menu.Trigger>
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
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Actions ▾</Menu.Trigger>
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
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Edit ▾</Menu.Trigger>
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
  <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Disabled Menu ▾</Menu.Trigger>
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

- Each `Menu.Item` requires a unique `id` prop. Add `textValue` for accessibility (screen reader announcements and keyboard type-ahead).
- Use `isDisabled` on individual items or on `Menu.Root` to disable the entire menu.
- Use `onAction` on `Menu.Item` to handle item selection.
- **Do not nest `<Button>` inside `<Menu.Trigger>`.** `Menu.Trigger` is a React Aria `Button` — nesting another `<Button>` creates invalid `<button><button>` HTML. Instead, apply button styling via `className="tale-button tale-button--{variant} tale-button--{size}"` directly on `Menu.Trigger`.
- Add `aria-label` to `Menu.MenuList` to describe the menu's purpose to screen readers.
- Menu automatically provides `role="menu"` and each Item gets `role="menuitem"`.
