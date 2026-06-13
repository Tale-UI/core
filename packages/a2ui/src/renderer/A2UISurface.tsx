/**
 * A2UI Surface Renderer
 *
 * Renders a single A2UI surface by reconstructing the component tree
 * from the flat adjacency list and rendering each node via A2UINode.
 */

import * as React from 'react';
import { useA2UI } from './A2UIProvider.tsx';
import { A2UINode } from './A2UINode.tsx';
import { buildTree } from './tree.ts';

/* ─── Props ───────────────────────────────────────────────────────────────── */

export interface A2UISurfaceProps {
  /** The surface ID to render. Must match a surfaceId from a beginRendering message. */
  surfaceId: string;
  /** Optional fallback to show when the surface doesn't exist or has no components. */
  fallback?: React.ReactNode;
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export function A2UISurface({ surfaceId, fallback = null }: A2UISurfaceProps) {
  const { catalog, surfaces, dataStores, onAction } = useA2UI();

  const surface = surfaces.get(surfaceId);
  const dataStore = dataStores.get(surfaceId);

  // Build the tree from the flat component array
  const tree = React.useMemo(() => {
    if (!surface || surface.components.size === 0) {return null;}
    return buildTree(
      Array.from(surface.components.values()),
      surface.rootComponentId,
    );
  }, [surface]);

  if (!tree || !dataStore) {
    return React.createElement(React.Fragment, null, fallback);
  }

  return React.createElement(A2UINode, {
    node: tree,
    catalog,
    dataStore,
    surfaceId,
    onAction,
  });
}
