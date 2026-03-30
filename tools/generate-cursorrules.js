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
const SNIPPET_PATH = path.join(ROOT, 'docs/consumer-claude-md-snippet.md');
const OUTPUT_PATH = path.join(ROOT, '.cursorrules');

const args = process.argv.slice(2);
const checkMode = args.includes('--check');

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return null; }
}

// ─── Extract pitfalls from consumer snippet ─────────────────────────────────

function extractPitfalls(snippetContent) {
  if (!snippetContent) return '';
  const normalized = snippetContent.replace(/\r\n/g, '\n');

  // Extract lines between the namespace/simple list and "6. **Charts"
  // These are the individual pitfall bullet points (lines starting with "   - ")
  const lines = normalized.split('\n');
  const pitfalls = [];
  let inPitfalls = false;

  for (const line of lines) {
    // Start after the namespace/simple component list line
    if (line.includes('**Simple components** (direct use')) {
      inPitfalls = true;
      continue;
    }
    // Stop at the charts section or end of pitfalls
    if (inPitfalls && /^\d+\.\s+\*\*/.test(line.trim())) {
      break;
    }
    if (inPitfalls && line.trim().startsWith('- ')) {
      // Clean up the line: remove leading whitespace and "- " prefix
      let pitfall = line.trim().replace(/^- /, '');
      // Remove markdown bold markers for cleaner output
      pitfall = pitfall.replace(/\*\*/g, '');
      pitfalls.push(pitfall);
    }
  }

  return pitfalls;
}

// ─── Generate .cursorrules content ──────────────────────────────────────────

function generate() {
  const registry = JSON.parse(readFile(REGISTRY_PATH));
  const snippet = readFile(SNIPPET_PATH);

  const compound = registry.components
    .filter(c => c.kind === 'compound')
    .map(c => c.name)
    .sort();

  const simple = registry.components
    .filter(c => c.kind === 'simple')
    .map(c => c.name)
    .sort();

  const pitfalls = extractPitfalls(snippet);

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
