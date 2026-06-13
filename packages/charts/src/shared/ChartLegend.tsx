import * as React from 'react';
import { cx } from '../_cx';

export interface ChartLegendProps {
  payload?: Array<{ value: string; color: string }>;
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ payload, className }) => {
  if (!payload?.length) {return null;}

  return (
    <div className={cx('tale-chart__legend', className)}>
      {payload.map((entry, i) => (
        <div key={i} className="tale-chart__legend-item">
          <span className="tale-chart__legend-dot" style={{ backgroundColor: entry.color }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};
ChartLegend.displayName = 'ChartLegend';
