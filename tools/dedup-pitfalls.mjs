#!/usr/bin/env node
/**
 * dedup-pitfalls.mjs
 *
 * One-shot script that collapses duplicate <!-- pitfall: {slug} --> blocks in
 * docs/components/*.md and docs/pitfalls.md. Keeps the FIRST occurrence of each
 * slug and deletes subsequent identical/near-identical duplicates.
 *
 * Usage:
 *   node tools/dedup-pitfalls.mjs            # dry run (prints what would change)
 *   node tools/dedup-pitfalls.mjs --write    # write files in place
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WRITE = process.argv.includes('--write');

const targets = [
  join(ROOT, 'docs/pitfalls.md'),
  ...readdirSync(join(ROOT, 'docs/components'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => join(ROOT, 'docs/components', f)),
];

let totalRemoved = 0;
let filesChanged = 0;

for (const filePath of targets) {
  const original = readFileSync(filePath, 'utf8');
  const result = dedupFile(original, filePath);
  if (result !== original) {
    const removed = countPitfallBlocks(original) - countPitfallBlocks(result);
    console.log(`${WRITE ? 'Updated' : 'Would update'}: ${filePath.replace(`${ROOT  }/`, '')}`);
    console.log(`  Removed ${removed} duplicate block(s)`);
    if (WRITE) {writeFileSync(filePath, result, 'utf8');}
    totalRemoved += removed;
    filesChanged++;
  }
}

if (totalRemoved === 0) {
  console.log('No duplicates found.');
} else {
  console.log(
    `\n${WRITE ? 'Done' : 'Dry run'}: ${totalRemoved} duplicate block(s) in ${filesChanged} file(s).`,
  );
  if (!WRITE) {console.log('Re-run with --write to apply.');}
}

/**
 * Remove duplicate <!-- pitfall: slug --> blocks from a markdown file,
 * keeping the first occurrence of each slug.
 */
function dedupFile(content, filePath) {
  // Split on pitfall comment markers, preserving delimiters
  // Each block starts with <!-- pitfall: slug --> and ends before the next one
  // or at end of file. We collect all blocks within each ## section separately.

  const seenSlugs = new Set();
  let result = '';
  let pos = 0;

  // Find all <!-- pitfall: ... --> markers
  const markerRegex = /<!-- pitfall: ([a-z0-9-]+) -->/g;
  let match;
  const markers = [];
  while ((match = markerRegex.exec(content)) !== null) {
    markers.push({ slug: match[1], start: match.index, end: match.index + match[0].length });
  }

  if (markers.length === 0) {return content;}

  for (let i = 0; i < markers.length; i++) {
    const { slug, start } = markers[i];
    // Append everything up to this marker
    result += content.slice(pos, start);

    // Find where this block ends: either the start of the next pitfall marker,
    // the next ## section heading, or end of file
    const blockEnd = i + 1 < markers.length ? markers[i + 1].start : content.length;
    const blockContent = content.slice(start, blockEnd);

    if (seenSlugs.has(slug)) {
      // Duplicate — skip the block but keep any trailing whitespace that belongs
      // to the gap between blocks (don't collapse two newlines into nothing)
      pos = blockEnd;
      // Don't emit anything for this block
    } else {
      seenSlugs.add(slug);
      result += blockContent;
      pos = blockEnd;
    }
  }

  // Append anything after the last marker
  result += content.slice(pos);

  // Collapse more than two consecutive blank lines (artefact of deletions)
  result = result.replace(/\n{4,}/g, '\n\n\n');

  return result;
}

function countPitfallBlocks(content) {
  return (content.match(/<!-- pitfall: [a-z0-9-]+ -->/g) ?? []).length;
}
