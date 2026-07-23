# @tale-ui/charts

Recharts-based chart components themed with `@tale-ui/css` design tokens.

## Architecture

- Each chart type lives in `src/{chart-type}/` with a `.styled.tsx` and `index.ts`
- All charts use the compound parts pattern: `ChartName.Root`, `ChartName.XAxis`, etc.
- Shared utilities (ChartContainer, ChartTooltip, ChartLegend) live in `src/shared/`
- CSS lives in `src/chart.css` — uses Tale UI tokens, never hardcoded colours

## Conventions

- BEM: `.tale-chart` root, `.tale-chart--{type}` modifier, `.tale-chart__{part}` sub-parts
- All colours use `--color-*`, `--neutral-*`, or semantic tokens (never `--brand-*`)
- Recharts is a peer dependency — consumers install it themselves
- Default series palette uses token-based CSS custom properties for dark mode support
- Each part is a thin wrapper that sets Tale UI defaults then passes all props through to Recharts

## Token Usage

- Grid lines: `--neutral-16`
- Axis text: `--neutral-60`, `--text-font-family`, `--text-xs-font-size`
- Tooltip: `--neutral-5` bg, `--neutral-22` border, `--radius-m`, `--shadow-md`
- Primary series: `--color-60` stroke, `--color-20` fill
- Multi-series palette: `--color-60`, `--color-40`, `--color-80`, `--neutral-50`, `--success-60`, `--warning-60`, `--error-60`
