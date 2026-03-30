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

type TabSize = 'sm' | 'md';
type TabVariant = 'underline' | 'pills' | 'enclosed';
const TabSizeContext = React.createContext<TabSize>('md');
const TabVariantContext = React.createContext<TabVariant>('underline');

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaTabsProps, 'className'> {
  className?: string | undefined;
}

/**
 * Tabbed navigation with tab list, tab buttons, and panels.
 *
 * @example
 * ```tsx
 * import { Tabs } from '@tale-ui/react/tabs';
 *
 * <Tabs.Root defaultSelectedKey="tab1">
 *   <Tabs.List>
 *     <Tabs.Tab id="tab1">Account</Tabs.Tab>
 *     <Tabs.Tab id="tab2">Settings</Tabs.Tab>
 *     <Tabs.Indicator />
 *   </Tabs.List>
 *   <Tabs.Panel id="tab1">Account settings here.</Tabs.Panel>
 *   <Tabs.Panel id="tab2">App settings here.</Tabs.Panel>
 * </Tabs.Root>
 * ```
 */
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
  /** Size variant applied to all tabs in the list. */
  size?: TabSize | undefined;
  /** Visual style. `'underline'` (default) shows animated bottom bar, `'pills'` shows rounded pill background, `'enclosed'` shows bordered tab panel. */
  variant?: TabVariant | undefined;
}

/**
 * Container for tab buttons, with optional size and variant
 *
 * @example
 * ```tsx
 * <Tabs.List size="sm" variant="pills">
 *   <Tabs.Tab id="tab1">Overview</Tabs.Tab>
 *   <Tabs.Tab id="tab2">Details</Tabs.Tab>
 * </Tabs.List>
 * ```
 */
export const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ className, children, size, variant, ...props }, ref) => {
    const tabs: React.ReactNode[] = [];
    const extras: React.ReactNode[] = [];

    React.Children.forEach(children as React.ReactNode, (child) => {
      if (React.isValidElement(child) && child.type === Indicator) {
        extras.push(child);
      } else {
        tabs.push(child);
      }
    });

    const resolvedSize = size ?? 'md';
    const resolvedVariant = variant ?? 'underline';
    const variantClass = resolvedVariant !== 'underline' ? ` tale-tabs__list--${resolvedVariant}` : '';

    if (extras.length === 0) {
      return (
        <TabSizeContext.Provider value={resolvedSize}>
          <TabVariantContext.Provider value={resolvedVariant}>
            <TabList ref={ref} className={cx(`tale-tabs__list${variantClass}`, className)} {...props}>{tabs}</TabList>
          </TabVariantContext.Provider>
        </TabSizeContext.Provider>
      );
    }

    return (
      <TabSizeContext.Provider value={resolvedSize}>
        <TabVariantContext.Provider value={resolvedVariant}>
          <div className={cx(`tale-tabs__list${variantClass}`, className)} style={{ position: 'relative' }}>
            <TabList ref={ref} className="tale-tabs__list-inner" {...props}>{tabs}</TabList>
            {extras}
          </div>
        </TabVariantContext.Provider>
      </TabSizeContext.Provider>
    );
  },
);
List.displayName = 'Tabs.List';

// ── Tab ────────────────────────────────────────────────────────────────────

export interface TabProps extends Omit<AriaTabProps, 'className'> {
  className?: string | undefined;
}

/**
 * An individual tab button within the tab list
 *
 * @example
 * ```tsx
 * <Tabs.Tab id="settings">Settings</Tabs.Tab>
 * ```
 */
export const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ className, ...props }, ref) => {
    const tabSize = React.useContext(TabSizeContext);
    const tabVariant = React.useContext(TabVariantContext);
    const sizeClass = tabSize === 'sm' ? ' tale-tabs__tab--sm' : '';
    const variantClass = tabVariant !== 'underline' ? ` tale-tabs__tab--${tabVariant}` : '';
    return (
      <AriaTab ref={ref} className={cx(`tale-tabs__tab${sizeClass}${variantClass}`, className)} {...props} />
    );
  },
);
Tab.displayName = 'Tabs.Tab';

// ── Panel ──────────────────────────────────────────────────────────────────

export interface PanelProps extends Omit<AriaTabPanelProps, 'className'> {
  className?: string | undefined;
}

/**
 * Content area displayed when the corresponding tab is selected
 *
 * @example
 * ```tsx
 * <Tabs.Panel id="settings">Settings content here.</Tabs.Panel>
 * ```
 */
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

function updateIndicator(indicator: HTMLSpanElement, variant: TabVariant = 'underline') {
  const wrapper = indicator.parentElement;
  if (!wrapper) return;

  // The tabs live in either the wrapper itself or a .tale-tabs__list-inner child
  const tabContainer = wrapper.querySelector('.tale-tabs__list-inner') ?? wrapper;
  const selectedTab = tabContainer.querySelector<HTMLElement>('[data-selected]');
  if (!selectedTab) return;

  const isVertical = wrapper.closest('[data-orientation="vertical"]') !== null;

  if (isVertical) {
    // Clear horizontal-only styles
    indicator.style.left = '';
    indicator.style.top = `${selectedTab.offsetTop}px`;
    indicator.style.height = `${selectedTab.offsetHeight}px`;
    if (variant === 'pills') {
      indicator.style.width = `${selectedTab.offsetWidth}px`;
    } else {
      indicator.style.width = '';
    }
  } else {
    indicator.style.left = `${selectedTab.offsetLeft}px`;
    indicator.style.width = `${selectedTab.offsetWidth}px`;
    if (variant === 'pills') {
      indicator.style.top = `${selectedTab.offsetTop}px`;
      indicator.style.height = `${selectedTab.offsetHeight}px`;
    } else {
      // Clear pills/vertical-only styles
      indicator.style.top = '';
      indicator.style.height = '';
    }
  }
}

/**
 * Animated bar that tracks the currently selected tab
 *
 * @example
 * ```tsx
 * <Tabs.List>
 *   <Tabs.Tab id="tab1">One</Tabs.Tab>
 *   <Tabs.Indicator />
 * </Tabs.List>
 * ```
 */
export const Indicator = React.forwardRef<HTMLSpanElement, IndicatorProps>(
  ({ className, style, ...props }, ref) => {
    const innerRef = React.useRef<HTMLSpanElement | null>(null);
    const tabVariant = React.useContext(TabVariantContext);

    const mergedRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      // Enclosed variant doesn't use an animated indicator
      if (tabVariant === 'enclosed') return;

      const indicator = innerRef.current;
      if (!indicator) return;

      const wrapper = indicator.parentElement;
      if (!wrapper) return;

      const tabContainer = wrapper.querySelector('.tale-tabs__list-inner') ?? wrapper;

      const update = () => updateIndicator(indicator, tabVariant);

      // Initial position (after paint so tabs are laid out)
      const rafId = requestAnimationFrame(update);

      // Watch for data-selected changes on any child tab
      const mutationObserver = new MutationObserver(update);
      mutationObserver.observe(tabContainer, { attributes: true, attributeFilter: ['data-selected'], subtree: true });

      // Re-measure if tabs resize (e.g. font loading, container resize)
      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(tabContainer);

      return () => {
        cancelAnimationFrame(rafId);
        mutationObserver.disconnect();
        resizeObserver.disconnect();
      };
    }, [tabVariant]);

    // Enclosed variant hides indicator via CSS
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
