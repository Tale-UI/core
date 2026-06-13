#!/usr/bin/env node
/**
 * A2UI ↔ Component Registry Cross-Validation Audit
 *
 * Verifies that:
 *   1. Every A2UI type maps to a real Tale UI component in components.json
 *   2. A2UI prop allowed values are machine-parseable (not prose)
 *   3. No A2UI types reference non-existent components
 *   4. Icon names in A2UI catalog match the icon registry source
 *
 * Run:  node tools/audit-a2ui-registry-sync.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_PATH = path.join(ROOT, 'registry/components.json');
const A2UI_CATALOG_PATH = path.join(ROOT, 'registry/a2ui-catalog.json');
const ICON_REGISTRY_PATH = path.join(ROOT, 'packages/a2ui/src/icon-registry.ts');

let exitCode = 0;
const warnings = [];
const errors = [];

function warn(msg) { warnings.push(msg); }
function error(msg) { errors.push(msg); exitCode = 1; }

// ─── Load registries ───────────────────────────────────────────────────────

const components = JSON.parse(fs.readFileSync(COMPONENTS_PATH, 'utf8'));
const a2uiCatalog = JSON.parse(fs.readFileSync(A2UI_CATALOG_PATH, 'utf8'));

// Build lookup maps
const componentByName = new Map();
const componentBySlug = new Map();
for (const c of components.components) {
  componentByName.set(c.name, c);
  componentBySlug.set(c.slug, c);
}

// ─── Check 1: Every A2UI type maps to a Tale UI component ─────────────────

const a2uiTypes = a2uiCatalog.types || [];
let unmappedCount = 0;

for (const type of a2uiTypes) {
  const componentField = type.component;
  if (!componentField) {
    error(`A2UI type "${type.name}" has no component mapping`);
    unmappedCount++;
    continue;
  }

  // Component field can be "Button" or "Card.Root" or "TextField.Root"
  const baseName = componentField.split('.')[0];
  if (!componentByName.has(baseName)) {
    error(`A2UI type "${type.name}" maps to unknown component "${baseName}" (component field: "${componentField}")`);
    unmappedCount++;
  }
}

// ─── Check 2: Identify prose allowedValues ────────────────────────────────

const prosePatterns = [
  /^string$/i,
  /^string\s*\(.*\)$/i,
  /^number$/i,
  /^boolean$/i,
  /^number or string$/i,
  /^URL string/i,
  /^lucide icon name/i,
  /^array of/i,
  /\{ "name"/,
  /\{ "path"/,
  /number or.*binding/i,
  /string or number/i,
];

let proseCount = 0;
const proseProps = [];

for (const type of a2uiTypes) {
  for (const prop of (type.props || [])) {
    const val = prop.allowedValues;
    if (!val) {continue;}

    // Check if it's an enum list (backtick-delimited values)
    const hasBackticks = /`[^`]+`/.test(val);
    const isBoolean = val === 'boolean';
    const isProse = !hasBackticks && !isBoolean && prosePatterns.some(p => p.test(val));

    if (isProse) {
      // Not an error, but a warning for machine-parseability
      proseProps.push({ type: type.name, prop: prop.name, value: val });
      proseCount++;
    }
  }
}

// ─── Check 3: Icon names match icon-registry.ts ──────────────────────────

const iconRegistrySource = fs.readFileSync(ICON_REGISTRY_PATH, 'utf8');
const sourceIconNames = [];
// Extract only keys from the iconMap object (between "const iconMap" and first "};")
const iconMapBlock = iconRegistrySource.match(/const iconMap[^{]*\{([\s\S]*?)\};/);
if (iconMapBlock) {
  // Match both quoted ('icon-name': Component) and unquoted (icon: Component) keys
  const iconMapRegex = /(?:'([\w-]+)'|([\w-]+)):\s*[A-Z]/g;
  let m;
  while ((m = iconMapRegex.exec(iconMapBlock[1])) !== null) {
    sourceIconNames.push(m[1] || m[2]);
  }
}

const catalogIconNames = a2uiCatalog.iconNames || [];

const missingFromCatalog = sourceIconNames.filter(n => !catalogIconNames.includes(n));
const extraInCatalog = catalogIconNames.filter(n => !sourceIconNames.includes(n));

if (missingFromCatalog.length > 0) {
  error(`Icons in icon-registry.ts but missing from a2ui-catalog.json: ${missingFromCatalog.join(', ')}`);
}
if (extraInCatalog.length > 0) {
  error(`Icons in a2ui-catalog.json but missing from icon-registry.ts: ${extraInCatalog.join(', ')}`);
}

// ─── Check 4: A2UI example component types are valid ─────────────────────

const catalogTypeNames = new Set(a2uiTypes.map(t => t.name));
const examples = a2uiCatalog.examples || {};
let exampleIssues = 0;

for (const [name, example] of Object.entries(examples)) {
  for (const msg of (example.messages || [])) {
    if (msg.type !== 'surfaceUpdate') {continue;}
    for (const comp of (msg.components || [])) {
      if (!comp.component) {continue;}
      const typeName = Object.keys(comp.component)[0];
      if (!catalogTypeNames.has(typeName)) {
        error(`Example "${name}" uses unknown type "${typeName}"`);
        exampleIssues++;
      }
    }
  }
}

// ─── Report ────────────────────────────────────────────────────────────────

console.log('A2UI ↔ Component Registry Cross-Validation');
console.log('═'.repeat(50));
console.log(`A2UI types: ${a2uiTypes.length}`);
console.log(`Component registry: ${components.components.length} components`);
console.log(`Icon registry: ${sourceIconNames.length} icons`);
console.log(`A2UI catalog icons: ${catalogIconNames.length} icons`);
console.log();

if (unmappedCount === 0) {
  console.log('✅ All A2UI types map to valid Tale UI components');
} else {
  console.log(`❌ ${unmappedCount} A2UI types have invalid component mappings`);
}

if (missingFromCatalog.length === 0 && extraInCatalog.length === 0) {
  console.log('✅ Icon names match between registry and catalog');
} else {
  console.log(`❌ Icon name mismatch (${missingFromCatalog.length} missing, ${extraInCatalog.length} extra)`);
}

if (exampleIssues === 0) {
  console.log('✅ All example component types are valid');
} else {
  console.log(`❌ ${exampleIssues} example component type issues`);
}

if (proseCount > 0) {
  console.log(`⚠️  ${proseCount} props have prose allowedValues (not machine-parseable):`);
  for (const p of proseProps.slice(0, 10)) {
    console.log(`   ${p.type}.${p.prop}: "${p.value}"`);
  }
  if (proseProps.length > 10) {
    console.log(`   ... and ${proseProps.length - 10} more`);
  }
}

if (errors.length > 0) {
  console.log();
  console.log('Errors:');
  for (const entry of errors) {console.log(`  ❌ ${entry}`);}
}

if (warnings.length > 0) {
  console.log();
  console.log('Warnings:');
  for (const w of warnings) {console.log(`  ⚠️  ${w}`);}
}

console.log();
if (exitCode === 0) {
  console.log('✅ Cross-validation passed');
} else {
  console.log('❌ Cross-validation failed');
}
process.exit(exitCode);
