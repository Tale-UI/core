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

## Notes

- This is a simple (non-compound) component exported directly as `ColorSwatch`.
- Accepts a `color` prop as a parsed color value.
- The `color` prop accepts a parsed Color object from `react-aria-components` (e.g. `parseColor('#ff0000')`), not a plain string.
