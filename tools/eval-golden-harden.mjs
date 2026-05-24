#!/usr/bin/env node
/**
 * eval-golden-harden.mjs
 *
 * Repeatedly runs each selected golden prompt through eval-fix-review until the
 * prompt passes from a fresh generation N times in a row. If a round fails, the
 * normal documentation fix loop runs, the streak resets, and the same prompt is
 * tried again before moving on.
 *
 * Usage:
 *   node tools/eval-golden-harden.mjs --provider ollama --model qwen3.6 --passes 3
 *   node tools/eval-golden-harden.mjs --provider lm-studio --model qwen3.6 --passes 5
 *   node tools/eval-golden-harden.mjs --slug primary-button --passes 3
 *   node tools/eval-golden-harden.mjs --difficulty simple --passes 2 --max-rounds 20
 */

import { readFileSync, readdirSync, existsSync, unlinkSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';
import {
  isProviderQuotaError,
  isProviderQuotaMessage,
  providerQuotaError,
} from './eval-golden-prompts-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FIX_REVIEW_SCRIPT = join(__dirname, 'eval-fix-review.mjs');
const GOLDEN_DIR = join(__dirname, 'golden-prompts');

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const PASS_TARGET = parseInt(getArg('--passes') ?? getArg('--pass-streak') ?? '3', 10);
const MAX_ROUNDS = parseInt(getArg('--max-rounds') ?? String(PASS_TARGET * 10), 10);
const FILTER_DIFFICULTY = getArg('--difficulty');
const FILTER_SLUG = getArg('--slug');
const FILTER_SLUGS =
  getArg('--slugs')
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? null;
const ALLOW_CACHE = hasFlag('--allow-cache');
const STATE_FILE = getArg('--state-file') ?? join(__dirname, '.golden-harden-state.json');
const RESUME = hasFlag('--resume');
const RESET_RESUME = hasFlag('--reset-resume');

if (!Number.isFinite(PASS_TARGET) || PASS_TARGET < 1) {
  throw new Error('--passes must be a positive integer.');
}
if (!Number.isFinite(MAX_ROUNDS) || MAX_ROUNDS < PASS_TARGET) {
  throw new Error('--max-rounds must be an integer greater than or equal to --passes.');
}

const NO_COLOR = process.env.NO_COLOR !== undefined || !process.stdout.isTTY;
const C = NO_COLOR
  ? {
      bold: (s) => s,
      dim: (s) => s,
      green: (s) => s,
      yellow: (s) => s,
      red: (s) => s,
      cyan: (s) => s,
    }
  : {
      bold: (s) => `\x1b[1m${s}\x1b[22m`,
      dim: (s) => `\x1b[2m${s}\x1b[22m`,
      green: (s) => `\x1b[32m${s}\x1b[39m`,
      yellow: (s) => `\x1b[33m${s}\x1b[39m`,
      red: (s) => `\x1b[31m${s}\x1b[39m`,
      cyan: (s) => `\x1b[36m${s}\x1b[39m`,
    };

function loadGoldenPrompts() {
  return readdirSync(GOLDEN_DIR)
    .filter((file) => file.endsWith('.json') && file !== 'index.json')
    .map((file) => JSON.parse(readFileSync(join(GOLDEN_DIR, file), 'utf8')))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function selectedPrompts() {
  let prompts = loadGoldenPrompts();
  if (FILTER_DIFFICULTY)
    prompts = prompts.filter((prompt) => prompt.difficulty === FILTER_DIFFICULTY);
  if (FILTER_SLUG) prompts = prompts.filter((prompt) => prompt.slug === FILTER_SLUG);
  if (FILTER_SLUGS?.length) {
    const slugSet = new Set(FILTER_SLUGS);
    prompts = prompts.filter((prompt) => slugSet.has(prompt.slug));
  }
  return prompts;
}

function buildPassThroughArgs() {
  const ownFlagsWithValue = new Set([
    '--passes',
    '--pass-streak',
    '--max-rounds',
    '--slug',
    '--slugs',
    '--state-file',
  ]);
  const ownBooleanFlags = new Set(['--allow-cache', '--resume', '--reset-resume']);
  const passThrough = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (ownFlagsWithValue.has(arg)) {
      i++;
      continue;
    }
    if (ownBooleanFlags.has(arg)) {
      continue;
    }
    passThrough.push(arg);
  }

  if (!ALLOW_CACHE && !passThrough.includes('--fresh') && !passThrough.includes('--no-cache')) {
    passThrough.push('--fresh');
  }

  return passThrough;
}

function readResumeState(filePath) {
  if (!RESUME || RESET_RESUME || !existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    throw new Error(`Could not read resume state ${filePath}: ${err.message}`);
  }
}

function writeResumeState(filePath, state) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function buildResumeConfigSignature(prompts, passThroughArgs) {
  return {
    prompts: prompts.map((prompt) => prompt.slug),
    passes: PASS_TARGET,
    maxRounds: MAX_ROUNDS,
    difficulty: FILTER_DIFFICULTY ?? null,
    slug: FILTER_SLUG ?? null,
    slugs: FILTER_SLUGS ?? null,
    allowCache: ALLOW_CACHE,
    passThroughArgs,
  };
}

function sameResumeConfig(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runHardeningRound(slug, passThroughArgs, round) {
  const summaryFile = join(tmpdir(), `tale-ui-harden-${process.pid}-${slug}-${round}.json`);
  const proc = spawnSync(
    process.execPath,
    [
      FIX_REVIEW_SCRIPT,
      ...passThroughArgs,
      '--slug',
      slug,
      '--no-review',
      '--summary-file',
      summaryFile,
    ],
    {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  if (proc.stdout) {
    process.stdout.write(proc.stdout);
  }
  if (proc.stderr) {
    process.stderr.write(proc.stderr);
  }

  if (proc.error) throw proc.error;
  if (proc.status !== 0) {
    const details = [proc.stdout, proc.stderr].filter(Boolean).join('\n');
    if (isProviderQuotaMessage(details)) {
      throw providerQuotaError(details.slice(0, 500), { phase: 'hardening', slug });
    }
    throw new Error(`eval-fix-review exited with status ${proc.status} while hardening ${slug}.`);
  }
  if (!existsSync(summaryFile)) {
    throw new Error(`eval-fix-review did not write a summary file for ${slug}.`);
  }

  let summary;
  try {
    summary = JSON.parse(readFileSync(summaryFile, 'utf8'));
  } finally {
    try {
      unlinkSync(summaryFile);
    } catch {
      /* ignore */
    }
  }

  return summary;
}

async function main() {
  const prompts = selectedPrompts();
  if (prompts.length === 0) {
    throw new Error('No golden prompts matched the selected filters.');
  }

  const passThroughArgs = buildPassThroughArgs();
  const resumeConfig = buildResumeConfigSignature(prompts, passThroughArgs);
  const resumeState = readResumeState(STATE_FILE);
  if (resumeState && !sameResumeConfig(resumeState.config, resumeConfig)) {
    throw new Error(
      `Resume state ${STATE_FILE} was created with different hardening options. Use --reset-resume or a different --state-file.`,
    );
  }
  const promptState = { ...(resumeState?.promptState ?? {}) };
  const failures = [];

  const checkpoint = (status = 'in_progress') => {
    writeResumeState(STATE_FILE, {
      version: 1,
      status,
      updatedAt: new Date().toISOString(),
      config: resumeConfig,
      promptState,
      failures,
    });
  };

  console.log(
    C.bold(`\n=== Golden Prompt Hardening (${PASS_TARGET} clean pass(es) in a row) ===\n`),
  );
  console.log(C.dim(`Selected prompts: ${prompts.map((prompt) => prompt.slug).join(', ')}`));
  if (RESUME && resumeState) {
    console.log(C.dim(`Resume: ${relative(ROOT, STATE_FILE)}`));
  } else if (RESET_RESUME) {
    console.log(
      C.dim(`Ignoring previous resume state (--reset-resume): ${relative(ROOT, STATE_FILE)}`),
    );
  }
  if (!ALLOW_CACHE) {
    console.log(C.dim('Cache policy: fresh provider calls each round (--fresh).'));
  }

  for (const [index, prompt] of prompts.entries()) {
    let streak = promptState[prompt.slug]?.streak ?? 0;
    let round = promptState[prompt.slug]?.round ?? 0;
    if (promptState[prompt.slug]?.done) {
      console.log(
        `\n${C.bold(`[${index + 1}/${prompts.length}]`)} ${C.cyan(prompt.slug)} ` +
          C.green(`already hardened (${streak}/${PASS_TARGET})`),
      );
      continue;
    }
    console.log(
      `\n${C.bold(`[${index + 1}/${prompts.length}]`)} ${C.cyan(prompt.slug)} ` +
        C.dim(`target streak ${PASS_TARGET}`),
    );

    while (streak < PASS_TARGET && round < MAX_ROUNDS) {
      round++;
      console.log(
        `\n  ${C.bold(`Round ${round}/${MAX_ROUNDS}`)} ` +
          C.dim(`current clean streak: ${streak}/${PASS_TARGET}`),
      );

      const summary = runHardeningRound(prompt.slug, passThroughArgs, round);
      const cleanPass = summary.initialFailCount === 0 && summary.stillFailingCount === 0;

      if (cleanPass) {
        streak++;
        promptState[prompt.slug] = { streak, round, done: streak >= PASS_TARGET };
        console.log(`  ${C.green('✓ Clean pass')} (${streak}/${PASS_TARGET} in a row)`);
      } else {
        const failing = summary.stillFailingSlugs?.join(', ') || prompt.slug;
        const fixedNote = summary.fixedCount > 0 ? `; ${summary.fixedCount} fixed this round` : '';
        streak = 0;
        promptState[prompt.slug] = { streak, round, done: false };
        console.log(
          `  ${C.yellow('Streak reset')} (${summary.initialFailCount} initial failure(s)${fixedNote}; ` +
            `${summary.stillFailingCount} still failing: ${failing})`,
        );
      }
      checkpoint();
    }

    if (streak < PASS_TARGET) {
      failures.push(prompt.slug);
      promptState[prompt.slug] = { streak, round, done: false };
      checkpoint();
      console.log(
        `\n  ${C.red('✗ Hardening target not reached')} for ${prompt.slug} ` +
          C.dim(`after ${MAX_ROUNDS} round(s).`),
      );
    } else {
      promptState[prompt.slug] = { streak, round, done: true };
      checkpoint();
      console.log(`\n  ${C.green('✓ Hardened')} ${prompt.slug}`);
    }
  }

  if (failures.length > 0) {
    console.log(C.red(`\nHardening incomplete: ${failures.join(', ')}`));
    process.exit(1);
  }

  checkpoint('complete');
  console.log(C.green('\nHardening complete.'));
}

main().catch((err) => {
  if (isProviderQuotaError(err)) {
    console.error(C.red(`\nERROR: ${err.message}`));
  } else {
    console.error(err);
  }
  process.exit(1);
});
