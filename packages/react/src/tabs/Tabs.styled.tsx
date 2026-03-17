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
// React Aria's TabList uses a collection API and drops non-collection
// children (like Indicator). We split Indicator children out and render
// them as siblings of the TabList inside a shared positioned wrapper,
// so the Indicator can measure the tabs via the DOM.

export interface ListProps extends Omit<AriaTabListProps<object>, 'className'> {
  className?: string | undefined;
}

export const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ className, children, ...props }, ref) => {
    const tabs: React.ReactNode[] = [];
    const extras: React.ReactNode[] = [];

    React.Children.forEach(children as React.ReactNode, (child) => {
      if (React.isValidElement(child) && child.type === Indicator) {
        extras.push(child);
      } else {
        tabs.push(child);
      }
    });

    if (extras.length === 0) {
      return <TabList ref={ref} className={cx('tale-tabs__list', className)} {...props}>{tabs}</TabList>;
    }

    return (
      <div className={cx('tale-tabs__list', className)} style={{ position: 'relative' }}>
        <TabList ref={ref} className="tale-tabs__list-inner" {...props}>{tabs}</TabList>
        {extras}
      </div>
    );
  },
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
// Animated bar that tracks the selected tab. Uses a MutationObserver to
// watch for `data-selected` attribute changes on sibling tabs, then
// measures the selected tab to set position and size.

export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

function updateIndicator(indicator: HTMLSpanElement) {
  const wrapper = indicator.parentElement;
  if (!wrapper) return;

  // The tabs live in either the wrapper itself or a .tale-tabs__list-inner child
  const tabContainer = wrapper.querySelector('.tale-tabs__list-inner') ?? wrapper;
  const selectedTab = tabContainer.querySelector<HTMLElement>('[data-selected]');
  if (!selectedTab) return;

  const isVertical = wrapper.closest('[data-orientation="vertical"]') !== null;

  if (isVertical) {
    indicator.style.top = `${selectedTab.offsetTop}px`;
    indicator.style.height = `${selectedTab.offsetHeight}px`;
  } else {
    indicator.style.left = `${selectedTab.offsetLeft}px`;
    indicator.style.width = `${selectedTab.offsetWidth}px`;
  }
}

export const Indicator = React.forwardRef<HTMLSpanElement, IndicatorProps>(
  ({ className, style, ...props }, ref) => {
    const innerRef = React.useRef<HTMLSpanElement | null>(null);

    const mergedRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      const indicator = innerRef.current;
      if (!indicator) return;

      const wrapper = indicator.parentElement;
      if (!wrapper) return;

      const tabContainer = wrapper.querySelector('.tale-tabs__list-inner') ?? wrapper;

      // Initial position (after paint so tabs are laid out)
      const rafId = requestAnimationFrame(() => updateIndicator(indicator));

      // Watch for data-selected changes on any child tab
      const mutationObserver = new MutationObserver(() => updateIndicator(indicator));
      mutationObserver.observe(tabContainer, { attributes: true, attributeFilter: ['data-selected'], subtree: true });

      // Re-measure if tabs resize (e.g. font loading, container resize)
      const resizeObserver = new ResizeObserver(() => updateIndicator(indicator));
      resizeObserver.observe(tabContainer);

      return () => {
        cancelAnimationFrame(rafId);
        mutationObserver.disconnect();
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <span
        ref={mergedRef}
        role="presentation"
        className={cx('tale-tabs__indicator', className)}
        style={style}
        {...props}
      />
    );
  },
);
Indicator.displayName = 'Tabs.Indicator';
