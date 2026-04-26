#!/usr/bin/env node
/**
 * eval-a2ui-fix-review.mjs
 *
 * Self-healing eval pipeline for A2UI JSON generation:
 *   1. Eval    — run all A2UI golden prompts, collect failures
 *   2. Fix     — for each failure, ask Claude to diagnose and patch the A2UI system prompt
 *   3. Re-eval — re-run only the failing prompts; repeat up to MAX_ITER times
 *
 * The target file for patches is packages/a2ui/src/agent/system-prompt.md
 *
 * Usage:
 *   node tools/eval-a2ui-fix-review.mjs
 *   node tools/eval-a2ui-fix-review.mjs --model sonnet
 *   node tools/eval-a2ui-fix-review.mjs --provider ollama --model qwen3-coder-next
 *   node tools/eval-a2ui-fix-review.mjs --difficulty simple
 *   node tools/eval-a2ui-fix-review.mjs --no-fix        # skip fix loop, just eval
 *   node tools/eval-a2ui-fix-review.mjs --max-iter 5
 *   node tools/eval-a2ui-fix-review.mjs --until-pass    # loop until all pass or no more fixes
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, spawnSync } from 'child_process';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SYSTEM_PROMPT_PATH = join(ROOT, 'packages/a2ui/src/agent/system-prompt.md');
const EVAL_SCRIPT = join(__dirname, 'eval-a2ui-golden-prompts.mjs');
const GOLDEN_DIR = join(__dirname, 'a2ui-golden-prompts');

/* ─── CLI args ────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const getArg = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag = (flag) => args.includes(flag);

const MODEL = getArg('--model') ?? 'sonnet';
const FIX_MODEL = getArg('--fix-model') ?? MODEL;
const rawProvider = getArg('--provider') ?? 'claude';
const PROVIDER = (rawProvider === 'ollama' || rawProvider === 'lm-studio') ? 'local' : rawProvider;
const LOCAL_URL = getArg('--local-url') ?? (rawProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const rawFixProvider = getArg('--fix-provider') ?? rawProvider;
const FIX_PROVIDER = (rawFixProvider === 'ollama' || rawFixProvider === 'lm-studio') ? 'local' : rawFixProvider;
const FIX_LOCAL_URL = getArg('--fix-local-url') ?? (rawFixProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const LOCAL_API_KEY = process.env.LOCAL_API_KEY ?? 'ollama';
const FILTER_DIFFICULTY = getArg('--difficulty');
const NO_FIX = hasFlag('--no-fix');
const NO_CACHE = hasFlag('--no-cache');
const FRESH = hasFlag('--fresh');
const UNTIL_PASS = hasFlag('--until-pass');
const EVAL_CONCURRENCY = parseInt(getArg('--concurrency') ?? '5', 10);
const MAX_ITER = UNTIL_PASS
  ? (getArg('--max-iter') ? parseInt(getArg('--max-iter'), 10) : Infinity)
  : parseInt(getArg('--max-iter') ?? '3', 10);

/* ─── Provider setup ─────────────────────────────────────────────────────── */

function findClaude() {
  const candidates = [
    process.env.CLAUDE_PATH,
    join(process.env.HOME ?? '', '.local/bin/claude'),
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
  ].filter(Boolean);
  for (const p of candidates) { if (existsSync(p)) return p; }
  try { return execFileSync('which', ['claude'], { encoding: 'utf8' }).trim(); } catch { return null; }
}

// Straico shorthands
const STRAICO_MODEL_ALIASES = {
  sonnet:       'anthropic/claude-sonnet-4.5',
  'sonnet-4':   'anthropic/claude-sonnet-4',
  opus:         'claude-opus-4-5',
  haiku:        'claude-haiku-4-5-5',
  'gpt-4o':     'openai/gpt-4o-2024-11-20',
  'gpt-4.1':    'openai/gpt-4.1',
  'gemini-flash': 'google/gemini-2.5-flash-lite',
  'deepseek':   'deepseek/deepseek-chat-v3.1',
  'deepseek-r1': 'deepseek/deepseek-r1',
};

let CLAUDE_BIN = null;
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

/* ─── Run eval ────────────────────────────────────────────────────────────── */

function runEval(slugs = null) {
  const extraArgs = [];
  extraArgs.push('--model', MODEL);
  extraArgs.push('--provider', rawProvider);
  extraArgs.push('--concurrency', String(EVAL_CONCURRENCY));
  if (PROVIDER === 'local') extraArgs.push('--local-url', LOCAL_URL);
  if (FILTER_DIFFICULTY) extraArgs.push('--difficulty', FILTER_DIFFICULTY);
  if (slugs?.length) extraArgs.push('--slugs', slugs.join(','));
  if (NO_CACHE) extraArgs.push('--no-cache');
  if (FRESH) extraArgs.push('--fresh');

  const proc = spawnSync(
    process.execPath,
    [EVAL_SCRIPT, '--json', ...extraArgs],
    { cwd: ROOT, timeout: 900000, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
  );

  if (proc.error) throw new Error(`Eval script failed: ${proc.error.message}`);
  if (!proc.stdout?.trim()) throw new Error('Eval script produced no output — it may have timed out or crashed.');
  return JSON.parse(proc.stdout);
}

/* ─── Fix loop ────────────────────────────────────────────────────────────── */

function buildErrorSummary(result) {
  const lines = [];
  if (!result.l1.pass) {
    lines.push('L1 (catalog/protocol validation errors):');
    for (const e of result.l1.errors) lines.push(`  - ${e}`);
  }
  if (!result.l2.pass) lines.push(`L2 (missing component types): ${result.l2.missing.join(', ')}`);
  if (!result.l3.pass) {
    lines.push('L3 (structural errors):');
    for (const e of result.l3.errors) lines.push(`  - ${e}`);
  }
  return lines.join('\n');
}

async function getFix(result, failedOlds = []) {
  const systemPrompt = readFileSync(SYSTEM_PROMPT_PATH, 'utf8');

  const failedHint = failedOlds.length > 0
    ? `\nIMPORTANT: Previous fix attempts used these "old" strings which were NOT found verbatim in the system prompt — do NOT use them again:\n${failedOlds.map(s => `  - "${s}"`).join('\n')}\nIf you cannot find an exact string to replace, set "old" to empty string "" to append guidance instead.\n`
    : '';

  const fixPrompt = `You are improving the A2UI agent system prompt to prevent AI code generation errors.

A user asked an AI agent to generate A2UI JSON for this prompt:
"${result.prompt ?? ''}"

The agent generated this output (messages array):
\`\`\`json
${JSON.stringify(result.messages ?? [], null, 2).slice(0, 3000)}
\`\`\`

The following validation errors were detected:
${buildErrorSummary(result)}

Each L1 error includes the source of truth it violated (e.g. "[a2ui-catalog-metadata.js PROP_ALLOWED_VALUES[\"Button.variant\"]]").
This makes it possible to trace which rule is missing or ambiguous in the system prompt.

Current A2UI system prompt:
${systemPrompt.slice(0, 8000)}
${failedHint}
Identify the exact rule that is missing or unclear in the system prompt that caused this error.
Is this a system prompt deficiency (missing constraint, wrong allowed values, ambiguous instruction) or pure model non-determinism?

If it is fixable: provide a JSON patch to improve the system prompt.
The "old" value MUST be a substring that appears verbatim in the system prompt above, or empty string "" to append.
Output ONLY this JSON (no other text, no markdown fences):
{
  "diagnosis": "one sentence: root cause and whether it is fixable",
  "fixable": true or false,
  "old": "exact verbatim substring from the system prompt above, or empty string to append",
  "new": "the replacement text (or new guidance to append if old is empty string)"
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
          'Authorization': `Bearer ${STRAICO_API_KEY}`,
        },
        body: JSON.stringify({
          model: STRAICO_FIX_MODEL,
          max_tokens: 4096,
          messages: [
            { role: 'system', content: fixPrompt },
            { role: 'user', content: 'Output only the JSON fix object as instructed. No explanation, no markdown.' },
          ],
        }),
      });
      if (!response.ok) {
        const body = await response.text();
        if ((response.status === 502 || response.status === 503 || response.status === 504) && attempt < MAX_RETRIES) {
          lastErr = new Error(`Straico API error (${response.status})`);
          await new Promise(r => setTimeout(r, attempt * 2000));
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
            'Authorization': `Bearer ${LOCAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: FIX_MODEL,
            max_tokens: 4096,
            messages: [
              { role: 'system', content: fixPrompt },
              { role: 'user', content: 'Output only the JSON fix object as instructed. No explanation, no markdown.' },
            ],
          }),
          signal: AbortSignal.timeout(180000),
        });
      } catch (err) {
        if (err.cause?.code === 'ECONNREFUSED') {
          throw new Error(`Local LLM not reachable at ${FIX_LOCAL_URL}. Is Ollama / LM Studio running?`);
        }
        if (attempt < MAX_RETRIES) { lastErr = err; await new Promise(r => setTimeout(r, attempt * 2000)); continue; }
        throw err;
      }
      if (!response.ok) {
        const body = await response.text();
        if (attempt < MAX_RETRIES) { lastErr = new Error(`Local LLM error (${response.status})`); await new Promise(r => setTimeout(r, attempt * 2000)); continue; }
        throw new Error(`Local LLM error (${response.status}): ${body.slice(0, 200)}`);
      }
      const json = await response.json();
      text = json.choices?.[0]?.message?.content ?? '';
      lastErr = null;
      break;
    }
    if (lastErr) throw lastErr;
  } else {
    // Claude CLI
    const tmpFile = join(tmpdir(), `tale-ui-a2ui-fix-prompt-${process.pid}.md`);
    writeFileSync(tmpFile, fixPrompt, 'utf8');
    const MAX_RETRIES = 3;
    let lastErr;
    try {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const raw = execFileSync(
            CLAUDE_BIN,
            ['--print', '--no-session-persistence', '--model', FIX_MODEL,
              '--append-system-prompt-file', tmpFile, '--output-format', 'json',
              'Output only the JSON fix object as instructed. No explanation, no markdown.'],
            { cwd: tmpdir(), timeout: 180000, encoding: 'utf8' }
          );
          const parsed = JSON.parse(raw);
          text = parsed.result ?? '';
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          if (attempt < MAX_RETRIES) {
            console.log(`    (Claude CLI attempt ${attempt} failed: ${err.code ?? err.message} — retrying...)`);
            await new Promise(r => setTimeout(r, attempt * 3000));
          }
        }
      }
      if (lastErr) throw lastErr;
    } finally {
      try { execFileSync('rm', [tmpFile]); } catch { /* ignore */ }
    }
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  return JSON.parse(jsonMatch[0]);
}

function applyFix(fix) {
  const prompt = readFileSync(SYSTEM_PROMPT_PATH, 'utf8');
  let updated;
  if (!fix.old) {
    // Append to end of system prompt
    updated = prompt.trimEnd() + '\n\n' + fix.new + '\n';
  } else {
    if (!prompt.includes(fix.old)) {
      console.log(`      ⚠ Fix not applied — old string not found in system prompt`);
      return false;
    }
    updated = prompt.replace(fix.old, fix.new);
  }
  writeFileSync(SYSTEM_PROMPT_PATH, updated, 'utf8');
  return true;
}

/* ─── Per-prompt fix helper ───────────────────────────────────────────────── */

async function fixFailingPrompt(failure, promptMap) {
  console.log(`\n  Diagnosing: ${failure.slug}`);
  let current = failure;
  let passed = false;
  const failedOlds = [];

  for (let attempt = 1; attempt <= MAX_ITER; attempt++) {
    const attemptLabel = isFinite(MAX_ITER) ? `${attempt}/${MAX_ITER}` : `${attempt}`;
    try {
      const fix = await getFix(current, failedOlds);
      console.log(`    [${attemptLabel}] Diagnosis: ${fix.diagnosis}`);

      if (fix.fixable === false) {
        console.log(`    [${attemptLabel}] Non-determinism — skipping (not fixable in system prompt)`);
        break;
      }

      const applied = applyFix(fix);
      if (!applied) {
        if (fix.old) failedOlds.push(fix.old);
        console.log(`    [${attemptLabel}] Fix string not found — retrying with context`);
        continue;
      }

      console.log(`    [${attemptLabel}] Fix applied — re-evaluating...`);
      const reEval = runEval([current.slug]);
      const reResult = { ...reEval.results[0], prompt: promptMap.get(current.slug)?.prompt ?? '' };

      if (reResult.allPass) {
        console.log(`    [${attemptLabel}] ✓ Passing`);
        passed = true;
        break;
      }

      const checks = `L1=${reResult.l1.pass ? '✓' : '✗'} L2=${reResult.l2.pass ? '✓' : '✗'} L3=${reResult.l3.pass ? '✓' : '✗'}`;
      console.log(`    [${attemptLabel}] ✗ Still failing: ${checks}`);
      current = reResult;
      failedOlds.length = 0;
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.log(`    [${attemptLabel}] ⚠ Malformed JSON response — retrying`);
        continue;
      }
      console.log(`    [${attemptLabel}] ⚠ Could not get fix: ${err.message}`);
      break;
    }
  }
  return { passed, final: current };
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

async function main() {
  const modelLabel = FIX_MODEL !== MODEL ? `${MODEL} / fix: ${FIX_MODEL}` : MODEL;
  const providerLabel = FIX_PROVIDER !== PROVIDER ? `${rawProvider} / fix: ${rawFixProvider}` : rawProvider;
  console.log(`\n=== A2UI Eval → Fix (${modelLabel}, ${providerLabel}) ===\n`);

  /* ── Build prompt map ── */
  const { readdirSync } = await import('fs');
  const promptMap = new Map(
    readdirSync(GOLDEN_DIR)
      .filter(f => f.endsWith('.json') && f !== 'index.json')
      .map(f => {
        const d = JSON.parse(readFileSync(join(GOLDEN_DIR, f), 'utf8'));
        return [d.slug, d];
      })
  );

  const allSlugs = [...promptMap.keys()]
    .filter(s => !FILTER_DIFFICULTY || promptMap.get(s).difficulty === FILTER_DIFFICULTY);

  const chunkSize = Math.max(EVAL_CONCURRENCY, 1);
  const totalChunks = Math.ceil(allSlugs.length / chunkSize);
  const attemptsLabel = NO_FIX
    ? 'eval only'
    : UNTIL_PASS
    ? 'fix: unlimited attempts per prompt'
    : `fix: max ${MAX_ITER} attempts per prompt`;
  console.log(
    `Steps 1–2/2  Streaming eval + fix — ${totalChunks} chunk(s) of ≤${chunkSize} (${attemptsLabel})...`,
  );

  let totalInitialPassCount = 0;
  let totalInitialFailCount = 0;
  const stillFailing = [];

  for (let i = 0; i < allSlugs.length; i += chunkSize) {
    const chunk = allSlugs.slice(i, i + chunkSize);
    const chunkNum = Math.floor(i / chunkSize) + 1;
    console.log(`\n  [Chunk ${chunkNum}/${totalChunks}]  Evaluating: ${chunk.join(', ')}`);

    const evalResult = runEval(chunk);
    const annotated = evalResult.results.map(r => ({
      ...r,
      prompt: promptMap.get(r.slug)?.prompt ?? '',
    }));

    for (const r of annotated) {
      if (r.allPass) {
        totalInitialPassCount++;
      } else {
        totalInitialFailCount++;
        if (NO_FIX) {
          stillFailing.push(r);
        } else {
          const { passed, final } = await fixFailingPrompt(r, promptMap);
          if (!passed) stillFailing.push(final);
        }
      }
    }
  }

  const totalEvaluated = totalInitialPassCount + totalInitialFailCount;
  const fixedCount = totalInitialFailCount - stillFailing.length;
  const failing = stillFailing;

  /* ── Summary ── */
  console.log('\n' + '─'.repeat(52));
  console.log(`  Initial:   ${totalInitialPassCount}/${totalEvaluated} passed`);
  if (!NO_FIX) {
    console.log(`  After fix: ${totalEvaluated - failing.length}/${totalEvaluated} passed`);
    console.log(`  Fixed:     ${fixedCount} prompts`);
  }

  if (failing.length > 0) {
    console.log(`\n  ⚠ ${failing.length} prompt(s) still failing:`);
    for (const f of failing) {
      const checks = `L1=${f.l1.pass ? '✓' : '✗'} L2=${f.l2.pass ? '✓' : '✗'} L3=${f.l3.pass ? '✓' : '✗'}`;
      console.log(`    - ${f.slug}: ${checks}`);
    }
  }

  if (!NO_FIX && fixedCount > 0) {
    console.log(`\nSystem prompt was patched. Review changes:`);
    console.log(`  git diff packages/a2ui/src/agent/system-prompt.md`);
    console.log(`\nRegenerate dependent docs after reviewing:`);
    console.log(`  pnpm a2ui:generate-docs`);
    console.log(`  pnpm a2ui:generate-catalog`);
  }

  console.log();
}

main().catch(err => { console.error(err); process.exit(1); });
