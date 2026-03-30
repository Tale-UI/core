import { describe, it, expect, vi } from 'vitest';
import { createDataModelStore } from '../useDataModel.ts';

describe('createDataModelStore', () => {
  it('get returns undefined for unset paths', () => {
    const store = createDataModelStore();
    expect(store.get('missing')).toBeUndefined();
  });

  it('set and get work together', () => {
    const store = createDataModelStore();
    store.set('name', 'Alice');
    expect(store.get('name')).toBe('Alice');
  });

  it('set overwrites existing values', () => {
    const store = createDataModelStore();
    store.set('count', 1);
    store.set('count', 2);
    expect(store.get('count')).toBe(2);
  });

  it('stores complex values', () => {
    const store = createDataModelStore();
    const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    store.set('items', items);
    expect(store.get('items')).toBe(items);
  });

  it('subscribe notifies on path changes', () => {
    const store = createDataModelStore();
    const listener = vi.fn();
    store.subscribe('name', listener);
    store.set('name', 'Bob');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('subscribe does not fire for other paths', () => {
    const store = createDataModelStore();
    const listener = vi.fn();
    store.subscribe('name', listener);
    store.set('age', 25);
    expect(listener).not.toHaveBeenCalled();
  });

  it('unsubscribe stops notifications', () => {
    const store = createDataModelStore();
    const listener = vi.fn();
    const unsub = store.subscribe('name', listener);
    unsub();
    store.set('name', 'Charlie');
    expect(listener).not.toHaveBeenCalled();
  });

  it('subscribeAll fires on any change', () => {
    const store = createDataModelStore();
    const listener = vi.fn();
    store.subscribeAll(listener);
    store.set('a', 1);
    store.set('b', 2);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('snapshot returns a copy of the data', () => {
    const store = createDataModelStore();
    store.set('x', 10);
    store.set('y', 20);
    const snap = store.snapshot();
    expect(snap.get('x')).toBe(10);
    expect(snap.get('y')).toBe(20);
    // Mutating snapshot should not affect store
    snap.set('x', 999);
    expect(store.get('x')).toBe(10);
  });

  it('clear removes all data and notifies global listeners', () => {
    const store = createDataModelStore();
    const listener = vi.fn();
    store.subscribeAll(listener);
    store.set('a', 1);
    listener.mockClear();
    store.clear();
    expect(store.get('a')).toBeUndefined();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
