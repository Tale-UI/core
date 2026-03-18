# Drawer

`import { Drawer } from '@tale-ui/react/drawer';`

A slide-in panel with optional backdrop, title, and description.

## Parts

| Part | Description |
|------|-------------|
| `Drawer.Root` | Manages open/close state and transition animations. |
| `Drawer.Trigger` | Button that opens the drawer. Applies `tale-drawer__trigger` (not `tale-button`). |
| `Drawer.Backdrop` | Click-to-close overlay behind the drawer. |
| `Drawer.Popup` | The drawer panel (`role="dialog"`). |
| `Drawer.Title` | Drawer heading. |
| `Drawer.Description` | Drawer description text. |
| `Drawer.Close` | Button that closes the drawer. Applies `tale-drawer__close` (not `tale-button`). |

## Basic Usage

```tsx
import { Drawer } from '@tale-ui/react/drawer';

<Drawer.Root>
  <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
  <Drawer.Backdrop />
  <Drawer.Popup>
    <Drawer.Title>Drawer Title</Drawer.Title>
    <Drawer.Description>
      A drawer panel for side or bottom content.
    </Drawer.Description>
    <div style={{ marginTop: 'var(--space-m)', display: 'flex', gap: 'var(--space-xs)' }}>
      <Drawer.Close className="tale-button tale-button--neutral" style={{ flex: 1 }}>Cancel</Drawer.Close>
      <Drawer.Close className="tale-button tale-button--primary" style={{ flex: 1 }}>Confirm</Drawer.Close>
    </div>
  </Drawer.Popup>
</Drawer.Root>
```

## Examples

### Without Backdrop

```tsx
<Drawer.Root>
  <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
  <Drawer.Popup>
    <p>Drawer content goes here.</p>
    <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
  </Drawer.Popup>
</Drawer.Root>
```

## CSS Classes

- `.tale-drawer` — Root wrapper
- `.tale-drawer__trigger` — Trigger button (not `tale-button`)
- `.tale-drawer__backdrop` — Backdrop overlay
- `.tale-drawer__popup` — Drawer panel
- `.tale-drawer__title` — Title
- `.tale-drawer__description` — Description
- `.tale-drawer__close` — Close button (not `tale-button`)
- `.tale-drawer__handle` — Optional drag handle element
- `.tale-drawer__swipe-area` — Optional swipe-to-dismiss area

## Notes

- **Trigger and Close need explicit `tale-button` classes.** `Drawer.Trigger` applies `tale-drawer__trigger` and `Drawer.Close` applies `tale-drawer__close` — neither includes `tale-button`. Add `className="tale-button tale-button--{variant}"` for button styling.
- `Drawer.Root` supports controlled (`open` / `onOpenChange`) and uncontrolled (`defaultOpen`) modes.
- The Popup and Backdrop use transition status data attributes (`data-entering`, `data-exiting`) for CSS animations.
- Clicking the `Backdrop` closes the drawer automatically.
- Unlike Dialog, this is a custom implementation (not built on React Aria's Modal).
