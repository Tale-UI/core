# Badge

`import { Badge } from '@tale-ui/react/badge';`

A small status label with semantic color variants.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'neutral' \| 'brand' \| 'error' \| 'warning' \| 'success' \| 'red' \| 'orange' \| 'amber' \| 'yellow' \| 'lime' \| 'green' \| 'emerald' \| 'teal' \| 'cyan' \| 'sky' \| 'indigo' \| 'violet' \| 'purple' \| 'fuchsia' \| 'pink' \| 'rose'` | `'neutral'` | Color variant |
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

### Named Color Variants

```tsx
<Badge variant="red">Red</Badge>
<Badge variant="orange">Orange</Badge>
<Badge variant="amber">Amber</Badge>
<Badge variant="yellow">Yellow</Badge>
<Badge variant="lime">Lime</Badge>
<Badge variant="green">Green</Badge>
<Badge variant="emerald">Emerald</Badge>
<Badge variant="teal">Teal</Badge>
<Badge variant="cyan">Cyan</Badge>
<Badge variant="sky">Sky</Badge>
<Badge variant="indigo">Indigo</Badge>
<Badge variant="violet">Violet</Badge>
<Badge variant="purple">Purple</Badge>
<Badge variant="fuchsia">Fuchsia</Badge>
<Badge variant="pink">Pink</Badge>
<Badge variant="rose">Rose</Badge>
```

### Combined

```tsx
<Badge variant="error" size="sm">Failed</Badge>
<Badge variant="success" size="lg">Approved</Badge>
```

## CSS Classes

- `.tale-badge` -- Base
- `.tale-badge--neutral` / `--brand` / `--error` / `--warning` / `--success` -- Semantic variant modifiers
- `.tale-badge--red` / `--orange` / `--amber` / `--yellow` / `--lime` / `--green` / `--emerald` / `--teal` / `--cyan` / `--sky` / `--indigo` / `--violet` / `--purple` / `--fuchsia` / `--pink` / `--rose` -- Named color modifiers
- `.tale-badge--sm` / `--md` / `--lg` -- Size modifiers

## Notes

- Custom component -- not built on a React Aria primitive.
- Default variant is `neutral`, default size is `md`.
- Renders a `<span>` element. Pass `children` for the label text.
