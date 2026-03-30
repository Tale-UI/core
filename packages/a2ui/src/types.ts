/**
 * A2UI Protocol Types for Tale UI
 *
 * Based on A2UI v0.8 specification.
 * @see https://a2ui.org/specification/v0.8-a2ui/
 */

/* ─── Protocol Messages ───────────────────────────────────────────────────── */

/** Union of all A2UI protocol messages an agent can send. */
export type A2UIMessage =
  | BeginRenderingMessage
  | SurfaceUpdateMessage
  | DataModelUpdateMessage
  | DeleteSurfaceMessage;

/** Signals the start of rendering a new surface. */
export interface BeginRenderingMessage {
  type: 'beginRendering';
  surfaceId: string;
  rootComponentId: string;
  catalogId?: string | undefined;
}

/** Updates components within a surface (add, replace, or remove). */
export interface SurfaceUpdateMessage {
  type: 'surfaceUpdate';
  surfaceId: string;
  components: A2UIComponent[];
}

/** Sets or patches a value in the surface's data model. */
export interface DataModelUpdateMessage {
  type: 'dataModelUpdate';
  surfaceId: string;
  path: string;
  value: unknown;
}

/** Removes a surface entirely. */
export interface DeleteSurfaceMessage {
  type: 'deleteSurface';
  surfaceId: string;
}

/* ─── Component Model ─────────────────────────────────────────────────────── */

/**
 * A single component in the flat adjacency-list array.
 *
 * The `component` field is a record where the key is the component type name
 * (e.g. "Button", "Text") and the value is its props object.
 */
export interface A2UIComponent {
  id: string;
  component: Record<string, Record<string, unknown>>;
  /** Flex-grow weight hint for layout children. */
  weight?: number | undefined;
}

/* ─── Data Binding ────────────────────────────────────────────────────────── */

/** A reference to a path in the surface's data model. */
export interface DataBinding {
  path: string;
}

/** Check if a value is a data binding reference. */
export function isDataBinding(value: unknown): value is DataBinding {
  return (
    typeof value === 'object' &&
    value !== null &&
    'path' in value &&
    typeof (value as DataBinding).path === 'string' &&
    Object.keys(value).length === 1
  );
}

/* ─── Actions ─────────────────────────────────────────────────────────────── */

/** An action declaration on an interactive component. */
export interface A2UIAction {
  name: string;
  context?: Record<string, unknown> | undefined;
}

/* ─── Catalog ─────────────────────────────────────────────────────────────── */

/** A single catalog entry mapping an A2UI type to a React component + adapter. */
export interface CatalogEntry<P = any> {
  /** The React component to render. */
  component: React.ComponentType<P> | React.ForwardRefExoticComponent<P>;
  /**
   * Transforms A2UI component props into Tale UI component props.
   * Receives the raw A2UI props and a render context.
   */
  adapter: (a2uiProps: Record<string, unknown>, context: AdapterContext) => P;
}

/** Context passed to adapter functions during rendering. */
export interface AdapterContext {
  /** Rendered React children (already resolved from child component IDs). */
  children: React.ReactNode;
  /** Read a value from the surface data model at the given path. */
  resolveBinding: (binding: DataBinding) => unknown;
  /** Create an event handler that dispatches an A2UI action. */
  createActionHandler: (action: A2UIAction) => () => void;
  /** The component's flex-grow weight (from the A2UI component entry). */
  weight?: number | undefined;
}

/** A complete catalog: component type name → catalog entry. */
export type Catalog = Record<string, CatalogEntry>;

/* ─── Surface State ───────────────────────────────────────────────────────── */

/** Internal state for a single rendered surface. */
export interface SurfaceState {
  surfaceId: string;
  rootComponentId: string;
  catalogId?: string | undefined;
  components: Map<string, A2UIComponent>;
  dataModel: Map<string, unknown>;
}

/* ─── Tree Node ───────────────────────────────────────────────────────────── */

/** A reconstructed tree node (from the flat adjacency list). */
export interface TreeNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  weight?: number | undefined;
  children: TreeNode[];
}
