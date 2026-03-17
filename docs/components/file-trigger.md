# FileTrigger

`import { FileTrigger } from '@tale-ui/react/file-trigger';`

A headless component that opens the native file picker when its child element is clicked.

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

## Notes

- Wrap a `Button` (or any pressable element) as the child; clicking it opens the native file dialog.
- The `onSelect` callback receives a `FileList` or `null`.
- Supports `acceptedFileTypes`, `allowsMultiple`, and `defaultCamera` props from React Aria.
