import * as React from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';
import type { LineProps as RechartsLineProps } from 'recharts';
import { cx } from '../_cx';
import { DEFAULT_PALETTE } from '../_palette';
import { ChartTooltip } from '../shared/ChartTooltip';
import { ChartLegend } from '../shared/ChartLegend';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export interface RootProps {
  data: Record<string, unknown>[];
  width?: number;
  height?: number;
  /** Custom colour palette for series. */
  palette?: string[];
  className?: string;
}

/**
 * A line chart themed with Tale UI design tokens.
 *
 * @example
 * ```tsx
 * import { LineChart } from '@tale-ui/charts/line-chart';
 *
 * <LineChart.Root data={data} width={600} height={300}>
 *   <LineChart.Grid strokeDasharray="3 3" />
 *   <LineChart.XAxis dataKey="month" />
 *   <LineChart.YAxis />
 *   <LineChart.Tooltip />
 *   <LineChart.Legend />
 *   <LineChart.Line dataKey="revenue" />
 * </LineChart.Root>
 * ```
 */
export const Root: React.FC<React.PropsWithChildren<RootProps>> = ({ data, width, height, palette, className, children }) => {
  const colors = palette ?? DEFAULT_PALETTE;
  let lineIndex = 0;
  const enhanced = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type as any)?.displayName === 'LineChart.Line') {
      const color = colors[lineIndex % colors.length];
      lineIndex += 1;
      return React.cloneElement(child as React.ReactElement<any>, {
        stroke: (child.props as any).stroke ?? color,
      });
    }
    return child;
  });

  return (
    <RechartsLineChart
      data={data}
      width={width}
      height={height}
      className={cx('tale-chart tale-chart--line', className)}
    >
      {enhanced}
    </RechartsLineChart>
  );
};
Root.displayName = 'LineChart.Root';

/* ─── Line ─────────────────────────────────────────────────────────────────── */

export interface LineProps extends Omit<RechartsLineProps, 'ref'> {
  /** Data key to plot. */
  dataKey: string;
}

export const Line: React.FC<LineProps> = (props) => (
  <RechartsLine strokeWidth={2} dot={false} {...props} />
);
Line.displayName = 'LineChart.Line';

/* ─── XAxis ────────────────────────────────────────────────────────────────── */

export const XAxis: React.FC<any> = (props) => (
  <RechartsXAxis
    axisLine={false}
    tickLine={false}
    tick={{ fill: 'var(--neutral-60)', fontSize: 'var(--text-xs-font-size)' }}
    {...props}
  />
);
XAxis.displayName = 'LineChart.XAxis';

/* ─── YAxis ────────────────────────────────────────────────────────────────── */

export const YAxis: React.FC<any> = (props) => (
  <RechartsYAxis
    axisLine={false}
    tickLine={false}
    tick={{ fill: 'var(--neutral-60)', fontSize: 'var(--text-xs-font-size)' }}
    {...props}
  />
);
YAxis.displayName = 'LineChart.YAxis';

/* ─── Grid ─────────────────────────────────────────────────────────────────── */

export const Grid: React.FC<any> = (props) => (
  <RechartsGrid stroke="var(--neutral-16)" strokeDasharray="3 3" {...props} />
);
Grid.displayName = 'LineChart.Grid';

/* ─── Tooltip ──────────────────────────────────────────────────────────────── */

export const Tooltip: React.FC<any> = (props) => (
  <RechartsTooltip content={<ChartTooltip />} {...props} />
);
Tooltip.displayName = 'LineChart.Tooltip';

/* ─── Legend ────────────────────────────────────────────────────────────────── */

export const Legend: React.FC<any> = (props) => (
  <RechartsLegend content={<ChartLegend />} {...props} />
);
Legend.displayName = 'LineChart.Legend';
