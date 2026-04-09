#!/usr/bin/env node
/**
 * Pitfalls Registry Generator
 *
 * Parses docs/pitfalls.md and outputs registry/pitfalls.json.
 *
 * Run:   node tools/generate-pitfalls-registry.js          # generate and write
 *        node tools/generate-pitfalls-registry.js --check   # compare against committed; exit 1 if different
 *
 * Input format (docs/pitfalls.md):
 *
 *   ## Section Name
 *   <!-- pitfall: my-slug -->
 *   <!-- applies-to: ComponentA, ComponentB -->
 *   <!-- category: trigger-styling -->
 *   - **Summary text** — Detail text
 *     - anti-pattern: `<Bad.Usage>`
 *     - fix: `<Good.Usage>`
 *
 * For the trigger-styling table, use:
 *   <!-- trigger-table-start -->
 *   | Trigger | Auto-applies | Required className |
 *   | ... |
 *   <!-- trigger-table-end -->
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PITFALLS_DOC_PATH = path.join(ROOT, 'docs/pitfalls.md');
const PITFALLS_JSON_PATH = path.join(ROOT, 'registry/pitfalls.json');
const REACT_PKG_PATH = path.join(ROOT, 'packages/react/package.json');

const args = process.argv.slice(2);
const checkMode = args.includes('--check');

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return null; }
}

// ─── Parse a single pitfall entry block ─────────────────────────────────────

/**
 * Extract a `- complete example:` fenced block from raw (including blank) lines.
 * Handles both the fenced form (```tsx block) and the legacy inline backtick form.
 * @param {string[]} rawLines — all lines in the block (may include blank lines)
 * @returns {string|null}
 */
function extractCompleteExample(rawLines) {
  let inCE = false;
  let inFence = false;
  const fenceLines = [];
  for (const line of rawLines) {
    // Inline form: "  - complete example: `code`"
    if (!inCE && !inFence) {
      const inlineMatch = line.match(/^\s{2}- complete example:\s*`([^`]+)`\s*$/);
      if (inlineMatch) return inlineMatch[1];
    }
    // Start of complete example sub-bullet (fenced form)
    if (!inCE && /^\s{2}- complete example:\s*$/.test(line)) {
      inCE = true;
      continue;
    }
    // Opening fence (4 spaces + ```)
    if (inCE && !inFence && /^\s{4}```/.test(line)) {
      inFence = true;
      continue;
    }
    // Inside fenced block
    if (inFence) {
      if (/^\s{4}```/.test(line)) {
        // Closing fence — done
        return fenceLines.join('\n');
      }
      // Strip exactly 4 leading spaces
      fenceLines.push(line.replace(/^    /, ''));
    }
  }
  return null;
}

function parsePitfallBlock(commentBlock, bulletLine, restLines, completeExample = null) {
  const idMatch = commentBlock.match(/<!-- pitfall: ([\w-]+) -->/);
  if (!idMatch) return null;

  const id = idMatch[1];
  const appliesToMatch = commentBlock.match(/<!-- applies-to: ([^>]+) -->/);
  const categoryMatch = commentBlock.match(/<!-- category: ([\w-]+) -->/);

  const appliesTo = appliesToMatch
    ? appliesToMatch[1].split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const category = categoryMatch ? categoryMatch[1].trim() : null;

  // Parse bullet: "- **Summary** — Detail"
  const bulletMatch = bulletLine.match(/^- \*\*(.+?)\*\*(?:\s*[—–-]\s*(.*))?$/);
  if (!bulletMatch) return null;

  const summary = bulletMatch[1].replace(/`/g, '');
  let detail = bulletMatch[2] ? bulletMatch[2].trim() : '';

  // Collect any continuation lines (indented, not sub-bullets)
  for (const line of restLines) {
    if (/^\s+- (anti-pattern|fix|complete example):/.test(line)) continue;
    if (/^\s{4}```/.test(line)) continue; // fence lines
    if (/^\s/.test(line)) {
      detail += ' ' + line.trim();
    } else {
      break;
    }
  }

  // Parse sub-bullets
  const antiPatterns = [];
  const fixes = [];
  for (const line of restLines) {
    const apMatch = line.match(/^\s+- anti-pattern:\s*`([^`]+)`/);
    const fixMatch = line.match(/^\s+- fix:\s*`([^`]+)`/);
    if (apMatch) antiPatterns.push(apMatch[1]);
    if (fixMatch) fixes.push(fixMatch[1]);
  }

  return {
    id,
    summary: summary.trim(),
    detail: detail.trim(),
    ...(appliesTo.length > 0 ? { appliesTo } : {}),
    ...(category ? { category } : {}),
    ...(antiPatterns.length > 0 ? { antiPatterns } : {}),
    ...(fixes.length > 0 ? { fixes } : {}),
    ...(completeExample ? { completeExample } : {}),
  };
}

// ─── Parse the trigger styling table ────────────────────────────────────────

function parseTriggerTable(content) {
  const tableMatch = content.match(/<!-- trigger-table-start -->([\s\S]*?)<!-- trigger-table-end -->/);
  if (!tableMatch) return null;

  const tableText = tableMatch[1].trim();
  const rows = tableText.split('\n').filter(line => line.startsWith('|') && !line.match(/^\|\s*[-:]+/));

  if (rows.length < 2) return null;

  const headers = rows[0].split('|').map(h => h.trim()).filter(Boolean);
  const entries = [];

  for (const row of rows.slice(1)) {
    const cells = row.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < headers.length) continue;
    const entry = {};
    headers.forEach((h, i) => { entry[h] = cells[i] || ''; });
    entries.push(entry);
  }

  return { headers, entries };
}

// ─── Main parser ────────────────────────────────────────────────────────────

function parsePitfallsDoc(content) {
  if (!content) {
    return {
      crossComponentPitfalls: [],
      generalConventions: [],
      triggerStylingTable: null,
    };
  }

  const normalized = content.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  const crossComponentPitfalls = [];
  const generalConventions = [];

  // Determine which H2 section we're in
  let currentSection = null;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Track H2 sections
    if (/^## /.test(line)) {
      currentSection = line.replace(/^## /, '').trim();
      i++;
      continue;
    }

    // Collect comment block (may span multiple lines)
    if (line.startsWith('<!-- pitfall:')) {
      const commentLines = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith('<!--')) {
        commentLines.push(lines[j]);
        j++;
      }
      const commentBlock = commentLines.join('\n');

      // Next non-comment line should be the bullet
      const bulletLine = lines[j] || '';
      if (!bulletLine.startsWith('- **')) {
        i = j;
        continue;
      }

      // Collect raw block lines (including blank) for complete example extraction
      const rawBlockLines = [];
      let k = j + 1;
      while (k < lines.length && (lines[k].startsWith('  ') || lines[k] === '')) {
        rawBlockLines.push(lines[k]);
        k++;
      }

      // Build restLines (non-blank) for sub-bullet parsing
      const restLines = rawBlockLines.filter(l => l !== '');

      const completeExample = extractCompleteExample(rawBlockLines);
      const pitfall = parsePitfallBlock(commentBlock, bulletLine, restLines, completeExample);
      if (pitfall) {
        // Only classify as generalConventions if the section is explicitly "General Conventions"
        // or "General" — other sections with "convention" in their name (e.g. "React Aria Conventions")
        // are cross-component pitfalls with a specific domain.
        const sectionNorm = (currentSection || '').toLowerCase().trim();
        const isGeneral = sectionNorm === 'general conventions' || sectionNorm === 'general';
        if (isGeneral) {
          generalConventions.push(pitfall);
        } else {
          crossComponentPitfalls.push(pitfall);
        }
      }

      i = k;
      continue;
    }

    i++;
  }

  const triggerStylingTable = parseTriggerTable(normalized);

  return { crossComponentPitfalls, generalConventions, triggerStylingTable };
}

// ─── Run ────────────────────────────────────────────────────────────────────

const reactPkg = JSON.parse(readFile(REACT_PKG_PATH) || '{}');
const docContent = readFile(PITFALLS_DOC_PATH);
const parsed = parsePitfallsDoc(docContent);

const output = JSON.stringify({
  schemaVersion: '1.2.0',
  taleUiVersion: reactPkg.version || null,
  ...parsed,
}, null, 2) + '\n';

if (checkMode) {
  const existing = readFile(PITFALLS_JSON_PATH);
  if (existing === output) {
    console.log('✅ registry/pitfalls.json is up-to-date.');
    process.exit(0);
  } else {
    console.error('❌ registry/pitfalls.json is out of date. Run: pnpm pitfalls:generate');
    process.exit(1);
  }
} else {
  const registryDir = path.dirname(PITFALLS_JSON_PATH);
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }
  fs.writeFileSync(PITFALLS_JSON_PATH, output);
  const total = parsed.crossComponentPitfalls.length + parsed.generalConventions.length;
  console.log(`✅ Generated registry/pitfalls.json (${total} pitfalls: ${parsed.crossComponentPitfalls.length} cross-component, ${parsed.generalConventions.length} general conventions)`);
}
