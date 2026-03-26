# ProgressBar

`import { ProgressBar } from '@tale-ui/react/progress-bar';`

A horizontal bar indicating progress toward completion, with support for determinate and indeterminate states.

## Parts

| Part | Description |
|------|-------------|
| `ProgressBar.Root` | Wrapper managing value and ARIA semantics |
| `ProgressBar.Header` | Flex row wrapper for Label + Value |
| `ProgressBar.Label` | Accessible text label |
| `ProgressBar.Value` | Displays the current value (e.g. "60%"); `aria-hidden` |
| `ProgressBar.Track` | Background rail |
| `ProgressBar.Indicator` | Filled portion; set `value` for determinate width, omit for indeterminate |

## Basic Usage

```tsx
<ProgressBar.Root value={60} minValue={0} maxValue={100}>
  <ProgressBar.Track>
    <ProgressBar.Indicator value={60} />
  </ProgressBar.Track>
</ProgressBar.Root>
```

## Examples

### With Label and Value

```tsx
<ProgressBar.Root value={60} minValue={0} maxValue={100}>
  <ProgressBar.Header>
    <ProgressBar.Label>Uploading...</ProgressBar.Label>
    <ProgressBar.Value>60%</ProgressBar.Value>
  </ProgressBar.Header>
  <ProgressBar.Track>
    <ProgressBar.Indicator value={60} />
  </ProgressBar.Track>
</ProgressBar.Root>
```

### Indeterminate

```tsx
<ProgressBar.Root isIndeterminate minValue={0} maxValue={100}>
  <ProgressBar.Label>Loading...</ProgressBar.Label>
  <ProgressBar.Track>
    <ProgressBar.Indicator />
  </ProgressBar.Track>
</ProgressBar.Root>
```

### Multiple Values

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
  {[0, 25, 50, 75, 100].map((value) => (
    <ProgressBar.Root key={value} value={value} minValue={0} maxValue={100}>
      <ProgressBar.Header>
        <ProgressBar.Label>Progress</ProgressBar.Label>
        <ProgressBar.Value>{value}%</ProgressBar.Value>
      </ProgressBar.Header>
      <ProgressBar.Track>
        <ProgressBar.Indicator value={value} />
      </ProgressBar.Track>
    </ProgressBar.Root>
  ))}
</div>
```

## CSS Classes

- `.tale-progress-bar` — Root container
- `.tale-progress-bar__header` — Header row (Label + Value)
- `.tale-progress-bar__label` — Label text
- `.tale-progress-bar__value` — Value display
- `.tale-progress-bar__track` — Background rail
- `.tale-progress-bar__indicator` — Filled bar (`data-indeterminate` attribute set when no value)

## Notes

- Built on React Aria `ProgressBar`.
- The `Indicator` computes its width as a percentage from `value`, `min` (default 0), and `max` (default 100).
- **`ProgressBar.Value` requires children to display text.** It is a plain `<span>` (`aria-hidden`) that renders whatever you pass as children. Using it self-closing (`<ProgressBar.Value />`) renders an empty span. Always provide display text: `<ProgressBar.Value>60%</ProgressBar.Value>`.
- For indeterminate state, pass `isIndeterminate` on `Root` and omit `value` on `Indicator`. The indicator receives a `data-indeterminate` attribute for CSS animation targeting.
