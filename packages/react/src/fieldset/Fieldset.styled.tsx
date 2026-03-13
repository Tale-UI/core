import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-fieldset', className)} ref={ref} {...props} />
));
Root.displayName = 'Fieldset.Root';

export const Legend = React.forwardRef<
  React.ComponentRef<typeof H.Legend>,
  React.ComponentPropsWithoutRef<typeof H.Legend>
>(({ className, ...props }, ref) => (
  <H.Legend className={cx('tale-fieldset__legend', className)} ref={ref} {...props} />
));
Legend.displayName = 'Fieldset.Legend';
