import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  TabsRootState,
  TabsRootProps,
  TabsRootOrientation,
  TabsRootChangeEventReason,
  TabsRootChangeEventDetails,
} from './root/TabsRoot';

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-tabs', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'Tabs.Root';
export const Root = StyledRoot as typeof H.Root;

export namespace Root {
  export type State = TabsRootState;
  export type Props = TabsRootProps;
  export type Orientation = TabsRootOrientation;
  export type ChangeEventReason = TabsRootChangeEventReason;
  export type ChangeEventDetails = TabsRootChangeEventDetails;
}

const StyledList = React.forwardRef<
  React.ComponentRef<typeof H.List>,
  React.ComponentPropsWithoutRef<typeof H.List>
>(({ className, ...props }, ref) => (
  <H.List className={cx('tale-tabs__list', className)} ref={ref} {...props} />
));
StyledList.displayName = 'Tabs.List';
export const List = StyledList as typeof H.List;

const StyledTab = React.forwardRef<
  React.ComponentRef<typeof H.Tab>,
  React.ComponentPropsWithoutRef<typeof H.Tab>
>(({ className, ...props }, ref) => (
  <H.Tab className={cx('tale-tabs__tab', className)} ref={ref} {...props} />
));
StyledTab.displayName = 'Tabs.Tab';
export const Tab = StyledTab as typeof H.Tab;

const StyledIndicator = React.forwardRef<
  React.ComponentRef<typeof H.Indicator>,
  React.ComponentPropsWithoutRef<typeof H.Indicator>
>(({ className, ...props }, ref) => (
  <H.Indicator className={cx('tale-tabs__indicator', className)} ref={ref} {...props} />
));
StyledIndicator.displayName = 'Tabs.Indicator';
export const Indicator = StyledIndicator as typeof H.Indicator;

const StyledPanel = React.forwardRef<
  React.ComponentRef<typeof H.Panel>,
  React.ComponentPropsWithoutRef<typeof H.Panel>
>(({ className, ...props }, ref) => (
  <H.Panel className={cx('tale-tabs__panel', className)} ref={ref} {...props} />
));
StyledPanel.displayName = 'Tabs.Panel';
export const Panel = StyledPanel as typeof H.Panel;
