# Avatar

`import { Avatar } from '@tale-ui/react/avatar';`

A circular avatar displaying a user image or fallback initials.

## Parts

| Part | Description |
|------|-------------|
| `Avatar.Root` | Outer container. Accepts a `size` prop (`sm`, `md`, `lg`, `xl`). |
| `Avatar.Image` | An `<img>` element for the user photo. |
| `Avatar.Fallback` | Text content shown when no image is provided or loading fails. |
| `Avatar.Group` | Stacks multiple avatars with overlapping layout. Propagates `size` to children. |
| `Avatar.Count` | Displays a "+N" overflow indicator for additional avatars not shown. |

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

### Group

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant propagated to all child avatars |

Also accepts all standard `<div>` HTML attributes.

### Count

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | — | The overflow count to display (renders as "+N") |

Also accepts all standard `<span>` HTML attributes.

### Avatar Group

```tsx
<Avatar.Group size="md">
  <Avatar.Root>
    <Avatar.Fallback>AB</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Fallback>CD</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Fallback>EF</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Count count={5} />
</Avatar.Group>
```

### Group with Images

```tsx
<Avatar.Group size="lg">
  <Avatar.Root>
    <Avatar.Image src="/alice.jpg" alt="Alice" />
    <Avatar.Fallback>AL</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="/bob.jpg" alt="Bob" />
    <Avatar.Fallback>BO</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Count count={12} />
</Avatar.Group>
```

## CSS Classes

- `.tale-avatar` — Base
- `.tale-avatar--sm` / `--md` / `--lg` / `--xl` — Size modifiers
- `.tale-avatar__image` — Image element
- `.tale-avatar__fallback` — Fallback text
- `.tale-avatar-group` — Group container
- `.tale-avatar-group--sm` / `--md` / `--lg` / `--xl` — Group size modifiers
- `.tale-avatar-count` — "+N" overflow count indicator (with `--sm` / `--md` / `--lg` / `--xl` size modifiers)

## Notes

- Always include a `Fallback` alongside `Image` so initials display while the image loads or if it fails.
- Default size is `md`.
- `Avatar.Group` propagates `size` to children — do not set `size` on individual `Avatar.Root` inside a Group unless overriding.
- `Avatar.Count` renders a "+N" indicator — always place it as the last child of `Avatar.Group`.
