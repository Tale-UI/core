# FileTrigger

`import { FileTrigger } from '@tale-ui/react/file-trigger';`

A headless component that opens the native file picker when its child element is clicked.

## Props

Accepts all React Aria `FileTrigger` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { Button } from '@tale-ui/react/button';
import { useState } from 'react';

function FileUpload() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <>
      <FileTrigger
        onSelect={(fileList) => {
          if (fileList) {
            setFileName(Array.from(fileList).map((f) => f.name).join(', '));
          }
        }}
      >
        <Button>Upload file</Button>
      </FileTrigger>
      {fileName && <p>Selected: {fileName}</p>}
    </>
  );
}
```

## CSS Classes

None -- `FileTrigger` is a headless wrapper that renders no DOM element of its own.

## Pitfalls

<!-- pitfall: file-trigger-no-root -->
- **No `FileTrigger.Root`** — `FileTrigger` is a simple (non-compound) component used directly. There is no namespace structure.
  - anti-pattern: `<FileTrigger.Root>`
  - fix: `<FileTrigger>`

<!-- pitfall: file-trigger-onselect-nullable -->
- **`onSelect` receives `FileList | null` — always null-check** — The callback may receive `null` (e.g. when the user cancels the dialog). Guard before accessing the list.
  - anti-pattern: `onSelect={(list) => Array.from(list).map(...)}`
  - fix: `onSelect={(list) => { if (list) { Array.from(list).map(...) } }}`

## Notes

- Wrap a `Button` (or any pressable element) as the child; clicking it opens the native file dialog.
- The `onSelect` callback receives a `FileList` or `null`.
- Supports `acceptedFileTypes`, `allowsMultiple`, and `defaultCamera` props from React Aria.
