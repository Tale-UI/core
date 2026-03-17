# AlertDialog

`import { AlertDialog } from '@tale-ui/react/alert-dialog';`

A modal alert dialog with `role="alertdialog"` for confirmations and destructive actions.

## Parts

| Part | Description |
|------|-------------|
| `AlertDialog.Root` | Manages open/close state. |
| `AlertDialog.Trigger` | Button that opens the alert dialog. Applies `tale-alert-dialog__trigger` (not `tale-button`). |
| `AlertDialog.Backdrop` | Modal overlay behind the dialog. **Must wrap `AlertDialog.Popup`**. |
| `AlertDialog.Popup` | Modal wrapper. Must be a child of `AlertDialog.Backdrop`. |
| `AlertDialog.Content` | The `alertdialog` element. Wrap Title, Description, and actions inside. |
| `AlertDialog.Title` | Heading with `slot="title"`. |
| `AlertDialog.Description` | Paragraph describing the alert. |
| `AlertDialog.Close` | Button that closes the dialog via `slot="close"`. |

## Basic Usage

```tsx
import { useState } from 'react';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Button } from '@tale-ui/react/button';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger className="tale-button tale-button--danger">
        Delete Item
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Popup>
          <AlertDialog.Content>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This will permanently delete the item. This action cannot be undone.
            </AlertDialog.Description>
            <div className="tale-alert-dialog__actions">
              <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onPress={() => setOpen(false)}>Delete</Button>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog.Root>
  );
}
```

## CSS Classes

- `.tale-alert-dialog__trigger` — Trigger button (not `tale-button`)
- `.tale-alert-dialog__backdrop` — Backdrop overlay
- `.tale-alert-dialog__popup` — Modal wrapper
- `.tale-alert-dialog__content` — Dialog content (`role="alertdialog"`)
- `.tale-alert-dialog__title` — Title heading
- `.tale-alert-dialog__description` — Description paragraph
- `.tale-alert-dialog__close` — Close button
- `.tale-alert-dialog__actions` — Actions row

## Notes

- **Backdrop must wrap Popup.** `<AlertDialog.Backdrop>` must contain `<AlertDialog.Popup>` as a child — not a sibling. Using them as siblings leaves the backdrop stuck after closing.
- **Trigger needs explicit `tale-button`.** Unlike `Dialog.Trigger`, `AlertDialog.Trigger` applies `tale-alert-dialog__trigger` as its base class, not `tale-button`. Add both classes for button styling: `className="tale-button tale-button--danger"`.
- **Popup and Content are separate.** `Popup` is the Modal container, `Content` is the alertdialog element inside it. Always nest `Content` inside `Popup`.
- Unlike `Dialog`, AlertDialog renders with `role="alertdialog"` for screen reader announcements.
