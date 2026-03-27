import * as React from 'react';
import {
  RadarChart as RechartsRadarChart,
  Radar as RechartsRadar,
  PolarGrid as RechartsPolarGrid,
  PolarAngleAxis as RechartsPolarAngleAxis,
  PolarRadiusAxis as RechartsPolarRadiusAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';
import type { RadarProps as RechartsRadarProps } from 'recharts';
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
 * A radar chart themed with Tale UI design tokens.
 *
 * @example
 * ```tsx
 * import { RadarChart } from '@tale-ui/charts/radar-chart';
 *
 * <RadarChart.Root data={data} width={500} height={400}>
 *   <RadarChart.PolarGrid />
 *   <RadarChart.PolarAngleAxis dataKey="subject" />
 *   <RadarChart.PolarRadiusAxis />
 *   <RadarChart.Tooltip />
 *   <RadarChart.Legend />
 *   <RadarChart.Radar dataKey="score" />
 * </RadarChart.Root>
 * ```
 */
export const Root: React.FC<React.PropsWithChildren<RootProps>> = ({ data, width, height, palette, className, children }) => {
  const colors = palette ?? DEFAULT_PALETTE;
  let radarIndex = 0;
  const enhanced = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type as any)?.displayName === 'RadarChart.Radar') {
      const color = colors[radarIndex % colors.length];
      radarIndex++;
      return React.cloneElement(child as React.ReactElement<any>, {
        stroke: (child.props as any).stroke ?? color,
        fill: (child.props as any).fill ?? color,
      });
    }
    return child;
  });

  return (
    <RechartsRadarChart
      data={data}
      width={width}
      height={height}
      className={cx('tale-chart tale-chart--radar', className)}
    >
      {enhanced}
    </RechartsRadarChart>
  );
};
Root.displayName = 'RadarChart.Root';

/* ─── Radar ────────────────────────────────────────────────────────────────── */

export interface RadarProps extends Omit<RechartsRadarProps, 'ref'> {
  /** Data key to plot. */
  dataKey: string;
}

export const Radar: React.FC<RadarProps> = (props) => (
  <RechartsRadar fillOpacity={0.15} strokeWidth={2} {...props} />
);
Radar.displayName = 'RadarChart.Radar';

/* ─── PolarGrid ────────────────────────────────────────────────────────────── */

export const PolarGrid: React.FC<any> = (props) => (
  <RechartsPolarGrid stroke="var(--neutral-16)" {...props} />
);
PolarGrid.displayName = 'RadarChart.PolarGrid';

/* ─── PolarAngleAxis ───────────────────────────────────────────────────────── */

export const PolarAngleAxis: React.FC<any> = (props) => (
  <RechartsPolarAngleAxis
    tick={{ fill: 'var(--neutral-60)', fontSize: 'var(--text-xs-font-size)' }}
    {...props}
  />
);
PolarAngleAxis.displayName = 'RadarChart.PolarAngleAxis';

/* ─── PolarRadiusAxis ──────────────────────────────────────────────────────── */

export const PolarRadiusAxis: React.FC<any> = (props) => (
  <RechartsPolarRadiusAxis
    tick={{ fill: 'var(--neutral-60)', fontSize: 'var(--text-xs-font-size)' }}
    {...props}
  />
);
PolarRadiusAxis.displayName = 'RadarChart.PolarRadiusAxis';

/* ─── Tooltip ──────────────────────────────────────────────────────────────── */

export const Tooltip: React.FC<any> = (props) => (
  <RechartsTooltip content={<ChartTooltip />} {...props} />
);
Tooltip.displayName = 'RadarChart.Tooltip';

/* ─── Legend ────────────────────────────────────────────────────────────────── */

export const Legend: React.FC<any> = (props) => (
  <RechartsLegend content={<ChartLegend />} {...props} />
);
Legend.displayName = 'RadarChart.Legend';
