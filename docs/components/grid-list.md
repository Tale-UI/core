# GridList

`import { GridList } from '@tale-ui/react/grid-list';`

An accessible grid-based list supporting keyboard navigation and selection.

## Parts

| Part | Description |
|------|-------------|
| `GridList.Root` | Container. Accepts `aria-label` and `selectionMode`. |
| `GridList.Item` | A single list item. Requires `id` and `textValue`. |

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

## CSS Classes

- `.tale-grid-list` — Base
- `.tale-grid-list__item` — List item

## Notes

- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Each `GridList.Item` needs a `textValue` for accessibility (screen reader label).
- Built on React Aria `GridList` and `GridListItem`.
