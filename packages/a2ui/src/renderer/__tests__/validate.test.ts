import { describe, it, expect } from 'vitest';
import { validateMessage, validateComponents, validateMessages, formatErrors } from '../../validation/validate.ts';
import type { Catalog, A2UIComponent } from '../../types.ts';

const mockCatalog: Catalog = {
  Text: { component: () => null, adapter: () => ({}) },
  Button: { component: () => null, adapter: () => ({}) },
  Column: { component: () => null, adapter: () => ({}) },
  Row: { component: () => null, adapter: () => ({}) },
};

describe('validateMessage', () => {
  it('rejects non-object', () => {
    const result = validateMessage('not an object');
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.type).toBe('invalid_message_type');
  });

  it('rejects missing type', () => {
    const result = validateMessage({ surfaceId: 'x' });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.type).toBe('missing_field');
  });

  it('rejects unknown message type', () => {
    const result = validateMessage({ type: 'unknownType' });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.type).toBe('invalid_message_type');
  });

  it('validates beginRendering', () => {
    const valid = validateMessage({
      type: 'beginRendering',
      surfaceId: 'main',
      rootComponentId: 'root',
    });
    expect(valid.valid).toBe(true);

    const invalid = validateMessage({
      type: 'beginRendering',
      surfaceId: 'main',
      // missing rootComponentId
    });
    expect(invalid.valid).toBe(false);
  });

  it('validates surfaceUpdate', () => {
    const valid = validateMessage({
      type: 'surfaceUpdate',
      surfaceId: 'main',
      components: [],
    });
    expect(valid.valid).toBe(true);

    const invalid = validateMessage({
      type: 'surfaceUpdate',
      surfaceId: 'main',
      // missing components
    });
    expect(invalid.valid).toBe(false);
  });

  it('validates dataModelUpdate with path + value', () => {
    const valid = validateMessage({
      type: 'dataModelUpdate',
      surfaceId: 'main',
      path: 'name',
      value: 'test',
    });
    expect(valid.valid).toBe(true);
  });

  it('validates dataModelUpdate with data object', () => {
    const valid = validateMessage({
      type: 'dataModelUpdate',
      surfaceId: 'main',
      data: { name: 'test', age: 25 },
    });
    expect(valid.valid).toBe(true);
  });

  it('rejects dataModelUpdate without path or data', () => {
    const invalid = validateMessage({
      type: 'dataModelUpdate',
      surfaceId: 'main',
    });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors[0]?.type).toBe('missing_field');
  });

  it('validates deleteSurface', () => {
    const valid = validateMessage({
      type: 'deleteSurface',
      surfaceId: 'main',
    });
    expect(valid.valid).toBe(true);
  });
});

describe('validateComponents', () => {
  it('passes for valid components', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Column: { children: ['text'] } } },
      { id: 'text', component: { Text: { content: 'Hi' } } },
    ];
    const result = validateComponents(components, mockCatalog);
    expect(result.valid).toBe(true);
  });

  it('detects unknown component types', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { UnknownWidget: {} } },
    ];
    const result = validateComponents(components, mockCatalog);
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.type).toBe('unknown_component_type');
  });

  it('detects duplicate IDs', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Text: { content: 'A' } } },
      { id: 'root', component: { Text: { content: 'B' } } },
    ];
    const result = validateComponents(components, mockCatalog);
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.type).toBe('duplicate_id');
  });

  it('detects orphaned array references', () => {
    const components: A2UIComponent[] = [
      { id: 'root', component: { Column: { children: ['text', 'missing-id'] } } },
      { id: 'text', component: { Text: { content: 'Hi' } } },
    ];
    const result = validateComponents(components, mockCatalog);
    expect(result.valid).toBe(false);
    expect(result.errors.some((entry) => entry.type === 'orphaned_reference')).toBe(true);
  });
});

describe('validateMessages', () => {
  it('validates a batch of messages', () => {
    const messages = [
      { type: 'beginRendering', surfaceId: 'main', rootComponentId: 'root' },
      {
        type: 'surfaceUpdate',
        surfaceId: 'main',
        components: [{ id: 'root', component: { Text: { content: 'Hi' } } }],
      },
    ];
    const result = validateMessages(messages, mockCatalog);
    expect(result.valid).toBe(true);
  });

  it('catches errors across multiple messages', () => {
    const messages = [
      { type: 'invalid' },
      {
        type: 'surfaceUpdate',
        surfaceId: 'main',
        components: [{ id: 'root', component: { UnknownWidget: {} } }],
      },
    ];
    const result = validateMessages(messages, mockCatalog);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});

describe('formatErrors', () => {
  it('returns "No validation errors." for empty array', () => {
    expect(formatErrors([])).toBe('No validation errors.');
  });

  it('formats errors with numbering', () => {
    const result = formatErrors([
      { type: 'unknown_component_type', message: 'Unknown type "Foo".' },
      { type: 'duplicate_id', message: 'Duplicate ID "root".' },
    ]);
    expect(result).toContain('1.');
    expect(result).toContain('2.');
    expect(result).toContain('[unknown_component_type]');
    expect(result).toContain('[duplicate_id]');
  });
});
