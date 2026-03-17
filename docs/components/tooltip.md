# Tooltip

`import { Tooltip } from '@tale-ui/react/tooltip';`

A hover/focus-triggered tooltip with optional arrow and configurable placement.

## Parts

| Part | Description |
|------|-------------|
| `Tooltip.Root` | Manages hover/focus state. Accepts `delay` prop. |
| `Tooltip.Trigger` | Element that triggers the tooltip on hover/focus. |
| `Tooltip.Popup` | The tooltip overlay. Accepts `placement` and `offset`. |
| `Tooltip.Arrow` | Arrow pointing to the trigger. |

## Basic Usage

```tsx
import { Tooltip } from '@tale-ui/react/tooltip';

<Tooltip.Root>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Popup placement="top" offset={8}>
    <Tooltip.Arrow />
    This is a tooltip
  </Tooltip.Popup>
</Tooltip.Root>
```

## Examples

### All Placements

```tsx
{(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
  <Tooltip.Root key={placement}>
    <Tooltip.Trigger>{placement}</Tooltip.Trigger>
    <Tooltip.Popup placement={placement} offset={8}>
      <Tooltip.Arrow />
      Tooltip on {placement}
    </Tooltip.Popup>
  </Tooltip.Root>
))}
```

### With Delay

```tsx
<Tooltip.Root delay={500}>
  <Tooltip.Trigger>500ms delay</Tooltip.Trigger>
  <Tooltip.Popup placement="top" offset={8}>
    <Tooltip.Arrow />
    Appeared after 500ms
  </Tooltip.Popup>
</Tooltip.Root>

<Tooltip.Root delay={0}>
  <Tooltip.Trigger>No delay</Tooltip.Trigger>
  <Tooltip.Popup placement="top" offset={8}>
    <Tooltip.Arrow />
    Instant tooltip
  </Tooltip.Popup>
</Tooltip.Root>
```

## CSS Classes

- `.tale-tooltip__trigger` — Trigger element
- `.tale-tooltip__popup` — Tooltip container
- `.tale-tooltip__arrow` — Arrow element

## Notes

- **Trigger needs explicit `tale-button` classes.** `Tooltip.Trigger` applies `tale-tooltip__trigger` (no styling). Add `className="tale-button tale-button--{variant}"` for button styling.
- Pass `delay={ms}` to `Tooltip.Root` to control how long before the tooltip appears (default is React Aria's built-in delay).
- Tooltip content is plain text or inline elements -- not interactive. Use `Popover` for interactive overlays.
- The `Tooltip.Arrow` renders an SVG arrow that automatically rotates based on placement.
