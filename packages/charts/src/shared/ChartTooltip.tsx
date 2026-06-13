import * as React from 'react';
import { cx } from '../_cx';

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label, className }) => {
  if (!active || !payload?.length) {return null;}

  return (
    <div className={cx('tale-chart__tooltip', className)}>
      {label != null && <div className="tale-chart__tooltip-label">{label}</div>}
      {payload.map((entry, i) => (
        <div key={i} className="tale-chart__tooltip-item">
          <span className="tale-chart__tooltip-dot" style={{ backgroundColor: entry.color }} />
          <span className="tale-chart__tooltip-name">{entry.name}</span>
          <span className="tale-chart__tooltip-value">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};
ChartTooltip.displayName = 'ChartTooltip';
