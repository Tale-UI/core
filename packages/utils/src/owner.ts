import { isShadowRoot } from '@floating-ui/utils/dom';

export { getWindow as ownerWindow } from '@floating-ui/utils/dom';

export function ownerDocument(node: Element | null) {
  return node?.ownerDocument || document;
}

export function activeElement(doc: Document) {
  let element = doc.activeElement;
  while (element?.shadowRoot?.activeElement != null) {
    element = element.shadowRoot.activeElement;
  }
  return element;
}

export function contains(parent?: Element | null, child?: Element | null) {
  if (!parent || !child) {
    return false;
  }
  if (parent.contains(child)) {
    return true;
  }
  const rootNode = child.getRootNode?.();
  if (rootNode && isShadowRoot(rootNode)) {
    let next: Element | null = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      next = (next.parentNode as Element) || (next as unknown as ShadowRoot).host;
    }
  }
  return false;
}

export function getTarget(event: Event) {
  if ('composedPath' in event) {
    return event.composedPath()[0];
  }
  return (event as Event).target;
}
