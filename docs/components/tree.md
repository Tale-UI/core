# Tree

`import { Tree } from '@tale-ui/react/tree';`

A hierarchical tree view with expandable/collapsible nodes and optional selection.

## Parts

| Part | Description |
|------|-------------|
| `Tree.Root` | Container. Accepts `aria-label`, `selectionMode`, and `defaultExpandedKeys`. |
| `Tree.Item` | A tree node. Requires `id` and `textValue`. Nest items for sub-trees. |
| `Tree.ItemContent` | Renders the visible label content of a tree item. |

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

- `.tale-tree` — Base
- `.tale-tree__item` — Tree node

## Notes

- Nest `Tree.Item` elements inside a parent `Tree.Item` to create a hierarchy.
- Every `Tree.Item` must contain a `Tree.ItemContent` to render its label.
- Use `defaultExpandedKeys` (a `Set`) to control which nodes start expanded.
- Built on React Aria `Tree`, `TreeItem`, and `TreeItemContent`.
