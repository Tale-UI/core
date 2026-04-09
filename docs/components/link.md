# Link

`import { Link } from '@tale-ui/react/link';`

A styled anchor element with accessible disabled state support.

## Props

Accepts all React Aria `Link` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

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

## Pitfalls

<!-- pitfall: link-no-isexternal-prop -->
<!-- multi-idea-ok -->
- **There is no isExternal prop — use target and rel directly** — To open in a new tab, pass `target="_blank" rel="noopener noreferrer"` directly on `<Link>`. Never use a bare `<a>` tag for navigation — always use `<Link>` from `@tale-ui/react/link`.
  - anti-pattern: `<a href="https://example.com" target="_blank">Visit Example</a>`
  - anti-pattern: `<Link href="https://example.com" isExternal>`
  - fix: `<Link href="https://example.com" target="_blank" rel="noopener noreferrer">Visit Example</Link>`
  - complete example for new-tab link:

    ```tsx
    import { Link } from '@tale-ui/react/link';
    
    export function VisitExample() {
      return (
        <Link href="https://example.com" target="_blank" rel="noopener noreferrer">Visit Example</Link>
      );
    }
    ```

## Notes

- Built on React Aria `Link`. Supports `isDisabled` to prevent interaction and apply `data-disabled`.
- This is a simple (non-compound) component -- use it directly, not via sub-parts.
- The `data-current` attribute marks the link as the current page (styled with `--neutral-90`, bold, no underline, no pointer).
- Use `isDisabled` to disable the link (applies `opacity: 0.45` and `pointer-events: none`).
