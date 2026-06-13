#!/usr/bin/env node
/**
 * audit-golden-patchability.mjs
 *
 * Verifies that every component tagged in a golden prompt can be
 * patch-targeted by the fix loop in eval-fix-review.mjs.
 *
 * For each unique tagged component name, checks:
 *   1. Resolvable — name maps to a slug (via registry + docs-scan + case-insensitive)
 *   2. Doc exists  — docs/components/{slug}.md is present
 *   3. ## Pitfalls — the doc has a ## Pitfalls section for fixes to land in
 *
 * Exits non-zero if any gaps are found.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const COMPONENTS_REGISTRY = join(ROOT, 'registry/components.json');
const DOCS_COMPONENTS_DIR = join(ROOT, 'docs/components');
const GOLDEN_DIR = join(__dirname, 'golden-prompts');

/* ── Build name→slug map ─────────────────────────────────────────────────── */

const nameToSlug = new Map();

// Primary source: components registry
try {
  const reg = JSON.parse(readFileSync(COMPONENTS_REGISTRY, 'utf8'));
  for (const c of reg.components) {nameToSlug.set(c.name, c.slug);}
} catch { /* non-fatal */ }

// Supplement: docs/components/*.md filenames — covers @tale-ui/charts etc.
// Algorithm: kebab-slug → PascalCase (area-chart → AreaChart, radial-bar-chart → RadialBarChart)
try {
  for (const file of readdirSync(DOCS_COMPONENTS_DIR)) {
    if (!file.endsWith('.md') || file === 'index.md') {continue;}
    const slug = file.slice(0, -3);
    const name = slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
    if (!nameToSlug.has(name)) {nameToSlug.set(name, slug);}
  }
} catch { /* non-fatal */ }

// Case-insensitive fallback (resolves IPhoneMockup vs IphoneMockup etc.)
const nameToSlugLower = new Map([...nameToSlug].map(([k, v]) => [k.toLowerCase(), v]));

function resolveSlug(name) {
  return nameToSlug.get(name) ?? nameToSlugLower.get(name.toLowerCase()) ?? null;
}

/* ── Collect tagged components from golden prompts ───────────────────────── */

const tagToFiles = new Map(); // tag → [slug, ...]
try {
  for (const file of readdirSync(GOLDEN_DIR)) {
    if (!file.endsWith('.json') || file === 'index.json') {continue;}
    const p = JSON.parse(readFileSync(join(GOLDEN_DIR, file), 'utf8'));
    for (const tag of (p.tags ?? [])) {
      if (!tagToFiles.has(tag)) {tagToFiles.set(tag, []);}
      tagToFiles.get(tag).push(p.slug);
    }
  }
} catch (err) {
  console.error(`ERROR: could not read golden prompts: ${err.message}`);
  process.exit(1);
}

/* ── Audit ───────────────────────────────────────────────────────────────── */

const gaps = [];

for (const [name] of [...tagToFiles].sort(([a], [b]) => a.localeCompare(b))) {
  const slug = resolveSlug(name);
  if (!slug) {
    gaps.push({ case: 1, name, detail: 'not in registry or docs/' });
    continue;
  }
  const docPath = join(DOCS_COMPONENTS_DIR, `${slug}.md`);
  if (!existsSync(docPath)) {
    gaps.push({ case: 2, name, detail: `docs/components/${slug}.md not found` });
    continue;
  }
  const docContent = readFileSync(docPath, 'utf8');
  if (!/^## Pitfalls$/m.test(docContent)) {
    gaps.push({ case: 3, name, detail: `docs/components/${slug}.md has no ## Pitfalls section` });
  }
}

if (gaps.length === 0) {
  console.log(`✅ audit-golden-patchability: all ${tagToFiles.size} tagged components are patch-ready`);
  process.exit(0);
} else {
  const case1 = gaps.filter((g) => g.case === 1);
  const case2 = gaps.filter((g) => g.case === 2);
  const case3 = gaps.filter((g) => g.case === 3);
  console.log(`⚠ audit-golden-patchability: ${gaps.length} gap(s) across ${tagToFiles.size} tagged components\n`);
  if (case1.length) {
    console.log(`  Case 1 — unresolvable name (${case1.length}):`);
    for (const g of case1) {console.log(`    ${g.name}  — ${g.detail}`);}
  }
  if (case2.length) {
    console.log(`  Case 2 — missing doc file (${case2.length}):`);
    for (const g of case2) {console.log(`    ${g.name}  — ${g.detail}`);}
  }
  if (case3.length) {
    console.log(`  Case 3 — no ## Pitfalls section (${case3.length}):`);
    for (const g of case3) {console.log(`    ${g.name}  — ${g.detail}`);}
  }
  process.exit(1);
}
