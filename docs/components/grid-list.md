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
  - anti-pattern: `<GridList.Item isSelected={selectedIds.includes(item.id)}>`
  - fix: `<GridList.Root selectedKeys={selectedIds} onSelectionChange={setSelectedIds}>`
  - complete example:
    ```tsx
    import { GridList } from '@tale-ui/react/grid-list';
    import { Icon } from '@tale-ui/react/icon';
    import { Star, Heart, Bell } from 'lucide-react';
    
    export function Example() {
      return (
        <GridList.Root aria-label="Items" selectionMode="multiple">
          <GridList.Item id="1" textValue="Favorites"><Icon icon={Star} size="sm" />Favorites</GridList.Item>
          <GridList.Item id="2" textValue="Liked"><Icon icon={Heart} size="sm" />Liked</GridList.Item>
          <GridList.Item id="3" textValue="Alerts"><Icon icon={Bell} size="sm" />Alerts</GridList.Item>
        </GridList.Root>
      );
    }
    ```

<!-- pitfall: grid-list-on-selection-change-set -->
- **Do NOT annotate `onSelectionChange` parameter as `Set<string>` or import `Selection` from `react-aria-components`** — consumers do not depend on `react-aria-components` directly, so that import causes "Cannot find module" errors. Derive the selection type from `GridList.Root` props with `React.ComponentProps`, or omit the callback parameter annotation.
  - anti-pattern: `onSelectionChange={(keys: Set<string>) => setSelected(keys)}`
  - anti-pattern: `import type { Selection } from 'react-aria-components';`
  - fix: `type SelectionValue = Parameters<NonNullable<React.ComponentProps<typeof GridList.Root>['onSelectionChange']>>[0];`
  - fix: `onSelectionChange={(keys) => setSelected(keys)}`
  - complete example:
    ```tsx
    import * as React from 'react';
    import { useState } from 'react';
    import { GridList } from '@tale-ui/react/grid-list';
    
    type SelectionValue = Parameters<NonNullable<React.ComponentProps<typeof GridList.Root>['onSelectionChange']>>[0];
    
    export function Example() {
      const [selectedKeys, setSelectedKeys] = useState<SelectionValue>(new Set());
    
      return (
        <GridList.Root
          aria-label="Items"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <GridList.Item id="1" textValue="Item 1">Item 1</GridList.Item>
          <GridList.Item id="2" textValue="Item 2">Item 2</GridList.Item>
        </GridList.Root>
      );
    }
    ```

<!-- pitfall: grid-list-column-gap-token -->
- **When wrapping GridList in a Column or Row layout container, use spacing-token gap values — never component-size names** — `gap="md"` on an outer `<Column>` or `<Row>` causes `Type '"md"' is not assignable to type 'Gap | undefined'`; always map: `sm`→`s`, `md`→`m`, `lg`→`l`. This applies to the outermost page-level Column wrapper and to any Column used inside `GridList.Item` children.
  - anti-pattern: `<Column gap="md"><GridList.Root aria-label="Items" selectionMode="multiple">...</GridList.Root></Column>`
  - fix: `<Column gap="m"><GridList.Root aria-label="Items" selectionMode="multiple">...</GridList.Root></Column>`

## Notes

- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Each `GridList.Item` needs a `textValue` for accessibility (screen reader label).
- Built on React Aria `GridList` and `GridListItem`.
- Items support `data-dragging` and `data-drop-target` attributes when drag-and-drop is enabled.
