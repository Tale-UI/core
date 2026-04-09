#!/usr/bin/env node
/**
 * Pitfall Complete-Example Miner
 *
 * Extracts the root `@example` JSDoc block from each component's `.styled.tsx`
 * file, transforms it into a validator-compliant fenced code block, and injects
 * it as a `- complete example:` sub-bullet under the FIRST pitfall of each
 * component's `## Pitfalls` section.
 *
 * Usage:
 *   node tools/mine-pitfall-examples.mjs              # dry-run (default)
 *   node tools/mine-pitfall-examples.mjs --write      # write to .md files
 *   node tools/mine-pitfall-examples.mjs --component button  # single component
 *
 * Skips:
 *   - Pitfalls that already have a `- complete example:` sub-bullet.
 *   - Pitfalls marked `<!-- prose-only -->`.
 *   - Components where the JSDoc example contains any of the component's
 *     anti-pattern strings (conflict) — these are reported and skipped.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const REACT_SRC = join(ROOT, 'packages/react/src');
const DOCS_DIR = join(ROOT, 'docs/components');
const REGISTRY_PATH = join(ROOT, 'registry/components.json');

const args = process.argv.slice(2);
const WRITE_MODE = args.includes('--write');
const componentFilter = (() => {
  const idx = args.indexOf('--component');
  return idx !== -1 ? args[idx + 1] : null;
})();

// ─── Slug/Pascal helpers (mirrors generate-registry.js) ──────────────────────

const PASCAL_OVERRIDES = {
  'csp-provider': 'CSPProvider',
  'i18n-provider': 'I18nProvider',
  'toggle-group': 'ToggleButtonGroup',
  'merge-props': 'mergeProps',
};

function kebabToPascal(kebab) {
  if (PASCAL_OVERRIDES[kebab]) { return PASCAL_OVERRIDES[kebab]; }
  return kebab.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

function findStyledFile(slug) {
  const dir = join(REACT_SRC, slug);
  if (!existsSync(dir)) { return null; }
  const files = readdirSync(dir);
  const pascal = kebabToPascal(slug);
  const styledName = `${pascal}.styled.tsx`;
  if (files.includes(styledName)) { return join(dir, styledName); }
  // Fallback: non-test .tsx file with the same Pascal name
  const plainName = `${pascal}.tsx`;
  if (files.includes(plainName)) { return join(dir, plainName); }
  const styled = files.find(f => f.endsWith('.styled.tsx'));
  if (styled) { return join(dir, styled); }
  return null;
}

// ─── JSDoc @example extractor ────────────────────────────────────────────────

/**
 * Extracts the FIRST `@example` JSDoc block that immediately precedes a
 * top-level `export` statement.  Returns the unwrapped code (without the
 * JSDoc comment markers and without the ``` fences) or null.
 *
 * Uses a sequential block parser rather than a single regex to avoid
 * accidentally spanning multiple JSDoc blocks.
 */
function extractJsdocExample(content) {
  // Walk through the file finding each /** ... */ block sequentially.
  let pos = 0;
  while (pos < content.length) {
    const start = content.indexOf('/**', pos);
    if (start === -1) { break; }

    const end = content.indexOf('*/', start + 3);
    if (end === -1) { break; }

    const blockRaw = content.slice(start, end + 2);
    pos = end + 2;

    // Skip if no @example in this block
    if (!blockRaw.includes('@example')) { continue; }

    // Check that after whitespace/newlines this block is followed by an export
    // of a capitalised identifier (top-level component, not sub-part).
    const afterBlock = content.slice(end + 2);
    if (!/^\s*\nexport\s+(?:const|function)\s+[A-Z]/.test(afterBlock)) { continue; }

    // Strip the JSDoc markers — remove /** , */ , and leading " * " per line
    const body = blockRaw
      .replace(/^\/\*\*\s*\n/, '')
      .replace(/\n\s*\*\/$/, '')
      .split('\n')
      .map(l => l.replace(/^\s*\*\s?/, ''))
      .join('\n');

    // Extract the content of the @example block (up to the next @ tag or end)
    const exRe = /@example\s*\n([\s\S]*?)(?=\n@|\s*$)/;
    const ex = exRe.exec(body);
    if (!ex) { continue; }

    // Remove the ``` fences
    const inner = ex[1]
      .replace(/^\s*```tsx?\s*\n/, '')
      .replace(/\n\s*```\s*$/, '')
      .trim();

    if (!inner) { continue; }
    return inner;
  }
  return null;
}

/**
 * Fallback: extract the first ```tsx block from the ## Basic Usage section of
 * the component .md file.  Returns the raw code (no fences) or null.
 */
function extractBasicUsage(docContent) {
  const marker = '\n## Basic Usage\n';
  const start = docContent.indexOf(marker);
  if (start === -1) { return null; }
  const section = docContent.slice(start + marker.length, start + marker.length + 2000);
  const m = section.match(/```tsx\n([\s\S]*?)```/);
  if (!m) { return null; }
  return m[1].trim() || null;
}

// ─── Code transformer ────────────────────────────────────────────────────────

/**
 * Transform bare JSX + imports extracted from a JSDoc @example into a
 * validator-compliant module:
 *
 *   import { ... } from '...';
 *   export function Example() {
 *     <hooks>
 *     return (
 *       <jsx>
 *     );
 *   }
 *
 * @param {string} code  — unwrapped JSDoc body (no ``` fences)
 * @returns {{ ok: boolean, code: string, reason?: string }}
 */
function transformCode(code) {
  const lines = code.split('\n');

  // Partition lines into: imports, topLevel declarations, jsx body
  const importLines = [];
  const hookLines = [];   // const x = useState(…) / hooks at module scope
  const jsxLines = [];
  let inJsx = false;

  for (const line of lines) {
    if (!inJsx && line.trimStart().startsWith('import ')) {
      importLines.push(line);
    } else if (!inJsx && /^\s*(const|let)\s+\[/.test(line)) {
      // Hook destructuring at top level (e.g. AlertDialog's useState call)
      hookLines.push(line);
    } else if (!inJsx && line.trim() === '') {
      // Skip blank lines between imports/hooks and JSX
    } else {
      // First non-import non-blank line: start of JSX
      inJsx = true;
      jsxLines.push(line);
    }
  }

  if (importLines.length === 0) {
    return { ok: false, reason: 'no import lines found' };
  }
  if (jsxLines.length === 0) {
    return { ok: false, reason: 'no JSX content found' };
  }

  // Detect hook import needs: if we have hookLines using useState but no useState import
  if (hookLines.length > 0) {
    const usedHooks = hookLines
      .flatMap(l => (l.match(/\b(use[A-Z]\w+)/g) || []))
      .filter((h, i, a) => a.indexOf(h) === i);
    for (const hook of usedHooks) {
      const alreadyImported = importLines.some(l => l.includes(hook));
      if (!alreadyImported) {
        importLines.unshift(`import { ${hook} } from 'react';`);
      }
    }
  }

  // Determine if we need a fragment (multiple top-level JSX siblings)
  const trimmedJsx = jsxLines.map(l => l.trim()).filter(Boolean);
  const topLevelElements = countTopLevelElements(trimmedJsx);
  const needsFragment = topLevelElements > 1;

  // Build the function body
  // All JSX lines are re-indented to 4 spaces (inside return, inside fragment if any)
  const jsxIndent = needsFragment ? '      ' : '    ';
  const jsxBody = jsxLines.map(l => jsxIndent + l).join('\n');

  const hookBlock = hookLines.length > 0
    ? `${hookLines.map(l => `  ${l.trim()}`).join('\n')}\n`
    : '';

  let returnContent;
  if (needsFragment) {
    returnContent = `(\n    <>\n${jsxBody}\n    </>`;
  } else {
    returnContent = `(\n${jsxBody}`;
  }

  const transformed = [
    ...importLines,
    '',
    'export function Example() {',
    ...(hookBlock ? [hookBlock.trimEnd()] : []),
    `  return ${returnContent}`,
    '  );',
    '}',
  ].join('\n');

  // Validate the output
  if (!transformed.includes('import ')) {
    return { ok: false, reason: 'transform produced no import statement' };
  }
  if (!transformed.includes('return') && !transformed.includes('export function')) {
    return { ok: false, reason: 'transform produced no return or export function' };
  }

  return { ok: true, code: transformed };
}

/**
 * Count the number of top-level JSX elements in a list of trimmed lines.
 * A "top-level element" starts with `<ComponentName` at depth 0.
 */
function countTopLevelElements(trimmedLines) {
  let depth = 0;
  let count = 0;
  for (const line of trimmedLines) {
    // Opening tags (not self-closing, not closing)
    const opens = (line.match(/<[A-Za-z][^/!>]*[^/]>/g) || []).length;
    const selfClose = (line.match(/<[A-Za-z][^>]*\/>/g) || []).length;
    const closes = (line.match(/<\/[A-Za-z][^>]*>/g) || []).length;
    if (depth === 0 && (opens > 0 || selfClose > 0)) {
      count += 1;
    }
    depth += opens - closes;
    if (depth < 0) { depth = 0; }
  }
  return count;
}

// ─── Markdown patcher ────────────────────────────────────────────────────────

/**
 * Given a component .md file's content, the first pitfall id, and the
 * transformed code, returns the patched content with the `- complete example:`
 * block inserted after the last sub-bullet of the first pitfall.
 *
 * Returns null if the target pitfall already has a complete example or is
 * prose-only.
 */
function patchMd(content, firstPitfallId, transformedCode) {
  const lines = content.split('\n');
  const pitfallComment = `<!-- pitfall: ${firstPitfallId} -->`;

  // Find the pitfall comment line
  const pitfallLineIdx = lines.findIndex(l => l.includes(pitfallComment));
  if (pitfallLineIdx === -1) { return null; }

  // Check for prose-only between pitfall comment and first bullet
  for (let i = pitfallLineIdx; i < Math.min(pitfallLineIdx + 5, lines.length); i += 1) {
    if (lines[i].includes('<!-- prose-only -->')) { return null; }
  }

  // Find the first top-level bullet (line starting with "- **")
  let bulletLineIdx = -1;
  for (let i = pitfallLineIdx + 1; i < lines.length; i += 1) {
    if (lines[i].startsWith('- **')) { bulletLineIdx = i; break; }
    if (lines[i].startsWith('## ') || lines[i].startsWith('<!-- pitfall:')) { break; }
  }
  if (bulletLineIdx === -1) { return null; }

  // Check if this block already has a complete example
  for (let i = bulletLineIdx + 1; i < lines.length; i += 1) {
    const l = lines[i];
    if (l.startsWith('<!-- pitfall:') || l.startsWith('## ')) { break; }
    if (/^\s+- complete example/.test(l)) { return null; } // already present
  }

  // Find the last sub-bullet line (any "  - " line belonging to this pitfall)
  let lastSubBulletIdx = bulletLineIdx;
  for (let i = bulletLineIdx + 1; i < lines.length; i += 1) {
    const l = lines[i];
    if (l.startsWith('<!-- pitfall:') || l.startsWith('## ')) { break; }
    if (/^\s{2,}- /.test(l)) { lastSubBulletIdx = i; }
    // A fenced code block that's part of a sub-bullet
    if (/^\s{4,}```/.test(l)) { lastSubBulletIdx = i; }
  }

  // Build the complete example block (4-space indent inside fence)
  const indentedCode = transformedCode.split('\n').map(l => `    ${l}`).join('\n');
  const ceBlock = [
    '  - complete example:',
    '    ```tsx',
    indentedCode,
    '    ```',
  ].join('\n');

  // Insert after lastSubBulletIdx
  const result = [
    ...lines.slice(0, lastSubBulletIdx + 1),
    ceBlock,
    ...lines.slice(lastSubBulletIdx + 1),
  ];

  return result.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));

const results = {
  added: [],
  skipped_already_has: [],
  skipped_conflict: [],
  skipped_no_jsdoc: [],
  skipped_transform_failed: [],
  skipped_no_pitfalls: [],
  skipped_patch_failed: [],
};

for (const comp of registry.components) {
  if (componentFilter && comp.slug !== componentFilter) { continue; }

  const pitfalls = comp.pitfalls;
  if (!pitfalls || pitfalls.length === 0) {
    results.skipped_no_pitfalls.push(comp.slug);
    continue;
  }

  // Skip if first pitfall already has a complete example
  const firstPitfall = pitfalls[0];
  if (firstPitfall.completeExample) {
    results.skipped_already_has.push(comp.slug);
    continue;
  }

  // Find styled file (may be null; JSDoc extraction will be skipped if so)
  const styledPath = findStyledFile(comp.slug);
  const styledContent = styledPath ? readFileSync(styledPath, 'utf8') : '';

  // Extract JSDoc @example; fall back to ## Basic Usage in the .md file
  const docPathForFallback = join(DOCS_DIR, `${comp.slug}.md`);
  const docContentForFallback = existsSync(docPathForFallback)
    ? readFileSync(docPathForFallback, 'utf8')
    : null;

  const rawCode = extractJsdocExample(styledContent)
    ?? (docContentForFallback ? extractBasicUsage(docContentForFallback) : null);

  if (!rawCode) {
    results.skipped_no_jsdoc.push({ slug: comp.slug, reason: 'no usable @example in styled file or ## Basic Usage in doc' });
    continue;
  }

  // Transform
  const transformed = transformCode(rawCode);
  if (!transformed.ok) {
    results.skipped_transform_failed.push({ slug: comp.slug, reason: transformed.reason });
    continue;
  }

  // Conflict check: does the transformed code contain any anti-pattern snippet?
  const allAntiPatterns = pitfalls.flatMap(p => p.antiPatterns || []);
  const conflict = allAntiPatterns.find(ap => transformed.code.includes(ap));
  if (conflict) {
    results.skipped_conflict.push({
      slug: comp.slug,
      pitfallId: firstPitfall.id,
      antiPattern: conflict,
    });
    continue;
  }

  // Patch the .md file
  const docPath = join(DOCS_DIR, `${comp.slug}.md`);
  if (!existsSync(docPath)) {
    results.skipped_patch_failed.push({ slug: comp.slug, reason: '.md file not found' });
    continue;
  }

  const docContent = readFileSync(docPath, 'utf8');
  const patched = patchMd(docContent, firstPitfall.id, transformed.code);
  if (!patched) {
    results.skipped_patch_failed.push({
      slug: comp.slug,
      reason: `patchMd returned null for pitfall '${firstPitfall.id}'`,
    });
    continue;
  }

  if (WRITE_MODE) {
    writeFileSync(docPath, patched, 'utf8');
  }

  results.added.push({
    slug: comp.slug,
    pitfallId: firstPitfall.id,
    preview: transformed.code.split('\n').slice(0, 4).join(' | '),
  });
}

// ─── Report ──────────────────────────────────────────────────────────────────

const mode = WRITE_MODE ? 'WRITE' : 'DRY-RUN';
process.stdout.write(`\n=== mine-pitfall-examples [${mode}] ===\n\n`);

process.stdout.write(`✅ Added (${results.added.length}):\n`);
for (const r of results.added) {
  process.stdout.write(`   ${r.slug.padEnd(30)} → ${r.pitfallId}\n`);
  process.stdout.write(`     ${r.preview}\n`);
}

if (results.skipped_already_has.length > 0) {
  process.stdout.write(`\n⏭  Already has completeExample (${results.skipped_already_has.length}):\n`);
  for (const s of results.skipped_already_has) {
    process.stdout.write(`   ${s}\n`);
  }
}

if (results.skipped_conflict.length > 0) {
  process.stdout.write(`\n⚠️  Conflicts — JSDoc contains anti-pattern (${results.skipped_conflict.length}):\n`);
  for (const r of results.skipped_conflict) {
    process.stdout.write(`   ${r.slug.padEnd(30)} pitfall=${r.pitfallId}\n`);
    process.stdout.write(`     anti-pattern: ${r.antiPattern}\n`);
  }
}

if (results.skipped_no_jsdoc.length > 0) {
  process.stdout.write(`\n⚠️  No usable JSDoc @example (${results.skipped_no_jsdoc.length}):\n`);
  for (const r of results.skipped_no_jsdoc) {
    process.stdout.write(`   ${r.slug.padEnd(30)} ${r.reason}\n`);
  }
}

if (results.skipped_transform_failed.length > 0) {
  process.stdout.write(`\n❌ Transform failed (${results.skipped_transform_failed.length}):\n`);
  for (const r of results.skipped_transform_failed) {
    process.stdout.write(`   ${r.slug.padEnd(30)} ${r.reason}\n`);
  }
}

if (results.skipped_patch_failed.length > 0) {
  process.stdout.write(`\n❌ Patch failed (${results.skipped_patch_failed.length}):\n`);
  for (const r of results.skipped_patch_failed) {
    process.stdout.write(`   ${r.slug.padEnd(30)} ${r.reason}\n`);
  }
}

if (results.skipped_no_pitfalls.length > 0) {
  process.stdout.write(`\n—  No pitfalls (${results.skipped_no_pitfalls.length}): ${results.skipped_no_pitfalls.join(', ')}\n`);
}

process.stdout.write(`\n`);
process.stdout.write(`Summary: ${results.added.length} added`);
process.stdout.write(`, ${results.skipped_already_has.length} already have example`);
process.stdout.write(`, ${results.skipped_conflict.length} conflicts`);
process.stdout.write(`, ${results.skipped_no_jsdoc.length + results.skipped_transform_failed.length + results.skipped_patch_failed.length} failures\n`);

if (!WRITE_MODE) {
  process.stdout.write(`\nRun with --write to apply changes.\n`);
}
process.stdout.write('\n');
