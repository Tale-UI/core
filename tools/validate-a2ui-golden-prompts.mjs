#!/usr/bin/env node
/**
 * validate-a2ui-golden-prompts.mjs
 *
 * Validates the `reference.messages` in every A2UI golden prompt JSON file against
 * the full multi-source validation suite (catalog types, prop names, prop values,
 * icon names, usageHints, protocol structure).
 *
 * Usage:
 *   node tools/validate-a2ui-golden-prompts.mjs
 *   node tools/validate-a2ui-golden-prompts.mjs --json
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const GOLDEN_DIR = join(__dirname, 'a2ui-golden-prompts');

const require = createRequire(import.meta.url);
const { PROP_ALLOWED_VALUES } = require('./a2ui-catalog-metadata.js');

/* ─── Source parsing ──────────────────────────────────────────────────────── */

const CATALOG_PATH = join(ROOT, 'packages/a2ui/src/catalog.ts');
const CATALOG_JSON_PATH = join(ROOT, 'registry/a2ui-catalog.json');
const ICON_REGISTRY_PATH = join(ROOT, 'packages/a2ui/src/icon-registry.ts');

const ALWAYS_ALLOWED_PROPS = new Set(['children', 'id']);

function extractCatalogKeys(source) {
  const keys = [];
  for (const match of source.matchAll(/^\s{2}(\w+):\s*\{$/gm)) {
    keys.push(match[1]);
  }
  return keys;
}

function extractIconNames(source) {
  const names = [];
  const mapMatch = source.match(/const iconMap[^{]*\{([\s\S]*?)\n\};/);
  if (!mapMatch) return names;
  for (const match of mapMatch[1].matchAll(/^\s+'?([\w-]+)'?\s*:/gm)) {
    names.push(match[1]);
  }
  return names;
}

function extractUsageHints(source) {
  const hints = [];
  for (const match of source.matchAll(/case '([^']+)':/g)) {
    hints.push(match[1]);
  }
  return hints;
}

function buildAllowedPropsMap(catalogJsonPath) {
  const catalog = JSON.parse(readFileSync(catalogJsonPath, 'utf8'));
  const map = new Map();
  for (const type of catalog.types || []) {
    const allowed = new Set(ALWAYS_ALLOWED_PROPS);
    for (const prop of type.props || []) {
      allowed.add(prop.name);
    }
    map.set(type.name, allowed);
  }
  return map;
}

/* ─── Deep validation ─────────────────────────────────────────────────────── */

/**
 * Validate an array of A2UI messages against the full multi-source spec.
 * Returns { errors: string[], warnings: string[] }.
 */
function validateA2UIDeep(messages, { catalogSet, iconSet, hintSet, allowedPropsMap }) {
  const errors = [];
  const warnings = [];

  // Protocol: beginRendering before surfaceUpdate
  const seenBeginRendering = new Set();
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      errors.push('Message must be a non-null object');
      continue;
    }
    if (!msg.type || typeof msg.type !== 'string') {
      errors.push('Message is missing required "type" field');
      continue;
    }

    if (msg.type === 'beginRendering') {
      if (!msg.surfaceId) errors.push('beginRendering missing "surfaceId"');
      if (!msg.rootComponentId) errors.push('beginRendering missing "rootComponentId"');
      else seenBeginRendering.add(msg.surfaceId);
    } else if (msg.type === 'surfaceUpdate') {
      if (!msg.surfaceId) errors.push('surfaceUpdate missing "surfaceId"');
      else if (!seenBeginRendering.has(msg.surfaceId)) {
        errors.push(`surfaceUpdate for "${msg.surfaceId}" before beginRendering`);
      }
      if (!Array.isArray(msg.components)) {
        errors.push('surfaceUpdate missing "components" array');
        continue;
      }

      const ids = new Set();

      // First pass: collect IDs
      for (const comp of msg.components) {
        if (comp.id) ids.add(comp.id);
      }

      // Check rootComponentId exists
      const beginMsg = messages.find(m => m.type === 'beginRendering' && m.surfaceId === msg.surfaceId);
      if (beginMsg?.rootComponentId && !ids.has(beginMsg.rootComponentId)) {
        errors.push(`rootComponentId "${beginMsg.rootComponentId}" not found in surfaceUpdate components`);
      }

      const seenIds = new Set();
      for (const comp of msg.components) {
        // Duplicate IDs
        if (seenIds.has(comp.id)) {
          errors.push(`Duplicate component ID: "${comp.id}"`);
        }
        seenIds.add(comp.id);

        if (!comp.component || typeof comp.component !== 'object') {
          errors.push(`Component "${comp.id}" has no "component" field`);
          continue;
        }

        const typeKeys = Object.keys(comp.component);
        if (typeKeys.length === 0) {
          errors.push(`Component "${comp.id}" has no type key`);
          continue;
        }

        const typeName = typeKeys[0];

        // Unknown type
        if (!catalogSet.has(typeName)) {
          errors.push(`Unknown component type "${typeName}" on "${comp.id}"`);
          continue;
        }

        const props = comp.component[typeName] || {};

        // Icon name check
        if (typeName === 'Icon' && props.name) {
          const iconName = String(props.name).toLowerCase();
          if (!iconSet.has(iconName)) {
            warnings.push(`Icon name "${props.name}" on "${comp.id}" not in built-in registry`);
          }
        }

        // EmptyState icon prop (string, not boolean)
        if (typeName === 'EmptyState' && props.icon && typeof props.icon === 'string') {
          const iconName = props.icon.toLowerCase();
          if (!iconSet.has(iconName)) {
            warnings.push(`EmptyState icon "${props.icon}" on "${comp.id}" not in built-in registry`);
          }
        }

        // usageHint check
        if (typeName === 'Text' && props.usageHint) {
          if (!hintSet.has(props.usageHint)) {
            errors.push(`Invalid usageHint "${props.usageHint}" on "${comp.id}". Valid: ${[...hintSet].join(', ')}`);
          }
        }

        // Per-type prop name check
        const allowedProps = allowedPropsMap.get(typeName);
        if (allowedProps) {
          for (const propName of Object.keys(props)) {
            if (!allowedProps.has(propName)) {
              errors.push(`Unknown prop "${propName}" on ${typeName} "${comp.id}". Allowed: ${[...allowedProps].filter(p => !ALWAYS_ALLOWED_PROPS.has(p)).join(', ')}`);
            }
          }
        }

        // Per-type prop value check
        for (const [propName, propValue] of Object.entries(props)) {
          if (typeof propValue !== 'string') continue;
          const typeKey = `${typeName}.${propName}`;
          const allowed = typeKey in PROP_ALLOWED_VALUES
            ? PROP_ALLOWED_VALUES[typeKey]
            : PROP_ALLOWED_VALUES[propName];
          if (!allowed) continue;
          if (!allowed.includes(propValue)) {
            errors.push(`Invalid value "${propValue}" for ${typeName}.${propName} on "${comp.id}". Allowed: ${allowed.join(', ')}`);
          }
        }

        // Orphaned children
        if (Array.isArray(props.children)) {
          for (const childId of props.children) {
            if (typeof childId === 'string' && !ids.has(childId)) {
              errors.push(`Orphaned child ref "${childId}" in "${comp.id}".children`);
            }
          }
        }
      }
    } else if (msg.type === 'dataModelUpdate') {
      if (!msg.surfaceId) errors.push('dataModelUpdate missing "surfaceId"');
      if (typeof msg.path !== 'string' && (!msg.data || typeof msg.data !== 'object')) {
        errors.push('dataModelUpdate requires "path" string or "data" object');
      }
    } else if (msg.type === 'deleteSurface') {
      if (!msg.surfaceId) errors.push('deleteSurface missing "surfaceId"');
    } else {
      errors.push(`Unknown message type: "${msg.type}"`);
    }
  }

  if (!messages.some(m => m.type === 'beginRendering')) {
    errors.push('No beginRendering message found');
  }

  return { errors, warnings };
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

const isJson = process.argv.includes('--json');

const catalogSource = readFileSync(CATALOG_PATH, 'utf8');
const iconSource = readFileSync(ICON_REGISTRY_PATH, 'utf8');

const catalogSet = new Set(extractCatalogKeys(catalogSource));
const iconSet = new Set(extractIconNames(iconSource));
const hintSet = new Set(extractUsageHints(catalogSource));
const allowedPropsMap = buildAllowedPropsMap(CATALOG_JSON_PATH);

if (catalogSet.size === 0) {
  console.error('ERROR: Could not extract any catalog keys from catalog.ts');
  process.exit(1);
}

const files = readdirSync(GOLDEN_DIR)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort();

if (files.length === 0) {
  console.error('ERROR: No golden prompt JSON files found in', GOLDEN_DIR);
  process.exit(1);
}

const validationCtx = { catalogSet, iconSet, hintSet, allowedPropsMap };
const results = [];

for (const file of files) {
  const data = JSON.parse(readFileSync(join(GOLDEN_DIR, file), 'utf8'));
  const messages = data.reference?.messages;

  if (!messages || !Array.isArray(messages)) {
    results.push({ slug: data.slug ?? file, errors: ['reference.messages array is missing'], warnings: [] });
    continue;
  }

  const { errors, warnings } = validateA2UIDeep(messages, validationCtx);
  results.push({ slug: data.slug ?? file, errors, warnings });
}

if (isJson) {
  process.stdout.write(JSON.stringify(results, null, 2) + '\n');
} else {
  let hasErrors = false;
  for (const r of results) {
    const status = r.errors.length === 0 ? '✓' : '✗';
    console.log(`${status} ${r.slug}`);
    for (const e of r.errors) {
      console.log(`    ERROR: ${e}`);
      hasErrors = true;
    }
    for (const w of r.warnings) {
      console.log(`    WARN:  ${w}`);
    }
  }
  const errorCount = results.filter(r => r.errors.length > 0).length;
  console.log(`\n${files.length} golden prompts validated, ${errorCount} with errors`);
  if (hasErrors) process.exit(1);
}
