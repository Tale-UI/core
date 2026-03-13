import * as React from 'react';
import { Tabs as H } from '@tale-ui/react/tabs';
import { cx } from '../_cx';

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-tabs', className)} ref={ref} {...props} />
));
Root.displayName = 'Tabs.Root';

export const List = React.forwardRef<
  React.ComponentRef<typeof H.List>,
  React.ComponentPropsWithoutRef<typeof H.List>
>(({ className, ...props }, ref) => (
  <H.List className={cx('tale-tabs__list', className)} ref={ref} {...props} />
));
List.displayName = 'Tabs.List';

export const Tab = React.forwardRef<
  React.ComponentRef<typeof H.Tab>,
  React.ComponentPropsWithoutRef<typeof H.Tab>
>(({ className, ...props }, ref) => (
  <H.Tab className={cx('tale-tabs__tab', className)} ref={ref} {...props} />
));
Tab.displayName = 'Tabs.Tab';

export const Indicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-tabs__indicator', className)} ref={ref} {...props} />
));
Indicator.displayName = 'Tabs.Indicator';

export const Panel = React.forwardRef<
  React.ComponentRef<typeof H.Panel>,
  React.ComponentPropsWithoutRef<typeof H.Panel>
>(({ className, ...props }, ref) => (
  <H.Panel className={cx('tale-tabs__panel', className)} ref={ref} {...props} />
));
Panel.displayName = 'Tabs.Panel';
