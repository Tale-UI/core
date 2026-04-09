# ColorSwatchPicker

`import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';`

A selectable grid of color swatches for picking from a predefined set of colors.

## Parts

| Part | Description |
|------|-------------|
| `ColorSwatchPicker.Root` | Container that manages selection state |
| `ColorSwatchPicker.Item` | Individual selectable swatch item |

## Props

Accepts all React Aria `ColorSwatchPicker` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { ColorSwatch } from '@tale-ui/react/color-swatch';

<ColorSwatchPicker.Root>
  <ColorSwatchPicker.Item color="#ff0000">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
  <ColorSwatchPicker.Item color="#00ff00">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
  <ColorSwatchPicker.Item color="#0000ff">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
</ColorSwatchPicker.Root>
```

## CSS Classes

- `.tale-color-swatch-picker` — Root container
- `.tale-color-swatch-picker__item` — Individual swatch item

## Pitfalls

<!-- pitfall: color-swatch-picker-import-swatch-separately -->
- **Import `ColorSwatch` separately from `@tale-ui/react/color-swatch`** — it is not exported from `@tale-ui/react/color-swatch-picker`.
  - anti-pattern: `import { ColorSwatch } from '@tale-ui/react/color-swatch-picker'`
  - fix: `import { ColorSwatch } from '@tale-ui/react/color-swatch'`
  - complete example:
    ```tsx
    import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
    import { ColorSwatch } from '@tale-ui/react/color-swatch';
    
    export function Example() {
      return (
        <ColorSwatchPicker.Root>
          <ColorSwatchPicker.Item color="#ff0000"><ColorSwatch /></ColorSwatchPicker.Item>
          <ColorSwatchPicker.Item color="#00ff00"><ColorSwatch /></ColorSwatchPicker.Item>
          <ColorSwatchPicker.Item color="#0000ff"><ColorSwatch /></ColorSwatchPicker.Item>
        </ColorSwatchPicker.Root>
      );
    }
    ```

<!-- pitfall: color-swatch-picker-value-not-selection -->
- **Uses `value`/`onChange`, not `onSelectionChange`** — The controlled API uses `value` and `onChange`. There is no `onSelectionChange` prop.
  - anti-pattern: `<ColorSwatchPicker.Root onSelectionChange={setColor}>`
  - fix: `<ColorSwatchPicker.Root value={color} onChange={setColor}>`

<!-- pitfall: color-swatch-picker-value-not-nullable -->
- **`value` does NOT accept `null` or `undefined`** — `ColorSwatchPicker.Root` requires a non-nullable color value when controlled. Use `defaultValue` for uncontrolled usage without an initial value.
  - anti-pattern: `<ColorSwatchPicker.Root value={null}>`
  - fix: `<ColorSwatchPicker.Root defaultValue="#ff0000">`

<!-- pitfall: color-swatch-picker-no-list-sub-part -->
- **No `ColorSwatchPicker.List`** — There is no `List` sub-part. Place `ColorSwatchPicker.Item` elements directly inside `ColorSwatchPicker.Root`.
  - anti-pattern: `<ColorSwatchPicker.Root><ColorSwatchPicker.List><ColorSwatchPicker.Item color="#ff0000"><ColorSwatch /></ColorSwatchPicker.Item></ColorSwatchPicker.List></ColorSwatchPicker.Root>`
  - fix: `<ColorSwatchPicker.Root><ColorSwatchPicker.Item color="#ff0000"><ColorSwatch /></ColorSwatchPicker.Item></ColorSwatchPicker.Root>`

<!-- cross-pitfall-ref: color-swatch-string-only -->
<!-- cross-pitfall-ref: color-imports-from-rac -->

## Notes

- Each `Item` accepts a `color` prop specifying the swatch color.
- Combine with `ColorSwatch` inside each `Item` to render the visual swatch.
- Selection state is managed via `value` / `onChange` (controlled) or `defaultValue` (uncontrolled). The selected swatch receives `data-selected`.
