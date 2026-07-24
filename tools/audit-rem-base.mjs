#!/usr/bin/env node
/**
 * Rem Base Audit
 *
 * Verifies that current-release source and guidance use the standard browser
 * root rem contract. Historical notes, plans, research, generated build
 * outputs, and standard-root docs app CSS are intentionally skipped.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

function gitFiles() {
  return execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter((file) => file && existsSync(path.join(ROOT, file)));
}

function readTracked(file) {
  return readFileSync(path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');
}

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

const skippedPrefixes = [
  '.github/',
  'analysis/',
  'docs/archive/research/',
  'docs/src/',
  'plans/',
  'research/',
  'playground/storybook/storybook-static/',
  'packages/css/dist/',
];

const skippedFiles = new Set(['packages/styles/CHANGELOG.md', 'tools/audit-rem-base.mjs']);

function isSkipped(file) {
  return skippedFiles.has(file) || skippedPrefixes.some((prefix) => file.startsWith(prefix));
}

const staleGuidancePatterns = [
  { label: 'old root percentage', regex: /62\.5%/g },
  { label: 'old 10px rem contract', regex: /1rem\s*=\s*10px|10px\s*=\s*1rem/g },
  { label: 'converted stale 10px rem text', regex: /0\.625rem\s*=\s*10px/g },
  { label: 'old design-token setup wording', regex: /design tokens assume|font-size base/g },
];

const errors = [];

for (const file of gitFiles()) {
  if (isSkipped(file)) {
    continue;
  }

  const text = readTracked(file);
  for (const { label, regex } of staleGuidancePatterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        file,
        line: lineNumber(text, match.index),
        message: `${label}: ${match[0]}`,
      });
    }
  }
}

function expectIncludes(file, expected) {
  const text = readTracked(file);
  if (!text.includes(expected)) {
    errors.push({ file, line: 1, message: `missing expected value: ${expected}` });
  }
}

function expectExcludes(file, forbidden) {
  const text = readTracked(file);
  for (const value of forbidden) {
    const index = text.indexOf(value);
    if (index !== -1) {
      errors.push({
        file,
        line: lineNumber(text, index),
        message: `pre-migration value remains: ${value}`,
      });
    }
  }
}

expectIncludes('packages/css/src/tokens/_base.css', 'font-size: 100%;');
expectIncludes('packages/css/src/tokens/_spacing.css', '--space-m: 1.75rem;');
expectIncludes('packages/css/src/tokens/_spacing.css', '--section-space-xl: 13.98125rem;');
expectIncludes('packages/css/src/tokens/_typography.css', '--text-m: 1rem;');
expectIncludes('packages/css/src/tokens/_effects.css', '--scale: 0.07813rem;');
expectIncludes('packages/styles/src/_primitives.css', '--field-min-height: 2.25rem;');
expectIncludes('packages/styles/src/_primitives.css', '--progress-track-height: 0.5rem;');

expectExcludes('packages/css/src/tokens/_base.css', ['font-size: 62.5%;']);
expectExcludes('packages/css/src/tokens/_spacing.css', [
  '--space-m: 2.80rem;',
  '--section-space-xl: 22.37rem;',
  '--space-m: clamp(1.6rem, calc(1.07vw + 1.09rem), 2.8rem);',
]);
expectExcludes('packages/css/src/tokens/_typography.css', [
  '--text-m: 1.60rem;',
  '--text-8xl: 4.5rem;',
  '--text-m: clamp(1.4rem, calc(0.18vw + 1.31rem), 1.6rem);',
]);
expectExcludes('packages/css/src/tokens/_effects.css', ['--scale: 0.125rem;']);
expectExcludes('packages/styles/src/_primitives.css', [
  '--field-min-height: 3.6rem;',
  '--progress-track-height: 0.8rem;',
  'min-height: 4.4rem;',
]);

if (errors.length > 0) {
  console.error(`Rem base audit failed: ${errors.length} issue(s) found.\n`);
  for (const issue of errors) {
    console.error(`  ${issue.file}:${issue.line} ${issue.message}`);
  }
  process.exit(1);
}

console.log(
  'Rem base audit passed: standard-root contract and converted token values are in place.',
);
console.log(`Reviewed exceptions skipped: ${[...skippedPrefixes, ...skippedFiles].join(', ')}`);
