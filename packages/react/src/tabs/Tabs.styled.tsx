import * as React from 'react';
import {
  Tabs,
  TabList,
  Tab as AriaTab,
  TabPanel,
} from 'react-aria-components';
import type {
  TabsProps as AriaTabsProps,
  TabListProps as AriaTabListProps,
  TabProps as AriaTabProps,
  TabPanelProps as AriaTabPanelProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaTabsProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <Tabs ref={ref} className={cx('tale-tabs', className)} {...props} />
  ),
);
Root.displayName = 'Tabs.Root';

// ── List ───────────────────────────────────────────────────────────────────

export interface ListProps extends Omit<AriaTabListProps<object>, 'className'> {
  className?: string | undefined;
}

export const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ className, ...props }, ref) => (
    <TabList ref={ref} className={cx('tale-tabs__list', className)} {...props} />
  ),
);
List.displayName = 'Tabs.List';

// ── Tab ────────────────────────────────────────────────────────────────────

export interface TabProps extends Omit<AriaTabProps, 'className'> {
  className?: string | undefined;
}

export const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ className, ...props }, ref) => (
    <AriaTab ref={ref} className={cx('tale-tabs__tab', className)} {...props} />
  ),
);
Tab.displayName = 'Tabs.Tab';

// ── Panel ──────────────────────────────────────────────────────────────────

export interface PanelProps extends Omit<AriaTabPanelProps, 'className'> {
  className?: string | undefined;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, ...props }, ref) => (
    <TabPanel ref={ref} className={cx('tale-tabs__panel', className)} {...props} />
  ),
);
Panel.displayName = 'Tabs.Panel';

// ── Indicator ──────────────────────────────────────────────────────────────
// A simple decorative bar positioned via CSS; RA Tabs does not have a built-in
// sliding indicator concept. Position/sizing via CSS custom properties or
// consumer-supplied styles.

export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLSpanElement, IndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} role="presentation" className={cx('tale-tabs__indicator', className)} {...props} />
  ),
);
Indicator.displayName = 'Tabs.Indicator';
