#!/usr/bin/env node
/**
 * Pitfall Coverage Audit
 *
 * Tracks how many components have ## Pitfalls sections and reports coverage
 * statistics. Useful for tracking Phase 3 progress.
 *
 * Usage:
 *   node tools/audit-pitfall-coverage.js           # show coverage report
 *   node tools/audit-pitfall-coverage.js --missing  # show only components without pitfalls
 *   node tools/audit-pitfall-coverage.js --json     # machine-readable JSON output
 *
 * Components that have no known pitfalls (utility-only, no sub-parts, no common mistakes)
 * are excluded from the "expected" count.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs/components');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');

function readFile(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

const args = process.argv.slice(2);
const showMissing = args.includes('--missing');
const jsonMode = args.includes('--json');

const registry = JSON.parse(readFile(REGISTRY_PATH));

// Components that are unlikely to have specific pitfalls (no sub-parts, purely functional)
const SKIP_PITFALL_CHECK = new Set([
  'CSPProvider', 'I18nProvider', 'mergeProps', 'Container',
]);

const results = [];
let withPitfalls = 0;
let withoutPitfalls = 0;
let expectedTotal = 0;

for (const component of registry.components) {
  if (SKIP_PITFALL_CHECK.has(component.name)) continue;
  expectedTotal++;

  const docPath = path.join(DOCS_DIR, `${component.slug}.md`);
  const docContent = readFile(docPath);
  const hasPitfalls = docContent ? /^## Pitfalls$/m.test(docContent) : false;
  const pitfallCount = component.pitfalls?.length || 0;
  const crossRefCount = component.crossPitfallRefs?.length || 0;

  if (hasPitfalls || pitfallCount > 0 || crossRefCount > 0) {
    withPitfalls++;
  } else {
    withoutPitfalls++;
  }

  results.push({
    name: component.name,
    slug: component.slug,
    hasPitfalls: hasPitfalls || pitfallCount > 0 || crossRefCount > 0,
    pitfallCount,
    crossRefCount,
  });
}

const coverage = Math.round((withPitfalls / expectedTotal) * 100);

if (jsonMode) {
  console.log(JSON.stringify({
    total: expectedTotal,
    withPitfalls,
    withoutPitfalls,
    coveragePercent: coverage,
    components: results,
  }, null, 2));
  process.exit(0);
}

if (!showMissing) {
  console.log(`\nPitfall Coverage Report`);
  console.log(`═══════════════════════`);
  console.log(`Total components: ${expectedTotal}`);
  console.log(`With pitfalls:    ${withPitfalls} (${coverage}%)`);
  console.log(`Without pitfalls: ${withoutPitfalls}`);
  console.log('');
}

const missing = results.filter(r => !r.hasPitfalls);
if (missing.length > 0) {
  if (showMissing) {
    for (const r of missing) {
      console.log(`  ${r.slug}`);
    }
  } else {
    console.log(`Components without ## Pitfalls (${missing.length}):`);
    for (const r of missing) {
      console.log(`  - ${r.name} (docs/components/${r.slug}.md)`);
    }
    console.log('');
  }
}

if (!showMissing) {
  const covered = results.filter(r => r.hasPitfalls);
  console.log(`Components with ## Pitfalls (${covered.length}):`);
  for (const r of covered) {
    const detail = [
      r.pitfallCount > 0 ? `${r.pitfallCount} specific` : null,
      r.crossRefCount > 0 ? `${r.crossRefCount} cross-refs` : null,
    ].filter(Boolean).join(', ');
    console.log(`  ✓ ${r.name}${detail ? ` (${detail})` : ''}`);
  }
}
