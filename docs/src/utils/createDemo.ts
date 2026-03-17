/**
 * Stub for createDemo utilities.
 * These functions are imported by demo barrel files (index.ts) but the actual
 * demo rendering is handled directly by the css-modules/index.tsx components.
 */

type DemoComponent = React.ComponentType<Record<string, unknown>>;

export function createDemo(_url: string, _component: DemoComponent) {
  return _component;
}

export function createDemoWithVariants(
  _url: string,
  _variants: Record<string, DemoComponent>,
) {
  return Object.values(_variants)[0] ?? (() => null);
}
