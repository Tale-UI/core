# ColorSwatch

`import { ColorSwatch } from '@tale-ui/react/color-swatch';`

A simple color preview element that displays a single color value.

## Props

Accepts all React Aria `ColorSwatch` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { parseColor } from 'react-aria-components';

<ColorSwatch color={parseColor('#ff0000')} />
```

## CSS Classes

- `.tale-color-swatch` — Base element

## Pitfalls

<!-- pitfall: color-swatch-prop-is-string -->
- **`color` prop accepts a plain CSS string, not a `Color` object** — Pass a CSS color string directly (e.g. `color="#ff0000"`). Do not use `parseColor()` or pass a `Color` object. Also, the prop is `color`, not `value`.
  - anti-pattern: `<ColorSwatch color={parseColor('#ff0000')} />`
  - fix: `<ColorSwatch color="#ff0000" />`

<!-- pitfall: color-swatch-no-size-prop -->
- **No `size` prop** — `ColorSwatch` does not accept a `size` prop. Use CSS to control dimensions.

<!-- cross-pitfall-ref: color-swatch-string-only -->

## Notes

- This is a simple (non-compound) component exported directly as `ColorSwatch`.
- Accepts a `color` prop as a parsed color value.
- The `color` prop accepts a parsed Color object from `react-aria-components` (e.g. `parseColor('#ff0000')`), not a plain string.
