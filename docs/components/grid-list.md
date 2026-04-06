# GridList

`import { GridList } from '@tale-ui/react/grid-list';`

An accessible grid-based list supporting keyboard navigation and selection.

## Parts

| Part | Description |
|------|-------------|
| `GridList.Root` | Container. Accepts `aria-label` and `selectionMode`. |
| `GridList.Item` | A single list item. Requires `id` and `textValue`. |

## Props

Accepts all React Aria `GridList` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<GridList.Root aria-label="Items">
  <GridList.Item id="1" textValue="Item 1">Item 1</GridList.Item>
  <GridList.Item id="2" textValue="Item 2">Item 2</GridList.Item>
  <GridList.Item id="3" textValue="Item 3">Item 3</GridList.Item>
</GridList.Root>
```

## Examples

### With Selection

```tsx
<GridList.Root aria-label="Items" selectionMode="multiple">
  <GridList.Item id="1" textValue="Item 1">Item 1</GridList.Item>
  <GridList.Item id="2" textValue="Item 2">Item 2</GridList.Item>
  <GridList.Item id="3" textValue="Item 3">Item 3</GridList.Item>
</GridList.Root>
```

### With Icons

```tsx
import { GridList } from '@tale-ui/react/grid-list';
import { Icon } from '@tale-ui/react/icon';
import { Star, Heart, Bell } from 'lucide-react';

<GridList.Root aria-label="Items" selectionMode="single">
  <GridList.Item id="1" textValue="Favorites"><Icon icon={Star} size="sm" />Favorites</GridList.Item>
  <GridList.Item id="2" textValue="Liked"><Icon icon={Heart} size="sm" />Liked</GridList.Item>
  <GridList.Item id="3" textValue="Alerts"><Icon icon={Bell} size="sm" />Alerts</GridList.Item>
</GridList.Root>
```

## CSS Classes

- `.tale-grid-list` — Base
- `.tale-grid-list__item` — List item

## Pitfalls

<!-- pitfall: grid-list-no-is-selected-on-item -->
- **`GridList.Item` does NOT accept `isSelected`** — use `selectedKeys` and `onSelectionChange` on `GridList.Root` instead.

<!-- pitfall: grid-list-on-selection-change-set -->
- **Do NOT annotate `onSelectionChange` parameter as `Set<string>`** — the parameter type is `Selection`; cast inside the handler if needed.

## Notes

- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Each `GridList.Item` needs a `textValue` for accessibility (screen reader label).
- Built on React Aria `GridList` and `GridListItem`.
- Items support `data-dragging` and `data-drop-target` attributes when drag-and-drop is enabled.
