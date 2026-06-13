import * as React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';
import type { BarProps as RechartsBarProps } from 'recharts';
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
 * A bar chart themed with Tale UI design tokens.
 *
 * @example
 * ```tsx
 * import { BarChart } from '@tale-ui/charts/bar-chart';
 *
 * <BarChart.Root data={data} width={600} height={300}>
 *   <BarChart.Grid strokeDasharray="3 3" />
 *   <BarChart.XAxis dataKey="month" />
 *   <BarChart.YAxis />
 *   <BarChart.Tooltip />
 *   <BarChart.Legend />
 *   <BarChart.Bar dataKey="revenue" />
 * </BarChart.Root>
 * ```
 */
export const Root: React.FC<React.PropsWithChildren<RootProps>> = ({ data, width, height, palette, className, children }) => {
  const colors = palette ?? DEFAULT_PALETTE;
  let barIndex = 0;
  const enhanced = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type as any)?.displayName === 'BarChart.Bar') {
      const color = colors[barIndex % colors.length];
      barIndex += 1;
      return React.cloneElement(child as React.ReactElement<any>, {
        fill: (child.props as any).fill ?? color,
      });
    }
    return child;
  });

  return (
    <RechartsBarChart
      data={data}
      width={width}
      height={height}
      className={cx('tale-chart tale-chart--bar', className)}
    >
      {enhanced}
    </RechartsBarChart>
  );
};
Root.displayName = 'BarChart.Root';

/* ─── Bar ──────────────────────────────────────────────────────────────────── */

export interface BarProps extends Omit<RechartsBarProps, 'ref'> {
  /** Data key to plot. */
  dataKey: string;
}

export const Bar: React.FC<BarProps> = (props) => (
  <RechartsBar radius={[4, 4, 0, 0]} {...props} />
);
Bar.displayName = 'BarChart.Bar';

/* ─── XAxis ────────────────────────────────────────────────────────────────── */

export const XAxis: React.FC<any> = (props) => (
  <RechartsXAxis
    axisLine={false}
    tickLine={false}
    tick={{ fill: 'var(--neutral-60)', fontSize: 'var(--text-xs-font-size)' }}
    {...props}
  />
);
XAxis.displayName = 'BarChart.XAxis';

/* ─── YAxis ────────────────────────────────────────────────────────────────── */

export const YAxis: React.FC<any> = (props) => (
  <RechartsYAxis
    axisLine={false}
    tickLine={false}
    tick={{ fill: 'var(--neutral-60)', fontSize: 'var(--text-xs-font-size)' }}
    {...props}
  />
);
YAxis.displayName = 'BarChart.YAxis';

/* ─── Grid ─────────────────────────────────────────────────────────────────── */

export const Grid: React.FC<any> = (props) => (
  <RechartsGrid stroke="var(--neutral-16)" strokeDasharray="3 3" {...props} />
);
Grid.displayName = 'BarChart.Grid';

/* ─── Tooltip ──────────────────────────────────────────────────────────────── */

export const Tooltip: React.FC<any> = (props) => (
  <RechartsTooltip content={<ChartTooltip />} {...props} />
);
Tooltip.displayName = 'BarChart.Tooltip';

/* ─── Legend ────────────────────────────────────────────────────────────────── */

export const Legend: React.FC<any> = (props) => (
  <RechartsLegend content={<ChartLegend />} {...props} />
);
Legend.displayName = 'BarChart.Legend';
