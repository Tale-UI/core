# ProgressCircle

`import { ProgressCircle } from '@tale-ui/react/progress-circle';`

A circular progress indicator showing task completion. Supports determinate (with value) and indeterminate (spinner) states.

## Parts

| Part | Description |
| ---- | ----------- |
| `ProgressCircle.Root` | Container. Wraps React Aria ProgressBar. |
| `ProgressCircle.Track` | SVG element with rail and indicator circles. |
| `ProgressCircle.Label` | Text label. |
| `ProgressCircle.Value` | Percentage text. Auto-renders `{percentage}%` if no children. |

## Props

### Root

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `number \| null` | — | Current value. Pass `null` for indeterminate. |
| `minValue` | `number` | `0` | Minimum value |
| `maxValue` | `number` | `100` | Maximum value |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the circular indicator |

Also accepts all React Aria `ProgressBar` props.

## Basic Usage

```tsx
<ProgressCircle.Root value={60}>
  <ProgressCircle.Track />
</ProgressCircle.Root>
```

## Examples

### With Label and Value

```tsx
<ProgressCircle.Root value={75}>
  <ProgressCircle.Track />
  <ProgressCircle.Label>Upload</ProgressCircle.Label>
  <ProgressCircle.Value />
</ProgressCircle.Root>
```

### Indeterminate

```tsx
<ProgressCircle.Root value={null}>
  <ProgressCircle.Track />
</ProgressCircle.Root>
```

### All Sizes

```tsx
<ProgressCircle.Root value={60} size="sm"><ProgressCircle.Track /></ProgressCircle.Root>
<ProgressCircle.Root value={60} size="md"><ProgressCircle.Track /></ProgressCircle.Root>
<ProgressCircle.Root value={60} size="lg"><ProgressCircle.Track /></ProgressCircle.Root>
```

### Complete

```tsx
<ProgressCircle.Root value={100}>
  <ProgressCircle.Track />
</ProgressCircle.Root>
```

## CSS Classes

- `.tale-progress-circle` -- Root container
- `.tale-progress-circle--sm` -- Small size
- `.tale-progress-circle--lg` -- Large size
- `.tale-progress-circle__track` -- SVG container
- `.tale-progress-circle__rail` -- Background ring (stroke)
- `.tale-progress-circle__indicator` -- Filled arc (stroke)
- `.tale-progress-circle__label` -- Text label
- `.tale-progress-circle__value` -- Percentage text

## Notes

- Built on React Aria `ProgressBar` — provides `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` automatically.
- Pass `value={null}` for an indeterminate spinning animation.
- When `value` reaches `maxValue`, `[data-complete]` is set and the indicator turns green.
- The `Value` sub-part auto-renders the rounded percentage if no children are provided.
- SVG dimensions scale with `size`: sm = 32px, md = 48px, lg = 64px.
