import * as React from 'react';
import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar as RechartsRadialBar,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';
import type { RadialBarProps as RechartsRadialBarProps } from 'recharts';
import { cx } from '../_cx';
import { DEFAULT_PALETTE } from '../_palette';
import { ChartTooltip } from '../shared/ChartTooltip';
import { ChartLegend } from '../shared/ChartLegend';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export interface RootProps {
  data: Record<string, unknown>[];
  width?: number;
  height?: number;
  /** Inner radius of the radial bar layout. */
  innerRadius?: number | string;
  /** Outer radius of the radial bar layout. */
  outerRadius?: number | string;
  /** Custom colour palette for bars. */
  palette?: string[];
  className?: string;
}

/**
 * A radial bar chart themed with Tale UI design tokens.
 *
 * @example
 * ```tsx
 * import { RadialBarChart } from '@tale-ui/charts/radial-bar-chart';
 *
 * <RadialBarChart.Root data={data} width={500} height={400}>
 *   <RadialBarChart.RadialBar dataKey="value" />
 *   <RadialBarChart.Tooltip />
 *   <RadialBarChart.Legend />
 * </RadialBarChart.Root>
 * ```
 */
export const Root: React.FC<React.PropsWithChildren<RootProps>> = ({
  data,
  width,
  height,
  innerRadius = '20%',
  outerRadius = '90%',
  palette,
  className,
  children,
}) => {
  const colors = palette ?? DEFAULT_PALETTE;

  // Inject fill colours into data entries if not already coloured
  const coloredData = data.map((entry, i) => ({
    fill: colors[i % colors.length],
    ...entry,
  }));

  return (
    <RechartsRadialBarChart
      data={coloredData}
      width={width}
      height={height}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      className={cx('tale-chart tale-chart--radial-bar', className)}
    >
      {children}
    </RechartsRadialBarChart>
  );
};
Root.displayName = 'RadialBarChart.Root';

/* ─── RadialBar ────────────────────────────────────────────────────────────── */

export interface RadialBarProps extends Omit<RechartsRadialBarProps, 'ref'> {
  /** Data key for the numeric value. */
  dataKey: string;
}

export const RadialBar: React.FC<RadialBarProps> = (props) => (
  <RechartsRadialBar background={{ fill: 'var(--neutral-10)' }} cornerRadius={4} {...props} />
);
RadialBar.displayName = 'RadialBarChart.RadialBar';

/* ─── Tooltip ──────────────────────────────────────────────────────────────── */

export const Tooltip: React.FC<any> = (props) => (
  <RechartsTooltip content={<ChartTooltip />} {...props} />
);
Tooltip.displayName = 'RadialBarChart.Tooltip';

/* ─── Legend ────────────────────────────────────────────────────────────────── */

export const Legend: React.FC<any> = (props) => (
  <RechartsLegend content={<ChartLegend />} {...props} />
);
Legend.displayName = 'RadialBarChart.Legend';
