import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-switch', className)} ref={ref} {...props} />
));
Root.displayName = 'Switch.Root';

export const Thumb = React.forwardRef<
  React.ComponentRef<typeof H.Thumb>,
  React.ComponentPropsWithoutRef<typeof H.Thumb>
>(({ className, ...props }, ref) => (
  <H.Thumb className={cx('tale-switch__thumb', className)} ref={ref} {...props} />
));
Thumb.displayName = 'Switch.Thumb';
