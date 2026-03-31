/**
 * A2UI Node Renderer
 *
 * Recursively renders a single node in the reconstructed A2UI component tree.
 * Looks up the component type in the catalog, calls the adapter, resolves
 * data bindings, and renders the Tale UI component.
 */

import * as React from 'react';
import type { TreeNode, Catalog, DataBinding } from '../types.ts';
import { isDataBinding } from '../types.ts';
import type { DataModelStore } from './useDataModel.ts';
import { useActionDispatcher, type OnAction } from './useActionDispatcher.ts';

/* ─── Props ───────────────────────────────────────────────────────────────── */

export interface A2UINodeProps {
  node: TreeNode;
  catalog: Catalog;
  dataStore: DataModelStore;
  surfaceId: string;
  onAction: OnAction;
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export const A2UINode = React.memo(function A2UINode({
  node,
  catalog,
  dataStore,
  surfaceId,
  onAction,
}: A2UINodeProps): React.ReactElement | null {
  const entry = catalog[node.type];

  // Create action handler factory
  const createActionHandler = useActionDispatcher(surfaceId, onAction);

  // Resolve any data bindings in the props
  const resolveBinding = React.useCallback(
    (binding: DataBinding) => dataStore.get(binding.path),
    [dataStore],
  );

  // Subscribe to any bound paths so we re-render when they change
  useBindingSubscriptions(node.props, dataStore);

  if (!entry) {
    // Unknown component type — render children only (graceful degradation)
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[A2UI] Unknown component type: "${node.type}"`);
    }
    return React.createElement(
      React.Fragment,
      null,
      ...node.children.map((child) =>
        React.createElement(A2UINode, {
          key: child.id,
          node: child,
          catalog,
          dataStore,
          surfaceId,
          onAction,
        }),
      ),
    );
  }

  // Recursively render children first
  const renderedChildren =
    node.children.length > 0
      ? node.children.map((child) =>
          React.createElement(A2UINode, {
            key: child.id,
            node: child,
            catalog,
            dataStore,
            surfaceId,
            onAction,
          }),
        )
      : null;

  // Call the adapter to convert A2UI props to Tale UI props
  let adaptedProps: Record<string, unknown>;
  try {
    adaptedProps = entry.adapter(node.props, {
      children: renderedChildren,
      resolveBinding,
      createActionHandler,
      weight: node.weight,
    }) ?? {};
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[A2UI] Adapter error for "${node.type}" (${node.id}):`, err);
    }
    return null;
  }

  // Apply flex-grow from weight if present
  const style =
    node.weight != null ? { flexGrow: node.weight } : undefined;

  if (style) {
    return React.createElement(
      'div',
      { style, key: node.id },
      React.createElement(entry.component as React.ComponentType<any>, adaptedProps),
    );
  }

  return React.createElement(entry.component as React.ComponentType<any>, {
    ...adaptedProps,
    key: node.id,
  });
});

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Subscribe to all data binding paths found in a node's props.
 * This ensures the component re-renders when bound data changes.
 */
function useBindingSubscriptions(
  props: Record<string, unknown>,
  dataStore: DataModelStore,
): void {
  // Collect all binding paths
  const paths = React.useMemo(() => {
    const result: string[] = [];
    if (!props) return result;
    for (const value of Object.values(props)) {
      if (isDataBinding(value)) {
        result.push(value.path);
      }
    }
    return result;
  }, [props]);

  // Subscribe to each path
  React.useEffect(() => {
    if (paths.length === 0) return;

    // Force re-render when any bound path changes
    const unsubscribes = paths.map((path) =>
      dataStore.subscribe(path, () => {
        // The useSyncExternalStore in useDataModelValue handles this,
        // but we also need the node itself to re-render so the adapter
        // can pick up the new resolved values.
      }),
    );

    return () => {
      for (const unsub of unsubscribes) unsub();
    };
  }, [paths, dataStore]);
}
