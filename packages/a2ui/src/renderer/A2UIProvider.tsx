/**
 * A2UI Provider
 *
 * Top-level context provider that manages A2UI surfaces, data models,
 * and action routing. Wraps your app (or a section of it) to enable
 * A2UI rendering.
 *
 * @example
 * ```tsx
 * import { A2UIProvider, A2UISurface } from '@tale-ui/a2ui/renderer';
 * import { taleUICatalog } from '@tale-ui/a2ui/catalog';
 *
 * function App() {
 *   const handleAction = (surfaceId, action) => {
 *     console.log('Action:', surfaceId, action);
 *   };
 *
 *   return (
 *     <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
 *       <A2UISurface surfaceId="main" />
 *     </A2UIProvider>
 *   );
 * }
 * ```
 */

import * as React from 'react';
import type {
  A2UIMessage,
  Catalog,
  SurfaceState,
} from '../types.ts';
import { createDataModelStore, type DataModelStore } from './useDataModel.ts';
import type { OnAction } from './useActionDispatcher.ts';

/* ─── Context ─────────────────────────────────────────────────────────────── */

export interface A2UIContextValue {
  catalog: Catalog;
  surfaces: Map<string, SurfaceState>;
  dataStores: Map<string, DataModelStore>;
  onAction: OnAction;
  /** Process a single A2UI message. */
  processMessage: (msg: A2UIMessage) => void;
  /** Process a batch of A2UI messages. */
  processMessages: (msgs: A2UIMessage[]) => void;
  /** Reset all surfaces and data. */
  reset: () => void;
}

export const A2UIContext = React.createContext<A2UIContextValue | null>(null);

/** Access the A2UI context. Throws if used outside a provider. */
export function useA2UI(): A2UIContextValue {
  const ctx = React.useContext(A2UIContext);
  if (!ctx) {throw new Error('useA2UI must be used within an <A2UIProvider>');}
  return ctx;
}

/* ─── Provider ────────────────────────────────────────────────────────────── */

export interface A2UIProviderProps {
  /** The component catalog to use for rendering. */
  catalog: Catalog;
  /** Called when a user interaction triggers an A2UI action. */
  onAction: OnAction;
  children: React.ReactNode;
}

export function A2UIProvider({ catalog, onAction, children }: A2UIProviderProps) {
  const [surfaces, setSurfaces] = React.useState<Map<string, SurfaceState>>(
    () => new Map(),
  );
  const dataStoresRef = React.useRef(new Map<string, DataModelStore>());

  // Stable ref for onAction to avoid context value churn
  const onActionRef = React.useRef(onAction);
  onActionRef.current = onAction;

  const getOrCreateStore = React.useCallback((surfaceId: string): DataModelStore => {
    let store = dataStoresRef.current.get(surfaceId);
    if (!store) {
      store = createDataModelStore();
      dataStoresRef.current.set(surfaceId, store);
    }
    return store;
  }, []);

  const processMessage = React.useCallback(
    (msg: A2UIMessage) => {
      switch (msg.type) {
        case 'beginRendering': {
          const store = getOrCreateStore(msg.surfaceId);
          store.clear();
          setSurfaces((prev) => {
            const next = new Map(prev);
            next.set(msg.surfaceId, {
              surfaceId: msg.surfaceId,
              rootComponentId: msg.rootComponentId,
              catalogId: msg.catalogId,
              components: new Map(),
              dataModel: new Map(),
            });
            return next;
          });
          break;
        }

        case 'surfaceUpdate': {
          setSurfaces((prev) => {
            const surface = prev.get(msg.surfaceId);
            if (!surface) {return prev;}

            const components = new Map(surface.components);
            for (const comp of msg.components) {
              components.set(comp.id, comp);
            }

            const next = new Map(prev);
            next.set(msg.surfaceId, { ...surface, components });
            return next;
          });
          break;
        }

        case 'dataModelUpdate': {
          const store = getOrCreateStore(msg.surfaceId);
          if ('path' in msg) {
            // Standard format: { path: "key", value: "val" }
            store.set(msg.path, msg.value);
          }
          if ('data' in msg) {
            // LLM bulk format: { data: { key1: val1, key2: val2 } }
            for (const [key, val] of Object.entries(msg.data)) {
              store.set(key, val);
            }
          }
          break;
        }

        case 'deleteSurface': {
          setSurfaces((prev) => {
            const next = new Map(prev);
            next.delete(msg.surfaceId);
            return next;
          });
          dataStoresRef.current.delete(msg.surfaceId);
          break;
        }
      }
    },
    [getOrCreateStore],
  );

  const processMessages = React.useCallback(
    (msgs: A2UIMessage[]) => {
      for (const msg of msgs) {processMessage(msg);}
    },
    [processMessage],
  );

  const reset = React.useCallback(() => {
    setSurfaces(new Map());
    for (const store of dataStoresRef.current.values()) {store.clear();}
    dataStoresRef.current.clear();
  }, []);

  const stableOnAction = React.useCallback<OnAction>(
    (surfaceId, action) => onActionRef.current(surfaceId, action),
    [],
  );

  const value = React.useMemo<A2UIContextValue>(
    () => ({
      catalog,
      surfaces,
      dataStores: dataStoresRef.current,
      onAction: stableOnAction,
      processMessage,
      processMessages,
      reset,
    }),
    [catalog, surfaces, stableOnAction, processMessage, processMessages, reset],
  );

  return React.createElement(A2UIContext.Provider, { value }, children);
}
