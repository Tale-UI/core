import * as React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';
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
 * An area chart themed with Tale UI design tokens.
 *
 * @example
 * ```tsx
 * import { AreaChart } from '@tale-ui/charts/area-chart';
 *
 * <AreaChart.Root data={data} width={600} height={300}>
 *   <AreaChart.Grid strokeDasharray="3 3" />
 *   <AreaChart.XAxis dataKey="month" />
 *   <AreaChart.YAxis />
 *   <AreaChart.Tooltip />
 *   <AreaChart.Legend />
 *   <AreaChart.Area dataKey="revenue" />
 * </AreaChart.Root>
 * ```
 */
export const Root: React.FC<React.PropsWithChildren<RootProps>> = ({ data, width, height, palette, className, children }) => {
  const colors = palette ?? DEFAULT_PALETTE;
  let areaIndex = 0;
  const enhanced = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type as any)?.displayName === 'AreaChart.Area') {
      const color = colors[areaIndex % colors.length];
      areaIndex++;
      return React.cloneElement(child as React.ReactElement<any>, {
        stroke: (child.props as any).stroke ?? color,
        fill: (child.props as any).fill ?? color,
      });
    }
    return child;
  });

  return (
    <RechartsAreaChart
      data={data}
      width={width}
      height={height}
      className={cx('tale-chart tale-chart--area', className)}
    >
      {enhanced}
    </RechartsAreaChart>
  );
};
Root.displayName = 'AreaChart.Root';

/* ─── Area ─────────────────────────────────────────────────────────────────── */

export interface AreaProps {
  /** Data key to plot. */
  dataKey: string;
  fill?: string;
  stroke?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  [key: string]: unknown;
}

export const Area: React.FC<AreaProps> = (props) => (
  <RechartsArea fillOpacity={0.15} strokeWidth={2} {...props} />
);
Area.displayName = 'AreaChart.Area';

/* ─── XAxis ────────────────────────────────────────────────────────────────── */

export const XAxis: React.FC<any> = (props) => (
  <RechartsXAxis
    axisLine={false}
    tickLine={false}
    tick={{ fill: 'var(--neutral-60)', fontSize: 'var(--text-xs-font-size)' }}
    {...props}
  />
);
XAxis.displayName = 'AreaChart.XAxis';

/* ─── YAxis ────────────────────────────────────────────────────────────────── */

export const YAxis: React.FC<any> = (props) => (
  <RechartsYAxis
    axisLine={false}
    tickLine={false}
    tick={{ fill: 'var(--neutral-60)', fontSize: 'var(--text-xs-font-size)' }}
    {...props}
  />
);
YAxis.displayName = 'AreaChart.YAxis';

/* ─── Grid ─────────────────────────────────────────────────────────────────── */

export const Grid: React.FC<any> = (props) => (
  <RechartsGrid stroke="var(--neutral-16)" strokeDasharray="3 3" {...props} />
);
Grid.displayName = 'AreaChart.Grid';

/* ─── Tooltip ──────────────────────────────────────────────────────────────── */

export const Tooltip: React.FC<any> = (props) => (
  <RechartsTooltip content={<ChartTooltip />} {...props} />
);
Tooltip.displayName = 'AreaChart.Tooltip';

/* ─── Legend ────────────────────────────────────────────────────────────────── */

export const Legend: React.FC<any> = (props) => (
  <RechartsLegend content={<ChartLegend />} {...props} />
);
Legend.displayName = 'AreaChart.Legend';
