# Button

`import { Button } from '@tale-ui/react/button';`

A styled button component with variant and size props, built on React Aria's Button.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'neutral' \| 'ghost' \| 'danger' \| 'inverse'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `disabled` | `boolean` | — | Alias for `isDisabled` for convenience |
| `isPending` | `boolean` | — | Shows a loading spinner and prevents interaction while remaining focusable |
| `pending` | `boolean` | — | Alias for `isPending` for convenience |

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

### Pending / Loading

```tsx
<Button variant="primary" isPending>Saving…</Button>
<Button variant="neutral" pending>Loading</Button>
```

When pending, the button shows a Spinner overlay while hiding its content (preserving width). The button remains focusable but does not respond to press or hover events. React Aria announces the pending state to screen readers automatically.

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
- `.tale-button__content` -- Inner wrapper for button children (uses `display: contents`)
- `.tale-button__spinner` -- Absolutely-positioned spinner overlay shown during pending state

## Notes

- `variant` defaults to `"primary"`, `size` defaults to `"md"`.
- Both `isDisabled` and `disabled` props are supported (aliases).
- Icons can be placed before or after the label text as inline children.
- Both `isPending` and `pending` props are supported (aliases). When pending, press and hover events are suppressed but the button remains focusable for accessibility.
