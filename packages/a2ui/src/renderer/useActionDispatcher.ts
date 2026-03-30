/**
 * Action Dispatcher
 *
 * Routes A2UI component actions back to the host application.
 * When a user interacts with a rendered component (e.g. pressing a Button),
 * the action is dispatched through this hook to the `onAction` callback
 * provided by the A2UIProvider.
 */

import * as React from 'react';
import type { A2UIAction } from '../types.ts';

/** Callback signature for action handlers. */
export type OnAction = (surfaceId: string, action: A2UIAction) => void;

/**
 * Creates a memoized action handler factory for a given surface.
 *
 * @param surfaceId - The surface that owns the component
 * @param onAction - The callback provided by the host application
 * @returns A factory that creates stable event handlers for A2UI actions
 */
export function useActionDispatcher(
  surfaceId: string,
  onAction: OnAction,
): (action: A2UIAction) => () => void {
  // Ref to avoid recreating handlers when onAction identity changes
  const onActionRef = React.useRef(onAction);
  onActionRef.current = onAction;

  const surfaceIdRef = React.useRef(surfaceId);
  surfaceIdRef.current = surfaceId;

  // Cache action handlers by action name to maintain referential stability
  const cache = React.useRef(new Map<string, () => void>());

  return React.useCallback((action: A2UIAction) => {
    const key = `${action.name}:${JSON.stringify(action.context ?? {})}`;
    let handler = cache.current.get(key);
    if (!handler) {
      handler = () => {
        onActionRef.current(surfaceIdRef.current, action);
      };
      cache.current.set(key, handler);
    }
    return handler;
  }, []);
}
