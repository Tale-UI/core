# DropZone

`import { DropZone } from '@tale-ui/react/drop-zone';`

A drag-and-drop target area that accepts files and other draggable content.

## Props

Accepts all React Aria `DropZone` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { useState } from 'react';

function MyDropZone() {
  const [dropped, setDropped] = useState(false);

  return (
    <DropZone onDrop={() => setDropped(true)}>
      <p>{dropped ? 'File dropped!' : 'Drop files here'}</p>
    </DropZone>
  );
}
```

## Examples

### Combined with FileTrigger

```tsx
import { DropZone } from '@tale-ui/react/drop-zone';
import { FileTrigger } from '@tale-ui/react/file-trigger';
import { Button } from '@tale-ui/react/button';
import { useState } from 'react';

function FileUpload() {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <DropZone
      onDrop={(e) => {
        const names = e.items
          .filter((item) => item.kind === 'file')
          .map((item) => ('name' in item ? item.name : 'unknown'));
        setFiles((prev) => [...prev, ...names]);
      }}
    >
      <p>Drop files here or</p>
      <FileTrigger
        onSelect={(fileList) => {
          if (fileList) {
            setFiles((prev) => [...prev, ...Array.from(fileList).map((f) => f.name)]);
          }
        }}
      >
        <Button>Browse files</Button>
      </FileTrigger>
      {files.length > 0 && <p>Files: {files.join(', ')}</p>}
    </DropZone>
  );
}
```

## CSS Classes

- `.tale-drop-zone` — Base element

## Notes

- This is a simple (non-compound) component exported directly as `DropZone`.
- The `onDrop` handler receives a drop event with an `items` array.
- Use `data-drop-target` attribute for styling the active drop state.
