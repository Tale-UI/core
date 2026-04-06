# DotIcon

`import { DotIcon } from '@tale-ui/react/dot-icon';`

A small colored circle indicator, typically used for status display.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| color | `'neutral' \| 'brand' \| 'error' \| 'warning' \| 'success'` | `'neutral'` | Dot color variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Dot size |

Also accepts all standard `<span>` HTML attributes except `children`.

## Basic Usage

```tsx
<DotIcon color="success" />
```

## Examples

### All Colors

```tsx
<DotIcon color="neutral" />
<DotIcon color="brand" />
<DotIcon color="error" />
<DotIcon color="warning" />
<DotIcon color="success" />
```

### All Sizes

```tsx
<DotIcon size="sm" />
<DotIcon size="md" />
<DotIcon size="lg" />
```

## CSS Classes

- `.tale-dot-icon` -- Base
- `.tale-dot-icon--neutral` / `--brand` / `--error` / `--warning` / `--success` -- Color modifiers
- `.tale-dot-icon--sm` / `--md` / `--lg` -- Size modifiers

## Pitfalls

<!-- pitfall: dot-icon-color-semantic-only -->
- **`color` accepts semantic tokens only** — valid values are `'neutral'`, `'brand'`, `'error'`, `'warning'`, `'success'`. Raw color names or hex values are not accepted.

## Notes

- Custom component -- not built on a React Aria primitive.
- Renders with `aria-hidden="true"` since it is a decorative indicator.
- Does not accept `children`.
