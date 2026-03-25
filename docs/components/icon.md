# Icon

`import { Icon } from '@tale-ui/react/icon';`

A wrapper component for lucide-react icons with BEM sizing and accessibility defaults.

## Basic Usage

```tsx
import { Icon } from '@tale-ui/react/icon';
import { Heart } from 'lucide-react';

<Icon icon={Heart} />
```

## Examples

### Sizes

```tsx
import { Star } from 'lucide-react';

<Icon icon={Star} size="sm" />
<Icon icon={Star} />              {/* md — default */}
<Icon icon={Star} size="lg" />
<Icon icon={Star} size="xl" />
```

### Accessible Icon (with label)

```tsx
import { AlertCircle } from 'lucide-react';

<Icon icon={AlertCircle} label="Warning" />
```

When `label` is provided, the icon gets `role="img"` and `aria-label` instead of `aria-hidden`.

### Inside a Button

```tsx
import { Button } from '@tale-ui/react/button';
import { Plus } from 'lucide-react';

<Button variant="primary">
  <Icon icon={Plus} size="sm" />
  Add Item
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ComponentType<SVGAttributes>` | — | A lucide-react icon component |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant |
| `label` | `string` | — | Accessible label. If omitted, icon is decorative (`aria-hidden`) |
| `className` | `string` | — | Additional class name merged with BEM base |

All other SVG attributes are forwarded to the underlying `<svg>` element.

## CSS Classes

- `.tale-icon` — Base (24px)
- `.tale-icon--sm` — 16px
- `.tale-icon--lg` — 32px
- `.tale-icon--xl` — 48px

## Notes

- Icons inherit `currentColor` by default — they match the parent text color.
- `@tale-ui/react` lists `lucide-react` as an optional peer dependency. Install it in your project: `pnpm add lucide-react`.
- The `Icon` component works with any SVG component that accepts standard SVG attributes, not just lucide-react.
