import * as React from 'react';
import { Separator as H } from './Separator';
import type { SeparatorProps, SeparatorState } from './Separator';
import { cx } from '../_cx';

export const Separator = React.forwardRef<
  React.ComponentRef<typeof H>,
  React.ComponentPropsWithoutRef<typeof H>
>(({ orientation = 'horizontal', className, ...props }, ref) => (
  <H
    orientation={orientation}
    className={cx(
      orientation === 'vertical' ? 'tale-separator tale-separator--vertical' : 'tale-separator',
      className,
    )}
    ref={ref}
    {...props}
  />
));
Separator.displayName = 'Separator';

export namespace Separator {
  export type Props = SeparatorProps;
  export type State = SeparatorState;
}
