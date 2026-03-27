import * as React from 'react';
import { ResponsiveContainer } from 'recharts';
import { cx } from '../_cx';

export interface ChartContainerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Aspect ratio (width / height). If set, height is derived from width. */
  aspect?: number;
  /** Fixed height. Defaults to 300 if no aspect is provided. */
  height?: number;
  /** Fixed width. Defaults to '100%'. */
  width?: number | `${number}%`;
  className?: string;
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ aspect, height = aspect ? undefined : 300, width = '100%', className, children, ...props }, ref) => (
    <div ref={ref} className={cx('tale-chart__container', className)} {...props}>
      <ResponsiveContainer width={width} height={height} aspect={aspect}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  ),
);
ChartContainer.displayName = 'ChartContainer';
