# Troubleshooting

Common issues encountered when using `@tale-ui/react` and how to fix them.

## Unstyled buttons in Dialog, AlertDialog, and Drawer

### Issue

Trigger and close/action buttons inside `Dialog`, `AlertDialog`, and `Drawer` render without any button styling — they appear as plain unstyled text.

### Cause

Each overlay component handles the `tale-button` base class differently:

- **`Dialog.Trigger`** auto-applies `tale-button`, but does **not** add a variant — so the button has base styles but looks incomplete without a variant modifier.
- **`AlertDialog.Trigger`** applies `tale-alert-dialog__trigger` instead of `tale-button` — no button styling at all.
- **`Drawer.Trigger`** applies `tale-drawer__trigger` instead of `tale-button` — no button styling at all.
- **`Drawer.Close`** applies `tale-drawer__close` instead of `tale-button` — no button styling at all.
- **`Dialog.Close`** is designed as a small icon-only close button (positioned top-right), not an action button.

### Solution

**Dialog** — Add the variant class to the trigger. Use `Dialog.Close` only for the corner `✕` icon. For cancel/confirm actions, use standalone `Button` components:

```tsx
import { useState } from 'react';
import { Dialog } from '@tale-ui/react/dialog';
import { Button } from '@tale-ui/react/button';

const [open, setOpen] = useState(false);

<Dialog.Root isOpen={open} onOpenChange={setOpen}>
  <Dialog.Trigger className="tale-button--primary">Open Dialog</Dialog.Trigger>
  <Dialog.Backdrop>
    <Dialog.Popup>
      <Dialog.Close aria-label="Close">✕</Dialog.Close>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description text.</Dialog.Description>
      <div className="tale-dialog__actions">
        <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
        <Button variant="primary" onPress={() => setOpen(false)}>Confirm</Button>
      </div>
    </Dialog.Popup>
  </Dialog.Backdrop>
</Dialog.Root>
```

**AlertDialog** — Add both `tale-button` and the variant class to the trigger. For actions, use standalone `Button` components:

```tsx
import { useState } from 'react';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Button } from '@tale-ui/react/button';

const [open, setOpen] = useState(false);

<AlertDialog.Root isOpen={open} onOpenChange={setOpen}>
  <AlertDialog.Trigger className="tale-button tale-button--danger">
    Delete Item
  </AlertDialog.Trigger>
  <AlertDialog.Backdrop>
    <AlertDialog.Popup>
      <AlertDialog.Content>
        <AlertDialog.Title>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
        <div className="tale-alert-dialog__actions">
          <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onPress={() => setOpen(false)}>Delete</Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Popup>
  </AlertDialog.Backdrop>
</AlertDialog.Root>
```

**Drawer** — Add both `tale-button` and the variant class to both trigger and close buttons:

```tsx
import { Drawer } from '@tale-ui/react/drawer';

<Drawer.Root>
  <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
  <Drawer.Backdrop />
  <Drawer.Popup>
    <Drawer.Title>Title</Drawer.Title>
    <Drawer.Description>Description text.</Drawer.Description>
    <div style={{ marginTop: 'var(--space-m)', display: 'flex', gap: 'var(--space-xs)' }}>
      <Drawer.Close className="tale-button tale-button--neutral" style={{ flex: 1 }}>Cancel</Drawer.Close>
      <Drawer.Close className="tale-button tale-button--primary" style={{ flex: 1 }}>Confirm</Drawer.Close>
    </div>
  </Drawer.Popup>
</Drawer.Root>
```

### Quick reference

| Component | Trigger class needed | Close/action approach |
|---|---|---|
| `Dialog.Trigger` | `className="tale-button--{variant}"` (base auto-applied) | `Dialog.Close` for `✕` icon; `<Button>` for actions |
| `AlertDialog.Trigger` | `className="tale-button tale-button--{variant}"` | `<Button>` components inside `tale-alert-dialog__actions` |
| `Drawer.Trigger` | `className="tale-button tale-button--{variant}"` | `Drawer.Close` with `className="tale-button tale-button--{variant}"` |

## Calendar navigation buttons stacked vertically

### Issue

The previous/next month buttons and heading in `Calendar` appear stacked on top of each other instead of in a horizontal row.

### Cause

`Calendar.PreviousButton`, `Calendar.Heading`, and `Calendar.NextButton` are rendered as sibling elements without any layout container. The Calendar component does not provide built-in flex layout for these — you must supply your own wrapper.

### Solution

Wrap the three navigation elements in a `<header>` (or `<div>`) with flexbox:

```tsx
<Calendar.Root>
  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>
      {(date) => <Calendar.Cell date={date} />}
    </Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>
```

This also applies when using Calendar inside `DatePicker.Dialog`.
