import * as React from 'react';

/**
 * Extracts the `ref` from a React element.
 * In React 19+, ref is on props. In earlier versions, it's a top-level field.
 */
export function getReactElementRef(element: unknown): React.Ref<unknown> | null {
  if (!React.isValidElement(element)) {
    return null;
  }

  const reactElement = element as React.ReactElement & { ref?: React.Ref<unknown> | undefined };
  const propsWithRef = reactElement.props as { ref?: React.Ref<unknown> | undefined } | undefined;

  // React 19+ moved ref to props; fall back to element.ref for older versions
  return propsWithRef?.ref ?? reactElement.ref ?? null;
}
