/**
 * Data Model Store
 *
 * A path-based reactive store for A2UI surface data models.
 * Components with data bindings subscribe to specific paths and
 * re-render only when their bound path changes.
 */

import * as React from 'react';

/* ─── Store Implementation ────────────────────────────────────────────────── */

export interface DataModelStore {
  /** Get the value at a path. */
  get: (path: string) => unknown;
  /** Set a value at a path. */
  set: (path: string, value: unknown) => void;
  /** Subscribe to changes at a specific path. Returns an unsubscribe function. */
  subscribe: (path: string, listener: () => void) => () => void;
  /** Subscribe to any change. Returns an unsubscribe function. */
  subscribeAll: (listener: () => void) => () => void;
  /** Get the full data model as a plain object. */
  snapshot: () => Map<string, unknown>;
  /** Clear all data. */
  clear: () => void;
}

export function createDataModelStore(): DataModelStore {
  const data = new Map<string, unknown>();
  const pathListeners = new Map<string, Set<() => void>>();
  const globalListeners = new Set<() => void>();

  function notifyPath(path: string): void {
    const listeners = pathListeners.get(path);
    if (listeners) {
      for (const listener of listeners) {listener();}
    }
    for (const listener of globalListeners) {listener();}
  }

  return {
    get(path: string): unknown {
      return data.get(path);
    },

    set(path: string, value: unknown): void {
      data.set(path, value);
      notifyPath(path);
    },

    subscribe(path: string, listener: () => void): () => void {
      let listeners = pathListeners.get(path);
      if (!listeners) {
        listeners = new Set();
        pathListeners.set(path, listeners);
      }
      listeners.add(listener);
      return () => {
        listeners!.delete(listener);
        if (listeners!.size === 0) {pathListeners.delete(path);}
      };
    },

    subscribeAll(listener: () => void): () => void {
      globalListeners.add(listener);
      return () => globalListeners.delete(listener);
    },

    snapshot(): Map<string, unknown> {
      return new Map(data);
    },

    clear(): void {
      data.clear();
      for (const listener of globalListeners) {listener();}
    },
  };
}

/* ─── React Hook ──────────────────────────────────────────────────────────── */

/**
 * Subscribe to a specific path in the data model.
 * Re-renders only when the value at this path changes.
 */
export function useDataModelValue(store: DataModelStore, path: string): unknown {
  return React.useSyncExternalStore(
    (onStoreChange) => store.subscribe(path, onStoreChange),
    () => store.get(path),
    () => store.get(path),
  );
}
