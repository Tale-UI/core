# AreaChart

`import { AreaChart } from '@tale-ui/charts/area-chart';`

An area chart themed with Tale UI design tokens. Built on Recharts.

## Parts

| Part | Description |
|------|-------------|
| `AreaChart.Root` | Container wrapping Recharts `AreaChart`. Accepts `data`, `width`, `height`, `palette`. |
| `AreaChart.Area` | An area series. Accepts `dataKey`. |
| `AreaChart.XAxis` | Horizontal axis. Accepts `dataKey` and Recharts XAxis props. |
| `AreaChart.YAxis` | Vertical axis. |
| `AreaChart.Grid` | Cartesian grid lines. |
| `AreaChart.Tooltip` | Styled tooltip using `ChartTooltip`. |
| `AreaChart.Legend` | Styled legend using `ChartLegend`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Chart data array (required) |
| `width` | `number` | — | Chart width in pixels |
| `height` | `number` | — | Chart height in pixels |
| `palette` | `string[]` | Token-based palette | Custom series colours |

### Area

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataKey` | `string` | — | Data key to plot (required) |
| `stroke` | `string` | Auto from palette | Area stroke colour |
| `fill` | `string` | Auto from palette | Area fill colour |
| `fillOpacity` | `number` | `0.15` | Fill transparency (0–1) |

All parts also accept standard Recharts props for their underlying component.

## Basic Usage

```tsx
<AreaChart.Root data={data} width={600} height={300}>
  <AreaChart.Grid />
  <AreaChart.XAxis dataKey="month" />
  <AreaChart.YAxis />
  <AreaChart.Tooltip />
  <AreaChart.Area dataKey="revenue" />
</AreaChart.Root>
```

## Examples

### Multiple Series

```tsx
<AreaChart.Root data={data} width={600} height={300}>
  <AreaChart.Grid strokeDasharray="3 3" />
  <AreaChart.XAxis dataKey="month" />
  <AreaChart.YAxis />
  <AreaChart.Tooltip />
  <AreaChart.Legend />
  <AreaChart.Area dataKey="revenue" />
  <AreaChart.Area dataKey="profit" />
</AreaChart.Root>
```

### Custom Fill Opacity

```tsx
<AreaChart.Root data={data} width={600} height={300}>
  <AreaChart.Grid />
  <AreaChart.XAxis dataKey="month" />
  <AreaChart.YAxis />
  <AreaChart.Tooltip />
  <AreaChart.Area dataKey="revenue" fillOpacity={0.3} />
</AreaChart.Root>
```

### With ChartContainer (responsive)

```tsx
import { ChartContainer } from '@tale-ui/charts';

<ChartContainer height={300}>
  <AreaChart.Root data={data}>
    <AreaChart.Grid />
    <AreaChart.XAxis dataKey="month" />
    <AreaChart.YAxis />
    <AreaChart.Area dataKey="revenue" />
  </AreaChart.Root>
</ChartContainer>
```

## CSS Classes

- `.tale-chart` — Base chart wrapper
- `.tale-chart--area` — Area chart modifier

## Notes

- Requires `recharts` as a peer dependency: `npm install recharts`.
- Series colours are auto-assigned from the palette. Override per-Area with `stroke` and `fill`.
- Areas default to `fillOpacity={0.15}` for a subtle shaded effect beneath the line.
- All Tale UI design tokens are used for grid, axis, tooltip styling — dark mode works automatically.

## Pitfalls
