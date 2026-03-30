import type * as React from 'react';
import ComponentAudit from './demos/ComponentAudit';
import ScaleDemo from './demos/ScaleDemo';
import FormWithValidation from './demos/recipes/FormWithValidation';
import DataTableWithSorting from './demos/recipes/DataTableWithSorting';
import SearchWithAutocomplete from './demos/recipes/SearchWithAutocomplete';
import SettingsPage from './demos/recipes/SettingsPage';
import A2UIDemo from './demos/A2UIDemo';
import ContainedTriggers from './experiments/perf/contained-triggers';
import DetachedTriggers from './experiments/perf/detached-triggers';
import RadixTriggers from './experiments/perf/radix-triggers';

export type RouteEntry =
  | {
      type: 'route';
      path: string;
      label: string;
      element: React.ReactElement;
      showInNav?: boolean;
    }
  | {
      type: 'redirect';
      path: string;
      to: string;
    }
  | {
      type: 'header';
      label: string;
    };

export const defaultRoute = '/perf/contained-triggers';

export const routes: RouteEntry[] = [
  { type: 'header', label: 'Tools' },
  {
    type: 'route',
    path: '/scale',
    label: 'Theme playground',
    element: <ScaleDemo />,
    showInNav: true,
  },
  { type: 'header', label: 'Components' },
  {
    type: 'route',
    path: '/component-audit',
    label: 'Component audit',
    element: <ComponentAudit />,
    showInNav: true,
  },
  { type: 'header', label: 'Recipes' },
  {
    type: 'route',
    path: '/recipes/form-with-validation',
    label: 'Form with validation',
    element: <FormWithValidation />,
    showInNav: true,
  },
  {
    type: 'route',
    path: '/recipes/data-table',
    label: 'Data table with sorting',
    element: <DataTableWithSorting />,
    showInNav: true,
  },
  {
    type: 'route',
    path: '/recipes/search-autocomplete',
    label: 'Search with autocomplete',
    element: <SearchWithAutocomplete />,
    showInNav: true,
  },
  {
    type: 'route',
    path: '/recipes/settings-page',
    label: 'Settings page',
    element: <SettingsPage />,
    showInNav: true,
  },
  { type: 'header', label: 'A2UI' },
  {
    type: 'route',
    path: '/a2ui',
    label: 'A2UI renderer demo',
    element: <A2UIDemo />,
    showInNav: true,
  },
  { type: 'header', label: 'Performance benchmarks' },
  { type: 'redirect', path: '/perf', to: defaultRoute },
  {
    type: 'route',
    path: '/perf/contained-triggers',
    label: 'Tale UI contained triggers',
    element: <ContainedTriggers />,
    showInNav: true,
  },
  {
    type: 'route',
    path: '/perf/detached-triggers',
    label: 'Tale UI detached triggers',
    element: <DetachedTriggers />,
    showInNav: true,
  },
  {
    type: 'route',
    path: '/perf/radix-triggers',
    label: 'Radix triggers',
    element: <RadixTriggers />,
    showInNav: true,
  },
];
