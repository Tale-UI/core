import { describe, it, expect } from 'vitest';
import { buildTree, findOrphanedRefs } from '../tree.ts';
import type { A2UIComponent } from '../../types.ts';

describe('buildTree', () => {
  it('returns null for missing root ID', () => {
    const result = buildTree([], 'missing');
    expect(result).toBeNull();
  });

  it('builds a single-node tree', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Text: { content: 'Hello' } } },
    ];
    const tree = buildTree(components, 'root');
    expect(tree).not.toBeNull();
    expect(tree!.id).toBe('root');
    expect(tree!.type).toBe('Text');
    expect(tree!.props).toEqual({ content: 'Hello' });
    expect(tree!.children).toEqual([]);
  });

  it('builds a tree with nested children via ID references', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Column: { children: ['child-1', 'child-2'] } } },
      { id: 'child-1', component: { Text: { content: 'First' } } },
      { id: 'child-2', component: { Text: { content: 'Second' } } },
    ];
    const tree = buildTree(components, 'root');
    expect(tree).not.toBeNull();
    expect(tree!.type).toBe('Column');
    expect(tree!.children).toHaveLength(2);
    expect(tree!.children[0]!.type).toBe('Text');
    expect(tree!.children[0]!.props.content).toBe('First');
    expect(tree!.children[1]!.type).toBe('Text');
    expect(tree!.children[1]!.props.content).toBe('Second');
  });

  it('builds deeply nested trees', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Column: { children: ['card'] } } },
      { id: 'card', component: { Card: { children: ['body'] } } },
      { id: 'body', component: { CardBody: { children: ['text'] } } },
      { id: 'text', component: { Text: { content: 'Deep' } } },
    ];
    const tree = buildTree(components, 'root');
    expect(tree!.children[0]!.children[0]!.children[0]!.props.content).toBe('Deep');
  });

  it('preserves weight on components', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Row: { children: ['a', 'b'] } } },
      { id: 'a', component: { Text: { content: 'A' } }, weight: 1 },
      { id: 'b', component: { Text: { content: 'B' } }, weight: 2 },
    ];
    const tree = buildTree(components, 'root');
    expect(tree!.children[0]!.weight).toBe(1);
    expect(tree!.children[1]!.weight).toBe(2);
  });

  it('handles single child ID references (not arrays)', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Card: { child: 'body' } } },
      { id: 'body', component: { Text: { content: 'Inside' } } },
    ];
    const tree = buildTree(components, 'root');
    expect(tree!.children).toHaveLength(1);
    expect(tree!.children[0]!.type).toBe('Text');
  });

  it('prevents cycles', () => {
    const components: A2UIComponent[] = [
      { id: 'a', component: { Column: { children: ['b'] } } },
      { id: 'b', component: { Column: { children: ['a'] } } },
    ];
    const tree = buildTree(components, 'a');
    expect(tree).not.toBeNull();
    // 'b' references 'a', but 'a' is already visited, so b has no children
    expect(tree!.children[0]!.children).toEqual([]);
  });

  it('keeps non-ID string props as regular props', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Text: { content: 'Hello World', usageHint: 'heading-m' } } },
    ];
    const tree = buildTree(components, 'root');
    expect(tree!.props.content).toBe('Hello World');
    expect(tree!.props.usageHint).toBe('heading-m');
    expect(tree!.children).toEqual([]);
  });
});

describe('findOrphanedRefs', () => {
  it('returns empty for valid components', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Column: { children: ['child'] } } },
      { id: 'child', component: { Text: { content: 'Hi' } } },
    ];
    expect(findOrphanedRefs(components)).toEqual([]);
  });

  it('detects orphaned array references', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Column: { children: ['child', 'missing'] } } },
      { id: 'child', component: { Text: { content: 'Hi' } } },
    ];
    const orphans = findOrphanedRefs(components);
    expect(orphans).toContain('missing');
  });
});
