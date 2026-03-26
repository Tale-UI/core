# Avatar

`import { Avatar } from '@tale-ui/react/avatar';`

A circular avatar displaying a user image or fallback initials.

## Parts

| Part | Description |
|------|-------------|
| `Avatar.Root` | Outer container. Accepts a `size` prop (`sm`, `md`, `lg`, `xl`). |
| `Avatar.Image` | An `<img>` element for the user photo. |
| `Avatar.Fallback` | Text content shown when no image is provided or loading fails. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant controlling avatar dimensions |

Also accepts all standard `<span>` HTML attributes.

### Image

No Tale UI-specific props. Accepts all standard `<img>` HTML attributes.

### Fallback

No Tale UI-specific props. Accepts all standard `<span>` HTML attributes.

## Basic Usage

```tsx
<Avatar.Root size="md">
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

## Examples

### All Sizes

```tsx
<Avatar.Root size="sm">
  <Avatar.Fallback>SM</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="md">
  <Avatar.Fallback>MD</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="lg">
  <Avatar.Fallback>LG</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="xl">
  <Avatar.Fallback>XL</Avatar.Fallback>
</Avatar.Root>
```

### With Image

```tsx
<Avatar.Root size="lg">
  <Avatar.Image src="/photo.jpg" alt="User avatar" />
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar.Root>
```

## CSS Classes

- `.tale-avatar` — Base
- `.tale-avatar--sm` / `--md` / `--lg` / `--xl` — Size modifiers
- `.tale-avatar__image` — Image element
- `.tale-avatar__fallback` — Fallback text

## Notes

- Always include a `Fallback` alongside `Image` so initials display while the image loads or if it fails.
- Default size is `md`.
