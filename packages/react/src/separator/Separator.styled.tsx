import * as React from 'react';
import { Separator as AriaSeparator } from 'react-aria-components';
import type { SeparatorProps as AriaSeparatorProps } from 'react-aria-components';
import { cx } from '../_cx';

export interface SeparatorProps extends Omit<AriaSeparatorProps, 'className'> {
  className?: string | undefined;
}

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => (
    <AriaSeparator
      ref={ref}
      orientation={orientation}
      className={cx(
        orientation === 'vertical' ? 'tale-separator tale-separator--vertical' : 'tale-separator',
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = 'Separator';
