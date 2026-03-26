# ToggleButtonGroup

`import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';`

A convenience re-export of `ToggleButtonGroup` from `@tale-ui/react/toggle-button`. Both import paths resolve to the same component.

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

## Notes

- This is the same component as `ToggleButtonGroup` from `@tale-ui/react/toggle-button` — see [ToggleButton](toggle-button.md) for the full API, props, examples, and CSS classes.
- **Requires `aria-label` or `aria-labelledby`** for accessibility.
