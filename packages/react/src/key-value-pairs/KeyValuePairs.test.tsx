import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { act } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { KeyValuePairs } from '@tale-ui/react/key-value-pairs';
import { createRenderer } from '#test-utils';

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0];

let resizeCallback: ResizeObserverCallback | null = null;

class ResizeObserverMock {
  constructor(callback: ResizeObserverCallback) {
    resizeCallback = callback;
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

function triggerResize() {
  act(() => {
    resizeCallback?.([], {} as ResizeObserver);
  });
}

describe('<KeyValuePairs />', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    resizeCallback = null;
    globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
  });

  it('renders a semantic description list root', async () => {
    const { container } = await render(
      <KeyValuePairs.Root>
        <KeyValuePairs.Item>
          <KeyValuePairs.Term>Status</KeyValuePairs.Term>
          <KeyValuePairs.Details>Active</KeyValuePairs.Details>
        </KeyValuePairs.Item>
      </KeyValuePairs.Root>,
    );

    expect(container.querySelector('dl.tale-key-value-pairs')).not.toBeNull();
  });

  it('renders item term before details in DOM order', async () => {
    const { container } = await render(
      <KeyValuePairs.Root>
        <KeyValuePairs.Item>
          <KeyValuePairs.Term>Status</KeyValuePairs.Term>
          <KeyValuePairs.Details>Active</KeyValuePairs.Details>
        </KeyValuePairs.Item>
      </KeyValuePairs.Root>,
    );

    const term = container.querySelector('dt.tale-key-value-pairs__term');
    const details = container.querySelector('dd.tale-key-value-pairs__details');

    expect(term).not.toBeNull();
    expect(details).not.toBeNull();
    const orderedDescriptionNodes = Array.from(container.querySelectorAll('dt, dd'));
    expect(orderedDescriptionNodes.indexOf(term!)).toBeLessThan(orderedDescriptionNodes.indexOf(details!));
  });

  it('renders grouped key-value pairs as a nested description list', async () => {
    const { container } = await render(
      <KeyValuePairs.Root>
        <KeyValuePairs.Group>
          <KeyValuePairs.GroupTitle>Network</KeyValuePairs.GroupTitle>
          <KeyValuePairs.GroupList>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>VPC</KeyValuePairs.Term>
              <KeyValuePairs.Details>vpc-123</KeyValuePairs.Details>
            </KeyValuePairs.Item>
          </KeyValuePairs.GroupList>
        </KeyValuePairs.Group>
      </KeyValuePairs.Root>,
    );

    const groupTitle = container.querySelector('dt.tale-key-value-pairs__group-title');
    const groupDetails = container.querySelector('dd.tale-key-value-pairs__group-details');
    const nestedList = groupDetails?.querySelector('dl.tale-key-value-pairs__group-list');

    expect(groupTitle).not.toBeNull();
    expect(nestedList).not.toBeNull();
    expect(nestedList?.querySelector('dt.tale-key-value-pairs__term')).not.toBeNull();
    expect(nestedList?.querySelector('dd.tale-key-value-pairs__details')).not.toBeNull();
  });

  it('merges custom classes on every part', async () => {
    const { container } = await render(
      <KeyValuePairs.Root className="root-custom" data-testid="root">
        <KeyValuePairs.Item className="item-custom" data-testid="item">
          <KeyValuePairs.Term className="term-custom" data-testid="term">
            Status
            <KeyValuePairs.Info className="info-custom" data-testid="info">?</KeyValuePairs.Info>
          </KeyValuePairs.Term>
          <KeyValuePairs.Details className="details-custom" data-testid="details">
            Active
          </KeyValuePairs.Details>
        </KeyValuePairs.Item>
        <KeyValuePairs.Group className="group-custom" data-testid="group">
          <KeyValuePairs.GroupTitle className="group-title-custom" data-testid="group-title">
            Network
          </KeyValuePairs.GroupTitle>
          <KeyValuePairs.GroupList className="group-list-custom" data-testid="group-list">
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>VPC</KeyValuePairs.Term>
              <KeyValuePairs.Details>vpc-123</KeyValuePairs.Details>
            </KeyValuePairs.Item>
          </KeyValuePairs.GroupList>
        </KeyValuePairs.Group>
      </KeyValuePairs.Root>,
    );

    expect(screen.getByTestId('root').classList.contains('tale-key-value-pairs')).toBe(true);
    expect(screen.getByTestId('root').classList.contains('root-custom')).toBe(true);
    expect(screen.getByTestId('item').classList.contains('item-custom')).toBe(true);
    expect(screen.getByTestId('term').classList.contains('term-custom')).toBe(true);
    expect(screen.getByTestId('info').classList.contains('info-custom')).toBe(true);
    expect(screen.getByTestId('details').classList.contains('details-custom')).toBe(true);
    expect(screen.getByTestId('group').classList.contains('group-custom')).toBe(true);
    expect(screen.getByTestId('group-title').classList.contains('group-title-custom')).toBe(true);
    expect(screen.getByTestId('group-list').classList.contains('group-list-custom')).toBe(true);
    expect(container.querySelector('.tale-key-value-pairs__group-list')).not.toBeNull();
  });

  it('applies root variant and density classes', async () => {
    await render(
      <KeyValuePairs.Root variant="divided" density="compact" data-testid="root">
        <KeyValuePairs.Item>
          <KeyValuePairs.Term>Status</KeyValuePairs.Term>
          <KeyValuePairs.Details>Active</KeyValuePairs.Details>
        </KeyValuePairs.Item>
      </KeyValuePairs.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.classList.contains('tale-key-value-pairs--divided')).toBe(true);
    expect(root.classList.contains('tale-key-value-pairs--compact')).toBe(true);
  });

  it('applies spacious density class', async () => {
    await render(
      <KeyValuePairs.Root density="spacious" data-testid="root">
        <KeyValuePairs.Item>
          <KeyValuePairs.Term>Status</KeyValuePairs.Term>
          <KeyValuePairs.Details>Active</KeyValuePairs.Details>
        </KeyValuePairs.Item>
      </KeyValuePairs.Root>,
    );

    expect(screen.getByTestId('root').classList.contains('tale-key-value-pairs--spacious')).toBe(true);
  });

  it('passes through accessible naming props', async () => {
    await render(
      <React.Fragment>
        <h2 id="service-heading">Service metadata</h2>
        <KeyValuePairs.Root
          aria-label="Service metadata"
          aria-labelledby="service-heading"
          data-testid="root"
        >
          <KeyValuePairs.Item>
            <KeyValuePairs.Term>Status</KeyValuePairs.Term>
            <KeyValuePairs.Details>Active</KeyValuePairs.Details>
          </KeyValuePairs.Item>
        </KeyValuePairs.Root>
      </React.Fragment>,
    );

    const root = screen.getByTestId('root');
    expect(root.getAttribute('aria-label')).toBe('Service metadata');
    expect(root.getAttribute('aria-labelledby')).toBe('service-heading');
  });

  it('resolves responsive columns, sets data-columns, and preserves consumer styles', async () => {
    const { container } = await render(
      <KeyValuePairs.Root
        columns={4}
        minColumnWidth={200}
        style={{ maxWidth: 640 }}
        data-testid="root"
      >
        <KeyValuePairs.Item>
          <KeyValuePairs.Term>Status</KeyValuePairs.Term>
          <KeyValuePairs.Details>Active</KeyValuePairs.Details>
        </KeyValuePairs.Item>
      </KeyValuePairs.Root>,
    );

    const root = screen.getByTestId('root') as HTMLDListElement;
    Object.defineProperty(root, 'getBoundingClientRect', {
      value: () => ({ width: 640, height: 0, top: 0, left: 0, right: 640, bottom: 0, x: 0, y: 0, toJSON: () => {} }),
      configurable: true,
    });

    triggerResize();

    expect(root.style.getPropertyValue('--tale-key-value-pairs-columns')).toBe('3');
    expect(root.getAttribute('data-columns')).toBe('3');
    expect(root.style.maxWidth).toBe('640px');
    expect(container.querySelector('dl.tale-key-value-pairs')).toBe(root);
  });

  it('clamps invalid runtime columns and minColumnWidth values for JavaScript consumers', async () => {
    await render(
      <KeyValuePairs.Root
        columns={99 as unknown as 4}
        minColumnWidth={Number.NaN}
        data-testid="root"
      >
        <KeyValuePairs.Item>
          <KeyValuePairs.Term>Status</KeyValuePairs.Term>
          <KeyValuePairs.Details>Active</KeyValuePairs.Details>
        </KeyValuePairs.Item>
      </KeyValuePairs.Root>,
    );

    const root = screen.getByTestId('root') as HTMLDListElement;
    Object.defineProperty(root, 'getBoundingClientRect', {
      value: () => ({ width: 999, height: 0, top: 0, left: 0, right: 999, bottom: 0, x: 0, y: 0, toJSON: () => {} }),
      configurable: true,
    });

    triggerResize();

    expect(root.style.getPropertyValue('--tale-key-value-pairs-columns')).toBe('4');
    expect(root.getAttribute('data-columns')).toBe('4');
  });
});
