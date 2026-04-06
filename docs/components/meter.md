# Meter

`import { Meter } from '@tale-ui/react/meter';`

A horizontal bar representing a scalar measurement within a known range (e.g. storage usage, signal strength).

## Parts

| Part | Description |
|------|-------------|
| `Meter.Root` | Wrapper managing value and ARIA semantics |
| `Meter.Header` | Flex row wrapper for Label + Value |
| `Meter.Label` | Accessible text label |
| `Meter.Value` | Displays the current value (e.g. "60%"); `aria-hidden` |
| `Meter.Track` | Background rail |
| `Meter.Indicator` | Filled portion sized by `value`, `min`, and `max` |

## Props

### Root

No Tale UI-specific props beyond React Aria's `Meter` props (`value`, `minValue`, `maxValue`, etc.).

Also accepts all React Aria `Meter` props.

### Indicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | The current value |
| `min` | `number` | `0` | The minimum value |
| `max` | `number` | `100` | The maximum value |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
<Meter.Root value={60} minValue={0} maxValue={100}>
  <Meter.Track>
    <Meter.Indicator value={60} />
  </Meter.Track>
</Meter.Root>
```

## Examples

### With Label and Value

```tsx
<Meter.Root value={60} minValue={0} maxValue={100}>
  <Meter.Header>
    <Meter.Label>Storage</Meter.Label>
    <Meter.Value>60%</Meter.Value>
  </Meter.Header>
  <Meter.Track>
    <Meter.Indicator value={60} />
  </Meter.Track>
</Meter.Root>
```

### Multiple Values

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
  {[10, 40, 70, 90].map((value) => (
    <Meter.Root key={value} value={value} minValue={0} maxValue={100}>
      <Meter.Header>
        <Meter.Label>Usage</Meter.Label>
        <Meter.Value>{value}%</Meter.Value>
      </Meter.Header>
      <Meter.Track>
        <Meter.Indicator value={value} />
      </Meter.Track>
    </Meter.Root>
  ))}
</div>
```

## CSS Classes

- `.tale-meter` — Root container
- `.tale-meter__header` — Header row (Label + Value)
- `.tale-meter__label` — Label text
- `.tale-meter__value` — Value display
- `.tale-meter__track` — Background rail
- `.tale-meter__indicator` — Filled bar

## Pitfalls

<!-- pitfall: meter-value-needs-children -->
- **`Meter.Value` needs children text** — use `<Meter.Value>60%</Meter.Value>`, not self-closing `<Meter.Value />`, which renders an empty span.

<!-- cross-pitfall-ref: minvalue-maxvalue-not-min-max -->

<!-- pitfall: meter-indicator-own-value-prop -->
- **`Meter.Indicator` requires its own `value` prop** — it does not inherit from `Meter.Root`. Always pass matching values to both.

<!-- pitfall: meter-no-output-sub-part -->
- **No `Meter.Output` sub-part** — use `Meter.Value` for displaying the current value text.

## Notes

- Built on React Aria `Meter`.
- **`Meter.Indicator` requires its own `value` prop** — it does not inherit from `Meter.Root`. React Aria's Meter exposes `percentage` via render props, not context, so the indicator computes its width independently from `value` (default 0), `min` (default 0), and `max` (default 100). Always pass matching values to both Root and Indicator.
- **`Meter.Value` requires children to display text.** It is a plain `<span>` (`aria-hidden`) that renders whatever you pass as children. Using it self-closing (`<Meter.Value />`) renders an empty span. Always provide display text: `<Meter.Value>60%</Meter.Value>`.
- Meter differs from ProgressBar semantically: use Meter for measurements within a known range (disk usage, battery level), and ProgressBar for task completion.
