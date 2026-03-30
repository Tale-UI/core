/**
 * Tale UI A2UI Catalog
 *
 * Maps A2UI standard component types to Tale UI React components with
 * adapter functions that convert A2UI props to Tale UI props.
 */

import * as React from 'react';
import type { Catalog, CatalogEntry, A2UIAction, AdapterContext } from './types.ts';
import { isDataBinding } from './types.ts';
import { resolveIcon } from './icon-registry.ts';

/* ─── Lazy imports ────────────────────────────────────────────────────────── */
// Use dynamic imports so tree-shaking works and we don't pull every component
// into bundles that only use a subset of the catalog.

import { Text } from '@tale-ui/react/text';
import { Row } from '@tale-ui/react/row';
import { Column } from '@tale-ui/react/column';
import { Card } from '@tale-ui/react/card';
import { Image } from '@tale-ui/react/image';
import { List } from '@tale-ui/react/list';
import { Button } from '@tale-ui/react/button';
import { TextField } from '@tale-ui/react/text-field';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Radio } from '@tale-ui/react/radio';
import { RadioGroup } from '@tale-ui/react/radio-group';
import { Select } from '@tale-ui/react/select';
import { Switch } from '@tale-ui/react/switch';
import { Table } from '@tale-ui/react/table';
import { Tabs } from '@tale-ui/react/tabs';
import { Badge } from '@tale-ui/react/badge';
import { ProgressBar } from '@tale-ui/react/progress-bar';
import { Spinner } from '@tale-ui/react/spinner';
import { Separator } from '@tale-ui/react/separator';
import { Link } from '@tale-ui/react/link';
import { Icon } from '@tale-ui/react/icon';
import { Form } from '@tale-ui/react/form';
import { Check } from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const h = React.createElement;

/** Resolve a prop value that may be a data binding. */
function resolve(value: unknown, ctx: AdapterContext): unknown {
  return isDataBinding(value) ? ctx.resolveBinding(value) : value;
}

/** Create an onPress handler if an action is defined. */
function pressHandler(action: unknown, ctx: AdapterContext): (() => void) | undefined {
  if (action && typeof action === 'object' && 'name' in action) {
    return ctx.createActionHandler(action as A2UIAction);
  }
  return undefined;
}

/** Map A2UI usage hint to Tale UI Text variant + size. */
function mapTextHint(hint?: string): { variant: string; size: string; as: string } {
  switch (hint) {
    case 'display-l': return { variant: 'display', size: 'l', as: 'h1' };
    case 'display-m': return { variant: 'display', size: 'm', as: 'h1' };
    case 'display-s': return { variant: 'display', size: 's', as: 'h2' };
    case 'heading-l': return { variant: 'heading', size: 'l', as: 'h2' };
    case 'heading-m': return { variant: 'heading', size: 'm', as: 'h3' };
    case 'heading-s': return { variant: 'heading', size: 's', as: 'h4' };
    case 'heading': return { variant: 'heading', size: 'm', as: 'h3' };
    case 'title': return { variant: 'title', size: 'm', as: 'h4' };
    case 'label': return { variant: 'label', size: 'm', as: 'span' };
    case 'body': return { variant: 'text', size: 'm', as: 'p' };
    case 'body-s': return { variant: 'text', size: 's', as: 'p' };
    case 'caption': return { variant: 'text', size: 'xs', as: 'span' };
    case 'mono': return { variant: 'mono', size: 'm', as: 'span' };
    default: return { variant: 'text', size: 'm', as: 'span' };
  }
}

/* ─── Standard Catalog ────────────────────────────────────────────────────── */

/**
 * The Tale UI A2UI catalog. Maps all 21 A2UI standard component types
 * to their Tale UI equivalents.
 */
export const taleUICatalog: Catalog = {
  /* ── Typography ──────────────────────────────────────────────────────── */

  Text: {
    component: Text,
    adapter: (props, ctx) => {
      const { variant, size, as: asTag } = mapTextHint(props.usageHint as string | undefined);
      return {
        variant,
        size,
        as: asTag,
        color: props.color as string | undefined,
        children: props.content ?? ctx.children,
      };
    },
  } as CatalogEntry,

  /* ── Layout ──────────────────────────────────────────────────────────── */

  Row: {
    component: Row,
    adapter: (props, ctx) => ({
      gap: props.spacing as string | undefined,
      align: props.alignment as string | undefined,
      justify: props.justify as string | undefined,
      wrap: props.wrap as boolean | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  Column: {
    component: Column,
    adapter: (props, ctx) => ({
      gap: props.spacing as string | undefined,
      align: props.alignment as string | undefined,
      justify: props.justify as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  Card: {
    component: Card.Root,
    adapter: (props, ctx) => ({
      variant: props.variant as string | undefined,
      padding: props.padding as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  /* ── Display ─────────────────────────────────────────────────────────── */

  Image: {
    component: Image,
    adapter: (props, ctx) => ({
      src: resolve(props.src, ctx) as string,
      alt: (props.alt as string) ?? '',
      radius: props.radius as string | undefined,
      fit: props.fit as string | undefined,
      width: props.width as number | string | undefined,
      height: props.height as number | string | undefined,
    }),
  } as CatalogEntry,

  List: {
    component: List.Root,
    adapter: (props, ctx) => ({
      variant: props.variant as string | undefined,
      density: props.density as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  ListItem: {
    component: List.Item,
    adapter: (props, ctx) => ({
      children: props.content ?? ctx.children,
    }),
  } as CatalogEntry,

  Badge: {
    component: Badge,
    adapter: (props, ctx) => ({
      variant: props.tone as string | undefined,
      size: props.size as string | undefined,
      type: props.type as string | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  Icon: {
    component: Icon,
    adapter: (props) => {
      const iconComponent = resolveIcon(props.name as string);
      return {
        icon: iconComponent,
        size: props.size as string | undefined,
        'aria-label': props.label as string | undefined,
      };
    },
  } as CatalogEntry,

  Separator: {
    component: Separator,
    adapter: (props) => ({
      orientation: props.orientation as string | undefined,
    }),
  } as CatalogEntry,

  Link: {
    component: Link,
    adapter: (props, ctx) => ({
      href: props.href as string,
      target: props.target as string | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Interactive ─────────────────────────────────────────────────────── */

  Button: {
    component: Button,
    adapter: (props, ctx) => ({
      variant: props.variant as string | undefined,
      size: props.size as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      onPress: pressHandler(props.action, ctx),
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Form Controls ───────────────────────────────────────────────────── */

  TextInput: {
    component: TextField.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        value: boundValue as string | undefined,
        defaultValue: props.defaultValue as string | undefined,
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.required as boolean | undefined,
        onChange: props.binding
          ? (v: string) => {
              const handler = pressHandler(props.action, ctx);
              if (handler) handler();
            }
          : undefined,
        children: h(React.Fragment, null,
          props.label ? h(TextField.Label, null, String(props.label)) : null,
          h(TextField.Input),
          props.description ? h(TextField.Description, null, String(props.description)) : null,
          props.errorMessage ? h(TextField.ErrorMessage, null, String(props.errorMessage)) : null,
        ),
      };
    },
  } as CatalogEntry,

  Checkbox: {
    component: Checkbox.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        isSelected: boundValue as boolean | undefined,
        defaultSelected: props.defaultSelected as boolean | undefined,
        isDisabled: props.disabled as boolean | undefined,
        onChange: props.binding
          ? () => {
              const handler = pressHandler(props.action, ctx);
              if (handler) handler();
            }
          : undefined,
        children: h(React.Fragment, null,
          h(Checkbox.Indicator, null, h(Icon, { icon: Check, size: 'sm' })),
          (props.label as string) ?? ctx.children,
        ),
      };
    },
  } as CatalogEntry,

  Radio: {
    component: RadioGroup,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        value: boundValue as string | undefined,
        defaultValue: props.defaultValue as string | undefined,
        isDisabled: props.disabled as boolean | undefined,
        label: props.label as string | undefined,
        onChange: props.binding
          ? () => {
              const handler = pressHandler(props.action, ctx);
              if (handler) handler();
            }
          : undefined,
        children: ctx.children,
      };
    },
  } as CatalogEntry,

  Select: {
    component: Select.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        selectedKey: boundValue as string | undefined,
        defaultSelectedKey: props.defaultValue as string | undefined,
        isDisabled: props.disabled as boolean | undefined,
        placeholder: props.placeholder as string | undefined,
        onSelectionChange: props.binding
          ? () => {
              const handler = pressHandler(props.action, ctx);
              if (handler) handler();
            }
          : undefined,
        children: h(React.Fragment, null,
          props.label ? h(Select.Label, null, String(props.label)) : null,
          h(Select.Trigger, null,
            h(Select.Value),
            h(Select.Icon),
          ),
          h(Select.Popover, null,
            h(Select.ListBox as React.ComponentType, null, ctx.children),
          ),
        ),
      };
    },
  } as CatalogEntry,

  Switch: {
    component: Switch.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        isSelected: boundValue as boolean | undefined,
        defaultSelected: props.defaultSelected as boolean | undefined,
        isDisabled: props.disabled as boolean | undefined,
        onChange: props.binding
          ? () => {
              const handler = pressHandler(props.action, ctx);
              if (handler) handler();
            }
          : undefined,
        children: h(React.Fragment, null,
          h(Switch.Thumb),
          (props.label as string) ?? ctx.children,
        ),
      };
    },
  } as CatalogEntry,

  RadioOption: {
    component: Radio.Root,
    adapter: (props, ctx) => ({
      value: props.value as string,
      isDisabled: props.disabled as boolean | undefined,
      children: h(React.Fragment, null,
        h(Radio.Indicator),
        (props.label as string) ?? ctx.children,
      ),
    }),
  } as CatalogEntry,

  SelectItem: {
    component: Select.Item,
    adapter: (props, ctx) => ({
      id: props.value as string,
      textValue: props.label as string | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Data Display ────────────────────────────────────────────────────── */

  Table: {
    component: Table.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'Table',
      selectionMode: props.selectionMode as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  Tabs: {
    component: Tabs.Root,
    adapter: (props, ctx) => ({
      defaultSelectedKey: props.defaultTab as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  Progress: {
    component: ProgressBar.Root,
    adapter: (props, ctx) => ({
      value: resolve(props.value, ctx) as number | undefined,
      maxValue: props.maxValue as number | undefined,
      isIndeterminate: props.indeterminate as boolean | undefined,
      'aria-label': (props.label as string) ?? 'Progress',
      children: ctx.children,
    }),
  } as CatalogEntry,

  Spinner: {
    component: Spinner,
    adapter: (props) => ({
      variant: props.variant as string | undefined,
      size: props.size as string | undefined,
      label: props.label as string | undefined,
    }),
  } as CatalogEntry,

  /* ── Form Structure ──────────────────────────────────────────────────── */

  Form: {
    component: Form,
    adapter: (props, ctx) => ({
      onSubmit: props.action
        ? (e: React.FormEvent) => {
            e.preventDefault();
            const handler = pressHandler(props.action, ctx);
            if (handler) handler();
          }
        : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  /* ── Card Sub-Parts ──────────────────────────────────────────────────── */

  CardHeader: {
    component: Card.Header,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  CardBody: {
    component: Card.Body,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  CardFooter: {
    component: Card.Footer,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,
};

/** Create a new catalog by merging the standard Tale UI catalog with custom entries. */
export function createCatalog(overrides: Record<string, CatalogEntry>): Catalog {
  return { ...taleUICatalog, ...overrides };
}
