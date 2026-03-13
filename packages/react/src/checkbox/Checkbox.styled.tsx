import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-checkbox', className)} ref={ref} {...props} />
));
Root.displayName = 'Checkbox.Root';

export const Indicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-checkbox__indicator', className)} ref={ref} {...props} />
));
Indicator.displayName = 'Checkbox.Indicator';
