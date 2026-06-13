#!/usr/bin/env node
/**
 * .cursorrules Generator
 *
 * Generates .cursorrules from:
 *   - registry/components.json (component list, namespace vs simple, props)
 *   - docs/consumer-claude-md-snippet.md (pitfalls section)
 *
 * Run:   node tools/generate-cursorrules.js          # generate and write
 *        node tools/generate-cursorrules.js --check   # compare; exit 1 if different
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');
const PITFALLS_PATH = path.join(ROOT, 'registry/pitfalls.json');
const OUTPUT_PATH = path.join(ROOT, '.cursorrules');

const args = process.argv.slice(2);
const checkMode = args.includes('--check');

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return null; }
}

// ─── Build pitfall lines from structured registry data ───────────────────────

function buildPitfallLines(registry, pitfallsJson) {
  const lines = [];

  // General conventions from pitfalls.json
  for (const gc of (pitfallsJson.generalConventions || [])) {
    lines.push(gc.summary + (gc.detail ? ' — ' + gc.detail.replace(/`/g, '') : ''));
  }

  // Trigger styling cross-component pitfalls
  for (const cp of (pitfallsJson.crossComponentPitfalls || [])) {
    if (cp.category === 'trigger-styling') {
      lines.push(cp.summary + (cp.detail ? ' — ' + cp.detail.replace(/`/g, '') : ''));
    }
  }

  // Top component-specific pitfalls (summary only, for cursorrules brevity)
  const seen = new Set();
  for (const component of registry.components.filter(c => c.status !== 'deprecated')) {
    for (const p of (component.pitfalls || [])) {
      const key = p.summary;
      if (!seen.has(key)) {
        seen.add(key);
        lines.push(`[${component.name}] ${p.summary}`);
      }
    }
  }

  return lines;
}

// ─── Generate .cursorrules content ──────────────────────────────────────────

function generate() {
  const registry = JSON.parse(readFile(REGISTRY_PATH));
  const pitfallsJson = JSON.parse(readFile(PITFALLS_PATH) || '{"crossComponentPitfalls":[],"generalConventions":[]}');

  const compound = registry.components
    .filter(c => c.kind === 'compound' && c.status !== 'deprecated')
    .map(c => c.name)
    .sort();

  const simple = registry.components
    .filter(c => c.kind === 'simple' && c.status !== 'deprecated')
    .map(c => c.name)
    .sort();

  const deprecated = registry.components
    .filter(c => c.status === 'deprecated')
    .map(c => {
      const match = (c.deprecationNote || '').match(/Use (\w+)/);
      return match ? `${c.name} (use ${match[1]})` : c.name;
    })
    .sort();

  const pitfalls = buildPitfallLines(registry, pitfallsJson);

  // Build the pitfalls section
  const pitfallLines = pitfalls.map(p => `- ${p}`).join('\n');

  const content = `# Tale UI — Cursor Rules

Use **only** components from \`@tale-ui/react\` for all UI. Never invent new imports or use other component libraries.

## Before writing UI code

1. Check \`registry/components.json\` for available components, props, parts, and examples.
2. Read the \`@example\` JSDoc on each component's \`.d.ts\` export before using it:
   \`node_modules/@tale-ui/react/esm/{name}/{Name}.styled.d.ts\`
3. For deeper details (all props, variants, patterns), read \`docs/components/{name}.md\`.

## Import patterns

- **Namespace components** (compound, multi-part): \`import { Dialog } from '@tale-ui/react/dialog'\` then \`<Dialog.Root>\`, \`<Dialog.Trigger>\`, etc.
- **Simple components** (single element): \`import { Button } from '@tale-ui/react/button'\` then \`<Button>\`.
- Never import from nested paths like \`@tale-ui/react/button/Button.styled\`.

## Namespace vs simple

**Namespace** (use \`.Root\`): ${compound.join(', ')}.

**Simple** (direct use): ${simple.join(', ')}.

**Deprecated** (still functional; avoid in new code): ${deprecated.join(', ')}.

For new checkbox/radio/switch UI, use \`CheckboxField\`, \`RadioField\` inside \`RadioGroup\`, and \`SwitchField\`. Use \`Checkbox\`, \`Radio\`, or \`Switch\` only when maintaining existing code or explicitly requested.

## Critical pitfalls

${pitfallLines}

## CSS tokens

- Colors: \`--color-*\` and \`--neutral-*\` (NEVER \`--brand-*\` in component CSS)
- Spacing: \`--space-4xs\` through \`--space-4xl\`
- Typography: \`--label-s-font-size\`, \`--text-s-font-size\`, etc.
- Neutral shades (irregular): 5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100
- Color shades (regular): 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
- \`--neutral-15\`, \`--neutral-25\`, \`--neutral-35\` DO NOT EXIST.

## Dark mode

Automatic via \`data-color-mode="dark"\` on \`<html>\`. Components using \`--color-*\` and \`--neutral-*\` get dark mode for free.

## Layout components

Use \`Row\` (horizontal flex) and \`Column\` (vertical flex) for layout. Both accept \`gap\`, \`align\`, \`justify\` props mapped to \`--space-*\` tokens.

## After generating code

Verify: all imports exist in \`@tale-ui/react\`, all props are valid, namespace components use \`.Root\`, simple components don't.
`;

  return content;
}

// ─── Run ────────────────────────────────────────────────────────────────────

const output = generate();

if (checkMode) {
  const existing = readFile(OUTPUT_PATH);
  if (existing === output) {
    console.log('✅ .cursorrules is up-to-date.');
    process.exit(0);
  } else {
    console.error('❌ .cursorrules is out of date. Run: pnpm cursorrules:generate');
    process.exit(1);
  }
} else {
  fs.writeFileSync(OUTPUT_PATH, output);
  console.log('✅ Generated .cursorrules');
}
