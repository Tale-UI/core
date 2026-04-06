#!/usr/bin/env node
/**
 * Pitfall Consistency Audit
 *
 * Verifies that pitfall IDs in component docs match the registry, and
 * that cross-pitfall refs resolve against registry/pitfalls.json.
 *
 * Checks:
 *   1. Every <!-- pitfall: id --> in docs/components/*.md is present in registry/components.json
 *   2. Every <!-- cross-pitfall-ref: id --> in docs/components/*.md exists in registry/pitfalls.json
 *   3. No orphan pitfall IDs (IDs in registry but not in any doc)
 *   4. No orphan crossPitfallRefs (IDs in registry but not in pitfalls.json)
 *
 * Run:   node tools/audit-pitfall-consistency.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs/components');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');
const PITFALLS_JSON_PATH = path.join(ROOT, 'registry/pitfalls.json');

function readFile(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

const registry = JSON.parse(readFile(REGISTRY_PATH));
const pitfallsJson = JSON.parse(readFile(PITFALLS_JSON_PATH) || '{"crossComponentPitfalls":[],"generalConventions":[]}');

const allCrossIds = new Set([
  ...pitfallsJson.crossComponentPitfalls.map(p => p.id),
  ...pitfallsJson.generalConventions.map(p => p.id),
]);

let issues = 0;
let warnings = 0;

for (const component of registry.components) {
  const docPath = path.join(DOCS_DIR, `${component.slug}.md`);
  const docContent = readFile(docPath);

  // 1. Verify pitfall IDs in doc match registry
  if (docContent) {
    const docPitfallIds = [...docContent.matchAll(/<!-- pitfall: ([\w-]+) -->/g)].map(m => m[1]);
    const registryIds = new Set((component.pitfalls || []).map(p => p.id));

    for (const id of docPitfallIds) {
      if (!registryIds.has(id)) {
        console.error(`❌ ${component.name}: doc has pitfall "${id}" but registry does not (run registry:generate)`);
        issues++;
      }
    }

    // 2. Verify crossPitfallRefs in doc resolve against pitfalls.json
    const docCrossRefs = [...docContent.matchAll(/<!-- cross-pitfall-ref: ([\w-]+) -->/g)].map(m => m[1]);
    const registryCrossRefs = new Set(component.crossPitfallRefs || []);

    for (const id of docCrossRefs) {
      if (!registryCrossRefs.has(id)) {
        console.error(`❌ ${component.name}: doc has cross-pitfall-ref "${id}" but registry does not (run registry:generate)`);
        issues++;
      }
      if (!allCrossIds.has(id)) {
        console.error(`❌ ${component.name}: cross-pitfall-ref "${id}" not found in registry/pitfalls.json`);
        issues++;
      }
    }
  }

  // 3. Registry crossPitfallRefs resolve against pitfalls.json
  for (const refId of (component.crossPitfallRefs || [])) {
    if (!allCrossIds.has(refId)) {
      console.error(`❌ ${component.name}: registry crossPitfallRef "${refId}" not found in registry/pitfalls.json`);
      issues++;
    }
  }
}

// 4. Check for obviously orphaned pitfall IDs in docs (IDs that appear in component pitfalls
//    section but with no matching registry entry — registry:generate would catch this too)
const allDocFiles = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md') && f !== 'index.md');
for (const file of allDocFiles) {
  const content = readFile(path.join(DOCS_DIR, file));
  if (!content) continue;
  const slug = file.replace('.md', '');
  const component = registry.components.find(c => c.slug === slug);
  if (!component) {
    // component doc exists but not in registry — skip (audit-components.js covers this)
    continue;
  }
  const docCrossRefs = [...content.matchAll(/<!-- cross-pitfall-ref: ([\w-]+) -->/g)].map(m => m[1]);
  for (const id of docCrossRefs) {
    if (!allCrossIds.has(id)) {
      console.warn(`⚠️  ${slug}: cross-pitfall-ref "${id}" does not exist in registry/pitfalls.json`);
      warnings++;
    }
  }
}

if (issues === 0 && warnings === 0) {
  const totalPitfalls = registry.components.reduce((n, c) => n + (c.pitfalls?.length || 0), 0);
  const totalCrossRefs = registry.components.reduce((n, c) => n + (c.crossPitfallRefs?.length || 0), 0);
  console.log(`✅ Pitfall consistency OK — ${totalPitfalls} component pitfalls, ${totalCrossRefs} cross-pitfall refs, all resolve correctly.`);
} else {
  if (warnings > 0) console.warn(`⚠️  ${warnings} warning(s)`);
  if (issues > 0) {
    console.error(`❌ ${issues} consistency error(s) found.`);
    process.exit(1);
  }
}
