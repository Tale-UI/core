# FeaturedIcon

`import { FeaturedIcon } from '@tale-ui/react/featured-icon';`

A themed background wrapper for an Icon child. Used to highlight icons in empty states, banners, and feature lists.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'brand' \| 'error' \| 'warning' \| 'success' \| 'neutral'` | `'brand'` | Color variant |
| shape | `'circle' \| 'square'` | `'circle'` | Shape of the container |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the container |

Also accepts all standard `<span>` HTML attributes.

## Basic Usage

```tsx
import { Icon } from '@tale-ui/react/icon';
import { AlertCircle } from 'lucide-react';

<FeaturedIcon variant="error">
  <Icon icon={AlertCircle} />
</FeaturedIcon>
```

## Examples

### All Variants

```tsx
import { Icon } from '@tale-ui/react/icon';
import { Star, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

<FeaturedIcon variant="brand"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="error"><Icon icon={AlertCircle} /></FeaturedIcon>
<FeaturedIcon variant="warning"><Icon icon={AlertTriangle} /></FeaturedIcon>
<FeaturedIcon variant="success"><Icon icon={CheckCircle} /></FeaturedIcon>
<FeaturedIcon variant="neutral"><Icon icon={Info} /></FeaturedIcon>
```

### Shapes

```tsx
<FeaturedIcon variant="brand" shape="circle"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon variant="brand" shape="square"><Icon icon={Star} /></FeaturedIcon>
```

### All Sizes

```tsx
<FeaturedIcon size="sm"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon size="md"><Icon icon={Star} /></FeaturedIcon>
<FeaturedIcon size="lg"><Icon icon={Star} /></FeaturedIcon>
```

## CSS Classes

- `.tale-featured-icon` -- Base (circle by default)
- `.tale-featured-icon--brand` / `--error` / `--warning` / `--success` / `--neutral` -- Variant modifiers
- `.tale-featured-icon--square` -- Square shape modifier
- `.tale-featured-icon--sm` / `--md` / `--lg` -- Size modifiers

## Notes

- Custom component -- not built on a React Aria primitive.
- Pass an `<Icon>` component as children.
- Default shape is `circle`, default variant is `brand`, default size is `md`.
