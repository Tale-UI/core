import * as React from 'react';
import { Menubar as H } from '@tale-ui/react/menubar';
import { cx } from '../_cx';

export const Menubar = React.forwardRef<
  React.ComponentRef<typeof H>,
  React.ComponentPropsWithoutRef<typeof H>
>(({ className, ...props }, ref) => (
  <H className={cx('tale-menubar', className)} ref={ref} {...props} />
));
Menubar.displayName = 'Menubar';
