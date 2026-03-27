import * as React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';
import type { PieProps as RechartsPieProps } from 'recharts';
import { cx } from '../_cx';
import { DEFAULT_PALETTE } from '../_palette';
import { ChartTooltip } from '../shared/ChartTooltip';
import { ChartLegend } from '../shared/ChartLegend';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export interface RootProps {
  data?: Record<string, unknown>[];
  width?: number;
  height?: number;
  /** Custom colour palette for slices. */
  palette?: string[];
  className?: string;
}

/**
 * A pie chart themed with Tale UI design tokens.
 *
 * @example
 * ```tsx
 * import { PieChart } from '@tale-ui/charts/pie-chart';
 *
 * <PieChart.Root width={400} height={300}>
 *   <PieChart.Pie data={data} dataKey="value" nameKey="name" />
 *   <PieChart.Tooltip />
 *   <PieChart.Legend />
 * </PieChart.Root>
 * ```
 */
export const Root: React.FC<React.PropsWithChildren<RootProps>> = ({ data, width, height, palette, className, children }) => {
  const colors = palette ?? DEFAULT_PALETTE;
  const enhanced = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type as any)?.displayName === 'PieChart.Pie') {
      const pieProps = child.props as any;
      const pieData: Record<string, unknown>[] = pieProps.data ?? data ?? [];
      return React.cloneElement(child as React.ReactElement<any>, {
        data: pieData,
        children: pieData.map((_, i) => (
          <RechartsCell key={i} fill={colors[i % colors.length]} />
        )),
      });
    }
    return child;
  });

  return (
    <RechartsPieChart
      width={width}
      height={height}
      className={cx('tale-chart tale-chart--pie', className)}
    >
      {enhanced}
    </RechartsPieChart>
  );
};
Root.displayName = 'PieChart.Root';

/* ─── Pie ──────────────────────────────────────────────────────────────────── */

export interface PieProps extends Omit<RechartsPieProps, 'ref'> {
  /** Data key for the numeric value. */
  dataKey: string;
}

export const Pie: React.FC<PieProps> = (props) => (
  <RechartsPie innerRadius={0} outerRadius={80} paddingAngle={2} {...props} />
);
Pie.displayName = 'PieChart.Pie';

/* ─── Cell ─────────────────────────────────────────────────────────────────── */

export const Cell: React.FC<any> = (props) => <RechartsCell {...props} />;
Cell.displayName = 'PieChart.Cell';

/* ─── Tooltip ──────────────────────────────────────────────────────────────── */

export const Tooltip: React.FC<any> = (props) => (
  <RechartsTooltip content={<ChartTooltip />} {...props} />
);
Tooltip.displayName = 'PieChart.Tooltip';

/* ─── Legend ────────────────────────────────────────────────────────────────── */

export const Legend: React.FC<any> = (props) => (
  <RechartsLegend content={<ChartLegend />} {...props} />
);
Legend.displayName = 'PieChart.Legend';
