# Dialog

`import { Dialog } from '@tale-ui/react/dialog';`

A modal dialog overlay with backdrop, title, description, and close button.

## Parts

| Part | Description |
|------|-------------|
| `Dialog.Root` | Manages open/close state. Wrap Trigger + Backdrop inside. |
| `Dialog.Trigger` | Button that opens the dialog. Auto-applies `tale-button`. |
| `Dialog.Backdrop` | Overlay behind the dialog. **Must wrap `Dialog.Popup`**. |
| `Dialog.Popup` | The dialog container (Modal + Dialog). Must be a child of `Dialog.Backdrop`. |
| `Dialog.Title` | Heading rendered with `slot="title"`. |
| `Dialog.Description` | Paragraph describing the dialog content. |
| `Dialog.Close` | Icon button that closes the dialog via `slot="close"`. Positioned top-right. |
| `Dialog.Actions` | Flex row container for action buttons (Cancel/Confirm). |

## Props

Accepts all React Aria `DialogTrigger` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { useState } from 'react';
import { Dialog } from '@tale-ui/react/dialog';
import { Button } from '@tale-ui/react/button';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--primary">Open Dialog</Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Confirm action</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to proceed? This action can be undone later.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onPress={() => setOpen(false)}>Confirm</Button>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}
```

> **Note:** `Dialog.Trigger` auto-applies `tale-button` but needs a variant className. Use `Dialog.Close` only for the corner ✕ icon — for action buttons, use standalone `Button` components.

## Examples

### Destructive

```tsx
const [open, setOpen] = useState(false);

<Dialog.Root isOpen={open} onOpenChange={setOpen}>
  <Dialog.Trigger className="tale-button--danger">Delete Account</Dialog.Trigger>
  <Dialog.Backdrop>
    <Dialog.Popup>
      <Dialog.Close aria-label="Close" />
      <Dialog.Title>Delete account</Dialog.Title>
      <Dialog.Description>
        This action is permanent and cannot be undone. All your data will be lost.
      </Dialog.Description>
      <Dialog.Actions>
        <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
        <Button variant="danger" onPress={() => setOpen(false)}>Delete</Button>
      </Dialog.Actions>
    </Dialog.Popup>
  </Dialog.Backdrop>
</Dialog.Root>
```

### Dismissable

```tsx
const [open, setOpen] = useState(false);

<Dialog.Root isOpen={open} onOpenChange={setOpen}>
  <Dialog.Trigger className="tale-button--neutral">Open Dismissable</Dialog.Trigger>
  <Dialog.Backdrop isDismissable>
    <Dialog.Popup>
      <Dialog.Close aria-label="Close" />
      <Dialog.Title>Dismissable Dialog</Dialog.Title>
      <Dialog.Description>
        Click the backdrop or press Escape to dismiss this dialog.
      </Dialog.Description>
      <Dialog.Actions>
        <Button variant="neutral" onPress={() => setOpen(false)}>Dismiss</Button>
      </Dialog.Actions>
    </Dialog.Popup>
  </Dialog.Backdrop>
</Dialog.Root>
```

## CSS Classes

- `.tale-button` — Trigger base (auto-applied)
- `.tale-dialog__backdrop` — Backdrop overlay
- `.tale-dialog__popup` — Dialog content container
- `.tale-dialog__title` — Title heading
- `.tale-dialog__description` — Description paragraph
- `.tale-dialog__close` — Close icon button (positioned top-right)
- `.tale-dialog__actions` — Actions row (cancel/confirm buttons)

## Notes

- **Controlled state uses `isOpen`, not `open`.** Pass `isOpen={open} onOpenChange={setOpen}` to `Dialog.Root`. This follows the React Aria Components convention.
- **Backdrop must wrap Popup.** `<Dialog.Backdrop>` must contain `<Dialog.Popup>` as a child — not a sibling. This produces the correct React Aria structure (`ModalOverlay > Modal > Dialog`). Using them as siblings creates two independent overlay portals and the backdrop will not be cleaned up on close.
- **Trigger variant class.** `Dialog.Trigger` auto-applies `tale-button` — add the variant yourself: `className="tale-button--primary"`.
- **Use `<Button>` for actions.** `Dialog.Close` applies `tale-dialog__close` CSS (absolutely positioned in the corner) — reserve it for the icon-only X button. For Cancel/Confirm, use `<Button variant="..." onPress={() => setOpen(false)}>`.
- **Wrap actions in `Dialog.Actions`.** This applies the correct flexbox layout for the button row.
- **Dismissable:** Pass `isDismissable` to `Dialog.Backdrop` to allow closing by clicking the backdrop or pressing Escape.
- **ARIA labelling:** Dialog automatically associates `Dialog.Title` with `aria-labelledby` and `Dialog.Description` with `aria-describedby`. Always include at least a Title for accessibility. The dialog receives `role="dialog"` automatically.
