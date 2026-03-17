# Link

`import { Link } from '@tale-ui/react/link';`

A styled anchor element with accessible disabled state support.

## Basic Usage

```tsx
<Link href="#">Click here</Link>
```

## Examples

### Disabled

```tsx
<Link href="#" isDisabled>Click here</Link>
```

### External Link

```tsx
<Link href="https://example.com" target="_blank">Open in new tab</Link>
```

## CSS Classes

- `.tale-link` — Base

## Notes

- Built on React Aria `Link`. Supports `isDisabled` to prevent interaction and apply `data-disabled`.
- This is a simple (non-compound) component -- use it directly, not via sub-parts.
