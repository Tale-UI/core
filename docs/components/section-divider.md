# SectionDivider

`import { SectionDivider } from '@tale-ui/react/section-divider';`

A decorative full-width horizontal rule styled as a section boundary. It has built-in maximum-width and responsive horizontal padding to match typical page layout containers.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | -- | Additional classes applied to the outer `<div>` wrapper |

Also accepts all standard `<div>` HTML attributes. Children are **not** rendered.

## Basic Usage

```tsx
import { SectionDivider } from '@tale-ui/react/section-divider';

<SectionDivider />
```

## Examples

### Between page sections

```tsx
<section>
  <h2>Features</h2>
  <p>...</p>
</section>
<SectionDivider />
<section>
  <h2>Pricing</h2>
  <p>...</p>
</section>
```

### Custom colour via CSS variable

```tsx
<SectionDivider style={{ '--section-divider-color': 'var(--color-20)' } as React.CSSProperties} />
```

## CSS Classes

- `.tale-section-divider` — Outer wrapper with layout padding
- `.tale-section-divider__rule` — The `<hr>` element (1 px height, `--neutral-20` background)

## Pitfalls

<!-- pitfall: section-divider-not-separator -->
- **`SectionDivider` is for page-level section breaks** — for UI dividers inside components (menus, cards, lists) use `Separator` instead.
  - anti-pattern: `<Menu><SectionDivider /></Menu>`
  - fix: `<Menu.Separator />`

## Notes

- Custom component — not built on a React Aria primitive.
- The `role="separator"` comes from the inner `<hr>`. The outer wrapper is presentational.
- Responsive padding: `var(--space-m)` on mobile, `var(--space-2xl)` at wider viewports.
