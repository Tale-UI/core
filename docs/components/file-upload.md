# FileUpload

`import { FileUpload } from '@tale-ui/react/file-upload';`

Drag-and-drop file upload with a drop zone and animated file list. Requires the `motion` peer dependency for list animations.

## Parts

| Part | Description |
|------|-------------|
| `FileUpload.Root` | Outer wrapper — flex column container. |
| `FileUpload.DropZone` | Interactive drop zone with drag-over highlight, click-to-browse, and file validation. |
| `FileUpload.List` | Animated `<ul>` using `motion/react` `AnimatePresence` — wraps list items. |
| `FileUpload.ListItem` | Generic `<li>` for custom list item content. |
| `FileUpload.ListItemProgressBar` | Pre-built list item with a linear progress bar, status text, and delete/retry controls. |
| `FileUpload.ListItemProgressFill` | Pre-built list item with a fill-from-left progress background, status text, and delete/retry controls. |

## Props

### FileUpload.Root

No Tale UI-specific props. Accepts all standard `<div>` HTML attributes.

### FileUpload.DropZone

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hint` | `string` | `'SVG, PNG, JPG or GIF (max. 800×400px)'` | Helper text shown below the upload prompt |
| `isDisabled` | `boolean` | — | Disables drag-and-drop and click-to-browse |
| `accept` | `string` | — | Accepted file types — comma-separated MIME types or extensions (e.g. `"image/*,.pdf"`) |
| `allowsMultiple` | `boolean` | `true` | Allow multiple files |
| `maxSize` | `number` | — | Maximum file size in bytes |
| `onDropFiles` | `(files: FileList) => void` | — | Called with accepted files |
| `onDropUnacceptedFiles` | `(files: FileList) => void` | — | Called with files not matching `accept` |
| `onSizeLimitExceed` | `(files: FileList) => void` | — | Called with files exceeding `maxSize` |

### FileUpload.List

No Tale UI-specific props. Accepts all standard `<ul>` HTML attributes.

### FileUpload.ListItem

No Tale UI-specific props. Accepts all standard `<li>` HTML attributes.

### FileUpload.ListItemProgressBar / FileUpload.ListItemProgressFill

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | File name |
| `size` | `number` | required | File size in bytes (displayed as human-readable) |
| `progress` | `number` | required | Upload progress 0–100 |
| `failed` | `boolean` | — | Marks the item as failed |
| `icon` | `ReactNode` | — | Optional file type icon element |
| `onDelete` | `() => void` | — | Called when the delete button is clicked |
| `onRetry` | `() => void` | — | Called when the "Try again" link is clicked |

## Utility

`getReadableFileSize(bytes: number): string` — Returns a human-readable file size (e.g. `"2 MB"`, `"430 KB"`). Also exported from the package.

## Basic Usage

```tsx
import { FileUpload } from '@tale-ui/react/file-upload';
import { useState } from 'react';

function Example() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload.Root>
      <FileUpload.DropZone
        hint="PNG, JPG or PDF (max 5 MB)"
        accept="image/*,.pdf"
        maxSize={5 * 1024 * 1024}
        onDropFiles={(fl) => setFiles((p) => [...p, ...Array.from(fl)])}
      />
      <FileUpload.List>
        {files.map((f, i) => (
          <FileUpload.ListItemProgressBar
            key={`${f.name}-${i}`}
            name={f.name}
            size={f.size}
            progress={100}
            onDelete={() => setFiles((p) => p.filter((_, j) => j !== i))}
          />
        ))}
      </FileUpload.List>
    </FileUpload.Root>
  );
}
```

## Examples

### With Fill Progress Variant

```tsx
<FileUpload.List>
  <FileUpload.ListItemProgressFill
    name="design.fig"
    size={2_400_000}
    progress={65}
    onDelete={() => {}}
  />
  <FileUpload.ListItemProgressFill
    name="assets.zip"
    size={8_100_000}
    progress={100}
    onDelete={() => {}}
  />
</FileUpload.List>
```

### With Custom File Icon

```tsx
{/* Using @untitledui/file-icons */}
import { FileIcon } from '@untitledui/file-icons';

<FileUpload.ListItemProgressBar
  name="report.pdf"
  size={1_200_000}
  progress={45}
  icon={<FileIcon type="pdf" theme="light" className="tale-file-upload-item__icon" />}
  onDelete={() => {}}
/>
```

### Failed State

```tsx
<FileUpload.ListItemProgressBar
  name="large-video.mp4"
  size={500_000_000}
  progress={0}
  failed
  onDelete={() => {}}
  onRetry={() => restartUpload()}
/>
```

## CSS Classes

- `.tale-file-upload` — Root wrapper
- `.tale-file-upload-drop-zone` — Drop zone container
- `.tale-file-upload-drop-zone--drag-over` — Active drag-over state
- `.tale-file-upload-drop-zone--disabled` — Disabled state
- `.tale-file-upload-drop-zone__icon-wrap` — Upload cloud icon container
- `.tale-file-upload-drop-zone__icon` — Upload cloud icon
- `.tale-file-upload-drop-zone__icon--disabled` — Disabled icon opacity
- `.tale-file-upload-drop-zone__body` — Text content area
- `.tale-file-upload-drop-zone__trigger-row` — Row with button + "or drag and drop"
- `.tale-file-upload-drop-zone__input` — Visually hidden `<input type="file">`
- `.tale-file-upload-drop-zone__trigger` — "Click to upload" button
- `.tale-file-upload-drop-zone__or` — "or drag and drop" text
- `.tale-file-upload-drop-zone__hint` — Hint text
- `.tale-file-upload-drop-zone__hint--invalid` — Error-colored hint text
- `.tale-file-upload-list` — List `<ul>`
- `.tale-file-upload-list-item` — Generic list item `<li>`
- `.tale-file-upload-item` — Compound list item base
- `.tale-file-upload-item--bar` — Progress bar variant
- `.tale-file-upload-item--fill` — Fill progress variant
- `.tale-file-upload-item--failed` — Failed state
- `.tale-file-upload-item__icon` — File icon slot
- `.tale-file-upload-item__content` — Content column
- `.tale-file-upload-item__name` — File name text
- `.tale-file-upload-item__meta` — Meta row (size + status)
- `.tale-file-upload-item__size` — Human-readable file size
- `.tale-file-upload-item__meta-sep` — Vertical separator between size and status
- `.tale-file-upload-item__status` — Status icon + label
- `.tale-file-upload-item__status-icon--success` / `--error` / `--uploading` — Status icon colors
- `.tale-file-upload-item__status-label` / `--success` / `--error` — Status label colors
- `.tale-file-upload-item__delete-btn` — Delete button
- `.tale-file-upload-item__delete-icon` — Trash icon
- `.tale-file-upload-item__retry-btn` — "Try again" link button
- `.tale-file-upload-item__progress-track` — Progress bar track
- `.tale-file-upload-item__progress-fill` — Progress bar fill
- `.tale-file-upload-item__fill-bg` — Fill variant background progress layer
- `.tale-file-upload-item__fill-bg--complete` — Hidden when complete
- `.tale-file-upload-item__fill-ring` — Fill variant inner border ring
- `.tale-file-upload-item__fill-ring--failed` — Error ring color

## Notes

- Requires `motion` to be installed: `npm install motion`
- `FileUpload.List` uses `AnimatePresence` from `motion/react` — list items animate in/out automatically.
- `getReadableFileSize` is also available as a named export: `import { getReadableFileSize } from '@tale-ui/react/file-upload'`.

## Pitfalls

<!-- pitfall: use-fileuploaddropzone-capital-z-not -->
- **Use FileUpload.DropZone (capital Z), not FileUpload.Dropzone** — the sub-part uses PascalCase with a capital Z; the lowercase form causes 'Property does not exist' TypeScript errors.
  - anti-pattern: `<FileUpload.Dropzone />`
  - fix: `<FileUpload.DropZone />`
<!-- pitfall: fileupload-props-on-dropzone-not-root -->
- **All upload config props (accept, maxSize, allowsMultiple, onDropFiles) belong on FileUpload.DropZone, not FileUpload.Root** — `FileUpload.Root` is a plain `<div>` wrapper with no file-upload-specific props; passing any of these there causes `is not assignable to type 'IntrinsicAttributes & RootProps'` TypeScript errors. Every configuration prop lives on `FileUpload.DropZone`.
  - anti-pattern: `<FileUpload.Root accept="image/*" maxSize={5 * 1024 * 1024}>`
  - anti-pattern: `<FileUpload.Root allowsMultiple>`
  - fix: `<FileUpload.Root><FileUpload.DropZone accept="image/*" maxSize={5 * 1024 * 1024} /></FileUpload.Root>`
  - fix: `<FileUpload.Root><FileUpload.DropZone accept="image/*,application/pdf" maxSize={5 * 1024 * 1024} allowsMultiple /></FileUpload.Root>`
<!-- pitfall: fileuploaddropzone-accept-takes-string -->
- **`FileUpload.DropZone` `accept` takes a comma-separated string, not an array** — passing `accept={['image/*', 'application/pdf']}` causes `Type 'string[]' is not assignable to type 'string'`; use a plain comma-separated string matching the HTML `accept` attribute format instead.
  - anti-pattern: `<FileUpload.DropZone accept={['image/*', 'application/pdf']} />`
  - fix: `<FileUpload.DropZone accept="image/*,application/pdf" />`
<!-- pitfall: use-fileupload-for-any-prompt -->
- **Use `FileUpload` for any prompt that asks for a file upload area, dropzone uploader, or uploaded-file list with progress** — when the request is to accept files and show uploaded items, render `FileUpload.Root` with `FileUpload.DropZone` and `FileUpload.List`, and use `FileUpload.ListItemProgressBar` or `FileUpload.ListItemProgressFill` for each file instead of leaving the file empty or substituting `DropZone` or `FileTrigger` alone.
  - anti-pattern: `// empty file`
  - anti-pattern: `import { DropZone } from '@tale-ui/react/drop-zone'; export function UploadArea() { return <DropZone />; }`
  - fix: `import * as React from 'react'; import { FileUpload } from '@tale-ui/react/file-upload'; export function UploadArea() { return <FileUpload.Root><FileUpload.DropZone accept="image/*,.pdf" maxSize={5 * 1024 * 1024} /><FileUpload.List><FileUpload.ListItemProgressBar name="photo.png" size={1200000} progress={60} /></FileUpload.List></FileUpload.Root>; }`
<!-- pitfall: fileuploaddropzone-ondropfiles-receives-filelist -->
- **`onDropFiles` callback receives `FileList`, not `File[]`** — the `onDropFiles` prop on `FileUpload.DropZone` is typed as `(files: FileList) => void`; annotating the handler parameter as `File[]` causes `Type '(rawFiles: File[]) => void' is not assignable to type '(files: FileList) => void'`. Type the parameter as `FileList` and use `Array.from()` to iterate over the files.
  - anti-pattern: `<FileUpload.DropZone onDropFiles={(rawFiles: File[]) => handleFiles(rawFiles)} />`
  - fix: `function handleFiles(rawFiles: FileList) { const entries = Array.from(rawFiles).map(file => ({ id: crypto.randomUUID(), name: file.name, size: file.size, progress: 0 })); }`
