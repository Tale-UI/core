# Badge

`import { Badge } from '@tale-ui/react/badge';`

A small status label with semantic color variants.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'neutral' \| 'brand' \| 'error' \| 'warning' \| 'success'` | `'neutral'` | Color variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the badge |

Also accepts all standard `<span>` HTML attributes.

## Basic Usage

```tsx
<Badge variant="success">Active</Badge>
```

## Examples

### All Variants

```tsx
<Badge variant="neutral">Neutral</Badge>
<Badge variant="brand">Brand</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="success">Success</Badge>
```

### All Sizes

```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Combined

```tsx
<Badge variant="error" size="sm">Failed</Badge>
<Badge variant="success" size="lg">Approved</Badge>
```

## CSS Classes

- `.tale-badge` -- Base
- `.tale-badge--neutral` / `--brand` / `--error` / `--warning` / `--success` -- Variant modifiers
- `.tale-badge--sm` / `--md` / `--lg` -- Size modifiers

## Notes

- Custom component -- not built on a React Aria primitive.
- Default variant is `neutral`, default size is `md`.
- Renders a `<span>` element. Pass `children` for the label text.
