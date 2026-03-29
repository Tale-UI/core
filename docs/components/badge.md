# Badge

`import { Badge } from '@tale-ui/react/badge';`

A small status label with semantic color variants.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'neutral' \| 'brand' \| 'error' \| 'warning' \| 'success' \| 'red' \| 'orange' \| 'amber' \| 'yellow' \| 'lime' \| 'green' \| 'emerald' \| 'teal' \| 'cyan' \| 'sky' \| 'indigo' \| 'violet' \| 'purple' \| 'fuchsia' \| 'pink' \| 'rose'` | `'neutral'` | Color variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the badge |
| type | `'pill' \| 'rounded' \| 'modern'` | `'pill'` | Visual type. pill uses full border-radius, rounded uses medium radius, modern uses neutral shadow styling |

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

### Types

```tsx
<Badge type="pill">Pill (default)</Badge>
<Badge type="rounded">Rounded</Badge>
<Badge type="modern">Modern</Badge>
```

### Combined

```tsx
<Badge variant="error" size="sm">Failed</Badge>
<Badge variant="success" size="lg">Approved</Badge>
<Badge variant="brand" type="rounded">Rounded Brand</Badge>
<Badge variant="success" type="modern">Modern Success</Badge>
```

## CSS Classes

- `.tale-badge` -- Base
- `.tale-badge--neutral` -- Neutral variant (uses `--neutral-*` tokens)
- `.tale-badge--color` -- Color variant (uses `--color-*` tokens). Combined with `.color-*` theme classes to switch palette.
- `.color-error` / `.color-warning` / `.color-success` / `.color-red` / `.color-orange` etc. -- Theme class from `@tale-ui/core` that remaps `--color-*` tokens to the named palette. Applied automatically by the React component.
- `.tale-badge--sm` / `--md` / `--lg` -- Size modifiers
- `.tale-badge--rounded` / `--modern` -- Type modifiers (pill is default, no extra class)

## Notes

- Custom component -- not built on a React Aria primitive.
- Default variant is `neutral`, default size is `md`, default type is `pill`.
- Renders a `<span>` element. Pass `children` for the label text.
- The `brand` variant uses `--color-*` tokens directly (the brand palette). All other non-neutral variants apply a `.color-*` theme class to remap the palette.
- Color variant backgrounds use `color-mix(in srgb, var(--color-60) 15%, var(--neutral-5))` for a subtle tinted background.
