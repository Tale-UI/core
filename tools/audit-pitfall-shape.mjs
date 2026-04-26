#!/usr/bin/env node
/**
 * Pitfall Shape Validator
 *
 * Walks docs/components/*.md and docs/pitfalls.md, parses each pitfall block,
 * and reports shape violations. Exits non-zero if any violations are found.
 *
 * Usage:
 *   node tools/audit-pitfall-shape.mjs              # report violations
 *   node tools/audit-pitfall-shape.mjs --verbose     # include pass lines too
 *
 * Violations reported:
 *   1. Slug uniqueness within a file
 *   2. Exactly one top-level bullet per slug
 *   3. Summary length ≤ 180 chars
 *   4. Single-idea summary (no idea-separator conjunctions outside backticks)
 *   5. Slug/summary semantic match (≥50% of slug tokens in summary)
 *   6. Anti-pattern + fix presence (unless <!-- prose-only -->)
 *   7. Backtick discipline in anti-pattern/fix snippets
 *   8. Complete example shape (fenced ```tsx, has import + return/export)
 *   9. No disallowed sub-bullet kinds (common mistake:, enforcement rule:)
 *  10. Category required in pitfalls.md, forbidden in components/*.md
 *  11. Cross-file meta-pitfalls must not appear in components/*.md
 *  12. Notes bullets must not restate local pitfall rules
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const COMPONENTS_DIR = join(ROOT, 'docs/components');
const PITFALLS_DOC = join(ROOT, 'docs/pitfalls.md');

// verbose flag reserved for future use
// const verbose = process.argv.includes('--verbose');

// ─── Constants ───────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  // Generic English stopwords
  'no', 'not', 'is', 'a', 'an', 'the', 'on', 'in', 'for', 'with',
  'use', 'uses', 'used', 'using', 'are', 'be', 'it', 'its', 'of',
  'to', 'from', 'or', 'and', 'do', 'does', 'only', 'always', 'never',
  // Structural slug terms (describe shape, not the rule content)
  'sub', 'part', 'parts', 'valid', 'values', 'value', 'always', 'required',
  'correct', 'explicit', 'missing', 'type',
]);

// Slugs that must ONLY appear in docs/pitfalls.md — not in component docs
const GLOBAL_ONLY_SLUG_PREFIXES = [
  'always-generate',
  'never-output',
  'always-output',
];

const DISALLOWED_SUB_BULLETS = [
  'common mistake',
  'enforcement rule',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripBacktickContent(str) {
  return str.replace(/`[^`]*`/g, '');
}

function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function dropStopwords(tokens) {
  return tokens.filter(t => !STOPWORDS.has(t) && t.length > 1);
}

function normalizeForComparison(str) {
  return dropStopwords(tokenize(stripBacktickContent(str)));
}


// Known abbreviation expansions for slug semantic matching
const SLUG_ABBREVS = {
  rac: 'react-aria-components',
  btn: 'button',
  bg: 'background',
  ap: 'antipattern',
};

/**
 * @param {string} slug
 * @param {string} summary — raw summary (with backtick content intact)
 * @param {string[]} componentTokens — tokens of the component name (file basename), stripped from slug for matching
 */
function slugSummaryMatch(slug, summary, componentTokens = []) {
  const slugTokens = dropStopwords(tokenize(slug.replace(/-/g, ' ')));
  if (slugTokens.length === 0) { return true; } // nothing to check

  // Remove component name prefix tokens from slug (they're implicit in per-component docs)
  const ruleTokens = slugTokens.filter(t => !componentTokens.includes(t));
  if (ruleTokens.length === 0) { return true; } // only component tokens, nothing to check

  // Include backtick content in summary words (don't strip — key terms are often in backticks)
  const summaryWords = dropStopwords(tokenize(summary));

  // Expand abbreviations in rule tokens
  const expandedTokens = ruleTokens.map(t => SLUG_ABBREVS[t] || t);

  let matched = 0;
  for (const st of expandedTokens) {
    if (summaryWords.some(sw => stemMatch(st, sw))) { matched += 1; }
  }
  return (matched / expandedTokens.length) >= 0.4;
}

const STEM_LEN = 4; // minimum prefix length for stem matching

function stemMatch(a, b) {
  if (a === b) { return true; }
  // Shared prefix stem (handles nesting/nested, requires/required, imports/import)
  if (a.length >= STEM_LEN && b.length >= STEM_LEN && a.slice(0, STEM_LEN) === b.slice(0, STEM_LEN)) { return true; }
  // One is a prefix of the other (min 3 chars)
  const min = Math.min(a.length, b.length);
  if (min >= 3 && (a.startsWith(b.slice(0, min)) || b.startsWith(a.slice(0, min)))) { return true; }
  // One is contained in the other (handles camelCase words in summary containing slug token)
  if (a.length >= 3 && b.includes(a)) { return true; }
  if (b.length >= 3 && a.includes(b)) { return true; }
  return false;
}

// ─── Block parser ─────────────────────────────────────────────────────────────

/**
 * Parse pitfall blocks from a file's content.
 * Returns an array of parsed block objects with position info.
 */
function parseBlocks(content, filePath) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line.startsWith('<!-- pitfall:')) {
      i += 1;
      continue;
    }

    // Collect comment lines
    const commentStart = i;
    const commentLines = [line];
    let j = i + 1;
    while (j < lines.length && lines[j].startsWith('<!--')) {
      commentLines.push(lines[j]);
      j += 1;
    }
    const commentBlock = commentLines.join('\n');

    const idMatch = commentBlock.match(/<!-- pitfall: ([\w-]+) -->/);
    if (!idMatch) { i = j; continue; }

    const id = idMatch[1];
    const proseOnly = commentBlock.includes('<!-- prose-only -->') || lines[j]?.includes('<!-- prose-only -->');
    const multiIdeaOk = commentBlock.includes('<!-- multi-idea-ok -->') || lines[j - 1]?.includes('<!-- multi-idea-ok -->');
    const hasCategory = /<!-- category: ([\w-]+) -->/.test(commentBlock);
    const hasAppliesTo = /<!-- applies-to: [^>]+ -->/.test(commentBlock);

    // Find top-level bullets in the block
    const bulletLines = [];
    const rawBlockLines = [];
    let k = j;
    // Scan until next <!-- pitfall: or next ## heading or EOF
    while (k < lines.length) {
      const l = lines[k];
      if (l.startsWith('<!-- pitfall:') || l.startsWith('## ')) { break; }
      rawBlockLines.push(l);
      if (/^- \*\*/.test(l)) { bulletLines.push({ line: l, lineNum: k + 1 }); }
      k += 1;
    }

    const rawBlock = rawBlockLines.join('\n');

    blocks.push({
      id,
      filePath,
      commentStartLine: commentStart + 1, // 1-indexed
      bulletLines,
      rawBlock,
      proseOnly,
      multiIdeaOk,
      hasCategory,
      hasAppliesTo,
    });

    i = k;
  }
  return blocks;
}

function parseNotesBullets(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const marker = '\n## Notes\n';
  const start = normalized.indexOf(marker);
  if (start === -1) { return []; }

  const notesStart = start + marker.length;
  const nextHeading = normalized.indexOf('\n## ', notesStart);
  const section = normalized.slice(notesStart, nextHeading === -1 ? undefined : nextHeading);

  return section
    .split('\n')
    .map(line => line.match(/^- (.+)$/)?.[1]?.trim() || null)
    .filter(Boolean);
}

// ─── Violation checks ────────────────────────────────────────────────────────

function checkBlock(block, isPitfallsDoc, violations) {
  const { id, filePath, commentStartLine, bulletLines, rawBlock, proseOnly, multiIdeaOk, hasCategory } = block;
  const loc = `${filePath}:${commentStartLine}`;

  // Component name tokens (from filename, used to strip component prefix from slug for semantic match)
  const fileBasename = basename(filePath, '.md'); // e.g. "range-calendar"
  const componentTokens = isPitfallsDoc ? [] : dropStopwords(tokenize(fileBasename.replace(/-/g, ' ')));

  // Check 2: exactly one top-level bullet
  if (bulletLines.length === 0) {
    violations.push({ loc, id, msg: 'no top-level bullet found' });
    return; // can't check further
  }
  if (bulletLines.length > 1) {
    violations.push({ loc, id, msg: `${bulletLines.length} top-level bullets found (expected exactly 1)` });
  }

  const firstBullet = bulletLines[0].line;
  const bulletMatch = firstBullet.match(/^- \*\*(.+?)\*\*(?:\s*[—–-]\s*(.*))?$/s);
  if (!bulletMatch) {
    violations.push({ loc, id, msg: 'first bullet does not match "- **summary** — detail" format' });
    return;
  }

  const summary = bulletMatch[1];
  const summaryClean = summary.replace(/`[^`]*`/g, '').trim();

  // Check 3: summary length
  if (summary.length > 180) {
    violations.push({ loc, id, msg: `summary too long (${summary.length} chars, max 180)` });
  }

  // Check 4: single-idea summary
  if (!multiIdeaOk) {
    const stripped = stripBacktickContent(summary);
    const dashCount = (stripped.match(/[—–]/g) || []).length;
    if (dashCount >= 2) {
      violations.push({ loc, id, msg: `summary appears multi-idea (${dashCount} em-dashes outside backticks)` });
    }
    if (/\band\b/.test(stripped)) {
      violations.push({ loc, id, msg: 'summary may be multi-idea (contains "and" outside backticks)' });
    }
    if (/;/.test(stripped)) {
      violations.push({ loc, id, msg: 'summary may be multi-idea (contains semicolon outside backticks)' });
    }
  }

  // Check 5: slug/summary semantic match (use raw summary including backtick content)
  if (!slugSummaryMatch(id, summary, componentTokens)) {
    violations.push({ loc, id, msg: `slug tokens not reflected in summary (slug: "${id}", summary: "${summaryClean.slice(0, 80)}...")` });
  }

  // Check 6: anti-pattern + fix presence (unless prose-only)
  if (!proseOnly) {
    const hasAntiPattern = /^\s+- anti-pattern:/m.test(rawBlock);
    const hasFix = /^\s+- fix:/m.test(rawBlock);
    if (!hasAntiPattern) {
      violations.push({ loc, id, msg: 'missing anti-pattern sub-bullet (add <!-- prose-only --> if intentional)' });
    }
    if (!hasFix) {
      violations.push({ loc, id, msg: 'missing fix sub-bullet (add <!-- prose-only --> if intentional)' });
    }
  }

  // Check 7: backtick discipline in anti-pattern/fix
  const apLines = [...rawBlock.matchAll(/^\s+- anti-pattern:\s*(.+)$/mg)].map(m => m[1]);
  const fixLines = [...rawBlock.matchAll(/^\s+- fix:\s*(.+)$/mg)].map(m => m[1]);
  for (const snippet of [...apLines, ...fixLines]) {
    // Must be either backtick-wrapped or start of a fenced block (```)
    const isBtWrapped = /^`[^`]+`$/.test(snippet.trim());
    const isFenceStart = snippet.trim().startsWith('```');
    if (!isBtWrapped && !isFenceStart && snippet.trim() !== '') {
      violations.push({ loc, id, msg: `anti-pattern/fix snippet not backtick-wrapped: ${snippet.slice(0, 60)}` });
    }
  }

  // Check 8: complete example shape
  const ceBlockMatch = rawBlock.match(/ {2}- complete example:\s*\n([\s\S]*?)(?=\n\s{2,}- |\n<!-- |\n*$)/);
  const ceInlineMatch = rawBlock.match(/ {2}- complete example:\s*`([^`]+)`/);
  if (ceBlockMatch) {
    const ceContent = ceBlockMatch[1];
    if (!ceContent.includes('```')) {
      violations.push({ loc, id, msg: 'complete example is present but not a fenced code block' });
    } else {
      // Must start with ```tsx (or ```jsx or just ```)
      if (!/```(tsx|jsx|js|ts)?/.test(ceContent)) {
        violations.push({ loc, id, msg: 'complete example fence should use ```tsx language tag' });
      }
      if (!ceContent.includes('import ')) {
        violations.push({ loc, id, msg: 'complete example should contain an import statement' });
      }
      if (!ceContent.includes('return') && !ceContent.includes('export function')) {
        violations.push({ loc, id, msg: 'complete example should contain a return statement or export function' });
      }
    }
  } else if (ceInlineMatch) {
    violations.push({ loc, id, msg: 'complete example uses legacy inline backtick form — convert to fenced block' });
  }

  // Check 9: disallowed sub-bullet kinds
  for (const kind of DISALLOWED_SUB_BULLETS) {
    if (new RegExp(`^\\s+- ${kind}:`, 'm').test(rawBlock)) {
      violations.push({ loc, id, msg: `disallowed sub-bullet "- ${kind}:" found` });
    }
  }

  // Check 10: category presence/absence
  if (isPitfallsDoc && !hasCategory) {
    violations.push({ loc, id, msg: 'missing <!-- category: ... --> comment (required in pitfalls.md)' });
  }
  if (!isPitfallsDoc && hasCategory) {
    violations.push({ loc, id, msg: '<!-- category: ... --> comment should not appear in component docs' });
  }

  // Check 11: global-only slugs must not appear in component docs
  if (!isPitfallsDoc) {
    for (const prefix of GLOBAL_ONLY_SLUG_PREFIXES) {
      if (id.startsWith(prefix)) {
        violations.push({ loc, id, msg: `slug "${id}" is a meta-pitfall that should only live in docs/pitfalls.md` });
      }
    }
  }
}

function checkNotesAgainstPitfalls(filePath, content, blocks, violations) {
  const notes = parseNotesBullets(content);
  if (notes.length === 0 || blocks.length === 0) { return; }

  const summaries = blocks
    .map(block => {
      const firstBullet = block.bulletLines[0]?.line;
      const bulletMatch = firstBullet?.match(/^- \*\*(.+?)\*\*(?:\s*[—–-]\s*(.*))?$/s);
      if (!bulletMatch) { return null; }
      return {
        id: block.id,
        summary: bulletMatch[1],
        tokens: normalizeForComparison(bulletMatch[1]),
      };
    })
    .filter(Boolean);

  for (const note of notes) {
    const noteTokens = normalizeForComparison(note);
    if (noteTokens.length < 3) { continue; }

    for (const pitfall of summaries) {
      const overlap = pitfall.tokens.filter(token => noteTokens.includes(token));
      const overlapRatio = pitfall.tokens.length === 0 ? 0 : overlap.length / pitfall.tokens.length;
      if (overlap.length >= 3 && overlapRatio >= 0.75) {
        violations.push({
          loc: `${filePath}:notes`,
          id: pitfall.id,
          msg: `note restates pitfall "${pitfall.id}" (${pitfall.summary})`,
        });
        break;
      }
    }
  }
}

// ─── Auto-fix (--fix mode) ────────────────────────────────────────────────────

const FIX_MODE = process.argv.includes('--fix');

function autoFixFile(filePath) {
  const before = readFileSync(filePath, 'utf8');
  // Only repair trailing double-backticks inside anti-pattern / fix sub-bullets.
  const after = before.replace(
    /^(\s+- (?:anti-pattern|fix):\s*.*?)``(?!`)(\s*)$/gm,
    '$1`$2',
  );
  if (after !== before) {
    writeFileSync(filePath, after, 'utf8');
    return true;
  }
  return false;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function auditFile(filePath, isPitfallsDoc) {
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }

  const blocks = parseBlocks(content, filePath);
  const violations = [];

  // Check 1: slug uniqueness within file
  const seenSlugs = new Map(); // slug -> first line
  for (const block of blocks) {
    if (seenSlugs.has(block.id)) {
      violations.push({
        loc: `${block.filePath}:${block.commentStartLine}`,
        id: block.id,
        msg: `duplicate slug (first seen at line ${seenSlugs.get(block.id)})`,
      });
    } else {
      seenSlugs.set(block.id, block.commentStartLine);
    }
  }

  for (const block of blocks) {
    checkBlock(block, isPitfallsDoc, violations);
  }

  if (!isPitfallsDoc) {
    checkNotesAgainstPitfalls(filePath, content, blocks, violations);
  }

  return violations;
}

// Report helper (needed by auto-fix output too)
const relPath = p => p.replace(`${ROOT}/`, '');

const componentFiles = readdirSync(COMPONENTS_DIR)
  .filter(f => f.endsWith('.md') && f !== 'index.md')
  .map(f => join(COMPONENTS_DIR, f));

// Auto-fix pass (--fix): repair trailing double-backticks in anti-pattern/fix bullets
if (FIX_MODE) {
  for (const f of [PITFALLS_DOC, ...componentFiles]) {
    if (autoFixFile(f)) {
      process.stdout.write(`  auto-repaired trailing \`\` in ${relPath(f)}\n`);
    }
  }
}

const allViolations = [];

// Audit pitfalls.md
allViolations.push(...auditFile(PITFALLS_DOC, true));

// Audit component docs
for (const f of componentFiles) {
  allViolations.push(...auditFile(f, false));
}

if (allViolations.length === 0) {
  process.stdout.write(`✅ audit-pitfall-shape: no violations found (${componentFiles.length + 1} files checked)\n`);
  process.exit(0);
} else {
  for (const v of allViolations) {
    console.error(`${relPath(v.loc)}  [${v.id}]  ${v.msg}`);
  }
  console.error(`\n❌ ${allViolations.length} violation${allViolations.length === 1 ? '' : 's'} found`);
  process.exit(1);
}
