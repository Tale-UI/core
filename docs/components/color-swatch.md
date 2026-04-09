# ColorSwatch

`import { ColorSwatch } from '@tale-ui/react/color-swatch';`

A simple color preview element that displays a single color value.

## Props

Accepts all React Aria `ColorSwatch` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { ColorSwatch } from '@tale-ui/react/color-swatch';

<ColorSwatch color="#ff0000" />
```

## CSS Classes

- `.tale-color-swatch` — Base element

## Pitfalls

<!-- pitfall: color-swatch-prop-is-string -->
- **`color` prop accepts a plain CSS string, not a `Color` object** — pass a CSS color string directly (e.g. `color="#ff0000"`); do not use `parseColor()` or pass a `Color` object, and the prop is `color`, not `value`.
  - anti-pattern: `<ColorSwatch color={parseColor('#ff0000')} />`
  - fix: `<ColorSwatch color="#ff0000" />`
  - complete example:

    ```tsx
    import { ColorSwatch } from '@tale-ui/react/color-swatch';
    export function MyComponent() {
      return <ColorSwatch color="#ff0000" />;
    }
    ```
<!-- pitfall: color-swatch-no-size-prop -->
- **No `size` prop** — `ColorSwatch` does not accept a `size` prop. Use CSS to control dimensions.
  - anti-pattern: `<ColorSwatch color="#ff0000" size="lg" />`
  - fix: `<ColorSwatch color="#ff0000" style={{ width: '32px', height: '32px' }} />`

<!-- cross-pitfall-ref: color-swatch-string-only -->

## Notes

- This is a simple (non-compound) component exported directly as `ColorSwatch`.
