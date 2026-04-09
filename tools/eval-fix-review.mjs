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
 *   node tools/eval-fix-review.mjs --no-fix        # skip fix loop, go straight to review
 *   node tools/eval-fix-review.mjs --no-serve      # generate review page but don't start server
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, spawnSync, spawn } from 'child_process';
import { connect } from 'net';
import { tmpdir } from 'os';
import { buildCodexExecArgs, scoreCode } from './eval-golden-prompts-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SNIPPET_PATH = join(__dirname, '.eval-context.md');
const EVAL_SCRIPT = join(__dirname, 'eval-golden-prompts.mjs');
const REVIEW_COMPONENT = join(ROOT, 'playground/vite-app/src/demos/EvalReview.tsx');
const ROUTES_FILE = join(ROOT, 'playground/vite-app/src/routes.tsx');
const COMPONENTS_REGISTRY_PATH = join(ROOT, 'registry/components.json');
const PITFALLS_DOC_PATH = join(ROOT, 'docs/pitfalls.md');

/* ─── Component name→slug map (for source-aware patching) ────────────────── */

const nameToSlug = new Map();
try {
  const reg = JSON.parse(readFileSync(COMPONENTS_REGISTRY_PATH, 'utf8'));
  for (const c of reg.components) nameToSlug.set(c.name, c.slug);
} catch {
  /* non-fatal — source patching will skip component targets if map is empty */
}

/* ─── Eval-context heading → docs/pitfalls.md section heading ────────────── */

const EVAL_HEADING_TO_SOURCE_HEADING = {
  'Trigger styling': 'Trigger Styling',
  'Controlled state': 'Controlled State Patterns',
  'Color state': 'Color State Imports',
  'React Aria conventions': 'React Aria Conventions',
  Imports: 'Import Path Patterns',
  Layout: 'Layout Patterns',
  'Visual exports': 'Visual Exports',
  'Dark mode': 'Dark Mode',
  'General conventions': 'General Conventions',
};

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
const NO_FIX = hasFlag('--no-fix');
const NO_SERVE = hasFlag('--no-serve');
const SKIP_VALIDATE = hasFlag('--skip-validate');
const NO_CACHE = hasFlag('--no-cache');
const FRESH = hasFlag('--fresh');
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
  if (FILTER_DIFFICULTY) prompts = prompts.filter((prompt) => prompt.difficulty === FILTER_DIFFICULTY);
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
  if (slugs?.length) extraArgs.push('--slugs', slugs.join(','));
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
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  if (proc.error) throw new Error(`Eval script failed: ${proc.error.message}`);
  if (!proc.stdout?.trim())
    throw new Error('Eval script produced no output — it may have timed out or crashed.');
  return JSON.parse(proc.stdout);
}

function runPitfallTruthAudit() {
  execFileSync(process.execPath, [join(__dirname, 'audit-pitfall-truth.mjs')], {
    cwd: ROOT,
    timeout: 30000,
    encoding: 'utf8',
    stdio: 'inherit',
  });
}

function runPitfallShapeAudit() {
  execFileSync(process.execPath, [join(__dirname, 'audit-pitfall-shape.mjs')], {
    cwd: ROOT,
    timeout: 30000,
    encoding: 'utf8',
    stdio: 'inherit',
  });
}

/* ─── Fix loop ────────────────────────────────────────────────────────────── */

function buildErrorSummary(result) {
  const lines = [];
  if (!result.l1.pass)
    lines.push(
      `L1 (TypeScript/registry errors):\n${result.l1.errors.map((e) => `  - ${e}`).join('\n')}`,
    );
  if (!result.l2.pass) lines.push(`L2 (missing components): ${result.l2.missing.join(', ')}`);
  if (!result.l3.pass) lines.push(`L3 (forbidden imports): ${result.l3.forbidden.join(', ')}`);
  return lines.join('\n');
}

async function getFix(result, failedOlds = [], tags = []) {
  const snippet = readFileSync(SNIPPET_PATH, 'utf8');

  // Extract just the pitfalls section to keep the prompt short
  const pitfallsMatch = snippet.match(
    /5\. \*\*Common pitfalls\*\*[\s\S]*?(?=\n\d+\. \*\*|\n---|$)/,
  );
  const pitfallsSection = pitfallsMatch ? pitfallsMatch[0] : snippet;

  const failedHint =
    failedOlds.length > 0
      ? `\nIMPORTANT: Previous fix attempts used these "old" strings which were NOT found verbatim in the documentation — do NOT use them again:\n${failedOlds.map((s) => `  - "${s}"`).join('\n')}\nIf you cannot find an exact string to replace, set "old" to empty string "" to append a new bullet instead.\n`
      : '';

  const tagsHint =
    tags.length > 0
      ? `\nRequired components (L2 — these must appear in the code): ${tags.join(', ')}`
      : '';

  const fixPrompt = `You are improving Tale UI documentation to prevent AI code generation errors.

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
Identify the exact rule that is missing or unclear in the pitfalls section that caused this error.
The "old" value MUST be a substring that appears verbatim in the documentation above, or empty string "" to append a new bullet.
The "section" field identifies which documentation area the fix targets: "general" for general conventions, "cross:{category}" (e.g. "cross:trigger-styling") for cross-component pitfalls, or "component:{Name}" (e.g. "component:Dialog") for per-component pitfalls.
The "scope" field classifies whether the rule applies broadly or narrowly:
  - "cross-cutting": the rule applies to many or all components (e.g. Row/Column gap values, namespace vs simple, trigger styling, import path conventions). These go in the general conventions or cross-component sections of docs/pitfalls.md.
  - "component-specific": the rule only applies to one component's API (e.g. "TextArea uses TextArea.TextArea not TextArea.Textarea"). These go in the per-component section.
Output a JSON fix in this exact format (no other text, just the JSON):
{
  "diagnosis": "one sentence explaining the root cause",
  "scope": "cross-cutting | component-specific",
  "section": "general | cross:{category} | component:{ComponentName}",
  "old": "exact verbatim substring from the documentation above, or empty string to append",
  "new": "the replacement text (or new bullet to append if old is empty string)",
  "fixedCode": "a complete corrected version of the code above that addresses the diagnosed root cause — valid TSX with all necessary imports, no markdown fences"
}`;

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
        const proc = spawnSync(CODEX_BIN, buildCodexExecArgs({ model: codexFixModel, outputFile }), {
          cwd: ROOT,
          timeout: 180000,
          encoding: 'utf8',
          input: fullPrompt,
        });
        if (proc.error) throw proc.error;
        const outputText = existsSync(outputFile) ? readFileSync(outputFile, 'utf8').trim() : '';
        const stdoutText = proc.stdout?.trim() ?? '';
        const stderrText = proc.stderr?.trim() ?? '';
        try {
          unlinkSync(outputFile);
        } catch {
          /* ignore */
        }
        text = outputText || stdoutText;
        if (!text) {
          const details = stderrText || stdoutText;
          if (proc.status && details) {
            throw new Error(`Codex CLI exited with status ${proc.status}: ${details.slice(0, 400)}`);
          }
          if (details) throw new Error(`Codex did not produce a fix payload: ${details.slice(0, 400)}`);
          throw new Error('Codex did not write output file');
        }
        lastErr = null;
        break;
      } catch (err) {
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
          text = parsed.result ?? '';
          lastErr = null;
          break;
        } catch (err) {
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
  return JSON.parse(jsonMatch[0]);
}


/* ─── Source-aware pitfall patching ─────────────────────────────────────── */

/**
 * Determine which source file and section a fix targets, by searching backward
 * from fix.old's position in the eval context for the nearest heading.
 * Falls back to fix.section if position-based resolution fails.
 *
 * Returns { filePath, sectionHeading, isComponent } or null.
 */
function resolveSourceTarget(fix, evalContextContent) {
  let headingLabel = null;
  let parentHeading = null;
  // When fix.old is provided but not found verbatim, we still resolve the target
  // via fix.section and use append mode in applySourceFix.
  let appendFallback = false;

  if (fix.old) {
    const pos = evalContextContent.indexOf(fix.old);
    if (pos === -1) {
      // fix.old not found verbatim — fall through to section-based resolution
      // and signal append mode (can't reliably match text that isn't in the source).
      appendFallback = true;
    } else {
      // If fix.old itself starts with a heading (the model often includes the component
      // heading as part of the replaced block), extract the name from that heading directly.
      // Searching backward would find the PREVIOUS component's heading instead.
      // Handles both "   #### Name" (3-space indent) and "#### Name" (no indent).
      const headingInOld = fix.old.match(/^\s*#{3,4}\s+(.+)/);
      if (headingInOld) {
        headingLabel = headingInOld[1].trim();
        // Resolve the parent ### by searching backward from pos
        const before = evalContextContent.slice(0, pos);
        const h3Before = [...before.matchAll(/^   ### (.+)$/gm)];
        if (h3Before.length > 0) {
          parentHeading = h3Before[h3Before.length - 1][1].trim();
        }
      } else {
        // Search backward for the nearest ### or #### heading.
        // In the eval-context ALL headings are 3-space indented, e.g.:
        //   ### Cross-component pitfalls
        //   #### Layout
        const before = evalContextContent.slice(0, pos);
        const h4Match = [...before.matchAll(/^   #### (.+)$/gm)];
        const h3Match = [...before.matchAll(/^   ### (.+)$/gm)];

        if (h4Match.length > 0) {
          headingLabel = h4Match[h4Match.length - 1][1].trim();
          // Find the ### parent of this ####
          const h4Pos = before.lastIndexOf(h4Match[h4Match.length - 1][0]);
          const beforeH4 = before.slice(0, h4Pos);
          const h3Before = [...beforeH4.matchAll(/^   ### (.+)$/gm)];
          if (h3Before.length > 0) {
            parentHeading = h3Before[h3Before.length - 1][1].trim();
          }
        } else if (h3Match.length > 0) {
          headingLabel = h3Match[h3Match.length - 1][1].trim();
        }
      }
    }
  }

  // Fall back to section hint for new pitfalls or failed position resolution
  if (!headingLabel && fix.section) {
    if (fix.section === 'general') {
      headingLabel = 'General conventions';
    } else if (fix.section.startsWith('cross:')) {
      const cat = fix.section.slice(6);
      // Map category slug to eval-context label
      const catToLabel = {
        'trigger-styling': 'Trigger styling',
        'controlled-state': 'Controlled state',
        'color-state': 'Color state',
        'react-aria': 'React Aria conventions',
        imports: 'Imports',
        layout: 'Layout',
        'visual-exports': 'Visual exports',
        'dark-mode': 'Dark mode',
      };
      headingLabel = catToLabel[cat] ?? cat;
      parentHeading = 'Cross-component pitfalls';
    } else if (fix.section.startsWith('component:')) {
      headingLabel = fix.section.slice(10);
      parentHeading = 'Per-component pitfalls';
    }
  }

  if (!headingLabel) return null;

  // Classify: general conventions or per-component or cross-component.
  // A cross-cutting scope overrides per-component routing — the rule belongs in pitfalls.md.
  const isCrossCutting = fix.scope === 'cross-cutting';
  const isGeneral =
    headingLabel === 'General conventions' ||
    (parentHeading == null &&
      EVAL_HEADING_TO_SOURCE_HEADING[headingLabel] === 'General Conventions');
  const isPerComponent =
    !isCrossCutting &&
    (parentHeading === 'Per-component pitfalls' ||
      (!isGeneral && !EVAL_HEADING_TO_SOURCE_HEADING[headingLabel] && nameToSlug.has(headingLabel)));

  if (isPerComponent) {
    const slug = nameToSlug.get(headingLabel);
    if (!slug) return null;
    return {
      filePath: join(ROOT, `docs/components/${slug}.md`),
      sectionHeading: 'Pitfalls',
      isComponent: true,
      componentName: headingLabel,
      appendOnly: appendFallback,
    };
  }

  // Cross-component or general → docs/pitfalls.md.
  // If the fix model used a component heading but marked scope=cross-cutting,
  // route to General Conventions so the rule is surfaced on every plan_ui call.
  const sourceHeading = EVAL_HEADING_TO_SOURCE_HEADING[headingLabel]
    ?? (isCrossCutting ? 'General Conventions' : null);
  if (!sourceHeading) return null;

  return {
    filePath: PITFALLS_DOC_PATH,
    sectionHeading: sourceHeading,
    isComponent: false,
    appendOnly: appendFallback,
  };
}

/**
 * Derive a kebab-case pitfall slug from a summary string.
 * Takes the first 4-6 meaningful words.
 */
function summaryToSlug(summary) {
  return summary
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join('-');
}

/**
 * Extract the content of a ## Section from a markdown file.
 * Returns { sectionStart, sectionEnd, sectionText } where sectionStart/End
 * are character offsets in the full file content.
 */
function extractSection(fileContent, sectionHeading) {
  const headingPattern = new RegExp(`^## ${sectionHeading}\\s*$`, 'm');
  const match = headingPattern.exec(fileContent);
  if (!match) return null;

  const sectionStart = match.index + match[0].length;
  const nextHeadingMatch = /^## /m.exec(fileContent.slice(sectionStart));
  const sectionEnd = nextHeadingMatch ? sectionStart + nextHeadingMatch.index : fileContent.length;

  return {
    sectionStart,
    sectionEnd,
    sectionText: fileContent.slice(sectionStart, sectionEnd),
  };
}

/**
 * Try to find sourceOld in sectionText using three progressive passes:
 * 1. Exact match
 * 2. Backtick-normalized match (strip backticks from both)
 * 3. Summary-only match (match just the **bold** summary)
 *
 * Returns { matchStart, matchEnd } (offsets within sectionText) or null.
 */
function findInSection(sectionText, sourceOld) {
  // Pass 1: exact
  const idx1 = sectionText.indexOf(sourceOld);
  if (idx1 !== -1) return { matchStart: idx1, matchEnd: idx1 + sourceOld.length };

  // Pass 2: strip backticks
  const norm = (s) => s.replace(/`/g, '');
  const normSection = norm(sectionText);
  const normOld = norm(sourceOld);
  const idx2 = normSection.indexOf(normOld);
  if (idx2 !== -1) {
    // Map normalized offset back: find the real end by scanning forward
    let realStart = 0,
      normCount = 0;
    for (let i = 0; i < sectionText.length; i++) {
      if (normCount === idx2) {
        realStart = i;
        break;
      }
      if (sectionText[i] !== '`') normCount++;
    }
    let realEnd = realStart;
    let normEnd = idx2 + normOld.length;
    normCount = idx2;
    for (let i = realStart; i < sectionText.length; i++) {
      if (normCount >= normEnd) {
        realEnd = i;
        break;
      }
      if (sectionText[i] !== '`') normCount++;
      if (i === sectionText.length - 1) realEnd = sectionText.length;
    }
    return { matchStart: realStart, matchEnd: realEnd };
  }

  // Pass 3: summary-only — match just the **...**  bold text
  const summaryMatch = sourceOld.match(/\*\*(.+?)\*\*/);
  if (summaryMatch) {
    const summary = norm(summaryMatch[1]);
    const bulletPattern = new RegExp(
      `- \\*\\*[^*]*${summary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 30)}[^*]*\\*\\*`,
    );
    const idx3 = normSection.search(bulletPattern);
    if (idx3 !== -1) {
      // Replace the entire bullet block: the bullet header line + all nested sub-lines
      // (lines starting with whitespace or "  - "), stopping at the next top-level
      // "- **" bullet, a "<!-- " comment, or end of section.
      // This prevents successive runs from appending more sub-lines to the same bullet.
      const afterMatch = sectionText.slice(idx3);
      const lines = afterMatch.split('\n');
      let endLine = 1; // always include at least the header line
      while (endLine < lines.length) {
        const line = lines[endLine];
        // Sub-content of the bullet: indented lines or "  - ..." lines
        if (line === '' || /^\s/.test(line) || /^  - /.test(line)) {
          endLine++;
        } else {
          break;
        }
      }
      const endOffset = lines.slice(0, endLine).join('\n').length;
      return { matchStart: idx3, matchEnd: idx3 + endOffset };
    }
  }

  return null;
}

function normalizeSourcePatchBlock(text) {
  const block = text.replace(/^   /gm, '').trim();
  const lines = block.split('\n');
  const firstContentLine = lines.findIndex(
    (line) => line.startsWith('<!-- ') || line.startsWith('- ') || line.startsWith('  - '),
  );
  if (firstContentLine === -1) return block;
  return lines.slice(firstContentLine).join('\n').trimEnd();
}

/**
 * Apply a fix to the actual pitfall source file.
 * Returns true if the source file was patched, false if skipped.
 */
function applySourceFix(fix, evalContextContent) {
  const target = resolveSourceTarget(fix, evalContextContent);
  if (!target) {
    console.log(
      `      ${C.yellow('⚠ Source: could not resolve target')} (section=${fix.section ?? 'none'}, old=${JSON.stringify((fix.old ?? '').slice(0, 60))})`,
    );
    return false;
  }
  if (!existsSync(target.filePath)) {
    console.log(`      ${C.yellow('⚠ Source: file not found:')} ${target.filePath}`);
    return false;
  }

  // Sanitise the fix text before writing: the model sometimes produces a trailing
  // double-backtick like `<Row justify="between">`` (closing backtick + stray backtick).
  // Replace any `...`` end-of-line pattern with `...` to keep sub-bullets valid.
  if (fix.new) fix.new = fix.new.replace(/``(\s*)$/gm, '`$1');

  const fileContent = readFileSync(target.filePath, 'utf8');
  const section = extractSection(fileContent, target.sectionHeading);
  if (!section) {
    console.log(
      `      ${C.yellow(`⚠ Source: no '## ${target.sectionHeading}' section in`)} ${target.filePath}`,
    );
    return false;
  }

  // Strip 3-space indent from eval-context text to get source-format text.
  // If fix.old wasn't found in the eval-context (appendOnly), treat as a new pitfall
  // rather than trying to match text that was never there.
  if (fix.old && !target.appendOnly) {
    // Patch existing pitfall
    const sourceOld = normalizeSourcePatchBlock(fix.old);
    const found = findInSection(section.sectionText, sourceOld);
    if (!found) {
      console.log(
        `      ${C.yellow(`⚠ Source: old text not found in '## ${target.sectionHeading}' of`)} ${target.filePath}`,
      );
      console.log(`        ${C.dim('Looking for:')} ${JSON.stringify(sourceOld.slice(0, 80))}`);
      return false;
    }

    const sourceNew = normalizeSourcePatchBlock(fix.new);
    // Guard: reject replacement blocks that introduce multiple top-level bullets
    // (- ** lines). A pitfall slug must have exactly one bullet; the diagnosis model
    // sometimes prepends an "Always generate..." meta-bullet before the real fix.
    const topLevelBullets = sourceNew.split('\n').filter((l) => /^- \*\*/.test(l));
    if (topLevelBullets.length > 1) {
      console.log(
        `      ${C.yellow(`⚠ Source: replacement would introduce ${topLevelBullets.length} top-level bullets`)} (one per slug allowed) — skipping patch`,
      );
      return false;
    }
    const updatedSection =
      section.sectionText.slice(0, found.matchStart) +
      sourceNew +
      section.sectionText.slice(found.matchEnd);
    const updatedFile =
      fileContent.slice(0, section.sectionStart) +
      updatedSection +
      fileContent.slice(section.sectionEnd);
    writeFileSync(target.filePath, updatedFile, 'utf8');
    return target.filePath;
  } else {
    // New pitfall — append before end of section (with dedup check)
    const newBullet = normalizeSourcePatchBlock(fix.new);
    const summary = newBullet.match(/\*\*(.+?)\*\*/)?.[1] ?? 'new-pitfall';
    const slug = summaryToSlug(summary);

    // Dedup: skip if a pitfall with the same slug already exists in this section
    if (section.sectionText.includes(`<!-- pitfall: ${slug} -->`)) {
      console.log(
        `      ${C.yellow(`⚠ Source: pitfall '${slug}' already present in`)} ${target.filePath} — skipping append`,
      );
      return false;
    }

    let commentBlock;
    if (target.isComponent) {
      commentBlock = `\n<!-- pitfall: ${slug} -->\n${newBullet}\n`;
    } else {
      // Derive category slug from section heading (reverse of EVAL_HEADING_TO_SOURCE_HEADING)
      const catSlugMap = {
        'Trigger Styling': 'trigger-styling',
        'Controlled State Patterns': 'controlled-state',
        'Color State Imports': 'color-state',
        'React Aria Conventions': 'react-aria',
        'Import Path Patterns': 'imports',
        'Layout Patterns': 'layout',
        'Visual Exports': 'visual-exports',
        'Dark Mode': 'dark-mode',
        'General Conventions': 'general',
      };
      const catSlug = catSlugMap[target.sectionHeading] ?? 'general';
      const isGeneral = catSlug === 'general';
      if (isGeneral) {
        commentBlock = `\n<!-- pitfall: ${slug} -->\n<!-- applies-to: * -->\n<!-- category: typescript -->\n${newBullet}\n`;
      } else {
        commentBlock = `\n<!-- pitfall: ${slug} -->\n<!-- applies-to: * -->\n<!-- category: ${catSlug} -->\n${newBullet}\n`;
      }
    }

    // Insert before the end of the section (trim trailing newlines, then append)
    const trimmedSection = section.sectionText.trimEnd();
    const updatedSection = trimmedSection + commentBlock + '\n';
    const updatedFile =
      fileContent.slice(0, section.sectionStart) +
      updatedSection +
      fileContent.slice(section.sectionEnd);
    writeFileSync(target.filePath, updatedFile, 'utf8');
    return target.filePath;
  }
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
    console.log(C.dim('  (All source patches were skipped — check the ⚠ lines above for details.)'));
    console.log(separator);
    return;
  }

  // Only diff the specific files touched this run, not the entire docs tree.
  const sourceDiff = spawnSync(
    'git',
    ['diff', '--color=always', '--', ...modifiedFiles],
    { cwd: ROOT, encoding: 'utf8', timeout: 10000 },
  ).stdout?.trim() ?? '';

  if (!sourceDiff) {
    console.log(C.dim('  No documentation changes.'));
    console.log(C.dim('  (All source patches were skipped — check the ⚠ lines above for details.)'));
  } else {
    console.log(C.bold('  Source docs changed this run:'));
    console.log('');
    console.log(sourceDiff);
  }
  console.log(separator);
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
        if (!nameToPackages.has(name)) nameToPackages.set(name, []);
        nameToPackages.get(name).push(pkg);
      }
    }
    for (const [name, pkgs] of nameToPackages) {
      if (pkgs.length < 2) continue;
      // Prefer the most specific (longest) path — deep imports over barrel
      const keep = pkgs.reduce((a, b) => (b.length > a.length ? b : a));
      for (const pkg of pkgs) {
        if (pkg !== keep) map.get(pkg).delete(name);
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
        .filter((n) => n && new RegExp(`\\b${n}\\b`).test(bodyText));
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
      .replace(new RegExp(`\\b${typeName}\\b`, 'g'), unique);
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
    renamed = renamed
      .replace(new RegExp(`^((?:function|const)\\s+)${helperName}\\b`, 'm'), `$1${unique}`)
      .replace(new RegExp(`\\b${helperName}\\b`, 'g'), unique);
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

  // Build component bodies first so the assembled text is available for
  // import pruning. Apply suppressUnusedLocals to each block so that
  // Claude-generated `const <x> = ...` that are never read get prefixed
  // with `_`, satisfying noUnusedLocals without changing runtime behaviour.
  const componentDefs = passingResults
    .filter((r) => r.code)
    .map((r) => {
      const body = suppressUnusedLocals(renameExport(stripImports(r.code), r.slug));
      return `// ── ${r.slug} ${'─'.repeat(Math.max(0, 46 - r.slug.length))}\n${body}`;
    })
    .join('\n\n');

  // Merge imports from all code blocks, then drop any name that is not
  // actually referenced in the assembled component bodies to avoid TS6133
  // ("declared but its value is never read") from unused icon imports etc.
  const codeBlocks = passingResults.map((r) => r.code).filter(Boolean);
  const mergedImports = pruneUnusedImports(mergeImports(codeBlocks), componentDefs);
  const reactNamespaceImport = /\bReact\./.test(componentDefs) ? "import * as React from 'react';\n" : '';

  const sections = passingResults
    .filter((r) => r.code)
    .map((r) => {
      const prompt = promptMap.get(r.slug);
      const funcName = toFuncName(r.slug);
      return `      <section className="eval-review__section">
        <div className="eval-review__meta">
          <code className="eval-review__slug">{r.slug}</code>
          <span className="eval-review__difficulty">[${r.difficulty}]</span>
        </div>
        <p className="eval-review__prompt">${(prompt?.prompt ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</p>
        <div className="eval-review__preview">
          <${funcName} />
        </div>
      </section>`
        .replace(/{r\.slug}/g, r.slug)
        .replace(/{r\.difficulty}/g, r.difficulty);
    })
    .join('\n');

  return `// Auto-generated by eval-fix-review.mjs — re-run to update
import '@tale-ui/react-styles/index.css';
${reactNamespaceImport}${mergedImports}

${componentDefs}

export default function EvalReview() {
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
    console.log(C.dim('  Running pitfall shape audit...'));
    runPitfallShapeAudit();
  }

  console.log(C.dim('  Generating eval context from registries...'));
  execFileSync(process.execPath, [join(__dirname, 'generate-eval-context.js')], {
    cwd: ROOT,
    timeout: 10000,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  /* ── Step 1: Initial eval ── */
  console.log(C.bold('Step 1/4') + '  Running initial eval against all golden prompts...');
  let evalResult = runEval();

  // Load prompt text for fix loop
  const promptMap = new Map(
    GOLDEN_PROMPTS.map((prompt) => [prompt.slug, prompt]),
  );

  // Annotate results with prompt text and code
  let results = evalResult.results.map((r) => ({
    ...r,
    prompt: promptMap.get(r.slug)?.prompt ?? '',
  }));

  let passingCode = new Map(); // slug → code (keep best passing code)
  for (const r of results) {
    if (r.allPass && r.code) passingCode.set(r.slug, r);
  }

  let failing = results.filter((r) => !r.allPass);
  const passCount = results.length - failing.length;
  const initialSummary = failing.length === 0
    ? C.green(`  ${passCount}/${results.length} passed initially.`)
    : C.yellow(`  ${passCount}/${results.length} passed initially. ${failing.length} to fix.`);
  console.log(initialSummary + '\n');

  const runModifiedFiles = new Set();

  /* ── Step 2: Fix loop ── */
  if (!NO_FIX && failing.length > 0) {
    const attemptsLabel = UNTIL_PASS
      ? 'unlimited attempts per prompt'
      : `max ${MAX_ITER} attempts per prompt`;
    console.log(C.bold('Step 2/4') + `  Fix loop (${attemptsLabel})...`);
    const stillFailing = [];
    for (const failure of failing) {
      console.log(`\n  ${C.cyan(C.bold('Diagnosing:'))} ${C.bold(failure.slug)}`);
      let current = failure;
      let passed = false;
      const failedOlds = [];
      for (let attempt = 1; attempt <= MAX_ITER; attempt++) {
        const attemptLabel = isFinite(MAX_ITER) ? `${attempt}/${MAX_ITER}` : `${attempt}`;
        try {
          const fix = await getFix(current, failedOlds, promptMap.get(current.slug)?.tags ?? []);
          console.log(`    [${attemptLabel}] ${C.cyan('Diagnosis:')} ${fix.diagnosis}`);
          if (fix.new) {
            const target = fix.section ?? 'unknown';
            const oldHint = fix.old ? JSON.stringify(fix.old.slice(0, 60)) : 'append';
            const fixPreview = fix.new.split('\n').map((l) => C.dim(`      | `) + l).join('\n');
            console.log(`    [${attemptLabel}] ${C.magenta('Fix')} → ${C.bold(target)} ${C.dim(`(old=${oldHint})`)}:\n${fixPreview}`);
          }
          const evalContextBeforeFix = readFileSync(SNIPPET_PATH, 'utf8');
          let sourceApplied = false;
          if (!NO_SOURCE_PATCH) {
            try {
              const patchedPath = applySourceFix(fix, evalContextBeforeFix);
              sourceApplied = !!patchedPath;
              if (patchedPath) runModifiedFiles.add(patchedPath);
              if (sourceApplied) {
                console.log(`    [${attemptLabel}] ${C.green('Source file patched')} — regenerating registries...`);
                try {
                  execFileSync(process.execPath, [join(__dirname, 'generate-pitfalls-registry.js')], {
                    cwd: ROOT, timeout: 30000, encoding: 'utf8', stdio: 'pipe',
                  });
                  execFileSync(process.execPath, [join(__dirname, 'generate-registry.js')], {
                    cwd: ROOT, timeout: 60000, encoding: 'utf8', stdio: 'pipe',
                  });
                  execFileSync(process.execPath, [join(__dirname, 'generate-eval-context.js')], {
                    cwd: ROOT, timeout: 10000, encoding: 'utf8', stdio: 'pipe',
                  });
                  console.log(`    [${attemptLabel}] ${C.dim('Registries updated')}`);
                } catch (regenErr) {
                  console.log(`    [${attemptLabel}] ${C.yellow('⚠ Registry regen failed:')} ${regenErr.message}`);
                }
              } else {
                console.log(
                  `    [${attemptLabel}] ${C.yellow('⚠ Source patch skipped')} (no match in source file)`,
                );
              }
            } catch (err) {
              console.log(`    [${attemptLabel}] ${C.yellow('⚠ Source patch failed:')} ${err.message}`);
            }
          }
          const fixedCode = fix.fixedCode ?? '';
          if (!fixedCode.trim()) {
            console.log(`    [${attemptLabel}] ${C.yellow('⚠ Fix did not include fixedCode')} — retrying`);
            continue;
          }
          console.log(`    [${attemptLabel}] ${C.dim('Fix applied — scoring corrected code...')}`);
          const score = scoreCode(fixedCode, {
            tags: promptMap.get(current.slug)?.tags ?? [],
            root: ROOT,
            validatorPath: join(__dirname, 'validate-generated.mjs'),
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
          current = reResult; // use fresh result for next attempt's diagnosis
          failedOlds.length = 0; // reset — new failure context, old hints no longer relevant
        } catch (err) {
          if (err instanceof SyntaxError) {
            // Malformed JSON from the model — retryable
            console.log(`    [${attemptLabel}] ${C.yellow('⚠ Malformed JSON response')} — retrying`);
            continue;
          }
          console.log(`    [${attemptLabel}] ${C.yellow('⚠ Could not get fix:')} ${err.message}`);
          break;
        }
      }
      if (!passed) stillFailing.push(current);
    }

    const fixed = failing.length - stillFailing.length;
    const fixSummary = stillFailing.length === 0
      ? C.green(`\n  Fixed ${fixed}/${failing.length} prompts.`)
      : C.yellow(`\n  Fixed ${fixed}/${failing.length} prompts. ${stillFailing.length} still failing.`);
    console.log(fixSummary);
    failing = stillFailing;

    if (!NO_SOURCE_PATCH && fixed > 0) {
      console.log(C.dim('  Registries updated per fix attempt. MCP server will reflect fixes on next restart.'));
    }
  } else if (NO_FIX) {
    console.log(C.bold('Step 2/4') + C.dim('  Fix loop skipped (--no-fix).'));
  } else {
    console.log(C.bold('Step 2/4') + C.green('  No failures — fix loop not needed.'));
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

  /* ── Step 3: Generate review page ── */
  console.log(C.bold('\nStep 3/4') + '  Generating EvalReview.tsx...');
  const passingResults = [...passingCode.values()];

  if (passingResults.length === 0) {
    console.log('  No passing results — nothing to review.');
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
    console.log(C.yellow(`\nNote: fixes were applied to tools/.eval-context.md only (--no-source-patch).`));
    console.log(`To persist: port changes to docs/pitfalls.md and run: pnpm generate-docs`);
  }
  showDocsPatch(runModifiedFiles);
  console.log();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
