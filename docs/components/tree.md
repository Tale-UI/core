# Tree

`import { Tree } from '@tale-ui/react/tree';`

A hierarchical tree view with expandable/collapsible nodes and optional selection.

## Parts

| Part | Description |
|------|-------------|
| `Tree.Root` | Container. Accepts `aria-label`, `selectionMode`, and `defaultExpandedKeys`. |
| `Tree.Item` | A tree node. Requires `id` and `textValue`. Nest items for sub-trees. |
| `Tree.ItemContent` | Renders the visible label content of a tree item. Wraps children in a `div.tale-tree__item-content`. |

## Props

Accepts all React Aria `Tree` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Tree.Root aria-label="Files">
  <Tree.Item id="1" textValue="Documents">
    <Tree.ItemContent>Documents</Tree.ItemContent>
    <Tree.Item id="1.1" textValue="report.pdf">
      <Tree.ItemContent>report.pdf</Tree.ItemContent>
    </Tree.Item>
  </Tree.Item>
  <Tree.Item id="2" textValue="Photos">
    <Tree.ItemContent>Photos</Tree.ItemContent>
  </Tree.Item>
</Tree.Root>
```

## Examples

### Pre-expanded Nodes

```tsx
<Tree.Root aria-label="Files" defaultExpandedKeys={new Set(['1', '2'])}>
  <Tree.Item id="1" textValue="Documents">
    <Tree.ItemContent>Documents</Tree.ItemContent>
    <Tree.Item id="1.1" textValue="report.pdf">
      <Tree.ItemContent>report.pdf</Tree.ItemContent>
    </Tree.Item>
    <Tree.Item id="1.2" textValue="notes.txt">
      <Tree.ItemContent>notes.txt</Tree.ItemContent>
    </Tree.Item>
  </Tree.Item>
  <Tree.Item id="2" textValue="Photos">
    <Tree.ItemContent>Photos</Tree.ItemContent>
    <Tree.Item id="2.1" textValue="vacation.jpg">
      <Tree.ItemContent>vacation.jpg</Tree.ItemContent>
    </Tree.Item>
  </Tree.Item>
</Tree.Root>
```

## CSS Classes

- `.tale-tree` — Root container
- `.tale-tree__item` — Tree node (receives `data-level`, `data-has-child-items`, `data-expanded`, `data-selected`)
- `.tale-tree__item-content` — Content wrapper inside each item (rendered by `Tree.ItemContent`)

## Notes

- Nest `Tree.Item` elements inside a parent `Tree.Item` to create a hierarchy.
- Every `Tree.Item` must contain a `Tree.ItemContent` to render its label.
- Items with children automatically show a `▶` chevron that rotates to `▼` when expanded (via CSS `::before` on `.tale-tree__item-content`).
- Indentation is handled by CSS using the `data-level` attribute (levels 1–5).
- Use `defaultExpandedKeys` (a `Set`) to control which nodes start expanded.
- Built on React Aria `Tree`, `TreeItem`, and `TreeItemContent`.
- Items receive `data-hovered` on mouse hover (styled with `--neutral-12` background).
