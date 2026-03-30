#!/usr/bin/env node

/**
 * validate-a2ui-examples.js
 *
 * Validates A2UI few-shot example JSON files against the live catalog source.
 * Catches: unknown component types, invalid icon names, invalid usageHints,
 * orphaned child references, duplicate IDs, missing beginRendering.
 *
 * Usage:
 *   node tools/validate-a2ui-examples.js          # validate all examples
 *   node tools/validate-a2ui-examples.js --json    # machine-readable output
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'packages/a2ui/src/catalog.ts');
const ICON_REGISTRY_PATH = path.join(ROOT, 'packages/a2ui/src/icon-registry.ts');
const EXAMPLES_DIR = path.join(ROOT, 'packages/a2ui/src/agent/examples');

/* ─── Source Parsing ──────────────────────────────────────────────────────── */

/** Extract catalog entry keys from catalog.ts */
function extractCatalogKeys(source) {
  const keys = [];
  // Match top-level keys in taleUICatalog: `  TypeName: {`
  for (const match of source.matchAll(/^\s{2}(\w+):\s*\{$/gm)) {
    keys.push(match[1]);
  }
  return keys;
}

/** Extract icon names from icon-registry.ts */
function extractIconNames(source) {
  const names = [];
  const mapMatch = source.match(/const iconMap[^{]*\{([\s\S]*?)\n\};/);
  if (!mapMatch) return names;
  for (const match of mapMatch[1].matchAll(/^\s+'?([\w-]+)'?\s*:/gm)) {
    names.push(match[1]);
  }
  return names;
}

/** Extract valid usageHint values from catalog.ts mapTextHint function */
function extractUsageHints(source) {
  const hints = [];
  for (const match of source.matchAll(/case '([^']+)':/g)) {
    hints.push(match[1]);
  }
  return hints;
}

/* ─── Validation ──────────────────────────────────────────────────────────── */

function validateExample(filePath, catalogKeys, iconNames, usageHints) {
  const errors = [];
  const warnings = [];
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const messages = content.messages || [];
  const fileName = path.basename(filePath);

  const catalogSet = new Set(catalogKeys);
  const iconSet = new Set(iconNames);
  const hintSet = new Set(usageHints);

  // Check: beginRendering before surfaceUpdate
  let hasBeginRendering = false;
  for (const msg of messages) {
    if (msg.type === 'beginRendering') hasBeginRendering = true;
    if (msg.type === 'surfaceUpdate' && !hasBeginRendering) {
      errors.push(`surfaceUpdate before beginRendering`);
    }
  }
  if (!hasBeginRendering) {
    errors.push(`No beginRendering message found`);
  }

  // Validate each surfaceUpdate
  for (const msg of messages) {
    if (msg.type !== 'surfaceUpdate') continue;
    const components = msg.components || [];
    const ids = new Set();

    for (const comp of components) {
      // Duplicate IDs
      if (ids.has(comp.id)) {
        errors.push(`Duplicate component ID: "${comp.id}"`);
      }
      ids.add(comp.id);

      // Component type
      const typeKeys = Object.keys(comp.component || {});
      if (typeKeys.length === 0) {
        errors.push(`Component "${comp.id}" has no type key`);
        continue;
      }
      const typeName = typeKeys[0];
      if (!catalogSet.has(typeName)) {
        errors.push(`Unknown component type "${typeName}" on "${comp.id}"`);
      }

      const props = comp.component[typeName] || {};

      // Icon name check
      if (typeName === 'Icon' && props.name) {
        const iconName = String(props.name).toLowerCase();
        if (!iconSet.has(iconName)) {
          warnings.push(`Icon name "${props.name}" on "${comp.id}" not in built-in registry`);
        }
      }

      // UsageHint check
      if (typeName === 'Text' && props.usageHint) {
        if (!hintSet.has(props.usageHint)) {
          errors.push(`Invalid usageHint "${props.usageHint}" on "${comp.id}". Valid: ${[...hintSet].join(', ')}`);
        }
      }
    }

    // Orphaned child references
    for (const comp of components) {
      const typeName = Object.keys(comp.component || {})[0];
      if (!typeName) continue;
      const props = comp.component[typeName] || {};
      if (Array.isArray(props.children)) {
        for (const childId of props.children) {
          if (typeof childId === 'string' && !ids.has(childId)) {
            errors.push(`Orphaned child ref "${childId}" in "${comp.id}".children`);
          }
        }
      }
    }
  }

  return { fileName, errors, warnings };
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

function main() {
  const isJson = process.argv.includes('--json');

  const catalogSource = fs.readFileSync(CATALOG_PATH, 'utf8');
  const iconSource = fs.readFileSync(ICON_REGISTRY_PATH, 'utf8');

  const catalogKeys = extractCatalogKeys(catalogSource);
  const iconNames = extractIconNames(iconSource);
  const usageHints = extractUsageHints(catalogSource);

  if (catalogKeys.length === 0) {
    console.error('ERROR: Could not extract any catalog keys from catalog.ts');
    process.exit(1);
  }

  const exampleFiles = fs.readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith('.json'));
  if (exampleFiles.length === 0) {
    console.error('ERROR: No example JSON files found in', EXAMPLES_DIR);
    process.exit(1);
  }

  const results = exampleFiles.map((f) =>
    validateExample(path.join(EXAMPLES_DIR, f), catalogKeys, iconNames, usageHints),
  );

  if (isJson) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    let hasErrors = false;
    for (const r of results) {
      const status = r.errors.length === 0 ? '✓' : '✗';
      console.log(`${status} ${r.fileName}`);
      for (const e of r.errors) {
        console.log(`    ERROR: ${e}`);
        hasErrors = true;
      }
      for (const w of r.warnings) {
        console.log(`    WARN:  ${w}`);
      }
    }
    console.log(`\n${exampleFiles.length} examples validated, ${results.filter((r) => r.errors.length > 0).length} with errors`);
    if (hasErrors) process.exit(1);
  }
}

main();
