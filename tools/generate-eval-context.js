#!/usr/bin/env node
/**
 * Eval Context Generator
 *
 * Generates tools/.eval-context.md — the system prompt source used by the
 * golden prompt eval pipeline. It is the consumer snippet with section 5
 * expanded from a one-line MCP pointer into the full inline pitfalls catalog,
 * giving the eval the same pitfall knowledge a consumer gains through MCP calls.
 *
 * Inputs:
 *   docs/consumer-claude-md-snippet.md  — base consumer snippet (slim, ~1,300 tokens)
 *   registry/components.json            — per-component pitfalls[]
 *   registry/pitfalls.json              — crossComponentPitfalls[], generalConventions[], triggerStylingTable
 *
 * Output:
 *   tools/.eval-context.md              — gitignored derived artifact
 *
 * Run:   node tools/generate-eval-context.js          # generate and write
 *        node tools/generate-eval-context.js --check   # compare; exit 1 if different
 *
 * This file is regenerated automatically at eval startup — do not hand-edit.
 * To persist pitfall fixes from the fix loop, port changes to docs/pitfalls.md
 * and run: pnpm generate-docs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SNIPPET_PATH = path.join(ROOT, 'docs/consumer-claude-md-snippet.md');
const COMPONENTS_PATH = path.join(ROOT, 'registry/components.json');
const PITFALLS_PATH = path.join(ROOT, 'registry/pitfalls.json');
const OUTPUT_PATH = path.join(__dirname, '.eval-context.md');

const args = process.argv.slice(2);
const checkMode = args.includes('--check');

function readFile(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

/* ─── Pitfall rendering helpers ─────────────────────────────────────────── */

function renderPitfallBullet(pitfall, indent = '') {
  const lines = [];
  lines.push(`${indent}- **${pitfall.summary}** — ${pitfall.detail}`);
  if (pitfall.antiPatterns?.length) {
    for (const ap of pitfall.antiPatterns) {
      lines.push(`${indent}  - anti-pattern: \`${ap}\``);
    }
  }
  if (pitfall.fixes?.length) {
    for (const fix of pitfall.fixes) {
      lines.push(`${indent}  - fix: \`${fix}\``);
    }
  }
  return lines.join('\n');
}

function renderTriggerTable(table) {
  const { headers, entries } = table;
  const headerRow = '| ' + headers.join(' | ') + ' |';
  const sepRow = '| ' + headers.map(() => '---').join(' | ') + ' |';
  const rows = entries.map(e => '| ' + headers.map(h => e[h]).join(' | ') + ' |');
  return [headerRow, sepRow, ...rows].join('\n');
}

/* ─── Section 5 builder ─────────────────────────────────────────────────── */

const CATEGORY_ORDER = [
  'trigger-styling',
  'controlled-state',
  'color-state',
  'react-aria',
  'imports',
  'layout',
  'visual-exports',
  'dark-mode',
];

const CATEGORY_LABELS = {
  'trigger-styling': 'Trigger styling',
  'controlled-state': 'Controlled state',
  'color-state': 'Color state',
  'react-aria': 'React Aria conventions',
  'imports': 'Imports',
  'layout': 'Layout',
  'visual-exports': 'Visual exports',
  'dark-mode': 'Dark mode',
};

function buildSection5(components, pitfallsData) {
  const { crossComponentPitfalls, generalConventions, triggerStylingTable } = pitfallsData;
  const lines = [];

  lines.push('5. **Common pitfalls**');
  lines.push('');

  // ── General conventions ────────────────────────────────────────────────
  lines.push('   ### General conventions');
  lines.push('');
  for (const conv of generalConventions) {
    lines.push(renderPitfallBullet(conv, '   '));
  }
  lines.push('');

  // ── Cross-component pitfalls ───────────────────────────────────────────
  lines.push('   ### Cross-component pitfalls');
  lines.push('');

  // Group by category in canonical order
  const byCategory = {};
  for (const p of crossComponentPitfalls) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }

  for (const cat of CATEGORY_ORDER) {
    const group = byCategory[cat];
    if (!group?.length) continue;

    const label = CATEGORY_LABELS[cat] ?? cat;
    lines.push(`   #### ${label}`);
    lines.push('');
    for (const p of group) {
      lines.push(renderPitfallBullet(p, '   '));
    }
    lines.push('');

    // Trigger styling table follows trigger-styling pitfalls
    if (cat === 'trigger-styling' && triggerStylingTable) {
      lines.push(renderTriggerTable(triggerStylingTable).split('\n').map(l => '   ' + l).join('\n'));
      lines.push('');
    }
  }

  // Any categories not in canonical order (future-proofing)
  for (const [cat, group] of Object.entries(byCategory)) {
    if (CATEGORY_ORDER.includes(cat)) continue;
    const label = CATEGORY_LABELS[cat] ?? cat;
    lines.push(`   #### ${label}`);
    lines.push('');
    for (const p of group) {
      lines.push(renderPitfallBullet(p, '   '));
    }
    lines.push('');
  }

  // ── Per-component pitfalls ─────────────────────────────────────────────
  const withPitfalls = components.filter(c => c.pitfalls?.length && c.status !== 'deprecated');
  if (withPitfalls.length > 0) {
    lines.push('   ### Per-component pitfalls');
    lines.push('');
    for (const comp of withPitfalls) {
      lines.push(`   #### ${comp.name}`);
      lines.push('');
      for (const p of comp.pitfalls) {
        lines.push(renderPitfallBullet(p, '   '));
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/* ─── Main generator ────────────────────────────────────────────────────── */

function generate() {
  const snippetRaw = readFile(SNIPPET_PATH);
  if (!snippetRaw) throw new Error(`Cannot read ${SNIPPET_PATH}`);

  const componentsJson = readFile(COMPONENTS_PATH);
  if (!componentsJson) throw new Error(`Cannot read ${COMPONENTS_PATH}`);

  const pitfallsJson = readFile(PITFALLS_PATH);
  if (!pitfallsJson) throw new Error(`Cannot read ${PITFALLS_PATH}`);

  const { components } = JSON.parse(componentsJson);
  const pitfallsData = JSON.parse(pitfallsJson);

  // Extract body from consumer snippet (strip preamble before ## UI Components)
  const body = snippetRaw.replace(/^[\s\S]*?(?=^## UI Components)/m, '');

  // Build expanded section 5
  const section5 = buildSection5(components, pitfallsData);

  // Replace the one-line section 5 pointer with the expanded block.
  // Matches the entire "5. **Component pitfalls: ..." line (up to the next \n)
  const expanded = body.replace(/5\. \*\*Component pitfalls:.*\n/, section5 + '\n');

  return expanded;
}

/* ─── Write / check ─────────────────────────────────────────────────────── */

const output = generate();

if (checkMode) {
  const existing = readFile(OUTPUT_PATH);
  if (existing === output) {
    console.log('✅ tools/.eval-context.md is up-to-date.');
    process.exit(0);
  } else {
    console.error('❌ tools/.eval-context.md is out of date. Run: pnpm eval-context:generate');
    process.exit(1);
  }
} else {
  fs.writeFileSync(OUTPUT_PATH, output);
  const tokens = Math.round(output.length / 4);
  console.log(`✅ Generated tools/.eval-context.md (~${tokens} tokens estimated)`);
}
