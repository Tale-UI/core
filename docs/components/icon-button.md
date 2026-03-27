# IconButton

`import { IconButton } from '@tale-ui/react/icon-button';`

A square button designed for icon-only use. Inherits variant styles from Button but uses equal padding and `aspect-ratio: 1` for a square shape.

Always provide an `aria-label` for accessibility since there is no visible text.

## Basic Usage

```tsx
import { IconButton } from '@tale-ui/react/icon-button';
import { Icon } from '@tale-ui/react/icon';
import { Search } from 'lucide-react';

<IconButton aria-label="Search">
  <Icon icon={Search} />
</IconButton>
```

## Examples

### All Variants

```tsx
import { Plus, Settings, Search, Trash2, Download } from 'lucide-react';

<IconButton variant="primary" aria-label="Add"><Icon icon={Plus} /></IconButton>
<IconButton variant="neutral" aria-label="Settings"><Icon icon={Settings} /></IconButton>
<IconButton variant="ghost" aria-label="Search"><Icon icon={Search} /></IconButton>
<IconButton variant="danger" aria-label="Delete"><Icon icon={Trash2} /></IconButton>
<IconButton variant="inverse" aria-label="Download"><Icon icon={Download} /></IconButton>
```

### All Sizes

```tsx
<IconButton variant="neutral" size="sm" aria-label="Small"><Icon icon={Heart} /></IconButton>
<IconButton variant="neutral" size="md" aria-label="Medium"><Icon icon={Heart} /></IconButton>
<IconButton variant="neutral" size="lg" aria-label="Large"><Icon icon={Heart} /></IconButton>
```

### Disabled

```tsx
<IconButton variant="ghost" isDisabled aria-label="Search">
  <Icon icon={Search} />
</IconButton>
```

### Pending / Loading

```tsx
<IconButton variant="ghost" isPending aria-label="Search">
  <Icon icon={Search} />
</IconButton>
```

When pending, the icon is hidden and replaced by a Spinner. The button remains focusable but does not respond to press or hover events.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'neutral' \| 'ghost' \| 'danger' \| 'inverse'` | `'ghost'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `isDisabled` | `boolean` | `false` | Disables the button |
| `disabled` | `boolean` | — | Alias for `isDisabled` |
| `isPending` | `boolean` | — | Shows a loading spinner and prevents interaction while remaining focusable |
| `pending` | `boolean` | — | Alias for `isPending` |
| `aria-label` | `string` | — | Required accessible label |
| `className` | `string` | — | Additional class name |

All other props are forwarded to the underlying `<button>` element (via React Aria Button).

## CSS Classes

- `.tale-icon-button` — Base (sets `aspect-ratio: 1`)
- `.tale-icon-button--sm` — Small size padding
- `.tale-icon-button--md` — Medium size padding (default)
- `.tale-icon-button--lg` — Large size padding

Variant styles (`.tale-button--primary`, etc.) are inherited from the Button component.

## Notes

- The default variant is `ghost` (unlike Button which defaults to `primary`), since icon-only buttons are most commonly used as subtle actions.
- Always use `md` size icons inside IconButton for visual consistency.
- Always provide `aria-label` — without visible text the button is inaccessible otherwise.
- Both `isPending` and `pending` props are supported (aliases). When pending, press and hover events are suppressed but the button remains focusable for accessibility.
