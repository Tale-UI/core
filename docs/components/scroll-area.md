# ScrollArea

`import { ScrollArea } from '@tale-ui/react/scroll-area';`

A styled scrollable container with custom scrollbar UI.

## Parts

| Part | Description |
|------|-------------|
| `ScrollArea.Root` | Outer wrapper defining the scroll region dimensions |
| `ScrollArea.Viewport` | Clipping container for the scrollable content |
| `ScrollArea.Content` | Inner wrapper around the actual content |
| `ScrollArea.Scrollbar` | Scrollbar track; accepts `orientation` (`"vertical"` or `"horizontal"`) |
| `ScrollArea.Thumb` | Draggable scrollbar thumb inside a `Scrollbar` |
| `ScrollArea.Corner` | Corner piece shown when both scrollbars are visible |

## Basic Usage

```tsx
<ScrollArea.Root style={{ width: 300, height: 200 }}>
  <ScrollArea.Viewport>
    <ScrollArea.Content>
      <div style={{ padding: 'var(--space-s)' }}>
        {/* tall content here */}
      </div>
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
```

## Examples

### Horizontal

```tsx
<ScrollArea.Root style={{ width: 300, height: 100 }}>
  <ScrollArea.Viewport>
    <ScrollArea.Content>
      <div style={{ width: 800, padding: 'var(--space-s)', whiteSpace: 'nowrap' }}>
        {/* wide content here */}
      </div>
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
```

### Both Axes

```tsx
<ScrollArea.Root style={{ width: 300, height: 200 }}>
  <ScrollArea.Viewport>
    <ScrollArea.Content>
      <div style={{ width: 600, padding: 'var(--space-s)' }}>
        {/* wide and tall content */}
      </div>
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
```

## CSS Classes

- `.tale-scroll-area` — Root container
- `.tale-scroll-area__viewport` — Clipping viewport
- `.tale-scroll-area__content` — Content wrapper
- `.tale-scroll-area__scrollbar` — Scrollbar track (`data-orientation="vertical|horizontal"`)
- `.tale-scroll-area__thumb` — Scrollbar thumb
- `.tale-scroll-area__corner` — Corner element

## Notes

- This is a purely structural component (no React Aria dependency); all parts are plain `<div>` wrappers with BEM classes.
- You must set explicit `width`/`height` on `ScrollArea.Root` to define the scroll region.
- Add `ScrollArea.Corner` only when both vertical and horizontal scrollbars are present.
