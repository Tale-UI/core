/**
 * Tree Reconstruction
 *
 * Converts A2UI's flat adjacency-list component array into a renderable tree.
 * This is a pure function with no React dependency.
 */

import type { A2UIComponent, TreeNode } from '../types.ts';

/**
 * Build a tree from a flat array of A2UI components.
 *
 * A2UI encodes parent-child relationships by having component props reference
 * other component IDs. This function:
 * 1. Indexes all components by ID
 * 2. For each component, identifies which props are child references (IDs that
 *    exist in the component map)
 * 3. Recursively builds a tree starting from the root ID
 *
 * @param components - Flat array of A2UI components
 * @param rootId - The root component ID to start from
 * @returns The reconstructed tree, or null if rootId is not found
 */
export function buildTree(components: A2UIComponent[], rootId: string): TreeNode | null {
  // Index by ID for O(1) lookups
  const byId = new Map<string, A2UIComponent>();
  for (const comp of components) {
    byId.set(comp.id, comp);
  }

  // Track visited nodes to prevent cycles
  const visited = new Set<string>();

  return buildNode(rootId, byId, visited);
}

function buildNode(
  id: string,
  byId: Map<string, A2UIComponent>,
  visited: Set<string>,
): TreeNode | null {
  const comp = byId.get(id);
  if (!comp || visited.has(id)) return null;

  visited.add(id);

  // Extract the component type and props from the single-key component object
  const [type, rawProps] = getTypeAndProps(comp);
  if (!type) return null;

  // Separate child references from regular props
  const props: Record<string, unknown> = {};
  const children: TreeNode[] = [];

  for (const [key, value] of Object.entries(rawProps)) {
    if (typeof value === 'string' && byId.has(value)) {
      // Single child reference
      const child = buildNode(value, byId, visited);
      if (child) children.push(child);
    } else if (Array.isArray(value) && value.every((v) => typeof v === 'string' && byId.has(v))) {
      // Array of child references
      for (const childId of value) {
        const child = buildNode(childId as string, byId, visited);
        if (child) children.push(child);
      }
    } else {
      // Regular prop
      props[key] = value;
    }
  }

  return {
    id,
    type,
    props,
    weight: comp.weight,
    children,
  };
}

/**
 * Extract the component type name and props from an A2UI component.
 * The component field is `{ TypeName: { ...props } }` with a single key.
 */
function getTypeAndProps(comp: A2UIComponent): [string | null, Record<string, unknown>] {
  const keys = Object.keys(comp.component);
  if (keys.length === 0) return [null, {}];
  const type = keys[0]!;
  const props = (comp.component[type] ?? {}) as Record<string, unknown>;
  return [type, props];
}

/**
 * Validate that all component IDs referenced in the tree exist.
 * Returns an array of orphaned IDs (referenced but not in the components array).
 */
export function findOrphanedRefs(components: A2UIComponent[]): string[] {
  const ids = new Set(components.map((c) => c.id));
  const orphans: string[] = [];

  for (const comp of components) {
    const [, props] = getTypeAndProps(comp);
    for (const value of Object.values(props)) {
      if (typeof value === 'string' && !ids.has(value)) {
        // Could be a regular string prop, not necessarily an orphan.
        // Only flag if it looks like an ID (contains no spaces, reasonable length)
        if (value.length <= 64 && !/\s/.test(value)) {
          // Heuristic: skip obvious non-IDs like labels
          // This is best-effort; the renderer handles missing refs gracefully
        }
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && !ids.has(item) && item.length <= 64 && !/\s/.test(item)) {
            orphans.push(item);
          }
        }
      }
    }
  }

  return orphans;
}
