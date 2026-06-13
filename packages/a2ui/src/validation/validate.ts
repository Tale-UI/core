/**
 * A2UI Message Validation
 *
 * Validates A2UI messages against the protocol spec and the active catalog.
 * Returns structured errors that can be fed back to agents for self-correction.
 */

import type { A2UIComponent, Catalog } from '../types.ts';

/* ─── Prop Value Constraints ─────────────────────────────────────────────── */

/**
 * Catalog prop schemas for enum value validation.
 * Each entry maps TypeName.propName → array of allowed string values.
 * Generated from the A2UI catalog metadata PROP_VALUES/PROP_VALUE_OVERRIDES.
 * Only includes props with a finite set of known values (backtick-delimited enums).
 */
export type PropConstraints = Map<string, string[]>;

/** Extract backtick-delimited enum values from an allowedValues string. */
function extractEnumValues(allowedValues: string): string[] | null {
  const matches = allowedValues.match(/`([^`]+)`/g);
  if (!matches || matches.length === 0) {return null;}
  return matches.map(m => m.slice(1, -1));
}

/**
 * Build a PropConstraints map from an A2UI catalog JSON object.
 * Expected shape: { types: [{ name, props: [{ name, allowedValues }] }] }
 */
export function buildPropConstraints(
  catalogJson: { types: Array<{ name: string; props: Array<{ name: string; allowedValues: string }> }> },
): PropConstraints {
  const constraints: PropConstraints = new Map();
  for (const type of catalogJson.types) {
    for (const prop of type.props) {
      if (!prop.allowedValues) {continue;}
      // Skip props that accept free-form values (strings, numbers, bindings)
      if (prop.allowedValues === 'boolean') {continue;}
      const values = extractEnumValues(prop.allowedValues);
      if (values && values.length > 0) {
        constraints.set(`${type.name}.${prop.name}`, values);
      }
    }
  }
  return constraints;
}

/* ─── Error Types ─────────────────────────────────────────────────────────── */

export interface ValidationError {
  type:
    | 'invalid_message_type'
    | 'missing_field'
    | 'unknown_component_type'
    | 'missing_required_prop'
    | 'invalid_prop_value'
    | 'orphaned_reference'
    | 'duplicate_id'
    | 'cycle_detected'
    | 'empty_surface';
  message: string;
  /** The component ID involved, if applicable. */
  componentId?: string | undefined;
  /** The field or prop name involved, if applicable. */
  field?: string | undefined;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/* ─── Message Validation ──────────────────────────────────────────────────── */

/** Validate a single A2UI message. */
export function validateMessage(msg: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!msg || typeof msg !== 'object') {
    errors.push({ type: 'invalid_message_type', message: 'Message must be a non-null object.' });
    return { valid: false, errors };
  }

  const m = msg as Record<string, unknown>;

  if (!m.type || typeof m.type !== 'string') {
    errors.push({ type: 'missing_field', message: 'Message must have a "type" string field.', field: 'type' });
    return { valid: false, errors };
  }

  switch (m.type) {
    case 'beginRendering':
      if (!m.surfaceId || typeof m.surfaceId !== 'string')
        {errors.push({ type: 'missing_field', message: 'beginRendering requires "surfaceId".', field: 'surfaceId' });}
      if (!m.rootComponentId || typeof m.rootComponentId !== 'string')
        {errors.push({ type: 'missing_field', message: 'beginRendering requires "rootComponentId".', field: 'rootComponentId' });}
      break;

    case 'surfaceUpdate':
      if (!m.surfaceId || typeof m.surfaceId !== 'string')
        {errors.push({ type: 'missing_field', message: 'surfaceUpdate requires "surfaceId".', field: 'surfaceId' });}
      if (!Array.isArray(m.components))
        {errors.push({ type: 'missing_field', message: 'surfaceUpdate requires "components" array.', field: 'components' });}
      break;

    case 'dataModelUpdate':
      if (!m.surfaceId || typeof m.surfaceId !== 'string')
        {errors.push({ type: 'missing_field', message: 'dataModelUpdate requires "surfaceId".', field: 'surfaceId' });}
      // Accept standard format (path + value) or LLM bulk format (data object)
      if (typeof m.path !== 'string' && (!m.data || typeof m.data !== 'object'))
        {errors.push({ type: 'missing_field', message: 'dataModelUpdate requires "path" string or "data" object.', field: 'path' });}
      break;

    case 'deleteSurface':
      if (!m.surfaceId || typeof m.surfaceId !== 'string')
        {errors.push({ type: 'missing_field', message: 'deleteSurface requires "surfaceId".', field: 'surfaceId' });}
      break;

    default:
      errors.push({ type: 'invalid_message_type', message: `Unknown message type: "${m.type}".` });
  }

  return { valid: errors.length === 0, errors };
}

/* ─── Component Validation ────────────────────────────────────────────────── */

/** Validate a surfaceUpdate's components against a catalog. */
export function validateComponents(
  components: A2UIComponent[],
  catalog: Catalog,
  propConstraints?: PropConstraints,
): ValidationResult {
  const errors: ValidationError[] = [];
  const ids = new Set<string>();

  for (const comp of components) {
    // Check for duplicate IDs
    if (ids.has(comp.id)) {
      errors.push({
        type: 'duplicate_id',
        message: `Duplicate component ID: "${comp.id}".`,
        componentId: comp.id,
      });
    }
    ids.add(comp.id);

    // Extract type
    const typeKeys = Object.keys(comp.component);
    if (typeKeys.length === 0) {
      errors.push({
        type: 'missing_field',
        message: `Component "${comp.id}" has no type key in its component field.`,
        componentId: comp.id,
        field: 'component',
      });
      continue;
    }

    const typeName = typeKeys[0]!;

    // Check against catalog
    if (!catalog[typeName]) {
      errors.push({
        type: 'unknown_component_type',
        message: `Unknown component type "${typeName}" on component "${comp.id}". Available types: ${Object.keys(catalog).join(', ')}.`,
        componentId: comp.id,
      });
      continue;
    }

    // Validate prop values against constraints (if provided)
    if (propConstraints) {
      const props = comp.component[typeName] ?? {};
      for (const [propName, propValue] of Object.entries(props)) {
        if (propName === 'children') {continue;}
        if (typeof propValue !== 'string') {continue;}

        const key = `${typeName}.${propName}`;
        const allowed = propConstraints.get(key);
        if (allowed && !allowed.includes(propValue)) {
          errors.push({
            type: 'invalid_prop_value' as ValidationError['type'],
            message: `Component "${comp.id}" (${typeName}): prop "${propName}" has value "${propValue}" but allowed values are: ${allowed.join(', ')}.`,
            componentId: comp.id,
            field: propName,
          });
        }
      }
    }
  }

  // Check for orphaned child references
  for (const comp of components) {
    const typeKeys = Object.keys(comp.component);
    if (typeKeys.length === 0) {continue;}
    const props = comp.component[typeKeys[0]!] ?? {};

    for (const [key, value] of Object.entries(props)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && !ids.has(item) && item.length <= 64 && !/\s/.test(item)) {
            // Heuristic: could be a child ID reference that doesn't exist
            errors.push({
              type: 'orphaned_reference',
              message: `Component "${comp.id}" references "${item}" in "${key}", but no component with that ID exists.`,
              componentId: comp.id,
              field: key,
            });
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/* ─── Full Validation ─────────────────────────────────────────────────────── */

/** Validate a batch of A2UI messages against the protocol and a catalog. */
export function validateMessages(
  messages: unknown[],
  catalog: Catalog,
  propConstraints?: PropConstraints,
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const msg of messages) {
    const msgResult = validateMessage(msg);
    errors.push(...msgResult.errors);

    // Additional catalog checks for surfaceUpdate messages
    if (
      msgResult.valid &&
      typeof msg === 'object' &&
      msg !== null &&
      (msg as Record<string, unknown>).type === 'surfaceUpdate'
    ) {
      const m = msg as { components: A2UIComponent[] };
      const compResult = validateComponents(m.components, catalog, propConstraints);
      errors.push(...compResult.errors);
    }
  }

  return { valid: errors.length === 0, errors };
}

/** Format validation errors as a human-readable string for agent feedback. */
export function formatErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {return 'No validation errors.';}
  return errors
    .map((entry, i) => `${i + 1}. [${entry.type}] ${entry.message}`)
    .join('\n');
}
