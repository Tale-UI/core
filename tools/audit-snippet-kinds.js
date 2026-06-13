#!/usr/bin/env node
/**
 * Audit: Consumer Snippet ↔ Registry Kind Consistency
 *
 * Verifies that the namespace/simple component lists in
 * docs/consumer-claude-md-snippet.md match the kind field
 * in registry/components.json (derived from index.ts export patterns).
 *
 * Run: node tools/audit-snippet-kinds.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SNIPPET_PATH = path.join(ROOT, 'docs/consumer-claude-md-snippet.md');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');

const snippet = fs.readFileSync(SNIPPET_PATH, 'utf8').replace(/\r\n/g, '\n');
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

// ─── Parse lists from snippet ───────────────────────────────────────────────

function extractNames(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) {return null;}
  const after = text.slice(start + startMarker.length);
  const end = endMarker ? after.indexOf(endMarker) : after.indexOf('\n\n');
  const segment = (end === -1 ? after : after.slice(0, end)).trim();
  const names = [];
  // Support both backtick-wrapped (`Name`) and plain comma-separated (Name,) formats
  if (segment.includes('`')) {
    const regex = /`(\w+)`/g;
    let m;
    while ((m = regex.exec(segment)) !== null) {names.push(m[1]);}
  } else {
    for (const tok of segment.split(/[\s,]+/)) {
      const name = tok.trim().replace(/[.,;]$/, '');
      if (/^[A-Z]\w*$/.test(name) || name === 'mergeProps') {names.push(name);}
    }
  }
  return names;
}

const snippetNamespace = extractNames(
  snippet,
  '**Namespace** (use `<Component.Root>`, never `<Component>` directly):\n',
  '\n\n',
);

const snippetSimple = extractNames(snippet, '**Simple** (direct use, no `.Root`):\n', '\n\n');

if (!snippetNamespace || !snippetSimple) {
  console.error('❌ Could not parse namespace/simple lists from consumer-claude-md-snippet.md');
  process.exit(1);
}

// ─── Build registry map ─────────────────────────────────────────────────────

const registryMap = new Map();
for (const c of registry.components) {
  registryMap.set(c.name, c.kind);
}

// ─── Check ──────────────────────────────────────────────────────────────────

const issues = [];

// Check namespace list
for (const name of snippetNamespace) {
  const kind = registryMap.get(name);
  if (!kind) {
    issues.push(`Snippet lists "${name}" as namespace but it's not in the registry`);
  } else if (kind !== 'compound') {
    issues.push(`Snippet lists "${name}" as namespace but registry says "${kind}"`);
  }
}

// Check simple list
for (const name of snippetSimple) {
  const kind = registryMap.get(name);
  if (!kind) {
    issues.push(`Snippet lists "${name}" as simple but it's not in the registry`);
  } else if (kind !== 'simple') {
    issues.push(`Snippet lists "${name}" as simple but registry says "${kind}"`);
  }
}

// Check for components in registry but missing from both snippet lists.
// Deprecated components are intentionally excluded from the namespace/simple
// lists — they appear in the snippet's **Deprecated** line instead.
const snippetAll = new Set([...snippetNamespace, ...snippetSimple]);
for (const c of registry.components) {
  if (c.status === 'deprecated') {
    if (!snippet.includes(c.name)) {
      issues.push(`"${c.name}" is deprecated but not mentioned in the snippet's Deprecated line`);
    }
    continue;
  }
  if (!snippetAll.has(c.name)) {
    issues.push(`"${c.name}" is in the registry (${c.kind}) but missing from both snippet lists`);
  }
}

// ─── Report ─────────────────────────────────────────────────────────────────

if (issues.length > 0) {
  console.error(`❌ ${issues.length} issue(s) found:\n`);
  for (const issue of issues) {
    console.error(`  ✗ ${issue}`);
  }
  process.exit(1);
} else {
  console.log(
    `✅ Snippet namespace/simple lists match registry (${snippetNamespace.length} compound, ${snippetSimple.length} simple).`,
  );
}
