# ToggleButtonGroup

`import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';`

A convenience re-export of `ToggleButtonGroup` from `@tale-ui/react/toggle-button`. Both import paths resolve to the same component.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | — | Propagates size to child `ToggleButton` components |

Also accepts all React Aria `ToggleButtonGroup` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';
import { ToggleButton } from '@tale-ui/react/toggle-button';

<ToggleButtonGroup aria-label="Text formatting">
  <ToggleButton>Bold</ToggleButton>
  <ToggleButton>Italic</ToggleButton>
  <ToggleButton>Underline</ToggleButton>
</ToggleButtonGroup>
```

## Pitfalls

<!-- pitfall: toggle-group-no-radix-props -->
- **No Radix-style `type`, `value`, or `onValueChange` props** — use `selectionMode`, `selectedKeys`, `defaultSelectedKeys`, `onSelectionChange` instead.
  - anti-pattern: `<ToggleButtonGroup type="single" value={sel} onValueChange={setSel}>`
  - fix: `<ToggleButtonGroup selectionMode="single" selectedKeys={sel} onSelectionChange={setSel}>`
  - complete example:
    ```tsx
    import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';
    import { ToggleButton } from '@tale-ui/react/toggle-button';
    
    export function Example() {
      return (
        <ToggleButtonGroup aria-label="Text formatting">
          <ToggleButton>Bold</ToggleButton>
          <ToggleButton>Italic</ToggleButton>
          <ToggleButton>Underline</ToggleButton>
        </ToggleButtonGroup>
      );
    }
    ```

<!-- pitfall: toggle-group-requires-aria-label -->
<!-- prose-only -->
- **Requires `aria-label` or `aria-labelledby`** — React Aria logs a console warning at runtime if neither is provided.

<!-- cross-pitfall-ref: toggle-button-group-import-path -->

## Notes

- This is the same component as `ToggleButtonGroup` from `@tale-ui/react/toggle-button` — see [ToggleButton](toggle-button.md) for the full API, props, examples, and CSS classes.
- **Requires `aria-label` or `aria-labelledby`** for accessibility.
