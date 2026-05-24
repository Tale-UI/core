#!/usr/bin/env node
/**
 * eval-fix-review.mjs
 *
 * Full pipeline:
 *   1. Eval     — run all golden prompts, collect failures + generated code
 *   2. Fix      — for each failure, ask Claude to diagnose and patch the consumer snippet;
 *                 the fix model also returns a corrected code sample which is re-scored
 *                 deterministically (L1/L2/L3) — no fresh LLM generation per fix attempt
 *   3. Re-score — repeat fix+score up to MAX_ITER times until the corrected code passes
 *   4. Review   — write EvalReview.tsx, register the route, start playground, open browser
 *
 * Usage:
 *   node tools/eval-fix-review.mjs
 *   node tools/eval-fix-review.mjs --model sonnet
 *   node tools/eval-fix-review.mjs --difficulty simple
 *   node tools/eval-fix-review.mjs --slug primary-button
 *   node tools/eval-fix-review.mjs --no-fix        # skip fix loop, go straight to review
 *   node tools/eval-fix-review.mjs --no-review     # skip EvalReview.tsx generation + server
 *   node tools/eval-fix-review.mjs --no-serve      # generate review page but don't start server
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, mkdirSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, spawnSync, spawn } from 'child_process';
import { connect } from 'net';
import { tmpdir } from 'os';
import {
  buildCodexExecArgs,
  isProviderQuotaError,
  isProviderQuotaMessage,
  providerQuotaError,
  scoreCode,
} from './eval-golden-prompts-lib.mjs';
import {
  PITFALL_FIX_OPERATIONS,
  applyPitfallFixToSectionText,
  buildFixPreviewText,
  buildPitfallBlockTextFromFix,
  buildStructuredPitfallFromFix,
  extractSection,
  findPitfallBlockBySlug,
  formatPitfallOperationSpecsForPrompt,
  getPitfallBlocks,
  normalizeStringList,
  parsePitfallBlock,
  sanitizeTrailingDoubleBackticks,
  serializePitfallBlock,
  summaryReflectsPitfallSlug,
  summaryToSlug,
  validateFixPayload,
  validatePitfallPatchBlock,
  validateUpdatedPitfallSection,
} from './pitfall-patch-lib.mjs';
import {
  createPitfallSourceTargetResolver,
  normalizeTargetFileSlug,
} from './pitfall-source-target-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const IS_DIRECT_RUN =
  !!process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const SNIPPET_PATH = join(__dirname, '.eval-context.md');
const EVAL_SCRIPT = join(__dirname, 'eval-golden-prompts.mjs');
const REVIEW_COMPONENT = join(ROOT, 'playground/vite-app/src/demos/EvalReview.tsx');
const ROUTES_FILE = join(ROOT, 'playground/vite-app/src/routes.tsx');
const { resolveSectionTarget, resolveSourceTarget } = createPitfallSourceTargetResolver(ROOT);
const PATCH_ARTIFACT_RUN_DIR = join(
  __dirname,
  '.golden-patches',
  new Date().toISOString().replace(/[:.]/g, '-'),
);

/* ─── CLI args ────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const MODEL = getArg('--model') ?? 'sonnet';
const FIX_MODEL = getArg('--fix-model') ?? MODEL; // defaults to --model if not specified
const rawProvider = getArg('--provider') ?? 'claude'; // 'claude' | 'straico' | 'local' | 'ollama' | 'lm-studio' | 'codex'
const PROVIDER = rawProvider === 'ollama' || rawProvider === 'lm-studio' ? 'local' : rawProvider;
const LOCAL_URL =
  getArg('--local-url') ??
  (rawProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const rawFixProvider = getArg('--fix-provider') ?? rawProvider; // defaults to --provider if not specified
const FIX_PROVIDER =
  rawFixProvider === 'ollama' || rawFixProvider === 'lm-studio' ? 'local' : rawFixProvider;
const FIX_LOCAL_URL =
  getArg('--fix-local-url') ??
  (rawFixProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const LOCAL_API_KEY = process.env.LOCAL_API_KEY ?? 'ollama';
const FILTER_DIFFICULTY = getArg('--difficulty');
const FILTER_SLUG = getArg('--slug');
const FILTER_SLUGS =
  getArg('--slugs')
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? null;
const NO_FIX = hasFlag('--no-fix');
const NO_REVIEW = hasFlag('--no-review');
const NO_SERVE = hasFlag('--no-serve');
const SKIP_VALIDATE = hasFlag('--skip-validate');
const NO_CACHE = hasFlag('--no-cache');
const FRESH = hasFlag('--fresh');
const SUMMARY_FILE = getArg('--summary-file');
const STATE_FILE = getArg('--state-file') ?? join(__dirname, '.golden-fix-review-state.json');
const RESUME = hasFlag('--resume');
const RESET_RESUME = hasFlag('--reset-resume');
const EXIT_CODE_ON_FAIL = hasFlag('--exit-code-on-fail');
const UNTIL_PASS = hasFlag('--until-pass');
const SKIP_PITFALL_TRUTH = hasFlag('--skip-pitfall-truth');
const NO_SOURCE_PATCH = hasFlag('--no-source-patch');
const MCP_MODE = hasFlag('--mcp');
const EVAL_CONCURRENCY = parseInt(getArg('--concurrency') ?? (MCP_MODE ? '3' : '5'), 10);
const MCP_MAX_TURNS = parseInt(getArg('--mcp-max-turns') ?? '5', 10);
const MAX_ITER = UNTIL_PASS
  ? getArg('--max-iter')
    ? parseInt(getArg('--max-iter'), 10)
    : Infinity
  : parseInt(getArg('--max-iter') ?? '3', 10);
const MAX_SOURCE_PATCH_ATTEMPTS = parseInt(getArg('--max-source-patch-attempts') ?? '3', 10);
// Use a port outside the dev:all range (5173 = playground, 5174 = scale, 6006 = storybook)
const PREFERRED_PORT = 5190;

/* ─── Terminal colors ─────────────────────────────────────────────────────── */

const NO_COLOR = process.env.NO_COLOR !== undefined || !process.stdout.isTTY;
const C = NO_COLOR
  ? {
      bold: (s) => s,
      dim: (s) => s,
      red: (s) => s,
      green: (s) => s,
      yellow: (s) => s,
      cyan: (s) => s,
      magenta: (s) => s,
      blue: (s) => s,
    }
  : {
      bold: (s) => `\x1b[1m${s}\x1b[22m`,
      dim: (s) => `\x1b[2m${s}\x1b[22m`,
      red: (s) => `\x1b[31m${s}\x1b[39m`,
      green: (s) => `\x1b[32m${s}\x1b[39m`,
      yellow: (s) => `\x1b[33m${s}\x1b[39m`,
      cyan: (s) => `\x1b[36m${s}\x1b[39m`,
      magenta: (s) => `\x1b[35m${s}\x1b[39m`,
      blue: (s) => `\x1b[34m${s}\x1b[39m`,
    };

function loadGoldenPrompts() {
  return readdirSync(join(__dirname, 'golden-prompts'))
    .filter((f) => f.endsWith('.json') && f !== 'index.json')
    .map((f) => JSON.parse(readFileSync(join(__dirname, 'golden-prompts', f), 'utf8')));
}

const GOLDEN_PROMPTS = loadGoldenPrompts();

/* ─── Provider setup ─────────────────────────────────────────────────────── */

function findClaude() {
  const candidates = [
    process.env.CLAUDE_PATH,
    join(process.env.HOME ?? '', '.local/bin/claude'),
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
  ].filter(Boolean);
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  try {
    return execFileSync('which', ['claude'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function findCodex() {
  const candidates = [
    process.env.CODEX_PATH,
    join(process.env.HOME ?? '', '.local/bin/codex'),
    '/usr/local/bin/codex',
    '/opt/homebrew/bin/codex',
  ].filter(Boolean);
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  try {
    return execFileSync('which', ['codex'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

// Straico shorthands — mirrors eval-golden-prompts.mjs
// Full model list: https://straico.com/multimodel/
const STRAICO_MODEL_ALIASES = {
  // Anthropic
  sonnet: 'anthropic/claude-sonnet-4.5',
  'sonnet-4': 'anthropic/claude-sonnet-4',
  'sonnet-4.5': 'anthropic/claude-sonnet-4.5',
  opus: 'claude-opus-4-5',
  'opus-4': 'anthropic/claude-opus-4',
  'opus-4.5': 'claude-opus-4-5',
  haiku: 'claude-haiku-4-5-5',
  // OpenAI
  'gpt-4o': 'openai/gpt-4o-2024-11-20',
  'gpt-4o-mini': 'openai/gpt-4o-mini',
  'gpt-4.1': 'openai/gpt-4.1',
  'gpt-4.1-mini': 'openai/gpt-4.1-mini',
  'gpt-4.1-nano': 'openai/gpt-4.1-nano',
  'gpt-5': 'openai/gpt-5',
  'gpt-5-mini': 'openai/gpt-5-mini',
  o3: 'o3-2025-04-16',
  'o4-mini': 'openai/o4-mini',
  // Google
  'gemini-flash': 'google/gemini-2.5-flash-lite',
  'gemini-pro': 'google/gemini-3.1-pro-preview',
  // DeepSeek
  deepseek: 'deepseek/deepseek-chat-v3.1',
  'deepseek-r1': 'deepseek/deepseek-r1',
  // Meta
  llama4: 'meta-llama/llama-4-maverick',
  // xAI
  grok4: 'x-ai/grok-4',
  grok3: 'x-ai/grok-3-beta',
};

// Codex shorthands — mirrors eval-golden-prompts.mjs
const CODEX_MODEL_ALIASES = {
  'o4-mini': 'o4-mini',
  o3: 'o3',
  'o3-mini': 'o3-mini',
  'gpt-4.1': 'gpt-4.1',
  'gpt-4.1-mini': 'gpt-4.1-mini',
  'gpt-4.1-nano': 'gpt-4.1-nano',
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-5': 'gpt-5',
  'gpt-5-mini': 'gpt-5-mini',
  'gpt-5.4': 'gpt-5.4',
  'gpt-5.4-mini': 'gpt-5.4-mini',
};

let CLAUDE_BIN = null;
let CODEX_BIN = null;
let STRAICO_API_KEY = null;
let STRAICO_FIX_MODEL = null;

if (PROVIDER === 'straico' || FIX_PROVIDER === 'straico') {
  STRAICO_API_KEY = process.env.STRAICO_API_KEY;
  if (!STRAICO_API_KEY) {
    console.error('ERROR: STRAICO_API_KEY environment variable is not set.');
    process.exit(1);
  }
  STRAICO_FIX_MODEL = STRAICO_MODEL_ALIASES[FIX_MODEL] ?? FIX_MODEL;
}

if (PROVIDER === 'claude' || FIX_PROVIDER === 'claude') {
  CLAUDE_BIN = findClaude();
  if (!CLAUDE_BIN) {
    console.error('ERROR: Claude Code CLI not found.');
    process.exit(1);
  }
}

if (PROVIDER === 'codex' || FIX_PROVIDER === 'codex') {
  CODEX_BIN = findCodex();
  if (!CODEX_BIN) {
    console.error('ERROR: Codex CLI not found.');
    console.error(
      'Install it from https://github.com/openai/codex or set CODEX_PATH to the binary location.',
    );
    process.exit(1);
  }
}

// --mcp is forwarded to eval-golden-prompts.mjs, which handles provider-specific MCP wiring.

/* ─── Run eval ────────────────────────────────────────────────────────────── */

function getEvalPromptCount(slugs = null) {
  let prompts = GOLDEN_PROMPTS;
  if (FILTER_DIFFICULTY)
    prompts = prompts.filter((prompt) => prompt.difficulty === FILTER_DIFFICULTY);
  if (FILTER_SLUG) prompts = prompts.filter((prompt) => prompt.slug === FILTER_SLUG);
  if (FILTER_SLUGS?.length) {
    const filterSlugSet = new Set(FILTER_SLUGS);
    prompts = prompts.filter((prompt) => filterSlugSet.has(prompt.slug));
  }
  if (slugs?.length) {
    const slugSet = new Set(slugs);
    prompts = prompts.filter((prompt) => slugSet.has(prompt.slug));
  }
  return Math.max(prompts.length, slugs?.length ?? 1);
}

function getPerPromptEvalBudgetMs() {
  if (PROVIDER === 'local') return MCP_MODE ? 600000 : 365000; // 10 min with MCP tool loop, 6 min without
  if (PROVIDER === 'straico') return 370000;
  if (PROVIDER === 'codex') return MCP_MODE ? 180000 : 120000;
  return MCP_MODE ? 180000 : 90000;
}

function getRunEvalTimeoutMs(slugs = null) {
  const promptCount = getEvalPromptCount(slugs);
  const concurrency = Math.max(EVAL_CONCURRENCY, 1);
  const batches = Math.ceil(promptCount / concurrency);
  const estimatedMs = batches * getPerPromptEvalBudgetMs() + 300000;
  return Math.max(900000, Math.min(estimatedMs, 4 * 60 * 60 * 1000));
}

function runEval(slugs = null, { skipGenerate = false } = {}) {
  const extraArgs = [];
  extraArgs.push('--model', MODEL);
  extraArgs.push('--provider', PROVIDER);
  extraArgs.push('--concurrency', String(EVAL_CONCURRENCY));
  if (PROVIDER === 'local') extraArgs.push('--local-url', LOCAL_URL);
  if (FILTER_DIFFICULTY) extraArgs.push('--difficulty', FILTER_DIFFICULTY);
  if (slugs?.length) {
    extraArgs.push('--slugs', slugs.join(','));
  } else if (FILTER_SLUGS?.length) {
    extraArgs.push('--slugs', FILTER_SLUGS.join(','));
  } else if (FILTER_SLUG) {
    extraArgs.push('--slug', FILTER_SLUG);
  }
  if (NO_CACHE) extraArgs.push('--no-cache');
  if (FRESH) extraArgs.push('--fresh');
  if (skipGenerate) extraArgs.push('--skip-generate');
  extraArgs.push('--quiet-passing'); // hide passing one-liners; fix-review only cares about failures
  if (MCP_MODE) {
    extraArgs.push('--mcp');
    extraArgs.push('--mcp-max-turns', String(MCP_MAX_TURNS));
  }

  // Progress lines go to stderr (visible in terminal), JSON result to stdout.
  // Scale the wrapper timeout to the prompt count and provider budget so long-running
  // MCP runs do not get killed before the child process reaches its own per-prompt limits.
  const proc = spawnSync(process.execPath, [EVAL_SCRIPT, '--json', ...extraArgs], {
    cwd: ROOT,
    timeout: getRunEvalTimeoutMs(slugs),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (proc.stderr) {
    process.stderr.write(proc.stderr);
  }

  if (proc.error) throw new Error(`Eval script failed: ${proc.error.message}`);
  if (proc.status !== 0) {
    const details = [proc.stdout, proc.stderr].filter(Boolean).join('\n');
    if (isProviderQuotaMessage(details)) {
      throw providerQuotaError(details.slice(0, 500), { phase: 'eval' });
    }
    throw new Error(`Eval script exited with status ${proc.status}.`);
  }
  if (!proc.stdout?.trim())
    throw new Error('Eval script produced no output — it may have timed out or crashed.');
  const evalResult = JSON.parse(proc.stdout);
  assertNoProviderQuotaFailures(evalResult);
  return evalResult;
}

function runPitfallTruthAudit() {
  execFileSync(process.execPath, [join(__dirname, 'audit-pitfall-truth.mjs')], {
    cwd: ROOT,
    timeout: 30000,
    encoding: 'utf8',
    stdio: 'inherit',
  });
}

function runPitfallShapeAutoFix() {
  try {
    execFileSync(process.execPath, [join(__dirname, 'audit-pitfall-shape.mjs'), '--fix'], {
      cwd: ROOT,
      timeout: 30000,
      encoding: 'utf8',
      stdio: 'inherit',
    });
  } catch {
    // --fix exits non-zero when non-mechanical violations remain (multi-idea summaries,
    // missing sub-bullets, etc.) — those are caught by the blocking runPitfallShapeAudit.
    // Swallow here so the auto-fix pass never blocks the preflight on its own.
  }
}

function runPitfallShapeAudit() {
  execFileSync(process.execPath, [join(__dirname, 'audit-pitfall-shape.mjs')], {
    cwd: ROOT,
    timeout: 30000,
    encoding: 'utf8',
    stdio: 'inherit',
  });
}

function runGoldenPatchabilityAudit() {
  try {
    execFileSync(process.execPath, [join(__dirname, 'audit-golden-patchability.mjs')], {
      cwd: ROOT,
      timeout: 15000,
      encoding: 'utf8',
      stdio: 'inherit',
    });
  } catch {
    console.log(C.yellow('  ⚠ Some tagged components are not fully patch-ready (see above).'));
  }
}

/* ─── Fix loop ────────────────────────────────────────────────────────────── */

function buildErrorSummary(result) {
  const lines = [];
  if (!result.l1.pass)
    lines.push(
      `L1 (validation/policy errors):\n${result.l1.errors.map((e) => `  - ${e}`).join('\n')}`,
    );
  if (!result.l2.pass) lines.push(`L2 (missing components): ${result.l2.missing.join(', ')}`);
  if (!result.l3.pass) lines.push(`L3 (forbidden imports): ${result.l3.forbidden.join(', ')}`);
  return lines.join('\n');
}

function fixHasStructuredSourcePatch(fix) {
  return (
    !!fix.summary?.trim() ||
    !!fix.details?.trim() ||
    normalizeStringList(fix.antiPatterns).length > 0 ||
    normalizeStringList(fix.fixes).length > 0 ||
    !!fix.completeExample?.trim()
  );
}

function assertNoProviderQuotaFailures(evalResult) {
  const quotaFailure = evalResult?.results?.find((result) =>
    result?.l1?.errors?.some((error) => isProviderQuotaMessage(error)),
  );
  if (quotaFailure) {
    throw providerQuotaError('stop this run and retry after the provider reset', {
      phase: 'eval',
      slug: quotaFailure.slug,
    });
  }
}

function shouldStopSourcePatchRetries(failedAttemptCount, maxAttempts = MAX_SOURCE_PATCH_ATTEMPTS) {
  return Number.isFinite(maxAttempts) && failedAttemptCount >= maxAttempts;
}

function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function formatPatchTargetIndexEntry({ id, section, targetFile, summary }) {
  return `  - id: ${id} | section: ${section} | targetFile: ${targetFile} | summary: ${summary}`;
}

function buildPatchTargetIndex() {
  const entries = [];
  const sharedRegistry = readJsonFile(join(ROOT, 'registry/pitfalls.json'), {});

  for (const pitfall of sharedRegistry.crossComponentPitfalls ?? []) {
    if (!pitfall?.id || !pitfall?.summary) continue;
    entries.push({
      id: pitfall.id,
      section: `cross:${pitfall.category ?? 'general'}`,
      targetFile: 'docs/pitfalls.md',
      summary: pitfall.summary,
    });
  }

  for (const pitfall of sharedRegistry.generalConventions ?? []) {
    if (!pitfall?.id || !pitfall?.summary) continue;
    entries.push({
      id: pitfall.id,
      section: 'general',
      targetFile: 'docs/pitfalls.md',
      summary: pitfall.summary,
    });
  }

  const componentRegistry = readJsonFile(join(ROOT, 'registry/components.json'), {});
  for (const component of componentRegistry.components ?? []) {
    for (const pitfall of component.pitfalls ?? []) {
      if (!component?.name || !component?.slug || !pitfall?.id || !pitfall?.summary) continue;
      entries.push({
        id: pitfall.id,
        section: `component:${component.name}`,
        targetFile: component.slug,
        summary: pitfall.summary,
      });
    }
  }

  return entries
    .sort((a, b) => `${a.section}:${a.id}`.localeCompare(`${b.section}:${b.id}`))
    .map(formatPatchTargetIndexEntry)
    .join('\n');
}

function buildFixPrompt(result, failedPatchReasons = [], tags = []) {
  const snippet = readFileSync(SNIPPET_PATH, 'utf8');

  // Extract just the pitfalls section to keep the prompt short
  const pitfallsMatch = snippet.match(
    /5\. \*\*Common pitfalls\*\*[\s\S]*?(?=\n\d+\. \*\*|\n---|$)/,
  );
  const pitfallsSection = pitfallsMatch ? pitfallsMatch[0] : snippet;

  const failedHint =
    failedPatchReasons.length > 0
      ? `\nIMPORTANT: Previous fix payloads were rejected for these reasons — correct them in the next JSON response:\n${failedPatchReasons.map((s) => `  - ${s}`).join('\n')}\n`
      : '';

  const tagsHint =
    tags.length > 0
      ? `\nRequired components (L2 — these must appear in the code): ${tags.join(', ')}`
      : '';
  const patchOperationRules = formatPitfallOperationSpecsForPrompt();
  const patchTargetIndex = buildPatchTargetIndex();

  return `You are improving Tale UI documentation to prevent AI code generation errors.

A prompt was given to an AI agent:
"${result.prompt ?? ''}"

The agent generated this code:
\`\`\`tsx
${result.code ?? ''}
\`\`\`

The following errors were detected:
${buildErrorSummary(result)}
${tagsHint}
Allowed import prefixes (L3 — all imports must start with one of these):
  @tale-ui/react, @tale-ui/charts, react, lucide-react, @internationalized/

Current documentation (pitfalls section):
${pitfallsSection}
${failedHint}
Patch target index (copy existing IDs exactly; do not derive or invent targetPitfallSlug values):
${patchTargetIndex}

Identify the exact rule that is missing or unclear in the pitfalls section that caused this error.
The "old" value MUST be a substring that appears verbatim in the documentation above, or empty string "" to append a new bullet.
The "section" field identifies which documentation area the fix targets: "general" for general conventions, "cross:{category}" (e.g. "cross:trigger-styling") for cross-component pitfalls, or "component:{Name}" (e.g. "component:Dialog") for per-component pitfalls.
The "scope" field classifies whether the rule applies broadly or narrowly:
  - "cross-cutting": the rule applies to many or all components (e.g. Row/Column gap values, namespace vs simple, trigger styling, import path conventions). These go in the general conventions or cross-component sections of docs/pitfalls.md.
  - "component-specific": the rule only applies to one component's API (e.g. "TextArea uses TextArea.TextArea not TextArea.Textarea"). These go in the per-component section.
Patch-shape rules:
${patchOperationRules}
  - "targetFile" must agree with "section". For per-component fixes, "targetFile" must be the component doc slug (for example "image-cropper").
  - For "replace_pitfall" and "replace_subbullets", "targetPitfallSlug" must be copied from the Patch target index "id" field.
  - For replacement operations, "old" is optional. Use "old": "" if you cannot copy exact source markdown from the current documentation.
  - Only use "append_pitfall" when no existing Patch target index entry covers the rule. Do not append a near-duplicate of an existing summary.
  - Never switch to "append_pitfall" when updating a listed Patch target index ID; keep "replace_subbullets" and the existing "targetPitfallSlug".
Structured pitfall content rules:
  - Fill "summary", "details", "antiPatterns", "fixes", and "completeExample" with structured content for the resulting pitfall block.
  - "summary" must be plain text only, without markdown bold markers.
  - "details" must be plain text only, without the leading em dash.
  - Each entry in "antiPatterns" and "fixes" must be a single inline code snippet string with no surrounding markdown backticks.
  - "completeExample" must be plain TSX code only, with no markdown fences. Use empty string if there is no example.
  - The "new" field is deprecated. Leave it as an empty string; markdown in "new" is ignored by the patcher.
Output a JSON fix in this exact format (no other text, just the JSON):
{
  "diagnosis": "one sentence explaining the root cause",
  "scope": "cross-cutting | component-specific",
  "section": "general | cross:{category} | component:{ComponentName}",
  "targetFile": "docs/pitfalls.md | component doc slug like image-cropper",
  "targetPitfallSlug": "existing pitfall slug being updated, or empty string when appending a new pitfall",
  "newPitfallSlug": "slug for append_pitfall, or empty string for non-append operations",
  "operation": "replace_pitfall | replace_subbullets | append_pitfall",
  "old": "exact verbatim substring from the documentation above, used only as a verification hint for replace operations, or empty string for append",
  "summary": "plain summary text for the resulting pitfall",
  "details": "plain explanatory text that appears after the summary em dash",
  "antiPatterns": ["inline code snippet string 1", "inline code snippet string 2"],
  "fixes": ["inline code snippet string 1", "inline code snippet string 2"],
  "completeExample": "optional TSX code only, no markdown fences",
  "new": "",
  "fixedCode": "a complete corrected version of the code above that addresses the diagnosed root cause — valid TSX with all necessary imports, no markdown fences"
}`;
}

async function getFix(result, failedPatchReasons = [], tags = []) {
  const fixPrompt = buildFixPrompt(result, failedPatchReasons, tags);

  let text;

  if (FIX_PROVIDER === 'straico') {
    const MAX_RETRIES = 3;
    let lastErr;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const response = await fetch('https://api.straico.com/v0/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAICO_API_KEY}`,
        },
        body: JSON.stringify({
          model: STRAICO_FIX_MODEL,
          max_tokens: 4096,
          messages: [
            { role: 'system', content: fixPrompt },
            {
              role: 'user',
              content:
                'Output only the JSON fix object as instructed. No explanation, no markdown fences.',
            },
          ],
        }),
      });
      if (!response.ok) {
        const body = await response.text();
        if (response.status === 500 && body.includes('Excessively l')) {
          throw new Error(
            `Straico: fix prompt exceeds model context window for ${STRAICO_FIX_MODEL}.`,
          );
        }
        if (
          (response.status === 502 || response.status === 503 || response.status === 504) &&
          attempt < MAX_RETRIES
        ) {
          lastErr = new Error(`Straico API error (${response.status})`);
          await new Promise((r) => setTimeout(r, attempt * 2000));
          continue;
        }
        throw new Error(`Straico API error (${response.status}): ${body.slice(0, 200)}`);
      }
      const json = await response.json();
      const completion = json.data?.completion ?? json.completion ?? json;
      text = completion?.choices?.[0]?.message?.content ?? '';
      lastErr = null;
      break;
    }
    if (lastErr) throw lastErr;
  } else if (FIX_PROVIDER === 'local') {
    const MAX_RETRIES = 2;
    let lastErr;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      let response;
      try {
        response = await fetch(`${FIX_LOCAL_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${LOCAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: FIX_MODEL,
            max_tokens: 4096,
            messages: [
              { role: 'system', content: fixPrompt },
              {
                role: 'user',
                content:
                  'Output only the JSON fix object as instructed. No explanation, no markdown fences.',
              },
            ],
          }),
          signal: AbortSignal.timeout(180000),
        });
      } catch (err) {
        if (err.cause?.code === 'ECONNREFUSED') {
          throw new Error(
            `Local LLM not reachable at ${FIX_LOCAL_URL}. Is Ollama / LM Studio running?`,
          );
        }
        if (attempt < MAX_RETRIES) {
          lastErr = err;
          await new Promise((r) => setTimeout(r, attempt * 2000));
          continue;
        }
        throw err;
      }
      if (!response.ok) {
        const body = await response.text();
        if (attempt < MAX_RETRIES) {
          lastErr = new Error(`Local LLM error (${response.status})`);
          await new Promise((r) => setTimeout(r, attempt * 2000));
          continue;
        }
        throw new Error(`Local LLM error (${response.status}): ${body.slice(0, 200)}`);
      }
      const json = await response.json();
      text = json.choices?.[0]?.message?.content ?? '';
      lastErr = null;
      break;
    }
    if (lastErr) throw lastErr;
  } else if (FIX_PROVIDER === 'codex') {
    const codexFixModel = CODEX_MODEL_ALIASES[FIX_MODEL] ?? FIX_MODEL;
    const fullPrompt = `${fixPrompt}\n\n---\n\nOutput only the JSON fix object as instructed. No explanation, no markdown fences.`;
    const MAX_RETRIES = 3;
    let lastErr;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const outputFile = join(
        tmpdir(),
        `tale-ui-fix-codex-${process.pid}-${Date.now()}-${attempt}.txt`,
      );
      try {
        const proc = spawnSync(
          CODEX_BIN,
          buildCodexExecArgs({ model: codexFixModel, outputFile }),
          {
            cwd: ROOT,
            timeout: 180000,
            encoding: 'utf8',
            input: fullPrompt,
          },
        );
        if (proc.error) throw proc.error;
        const outputText = existsSync(outputFile) ? readFileSync(outputFile, 'utf8').trim() : '';
        const stdoutText = proc.stdout?.trim() ?? '';
        const stderrText = proc.stderr?.trim() ?? '';
        const details = [outputText, stdoutText, stderrText].filter(Boolean).join('\n');
        try {
          unlinkSync(outputFile);
        } catch {
          /* ignore */
        }
        if (isProviderQuotaMessage(details)) {
          throw providerQuotaError(details.slice(0, 400), { provider: 'Codex', phase: 'fix' });
        }
        if (proc.status !== 0) {
          throw new Error(`Codex CLI exited with status ${proc.status}: ${details.slice(0, 400)}`);
        }
        text = outputText || stdoutText;
        if (!text) {
          if (proc.status && details) {
            throw new Error(
              `Codex CLI exited with status ${proc.status}: ${details.slice(0, 400)}`,
            );
          }
          if (details)
            throw new Error(`Codex did not produce a fix payload: ${details.slice(0, 400)}`);
          throw new Error('Codex did not write output file');
        }
        lastErr = null;
        break;
      } catch (err) {
        if (isProviderQuotaError(err)) {
          throw err;
        }
        lastErr = err;
        if (attempt < MAX_RETRIES) {
          console.log(`    (Codex CLI attempt ${attempt} failed: ${err.message} — retrying...)`);
          await new Promise((r) => setTimeout(r, attempt * 3000));
        }
      }
    }
    if (lastErr) throw lastErr;
  } else {
    const tmpFile = join(tmpdir(), `tale-ui-fix-prompt-${process.pid}.md`);
    writeFileSync(tmpFile, fixPrompt, 'utf8');
    const MAX_RETRIES = 3;
    let lastErr;
    try {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const raw = execFileSync(
            CLAUDE_BIN,
            [
              '--print',
              '--no-session-persistence',
              '--model',
              FIX_MODEL,
              '--append-system-prompt-file',
              tmpFile,
              '--output-format',
              'json',
              'Output only the JSON fix object as instructed. No explanation, no markdown fences.',
            ],
            { cwd: tmpdir(), timeout: 180000, encoding: 'utf8' },
          );
          const parsed = JSON.parse(raw);
          if (parsed.is_error || isProviderQuotaMessage(parsed.result ?? '')) {
            const message = parsed.result ?? 'Claude CLI reported an error';
            if (isProviderQuotaMessage(message)) {
              throw providerQuotaError(message, { provider: 'Claude', phase: 'fix' });
            }
            throw new Error(`Claude CLI reported is_error: ${message}`);
          }
          text = parsed.result ?? '';
          lastErr = null;
          break;
        } catch (err) {
          const details = [err.message, err.stdout, err.stderr]
            .filter(Boolean)
            .map((value) => String(value))
            .join('\n');
          if (isProviderQuotaMessage(details)) {
            throw providerQuotaError(details.slice(0, 400), { provider: 'Claude', phase: 'fix' });
          }
          lastErr = err;
          if (attempt < MAX_RETRIES) {
            console.log(
              `    (Claude CLI attempt ${attempt} failed: ${err.code ?? err.message} — retrying...)`,
            );
            await new Promise((r) => setTimeout(r, attempt * 3000));
          }
        }
      }
      if (lastErr) throw lastErr;
    } finally {
      try {
        execFileSync('rm', [tmpFile]);
      } catch {
        /* ignore */
      }
    }
  }

  // Extract JSON from the response (may be wrapped in fences)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  const parsedFix = JSON.parse(jsonMatch[0]);
  if (typeof parsedFix.targetFile !== 'string') parsedFix.targetFile = '';
  if (typeof parsedFix.targetPitfallSlug !== 'string') parsedFix.targetPitfallSlug = '';
  if (typeof parsedFix.newPitfallSlug !== 'string') parsedFix.newPitfallSlug = '';
  if (typeof parsedFix.summary !== 'string') parsedFix.summary = '';
  if (typeof parsedFix.details !== 'string') parsedFix.details = '';
  if (!Array.isArray(parsedFix.antiPatterns)) parsedFix.antiPatterns = [];
  if (!Array.isArray(parsedFix.fixes)) parsedFix.fixes = [];
  if (typeof parsedFix.completeExample !== 'string') parsedFix.completeExample = '';
  if (!PITFALL_FIX_OPERATIONS.has(parsedFix.operation)) {
    parsedFix.operation = parsedFix.old?.trim() ? 'replace_pitfall' : 'append_pitfall';
  }
  return parsedFix;
}

/* ─── Source-aware pitfall patching ─────────────────────────────────────── */

/**
 * Apply a fix to the actual pitfall source file.
 * Returns true if the source file was patched, false if skipped.
 */
function applySourceFix(fix, evalContextContent) {
  applySourceFix.lastError = '';
  const target = resolveSourceTarget(fix, evalContextContent);
  if (!target) {
    applySourceFix.lastError = `could not resolve target (section=${fix.section ?? 'none'}, targetFile=${fix.targetFile ?? 'none'})`;
    console.log(
      `      ${C.yellow('⚠ Source: could not resolve target')} (section=${fix.section ?? 'none'}, old=${JSON.stringify((fix.old ?? '').slice(0, 60))})`,
    );
    return false;
  }
  if (!existsSync(target.filePath)) {
    applySourceFix.lastError = `file not found: ${target.filePath}`;
    console.log(`      ${C.yellow('⚠ Source: file not found:')} ${target.filePath}`);
    return false;
  }

  // Sanitise the fix text before writing: the model sometimes produces a trailing
  // double-backtick like `<Row justify="between">`` (closing backtick + stray backtick).
  // Collapse any repeated trailing backticks to a single closing backtick to keep
  // anti-pattern/fix sub-bullets valid when the model over-closes inline code.
  if (fix.new) fix.new = sanitizeTrailingDoubleBackticks(fix.new);

  let fileContent = readFileSync(target.filePath, 'utf8');
  let section = extractSection(fileContent, target.sectionHeading);
  if (!section) {
    if (target.isComponent && target.sectionHeading === 'Pitfalls') {
      console.log(`      ${C.dim('Auto-creating ## Pitfalls section in')} ${target.filePath}`);
      fileContent = fileContent.trimEnd() + '\n\n## Pitfalls\n';
      writeFileSync(target.filePath, fileContent, 'utf8');
      section = extractSection(fileContent, 'Pitfalls');
    }
    if (!section) {
      applySourceFix.lastError = `no '## ${target.sectionHeading}' section in ${target.filePath}`;
      console.log(
        `      ${C.yellow(`⚠ Source: no '## ${target.sectionHeading}' section in`)} ${target.filePath}`,
      );
      return false;
    }
  }

  const buildUpdatedFile = (updatedSection) =>
    sanitizeTrailingDoubleBackticks(
      fileContent.slice(0, section.sectionStart) +
        updatedSection +
        fileContent.slice(section.sectionEnd),
    );
  const result = applyPitfallFixToSectionText(section.sectionText, fix, target, target.filePath);
  if (result.error) {
    applySourceFix.lastError = result.error;
    const [message, ...detailLines] = result.error.split('\n');
    console.log(`      ${C.yellow(`⚠ Source: ${message}`)}`);
    if (detailLines.length > 0) {
      console.log(`        ${C.dim(detailLines.join('\n'))}`);
    }
    return false;
  }

  for (const warning of result.warnings ?? []) {
    console.log(`      ${C.yellow('⚠ Source warning:')} ${warning}`);
  }
  writeFileSync(target.filePath, buildUpdatedFile(result.updatedSection), 'utf8');
  return target.filePath;
}

/* ─── Docs diff display ──────────────────────────────────────────────────── */

/**
 * Show what changed in the documentation files during this run.
 * Only diffs files that were actually written by this run's fix loop.
 * Source docs are tracked by git — use `git diff` for colour output.
 */
function showDocsPatch(modifiedFiles = new Set()) {
  const separator = C.dim('─'.repeat(64));
  console.log(`\n${separator}`);

  if (modifiedFiles.size === 0) {
    console.log(C.dim('  No documentation changes.'));
    console.log(
      C.dim('  (All source patches were skipped — check the ⚠ lines above for details.)'),
    );
    console.log(separator);
    return;
  }

  // Only diff the specific files touched this run, not the entire docs tree.
  const sourceDiff =
    spawnSync('git', ['diff', '--color=always', '--', ...modifiedFiles], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 10000,
    }).stdout?.trim() ?? '';

  if (!sourceDiff) {
    console.log(C.dim('  No documentation changes.'));
    console.log(
      C.dim('  (All source patches were skipped — check the ⚠ lines above for details.)'),
    );
  } else {
    console.log(C.bold('  Source docs changed this run:'));
    console.log('');
    console.log(sourceDiff);
  }
  console.log(separator);
}

function writeSummaryFile(summary) {
  if (!SUMMARY_FILE) return;
  writeFileSync(SUMMARY_FILE, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
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

function buildResumeConfigSignature(slugs) {
  return {
    prompts: slugs,
    provider: PROVIDER,
    model: MODEL,
    fixProvider: FIX_PROVIDER,
    fixModel: FIX_MODEL,
    difficulty: FILTER_DIFFICULTY ?? null,
    slug: FILTER_SLUG ?? null,
    slugs: FILTER_SLUGS ?? null,
    mcp: MCP_MODE,
    mcpMaxTurns: MCP_MAX_TURNS,
    noFix: NO_FIX,
    noSourcePatch: NO_SOURCE_PATCH,
  };
}

function sameResumeConfig(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function safeArtifactName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

function savePatchArtifact(fix, { status, slug, attempt, reason = '' }) {
  const statusDir = join(PATCH_ARTIFACT_RUN_DIR, status);
  mkdirSync(statusDir, { recursive: true });
  const fileName = `${safeArtifactName(slug)}-${String(attempt).padStart(2, '0')}.json`;
  const filePath = join(statusDir, fileName);
  const payload = {
    ...fix,
    __meta: {
      status,
      slug,
      attempt,
      reason,
      createdAt: new Date().toISOString(),
    },
  };
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return filePath;
}

function formatPatchReplayCommand(filePath) {
  return `pnpm pitfalls:patch -- --json ${relative(ROOT, filePath)} --dry-run`;
}

/* ─── EvalReview.tsx generation ──────────────────────────────────────────── */

/**
 * Parse all import statements from a code block, handling both
 * single-line and multi-line forms. Returns a list of {names, pkg, isType} entries.
 */
function parseImports(code) {
  const results = [];
  const lines = code.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Start of an import statement
    const isType = /^import\s+type\s+\{/.test(line);
    if (isType || /^import\s+\{/.test(line)) {
      // Collect lines until we see `from '...'` or `from "..."`
      let block = '';
      while (i < lines.length) {
        block += lines[i] + '\n';
        if (/from\s+['"][^'"]+['"]\s*;?\s*$/.test(lines[i])) {
          i++;
          break;
        }
        i++;
      }
      // Extract the names block and package
      const namesMatch = block.match(/\{([\s\S]*?)\}/);
      const pkgMatch = block.match(/from\s+['"]([^'"]+)['"]/);
      if (namesMatch && pkgMatch) {
        const names = namesMatch[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        results.push({ names, pkg: pkgMatch[1], isType });
      }
    } else {
      i++;
    }
  }
  return results;
}

function parseImportSpec(spec) {
  const trimmed = spec.trim();
  const aliasMatch = trimmed.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
  if (aliasMatch) {
    return { imported: aliasMatch[1], local: aliasMatch[2], raw: trimmed };
  }
  return { imported: trimmed, local: trimmed, raw: trimmed };
}

function makeImportAlias(pkg, imported, usedNames) {
  const base =
    pkg === 'lucide-react'
      ? `Lucide${imported}`
      : `${pkg
          .split('/')
          .filter(Boolean)
          .at(-1)
          .replace(/[^a-zA-Z0-9_$]/g, '')
          .replace(/^\w/, (c) => c.toUpperCase())}${imported}`;
  let alias = base;
  let suffix = 2;
  while (usedNames.has(alias)) {
    alias = `${base}${suffix}`;
    suffix += 1;
  }
  usedNames.add(alias);
  return alias;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceIdentifier(body, from, to) {
  return body.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, 'g'), to);
}

function replaceIdentifierReference(body, from, to) {
  return body.replace(new RegExp(`\\b${escapeRegExp(from)}\\b(?!\\s*[=:])`, 'g'), to);
}

function rewriteImportBlock(block, replacements) {
  const namesMatch = block.match(/\{([\s\S]*?)\}/);
  if (!namesMatch) {
    return block;
  }

  const rewrittenNames = namesMatch[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((spec) => {
      const parsed = parseImportSpec(spec);
      const alias = replacements.get(`${parsed.imported}:${parsed.local}`);
      return alias ? `${parsed.imported} as ${alias}` : spec;
    });

  return block.replace(/\{([\s\S]*?)\}/, `{ ${rewrittenNames.join(', ')} }`);
}

/**
 * Generated snippets are validated individually, but EvalReview.tsx merges all
 * snippets into one module. If two snippets import the same local name from
 * different packages, the merged module can accidentally bind usages to the
 * wrong component (e.g. lucide-react `Image` versus Tale UI `Image`). Alias the
 * losing import and rewrite that snippet's body before merging.
 */
function aliasImportNameCollisions(codeBlocks) {
  const importsByLocalName = new Map();
  const usedNames = new Set();

  for (const [blockIndex, code] of codeBlocks.entries()) {
    for (const { names, pkg, isType } of parseImports(code)) {
      if (isType) {
        continue;
      }
      for (const rawSpec of names) {
        const spec = parseImportSpec(rawSpec);
        usedNames.add(spec.local);
        if (!importsByLocalName.has(spec.local)) {
          importsByLocalName.set(spec.local, []);
        }
        importsByLocalName.get(spec.local).push({
          blockIndex,
          pkg,
          imported: spec.imported,
          local: spec.local,
        });
      }
    }
  }

  const replacementsByBlock = new Map();
  for (const imports of importsByLocalName.values()) {
    const packages = new Set(imports.map((item) => item.pkg));
    if (packages.size < 2) {
      continue;
    }

    // Keep the same binding mergeImports would have kept before this aliasing
    // pass, so existing output stays stable except for the conflicting imports.
    const keepPkg = [...packages].reduce((a, b) => (b.length > a.length ? b : a));

    for (const item of imports) {
      if (item.pkg === keepPkg) {
        continue;
      }
      const alias = makeImportAlias(item.pkg, item.imported, usedNames);
      if (!replacementsByBlock.has(item.blockIndex)) {
        replacementsByBlock.set(item.blockIndex, new Map());
      }
      replacementsByBlock
        .get(item.blockIndex)
        .set(`${item.imported}:${item.local}`, { from: item.local, to: alias });
    }
  }

  if (replacementsByBlock.size === 0) {
    return codeBlocks;
  }

  return codeBlocks.map((code, blockIndex) => {
    const replacements = replacementsByBlock.get(blockIndex);
    if (!replacements) {
      return code;
    }

    const importReplacementMap = new Map(
      [...replacements.entries()].map(([key, value]) => [key, value.to]),
    );
    const out = [];
    const lines = code.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (/^import\s+\{/.test(line)) {
        let block = '';
        while (i < lines.length) {
          block = `${block}${lines[i]}\n`;
          if (/from\s+['"][^'"]+['"]\s*;?\s*$/.test(lines[i])) {
            i += 1;
            break;
          }
          i += 1;
        }
        out.push(rewriteImportBlock(block.trimEnd(), importReplacementMap));
      } else {
        let rewritten = line;
        for (const { from, to } of replacements.values()) {
          rewritten = replaceIdentifier(rewritten, from, to);
        }
        out.push(rewritten);
        i += 1;
      }
    }

    return out.join('\n');
  });
}

function mergeImports(codeBlocks) {
  const named = new Map(); // pkg → Set<string>
  const typed = new Map(); // pkg → Set<string>

  for (const code of codeBlocks) {
    for (const { names, pkg, isType } of parseImports(code)) {
      const map = isType ? typed : named;
      if (!map.has(pkg)) map.set(pkg, new Set());
      for (const n of names) map.get(pkg).add(n);
    }
  }

  // Deduplicate names that appear under multiple packages (e.g. TextField from
  // @tale-ui/react AND @tale-ui/react/text-field). Keep the most specific path
  // (longest) and remove the name from all others to avoid "already declared" errors.
  for (const map of [named, typed]) {
    const nameToPackages = new Map(); // name → [pkg, ...]
    for (const [pkg, names] of map) {
      for (const name of names) {
        const localName = parseImportSpec(name).local;
        if (!nameToPackages.has(localName)) nameToPackages.set(localName, []);
        nameToPackages.get(localName).push(pkg);
      }
    }
    for (const [localName, pkgs] of nameToPackages) {
      if (pkgs.length < 2) continue;
      // Prefer the most specific (longest) path — deep imports over barrel
      const keep = pkgs.reduce((a, b) => (b.length > a.length ? b : a));
      for (const pkg of pkgs) {
        if (pkg === keep) continue;
        for (const spec of [...map.get(pkg)]) {
          if (parseImportSpec(spec).local === localName) map.get(pkg).delete(spec);
        }
      }
    }
    // Drop packages whose Set became empty
    for (const [pkg, names] of map) {
      if (names.size === 0) map.delete(pkg);
    }
  }

  const lines = [];
  for (const [pkg, names] of [...named.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`import { ${[...names].sort().join(', ')} } from '${pkg}';`);
  }
  for (const [pkg, names] of [...typed.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`import type { ${[...names].sort().join(', ')} } from '${pkg}';`);
  }
  return lines.join('\n');
}

/**
 * Given the merged import block and the full body text of all component
 * definitions, remove any imported name that never appears as an identifier
 * in the body. Drops the entire import line if no names survive.
 */
function pruneUnusedImports(importBlock, bodyText) {
  return importBlock
    .split('\n')
    .map((line) => {
      const namesMatch = line.match(/\{([\s\S]*?)\}/);
      if (!namesMatch) return line;
      const usedNames = namesMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter((n) => {
          if (!n) return false;
          const localName = parseImportSpec(n).local;
          return new RegExp(`\\b${escapeRegExp(localName)}\\b`).test(bodyText);
        });
      if (usedNames.length === 0) return null;
      return line.replace(/\{[\s\S]*?\}/, `{ ${usedNames.join(', ')} }`);
    })
    .filter((line) => line !== null)
    .join('\n');
}

/**
 * Prefix any simple `const <ident> = ...` declaration with `_` when
 * the identifier is never referenced outside its own declaration line.
 * This suppresses TS6133 ("declared but never read") for unused locals
 * produced by Claude-generated eval code without altering runtime behaviour.
 * Destructuring patterns (`const { a } = ...`, `const [a] = ...`) are left
 * untouched because they are more complex and rarely the source of these errors.
 */
function suppressUnusedLocals(code) {
  const lines = code.split('\n');
  return lines
    .map((line, idx) => {
      const m = line.match(/^(\s*const\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*=)/);
      if (!m) return line;
      const ident = m[2];
      if (ident.startsWith('_')) return line; // already suppressed
      const otherLines = [...lines.slice(0, idx), ...lines.slice(idx + 1)];
      const usedElsewhere = otherLines.some((l) => new RegExp(`\\b${ident}\\b`).test(l));
      if (usedElsewhere) return line;
      // Drop `const <ident> = ` entirely, leaving just the expression statement.
      // (_-prefix suppresses noUnusedParameters but NOT noUnusedLocals in tsc.)
      return line.replace(/^(\s*)const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*/, '$1');
    })
    .join('\n');
}

function stripImports(code) {
  const out = [];
  const lines = code.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^import\s/.test(line)) {
      // Skip all lines belonging to this import statement
      while (i < lines.length) {
        const l = lines[i++];
        // Single-line import, or the closing `from '...'` line of a multi-line import
        if (/from\s+['"][^'"]+['"]\s*;?\s*$/.test(l)) break;
      }
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join('\n').trim();
}

function toFuncName(slug) {
  return (
    'Eval' +
    slug
      .split('-')
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join('')
  );
}

function normalizeEvalReviewCode(slug, code) {
  if (slug !== 'drawer-with-backdrop') {
    return code;
  }

  let normalized = code;

  if (!/<Drawer\.Root\b[^>]*\b(defaultOpen|open)\b/.test(normalized)) {
    normalized = normalized.replace(/<Drawer\.Root(?=[\s>])/, '<Drawer.Root defaultOpen');
  }

  return normalized;
}

function renameExport(code, slug) {
  const name = toFuncName(slug);
  // Handle: export function X, export default function X, export const X =
  let renamed = code
    .replace(/export\s+default\s+function\s+\w+/, `function ${name}`)
    .replace(/export\s+function\s+\w+/, `function ${name}`)
    .replace(/export\s+const\s+\w+\s*=/, `const ${name} =`);

  // Prefix top-level `type X = ...` aliases with the component name to avoid
  // "already declared" conflicts when multiple components use the same type name.
  // Two-pass: collect all type names first, then rename declarations + usages.
  const typeNames = [];
  renamed.replace(/^(?:export\s+)?type\s+(\w+)\s*=/gm, (_, typeName) => {
    typeNames.push(typeName);
  });
  for (const typeName of typeNames) {
    const unique = `${name}${typeName}`;
    renamed = renamed
      .replace(new RegExp(`^((?:export\\s+)?type\\s+)${typeName}(\\s*=)`, 'm'), `$1${unique}$2`)
      .replace(new RegExp(`\\b${typeName}\\b(?!\\s*=)`, 'g'), unique);
  }

  // Prefix top-level helper functions/consts that aren't the main export and
  // don't already start with `Eval` — prevents collisions with imported names
  // (e.g. model defines `function Image(...)` which shadows the Tale UI import).
  const helperNames = [];
  renamed.replace(/^(?:function|const)\s+(?!Eval)(\w+)/gm, (_, h) => {
    helperNames.push(h);
  });
  for (const helperName of helperNames) {
    const unique = `${name}${helperName}`;
    renamed = renamed.replace(
      new RegExp(`^((?:function|const)\\s+)${helperName}\\b`, 'm'),
      `$1${unique}`,
    );
    renamed = replaceIdentifierReference(renamed, helperName, unique);
  }

  // If no function or const declaration was found, wrap bare JSX in a function
  if (!/^(function|const)\s+Eval/m.test(renamed)) {
    // Strip trailing semicolons (model sometimes emits `<X />;`) and guard against empty bodies
    const body = renamed.trimEnd().replace(/;$/, '').trim();
    if (!body) return `function ${name}() { return null; }`;
    return `function ${name}() {\n  return (\n${body
      .split('\n')
      .map((l) => `    ${l}`)
      .join('\n')}\n  );\n}`;
  }
  return renamed;
}

function validateReviewFile() {
  const tsconfigPath = join(ROOT, 'playground/vite-app/tsconfig.app.json');
  try {
    execFileSync(
      'npx',
      [
        'tsc',
        '--noEmit',
        '--project',
        tsconfigPath,
        '--noUnusedLocals',
        'false',
        '--noUnusedParameters',
        'false',
      ],
      { cwd: ROOT, timeout: 60000, encoding: 'utf8', stdio: 'pipe' },
    );
    return { pass: true, errors: [] };
  } catch (err) {
    // Filter to only errors from EvalReview.tsx (pre-existing issues in other files are irrelevant)
    const output = `${err.stdout || ''}\n${err.stderr || ''}`;
    const lines = output.split('\n').filter((l) => l.includes('EvalReview.tsx') && l.trim());
    return { pass: false, errors: lines.length > 0 ? lines : [err.message] };
  }
}

function generateEvalReview(passingResults, allPrompts) {
  const promptMap = new Map(allPrompts.map((p) => [p.slug, p]));
  const codeBlocks = aliasImportNameCollisions(
    passingResults
      .map((r) => (r.code ? normalizeEvalReviewCode(r.slug, r.code) : r.code))
      .filter(Boolean),
  );
  let codeBlockIndex = 0;

  // Build component bodies first so the assembled text is available for
  // import pruning. Apply suppressUnusedLocals to each block so that
  // Claude-generated `const <x> = ...` that are never read get prefixed
  // with `_`, satisfying noUnusedLocals without changing runtime behaviour.
  const componentDefs = passingResults
    .filter((r) => r.code)
    .map((r) => {
      const body = suppressUnusedLocals(
        renameExport(stripImports(codeBlocks[codeBlockIndex++]), r.slug),
      );
      return `// ── ${r.slug} ${'─'.repeat(Math.max(0, 46 - r.slug.length))}\n${body}`;
    })
    .join('\n\n');

  // Merge imports from all code blocks, then drop any name that is not
  // actually referenced in the assembled component bodies to avoid TS6133
  // ("declared but its value is never read") from unused icon imports etc.
  const mergedImports = pruneUnusedImports(mergeImports(codeBlocks), componentDefs);
  const reactNamespaceImport = /\bReact\./.test(componentDefs)
    ? "import * as React from 'react';\n"
    : '';

  const sections = passingResults
    .filter((r) => r.code)
    .map((r) => {
      const prompt = promptMap.get(r.slug);
      const funcName = toFuncName(r.slug);
      const previewClass =
        r.slug === 'drawer-with-backdrop'
          ? 'eval-review__preview eval-review__preview--drawer'
          : 'eval-review__preview';
      return `      <section className="eval-review__section">
        <div className="eval-review__meta">
          <code className="eval-review__slug">{r.slug}</code>
          <span className="eval-review__difficulty">[${r.difficulty}]</span>
        </div>
        <p className="eval-review__prompt">${(prompt?.prompt ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</p>
        <div className="${previewClass}">
          <${funcName} />
        </div>
      </section>`
        .replace(/{r\.slug}/g, r.slug)
        .replace(/{r\.difficulty}/g, r.difficulty);
    })
    .join('\n');

  return `// Auto-generated by eval-fix-review.mjs — re-run to update
import '@tale-ui/react-styles/index.css';
import * as React from 'react';
${mergedImports}

${componentDefs}

export default function EvalReview() {
  // Snapshot data-color-mode during render (before any child effects fire),
  // then restore it once after mount. This neutralises the showcase
  // ColorModeToggle's mount-time side effect, which would otherwise force
  // the page back to OS preference / its own localStorage every time you
  // enter or refresh /eval-review. User-initiated toggles still work because
  // they trigger ColorModeToggle's effect on a real state change.
  const [initialMode] = React.useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-color-mode')
      : null,
  );
  React.useEffect(() => {
    if (initialMode === null) {
      document.documentElement.removeAttribute('data-color-mode');
    } else {
      document.documentElement.setAttribute('data-color-mode', initialMode);
    }
  }, [initialMode]);

  return (
    <div className="eval-review">
      <div className="eval-review__header">
        <h1>Eval Review</h1>
        <p>Generated code for ${passingResults.filter((r) => r.code).length} golden prompts. Visual L4 inspection.</p>
      </div>
${sections}
    </div>
  );
}
`;
}

/* ─── routes.tsx patching ─────────────────────────────────────────────────── */

function ensureEvalRoute() {
  let routes = readFileSync(ROUTES_FILE, 'utf8');

  if (routes.includes("path: '/eval-review'")) return; // already registered

  // Add import
  routes = routes.replace(
    "import A2UIDemo from './demos/A2UIDemo';",
    "import A2UIDemo from './demos/A2UIDemo';\nimport EvalReview from './demos/EvalReview';",
  );

  // Add route entry before the A2UI header
  routes = routes.replace(
    "  { type: 'header', label: 'A2UI' },",
    `  { type: 'header', label: 'Evaluation' },
  {
    type: 'route',
    path: '/eval-review',
    label: 'Eval review',
    element: <EvalReview />,
    showInNav: true,
  },
  { type: 'header', label: 'A2UI' },`,
  );

  writeFileSync(ROUTES_FILE, routes, 'utf8');
}

/* ─── Playground server ───────────────────────────────────────────────────── */

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = connect(port, 'localhost');
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForPort(port, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await checkPort(port)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function findFreePort(start) {
  for (let port = start; port < start + 20; port++) {
    if (!(await checkPort(port))) return port;
  }
  throw new Error('No free port found in range');
}

async function startPlayground() {
  if (await checkPort(PREFERRED_PORT)) {
    console.log(`  Playground already running on :${PREFERRED_PORT}`);
    return PREFERRED_PORT;
  }

  const port = await findFreePort(PREFERRED_PORT);
  console.log(`  Starting playground dev server on :${port}...`);
  const proc = spawn(
    'pnpm',
    [
      '-C',
      'playground/vite-app',
      'dev',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      cwd: ROOT,
      detached: true,
      stdio: 'ignore',
    },
  );
  proc.unref();

  const ready = await waitForPort(port, 120000);
  if (!ready) throw new Error(`Playground did not start on :${port} within 120s`);
  console.log(`  Playground ready on :${port}`);
  return port;
}

/* ─── Per-prompt fix helper ───────────────────────────────────────────────── */

async function fixFailingPrompt(failure, promptMap, runModifiedFiles, passingCode) {
  console.log(`\n  ${C.cyan(C.bold('Diagnosing:'))} ${C.bold(failure.slug)}`);
  let current = failure;
  let passed = false;
  const failedPatchReasons = [];
  let sourcePatchFailureCount = 0;
  for (let attempt = 1; attempt <= MAX_ITER; attempt++) {
    const attemptLabel = isFinite(MAX_ITER) ? `${attempt}/${MAX_ITER}` : `${attempt}`;
    try {
      console.log(
        `    [${attemptLabel}] ${C.dim(`Requesting fix from ${FIX_PROVIDER}:${FIX_MODEL}...`)}`,
      );
      const fix = await getFix(
        current,
        failedPatchReasons,
        promptMap.get(current.slug)?.tags ?? [],
      );
      console.log(`    [${attemptLabel}] ${C.cyan('Diagnosis:')} ${fix.diagnosis}`);
      const payloadValidation = validateFixPayload(fix);
      if (!payloadValidation.pass) {
        const reason = payloadValidation.errors.join('; ');
        const artifactPath = savePatchArtifact(fix, {
          status: 'rejected',
          slug: current.slug,
          attempt,
          reason,
        });
        failedPatchReasons.push(reason);
        console.log(`    [${attemptLabel}] ${C.yellow('⚠ Fix payload rejected:')} ${reason}`);
        console.log(
          `    [${attemptLabel}] ${C.dim('Replay:')} ${formatPatchReplayCommand(artifactPath)}`,
        );
        continue;
      }
      const fixPreviewText = buildFixPreviewText(fix);
      if (fixPreviewText) {
        const target = fix.section ?? 'unknown';
        const oldHint = fix.old ? JSON.stringify(fix.old.slice(0, 60)) : 'append';
        const fixPreview = fixPreviewText
          .split('\n')
          .map((l) => C.dim(`      | `) + l)
          .join('\n');
        console.log(
          `    [${attemptLabel}] ${C.magenta('Fix')} → ${C.bold(target)} ${C.dim(`(old=${oldHint})`)}:\n${fixPreview}`,
        );
      }
      const evalContextBeforeFix = readFileSync(SNIPPET_PATH, 'utf8');
      let sourcePatchApplied = false;
      const sourcePatchRequired = !NO_SOURCE_PATCH;
      if (!NO_SOURCE_PATCH) {
        try {
          const patchedPath = applySourceFix(fix, evalContextBeforeFix);
          if (patchedPath) runModifiedFiles.add(patchedPath);
          if (patchedPath) {
            const artifactPath = savePatchArtifact(fix, {
              status: 'applied',
              slug: current.slug,
              attempt,
              reason: `patched ${patchedPath}`,
            });
            sourcePatchApplied = true;
            sourcePatchFailureCount = 0;
            console.log(
              `    [${attemptLabel}] ${C.green('Source file patched')} — regenerating registries...`,
            );
            console.log(
              `    [${attemptLabel}] ${C.dim('Patch artifact:')} ${relative(ROOT, artifactPath)}`,
            );
            try {
              execFileSync(process.execPath, [join(__dirname, 'generate-pitfalls-registry.js')], {
                cwd: ROOT,
                timeout: 30000,
                encoding: 'utf8',
                stdio: 'pipe',
              });
              execFileSync(process.execPath, [join(__dirname, 'generate-registry.js')], {
                cwd: ROOT,
                timeout: 60000,
                encoding: 'utf8',
                stdio: 'pipe',
              });
              execFileSync(process.execPath, [join(__dirname, 'generate-eval-context.js')], {
                cwd: ROOT,
                timeout: 10000,
                encoding: 'utf8',
                stdio: 'pipe',
              });
              console.log(`    [${attemptLabel}] ${C.dim('Registries updated')}`);
            } catch (regenErr) {
              console.log(
                `    [${attemptLabel}] ${C.yellow('⚠ Registry regen failed:')} ${regenErr.message}`,
              );
            }
          } else {
            const reason = applySourceFix.lastError || 'source patch did not apply cleanly';
            const artifactPath = savePatchArtifact(fix, {
              status: 'rejected',
              slug: current.slug,
              attempt,
              reason,
            });
            failedPatchReasons.push(reason);
            sourcePatchFailureCount += 1;
            console.log(
              `    [${attemptLabel}] ${C.yellow('⚠ Source patch not applied')} (see ⚠ above for reason)`,
            );
            console.log(
              `    [${attemptLabel}] ${C.dim('Replay:')} ${formatPatchReplayCommand(artifactPath)}`,
            );
          }
        } catch (err) {
          const artifactPath = savePatchArtifact(fix, {
            status: 'rejected',
            slug: current.slug,
            attempt,
            reason: err.message,
          });
          failedPatchReasons.push(err.message);
          sourcePatchFailureCount += 1;
          console.log(`    [${attemptLabel}] ${C.yellow('⚠ Source patch failed:')} ${err.message}`);
          console.log(
            `    [${attemptLabel}] ${C.dim('Replay:')} ${formatPatchReplayCommand(artifactPath)}`,
          );
        }
      }
      if (sourcePatchRequired && !sourcePatchApplied) {
        if (shouldStopSourcePatchRetries(sourcePatchFailureCount)) {
          console.log(
            `    [${attemptLabel}] ${C.yellow(`⚠ Source patch failed ${sourcePatchFailureCount} times; stopping retries for this prompt`)}`,
          );
          break;
        }
        console.log(
          `    [${attemptLabel}] ${C.yellow('⚠ Source patch did not apply cleanly')} — retrying`,
        );
        continue;
      }
      const fixedCode = fix.fixedCode ?? '';
      if (!fixedCode.trim()) {
        failedPatchReasons.push('fixedCode is required');
        console.log(
          `    [${attemptLabel}] ${C.yellow('⚠ Fix did not include fixedCode')} — retrying`,
        );
        continue;
      }
      console.log(`    [${attemptLabel}] ${C.dim('Fix applied — scoring corrected code...')}`);
      const score = scoreCode(fixedCode, {
        tags: promptMap.get(current.slug)?.tags ?? [],
        root: ROOT,
        validatorPath: join(__dirname, 'validate-generated.mjs'),
        prompt: promptMap.get(current.slug)?.prompt ?? '',
      });
      const reResult = {
        slug: current.slug,
        difficulty: current.difficulty,
        allPass: score.allPass,
        l1: score.l1,
        l2: score.l2,
        l3: score.l3,
        code: fixedCode,
        prompt: promptMap.get(current.slug)?.prompt ?? '',
      };
      if (reResult.allPass) {
        passingCode.set(current.slug, reResult);
        console.log(`    [${attemptLabel}] ${C.green('✓ Passing')}`);
        passed = true;
        break;
      }
      const l1 = reResult.l1.pass ? C.green('✓') : C.red('✗');
      const l2 = reResult.l2.pass ? C.green('✓') : C.red('✗');
      const l3 = reResult.l3.pass ? C.green('✓') : C.red('✗');
      console.log(`    [${attemptLabel}] ${C.red('✗ Still failing:')} L1=${l1} L2=${l2} L3=${l3}`);
      current = reResult;
      failedPatchReasons.length = 0;
    } catch (err) {
      if (isProviderQuotaError(err)) {
        throw err;
      }
      if (err instanceof SyntaxError) {
        console.log(`    [${attemptLabel}] ${C.yellow('⚠ Malformed JSON response')} — retrying`);
        continue;
      }
      console.log(`    [${attemptLabel}] ${C.yellow('⚠ Could not get fix:')} ${err.message}`);
      break;
    }
  }
  return { passed, final: current };
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

async function main() {
  const modelLabel = FIX_MODEL !== MODEL ? `${MODEL} / fix: ${FIX_MODEL}` : MODEL;
  const providerLabel = FIX_PROVIDER !== PROVIDER ? `${PROVIDER} / fix: ${FIX_PROVIDER}` : PROVIDER;
  console.log(C.bold(`\n=== Eval → Fix → Review (${modelLabel}, ${providerLabel}) ===\n`));

  /* ── Step 0: Pitfall truth preflight + eval context ── */
  if (SKIP_PITFALL_TRUTH) {
    console.log(C.dim('  Skipping pitfall truth audit (--skip-pitfall-truth).'));
  } else {
    console.log(C.dim('  Running pitfall truth audit...'));
    runPitfallTruthAudit();
    console.log(C.dim('  Running pitfall shape auto-fix...'));
    runPitfallShapeAutoFix();
    console.log(C.dim('  Running pitfall shape audit...'));
    runPitfallShapeAudit();
    console.log(C.dim('  Running golden patchability audit...'));
    runGoldenPatchabilityAudit();
  }

  console.log(C.dim('  Generating eval context from registries...'));
  execFileSync(process.execPath, [join(__dirname, 'generate-eval-context.js')], {
    cwd: ROOT,
    timeout: 10000,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  /* ── Steps 1–2: Streaming eval + fix (chunk by chunk) ── */
  const promptMap = new Map(GOLDEN_PROMPTS.map((p) => [p.slug, p]));
  const allSlugs = GOLDEN_PROMPTS.filter(
    (p) => !FILTER_DIFFICULTY || p.difficulty === FILTER_DIFFICULTY,
  )
    .filter((p) => !FILTER_SLUG || p.slug === FILTER_SLUG)
    .filter((p) => !FILTER_SLUGS?.length || FILTER_SLUGS.includes(p.slug))
    .map((p) => p.slug);

  if (allSlugs.length === 0) {
    throw new Error('No golden prompts matched the selected filters.');
  }

  const resumeConfig = buildResumeConfigSignature(allSlugs);
  const resumeState = readResumeState(STATE_FILE);
  if (resumeState && !sameResumeConfig(resumeState.config, resumeConfig)) {
    throw new Error(
      `Resume state ${STATE_FILE} was created with different eval options. Use --reset-resume or a different --state-file.`,
    );
  }
  if (RESUME && resumeState) {
    console.log(
      C.dim(
        `  Resuming from ${relative(ROOT, STATE_FILE)} (${resumeState.completedSlugs?.length ?? 0}/${allSlugs.length} prompt(s) completed).`,
      ),
    );
  } else if (RESET_RESUME) {
    console.log(
      C.dim(`  Ignoring previous resume state (--reset-resume): ${relative(ROOT, STATE_FILE)}`),
    );
  }

  const chunkSize = Math.max(EVAL_CONCURRENCY, 1);
  const totalChunks = Math.ceil(allSlugs.length / chunkSize);
  const attemptsLabel = NO_FIX
    ? 'eval only'
    : UNTIL_PASS
      ? 'fix: unlimited attempts per prompt'
      : `fix: max ${MAX_ITER} attempts per prompt`;
  console.log(
    C.bold('Steps 1–2/4') +
      `  Streaming eval + fix — ${totalChunks} chunk(s) of ≤${chunkSize} (${attemptsLabel})...`,
  );

  const passingCode = new Map(
    (resumeState?.passingResults ?? []).map((result) => [result.slug, result]),
  );
  const runModifiedFiles = new Set(resumeState?.modifiedFiles ?? []);
  const completedSlugs = new Set(resumeState?.completedSlugs ?? []);
  const stillFailingBySlug = new Map(
    (resumeState?.stillFailing ?? []).map((result) => [result.slug, result]),
  );
  let initialPassCount = resumeState?.initialPassCount ?? 0;
  let initialFailCount = resumeState?.initialFailCount ?? 0;

  const checkpoint = (status = 'in_progress') => {
    writeResumeState(STATE_FILE, {
      version: 1,
      status,
      updatedAt: new Date().toISOString(),
      config: resumeConfig,
      completedSlugs: [...completedSlugs],
      initialPassCount,
      initialFailCount,
      stillFailing: [...stillFailingBySlug.values()],
      passingResults: [...passingCode.values()],
      modifiedFiles: [...runModifiedFiles],
    });
  };

  for (let i = 0; i < allSlugs.length; i += chunkSize) {
    const chunk = allSlugs.slice(i, i + chunkSize);
    const pendingChunk = chunk.filter((slug) => !completedSlugs.has(slug));
    const chunkNum = Math.floor(i / chunkSize) + 1;
    if (pendingChunk.length === 0) {
      console.log(
        `\n  ${C.bold(`[Chunk ${chunkNum}/${totalChunks}]`)}  Skipping completed: ${chunk.join(', ')}`,
      );
      continue;
    }
    console.log(
      `\n  ${C.bold(`[Chunk ${chunkNum}/${totalChunks}]`)}  Evaluating: ${pendingChunk.join(', ')}`,
    );

    // Step 0 already generated eval context; fixes regenerate mid-loop — always skip here.
    const evalResult = runEval(pendingChunk, { skipGenerate: true });
    const annotated = evalResult.results.map((r) => ({
      ...r,
      prompt: promptMap.get(r.slug)?.prompt ?? '',
    }));

    for (const r of annotated) {
      if (r.allPass) {
        initialPassCount++;
        if (r.code) passingCode.set(r.slug, r);
        stillFailingBySlug.delete(r.slug);
      } else {
        initialFailCount++;
        if (NO_FIX) {
          stillFailingBySlug.set(r.slug, r);
        } else {
          const { passed, final } = await fixFailingPrompt(
            r,
            promptMap,
            runModifiedFiles,
            passingCode,
          );
          if (passed) {
            stillFailingBySlug.delete(r.slug);
          } else {
            stillFailingBySlug.set(r.slug, final);
          }
        }
      }
      completedSlugs.add(r.slug);
      checkpoint();
    }
  }

  const stillFailing = [...stillFailingBySlug.values()];
  const totalEvaluated = initialPassCount + initialFailCount;
  const fixedCount = initialFailCount - stillFailing.length;
  const streamSummary =
    stillFailing.length === 0
      ? C.green(
          `\n  ${initialPassCount}/${totalEvaluated} passed initially${fixedCount > 0 ? `, ${fixedCount} fixed` : ''}.`,
        )
      : C.yellow(
          `\n  ${initialPassCount}/${totalEvaluated} passed initially. ${fixedCount > 0 ? `${fixedCount} fixed. ` : ''}${stillFailing.length} still failing.`,
        );
  console.log(streamSummary);

  if (!NO_SOURCE_PATCH && fixedCount > 0) {
    console.log(
      C.dim('  Registries updated per fix attempt. MCP server will reflect fixes on next restart.'),
    );
  }

  let failing = stillFailing;

  if (!SKIP_PITFALL_TRUTH) {
    console.log(C.bold('\nStep 2.5/4') + '  Verifying pitfall docs after fix loop...');
    runPitfallTruthAudit();
    runPitfallShapeAutoFix();
    runPitfallShapeAudit();
    runGoldenPatchabilityAudit();
  }

  if (failing.length > 0) {
    console.log(C.red(`\n  ⚠ ${failing.length} prompt(s) still failing after fix loop:`));
    for (const f of failing) {
      const l1 = f.l1.pass ? C.green('✓') : C.red('✗');
      const l2 = f.l2.pass ? C.green('✓') : C.red('✗');
      const l3 = f.l3.pass ? C.green('✓') : C.red('✗');
      console.log(`    - ${C.bold(f.slug)}: L1=${l1} L2=${l2} L3=${l3}`);
    }
  }

  const summary = {
    prompts: allSlugs,
    totalEvaluated,
    initialPassCount,
    initialFailCount,
    fixedCount,
    stillFailingCount: failing.length,
    stillFailingSlugs: failing.map((f) => f.slug),
    modifiedFiles: [...runModifiedFiles],
  };
  checkpoint('complete');
  writeSummaryFile(summary);

  if (NO_REVIEW) {
    console.log(C.bold('\nStep 3/4') + '  Skipped review generation (--no-review).');
    showDocsPatch(runModifiedFiles);
    if (EXIT_CODE_ON_FAIL && failing.length > 0) process.exit(1);
    return;
  }

  /* ── Step 3: Generate review page ── */
  console.log(C.bold('\nStep 3/4') + '  Generating EvalReview.tsx...');
  const passingResults = [...passingCode.values()];

  if (passingResults.length === 0) {
    console.log('  No passing results — nothing to review.');
    if (EXIT_CODE_ON_FAIL && failing.length > 0) process.exit(1);
    process.exit(0);
  }

  const reviewCode = generateEvalReview(passingResults, [...promptMap.values()]);
  writeFileSync(REVIEW_COMPONENT, reviewCode, 'utf8');
  ensureEvalRoute();
  console.log(`  Written: ${passingResults.length} components to EvalReview.tsx`);

  process.stdout.write('  Validating EvalReview.tsx...');
  const validation = validateReviewFile();
  if (validation.pass) {
    console.log(C.green(' ✓'));
  } else if (SKIP_VALIDATE) {
    console.log(C.yellow(` ⚠ errors found (--skip-validate, continuing anyway)`));
    for (const e of validation.errors.slice(0, 10)) console.error(`    ${e}`);
    if (validation.errors.length > 10)
      console.error(`    ... and ${validation.errors.length - 10} more`);
  } else {
    console.log(C.red(' ✗'));
    console.error(C.red('\n  EvalReview.tsx has errors — not starting playground:\n'));
    for (const e of validation.errors.slice(0, 20)) console.error(`    ${e}`);
    if (validation.errors.length > 20)
      console.error(`    ... and ${validation.errors.length - 20} more`);
    console.error('\n  Re-run with --skip-validate to open the playground anyway.');
    process.exit(1);
  }

  if (NO_SERVE) {
    console.log(
      `\nStep 4/4  Skipped (--no-serve). Open playground manually: http://localhost:${PREFERRED_PORT}/eval-review`,
    );
    showDocsPatch(runModifiedFiles);
    if (EXIT_CODE_ON_FAIL && failing.length > 0) process.exit(1);
    return;
  }

  /* ── Step 4: Serve and open ── */
  console.log(C.bold('\nStep 4/4') + '  Starting playground...');
  const port = await startPlayground();

  const url = `http://localhost:${port}/eval-review`;
  console.log(`  Opening ${C.cyan(url)}`);
  execFileSync('open', [url]);

  console.log(C.green('\nDone.') + ' Browser opened to eval review page.');
  if (failing.length > 0 && NO_SOURCE_PATCH) {
    console.log(
      C.yellow(`\nNote: fixes were applied to tools/.eval-context.md only (--no-source-patch).`),
    );
    console.log(`To persist: port changes to docs/pitfalls.md and run: pnpm generate-docs`);
  }
  showDocsPatch(runModifiedFiles);
  console.log();
  if (EXIT_CODE_ON_FAIL && failing.length > 0) process.exit(1);
}

export const __test__ = {
  applyPitfallFixToSectionText,
  buildFixPrompt,
  buildPitfallBlockTextFromFix,
  buildPatchTargetIndex,
  buildStructuredPitfallFromFix,
  buildFixPreviewText,
  extractSection,
  findPitfallBlockBySlug,
  fixHasStructuredSourcePatch,
  getPitfallBlocks,
  isProviderQuotaMessage,
  normalizeTargetFileSlug,
  parsePitfallBlock,
  resolveSectionTarget,
  resolveSourceTarget,
  serializePitfallBlock,
  shouldStopSourcePatchRetries,
  summaryReflectsPitfallSlug,
  summaryToSlug,
  validateFixPayload,
  validatePitfallPatchBlock,
  validateUpdatedPitfallSection,
};

if (IS_DIRECT_RUN) {
  main().catch((err) => {
    if (isProviderQuotaError(err)) {
      console.error(`ERROR: ${err.message}`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}
