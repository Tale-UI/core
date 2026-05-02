#!/usr/bin/env node
/* eslint-disable no-console, no-underscore-dangle, @typescript-eslint/naming-convention */

import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { execFileSync, spawnSync } from 'child_process';
import { dirname, join, resolve } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import {
  applyPitfallFixToSectionText,
  extractSection,
  sanitizeTrailingDoubleBackticks,
  validateFixPayload,
} from './pitfall-patch-lib.mjs';
import { createPitfallSourceTargetResolver } from './pitfall-source-target-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DEFAULT_EVAL_CONTEXT = join(__dirname, '.eval-context.md');

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const JSON_PATH = getArg('--json');
const EVAL_CONTEXT_PATH = getArg('--eval-context') ?? DEFAULT_EVAL_CONTEXT;
const WRITE = hasFlag('--write');
const DRY_RUN = hasFlag('--dry-run') || !WRITE;

function usage() {
  return `Usage:
  node tools/apply-pitfall-patch.mjs --json /tmp/fix.json --dry-run
  node tools/apply-pitfall-patch.mjs --json /tmp/fix.json --write

Options:
  --json PATH          Fix payload JSON file from golden:fix-review
  --dry-run           Validate and print a diff without writing (default)
  --write             Apply the patch to the target documentation file
  --eval-context PATH Optional eval context used for old-heading inference`;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    throw new Error(`Could not read JSON payload at ${path}: ${err.message}`, { cause: err });
  }
}

function readEvalContext(path) {
  if (!path || !existsSync(path)) {
    return '';
  }
  return readFileSync(path, 'utf8');
}

function renderDiff(oldText, newText, filePath) {
  if (oldText === newText) {
    return '';
  }

  const oldPath = join(tmpdir(), `tale-ui-pitfall-old-${process.pid}-${Date.now()}.md`);
  const newPath = join(tmpdir(), `tale-ui-pitfall-new-${process.pid}-${Date.now()}.md`);
  try {
    writeFileSync(oldPath, oldText, 'utf8');
    writeFileSync(newPath, newText, 'utf8');
    const proc = spawnSync(
      'git',
      ['diff', '--no-index', '--color=always', '--', oldPath, newPath],
      {
        cwd: ROOT,
        encoding: 'utf8',
      },
    );
    const diffText = proc.stdout || proc.stderr || '';
    return diffText
      .replaceAll(oldPath, `${filePath} (before)`)
      .replaceAll(newPath, `${filePath} (after)`);
  } finally {
    for (const path of [oldPath, newPath]) {
      try {
        unlinkSync(path);
      } catch {
        /* ignore */
      }
    }
  }
}

function buildUpdatedFile(fileContent, section, updatedSection) {
  return sanitizeTrailingDoubleBackticks(
    fileContent.slice(0, section.sectionStart) +
      updatedSection +
      fileContent.slice(section.sectionEnd),
  );
}

function main() {
  if (!JSON_PATH || hasFlag('--help') || hasFlag('-h')) {
    console.log(usage());
    process.exit(JSON_PATH ? 0 : 1);
  }
  if (WRITE && hasFlag('--dry-run')) {
    throw new Error('Use either --dry-run or --write, not both.');
  }

  const fix = readJson(JSON_PATH);
  const payloadValidation = validateFixPayload(fix);
  if (!payloadValidation.pass) {
    console.error('Patch payload is invalid:');
    for (const error of payloadValidation.errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  const { resolveSourceTarget } = createPitfallSourceTargetResolver(ROOT);
  const target = resolveSourceTarget(fix, readEvalContext(EVAL_CONTEXT_PATH));
  if (!target) {
    throw new Error(
      `Could not resolve target (section=${fix.section ?? 'none'}, targetFile=${fix.targetFile ?? 'none'}).`,
    );
  }
  if (!existsSync(target.filePath)) {
    throw new Error(`Target file not found: ${target.filePath}`);
  }

  let fileContent = readFileSync(target.filePath, 'utf8');
  let section = extractSection(fileContent, target.sectionHeading);
  if (!section && target.isComponent && target.sectionHeading === 'Pitfalls') {
    fileContent = `${fileContent.trimEnd()}\n\n## Pitfalls\n`;
    section = extractSection(fileContent, 'Pitfalls');
  }
  if (!section) {
    throw new Error(`No '## ${target.sectionHeading}' section in ${target.filePath}`);
  }

  const result = applyPitfallFixToSectionText(section.sectionText, fix, target, target.filePath);
  if (result.error) {
    throw new Error(result.error);
  }

  const updatedFile = buildUpdatedFile(fileContent, section, result.updatedSection);
  console.log(`Target: ${target.filePath}`);
  console.log(`Section: ## ${target.sectionHeading}`);
  console.log(`Expected pitfall slug: ${result.expectedSlug}`);

  if (DRY_RUN) {
    const diff = renderDiff(readFileSync(target.filePath, 'utf8'), updatedFile, target.filePath);
    console.log(diff || 'No changes.');
    return;
  }

  writeFileSync(target.filePath, updatedFile, 'utf8');
  for (const script of [
    'generate-pitfalls-registry.js',
    'generate-registry.js',
    'generate-eval-context.js',
  ]) {
    execFileSync(process.execPath, [join(__dirname, script)], {
      cwd: ROOT,
      stdio: 'inherit',
    });
  }
  console.log('Patch applied.');
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
