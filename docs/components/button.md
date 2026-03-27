# Button

`import { Button } from '@tale-ui/react/button';`

A styled button component with variant and size props, built on React Aria's Button.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'neutral' \| 'ghost' \| 'danger' \| 'inverse'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `disabled` | `boolean` | — | Alias for `isDisabled` for convenience |

Also accepts all React Aria `Button` props.

## Basic Usage

```tsx
<Button variant="primary" size="md">
  Button
</Button>
```

## Examples

### All Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="neutral">Neutral</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="inverse">Inverse</Button>
```

### All Sizes

```tsx
<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>
```

### Disabled

```tsx
<Button variant="primary" isDisabled>Primary</Button>
<Button variant="neutral" isDisabled>Neutral</Button>
```

### With Icon

```tsx
<Button variant="primary">
  <PlusIcon />
  Add Item
</Button>
```

## CSS Classes

- `.tale-button` -- Base
- `.tale-button--primary` -- Primary variant
- `.tale-button--neutral` -- Neutral variant
- `.tale-button--ghost` -- Ghost variant
- `.tale-button--danger` -- Danger variant
- `.tale-button--inverse` -- Inverse variant
- `.tale-button--sm` -- Small size
- `.tale-button--md` -- Medium size (default)
- `.tale-button--lg` -- Large size

## Notes

- `variant` defaults to `"primary"`, `size` defaults to `"md"`.
- Both `isDisabled` and `disabled` props are supported (aliases).
- Icons can be placed before or after the label text as inline children.
