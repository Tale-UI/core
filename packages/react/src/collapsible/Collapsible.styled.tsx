import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-collapsible', className)} ref={ref} {...props} />
));
Root.displayName = 'Collapsible.Root';

export const Trigger = React.forwardRef<
  React.ComponentRef<typeof H.Trigger>,
  React.ComponentPropsWithoutRef<typeof H.Trigger>
>(({ className, ...props }, ref) => (
  <H.Trigger className={cx('tale-collapsible__trigger', className)} ref={ref} {...props} />
));
Trigger.displayName = 'Collapsible.Trigger';

export const Panel = React.forwardRef<
  React.ComponentRef<typeof H.Panel>,
  React.ComponentPropsWithoutRef<typeof H.Panel>
>(({ className, ...props }, ref) => (
  <H.Panel className={cx('tale-collapsible__panel', className)} ref={ref} {...props} />
));
Panel.displayName = 'Collapsible.Panel';
