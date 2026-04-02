#!/usr/bin/env node
/**
 * eval-fix-review.mjs
 *
 * Full pipeline:
 *   1. Eval    — run all golden prompts, collect failures + generated code
 *   2. Fix     — for each failure, ask Claude to diagnose and patch the consumer snippet
 *   3. Re-eval — re-run only the failing prompts; repeat up to MAX_ITER times
 *   4. Review  — write EvalReview.tsx, register the route, start playground, open browser
 *
 * Usage:
 *   node tools/eval-fix-review.mjs
 *   node tools/eval-fix-review.mjs --model sonnet
 *   node tools/eval-fix-review.mjs --difficulty simple
 *   node tools/eval-fix-review.mjs --no-fix        # skip fix loop, go straight to review
 *   node tools/eval-fix-review.mjs --no-serve      # generate review page but don't start server
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, spawnSync, spawn } from 'child_process';
import { connect } from 'net';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SNIPPET_PATH = join(ROOT, 'docs/consumer-claude-md-snippet.md');
const EVAL_SCRIPT = join(__dirname, 'eval-golden-prompts.mjs');
const REVIEW_COMPONENT = join(ROOT, 'playground/vite-app/src/demos/EvalReview.tsx');
const ROUTES_FILE = join(ROOT, 'playground/vite-app/src/routes.tsx');

/* ─── CLI args ────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const getArg = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag = (flag) => args.includes(flag);

const MODEL = getArg('--model') ?? 'sonnet';
const FIX_MODEL = getArg('--fix-model') ?? MODEL; // defaults to --model if not specified
const rawProvider = getArg('--provider') ?? 'claude'; // 'claude' | 'straico' | 'local' | 'ollama' | 'lm-studio'
const PROVIDER = (rawProvider === 'ollama' || rawProvider === 'lm-studio') ? 'local' : rawProvider;
const LOCAL_URL = getArg('--local-url') ?? (rawProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const rawFixProvider = getArg('--fix-provider') ?? rawProvider; // defaults to --provider if not specified
const FIX_PROVIDER = (rawFixProvider === 'ollama' || rawFixProvider === 'lm-studio') ? 'local' : rawFixProvider;
const FIX_LOCAL_URL = getArg('--fix-local-url') ?? (rawFixProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const LOCAL_API_KEY = process.env.LOCAL_API_KEY ?? 'ollama';
const FILTER_DIFFICULTY = getArg('--difficulty');
const NO_FIX = hasFlag('--no-fix');
const NO_SERVE = hasFlag('--no-serve');
const NO_CACHE = hasFlag('--no-cache');
const FRESH = hasFlag('--fresh');
const UNTIL_PASS = hasFlag('--until-pass');
const MAX_ITER = UNTIL_PASS
  ? (getArg('--max-iter') ? parseInt(getArg('--max-iter'), 10) : Infinity)
  : parseInt(getArg('--max-iter') ?? '3', 10);
// Use a port outside the dev:all range (5173 = playground, 5174 = scale, 6006 = storybook)
const PREFERRED_PORT = 5190;

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

// Straico shorthands — mirrors eval-golden-prompts.mjs
// Full model list: https://straico.com/multimodel/
const STRAICO_MODEL_ALIASES = {
  // Anthropic
  sonnet:           'anthropic/claude-sonnet-4.5',
  'sonnet-4':       'anthropic/claude-sonnet-4',
  'sonnet-4.5':     'anthropic/claude-sonnet-4.5',
  opus:             'claude-opus-4-5',
  'opus-4':         'anthropic/claude-opus-4',
  'opus-4.5':       'claude-opus-4-5',
  haiku:            'claude-haiku-4-5-5',
  // OpenAI
  'gpt-4o':         'openai/gpt-4o-2024-11-20',
  'gpt-4o-mini':    'openai/gpt-4o-mini',
  'gpt-4.1':        'openai/gpt-4.1',
  'gpt-4.1-mini':   'openai/gpt-4.1-mini',
  'gpt-4.1-nano':   'openai/gpt-4.1-nano',
  'gpt-5':          'openai/gpt-5',
  'gpt-5-mini':     'openai/gpt-5-mini',
  'o3':             'o3-2025-04-16',
  'o4-mini':        'openai/o4-mini',
  // Google
  'gemini-flash':   'google/gemini-2.5-flash-lite',
  'gemini-pro':     'google/gemini-3.1-pro-preview',
  // DeepSeek
  'deepseek':       'deepseek/deepseek-chat-v3.1',
  'deepseek-r1':    'deepseek/deepseek-r1',
  // Meta
  'llama4':         'meta-llama/llama-4-maverick',
  // xAI
  'grok4':          'x-ai/grok-4',
  'grok3':          'x-ai/grok-3-beta',
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
  extraArgs.push('--provider', PROVIDER);
  if (PROVIDER === 'local') extraArgs.push('--local-url', LOCAL_URL);
  if (FILTER_DIFFICULTY) extraArgs.push('--difficulty', FILTER_DIFFICULTY);
  if (slugs?.length) extraArgs.push('--slugs', slugs.join(','));
  if (NO_CACHE) extraArgs.push('--no-cache');
  if (FRESH) extraArgs.push('--fresh');

  // Progress lines go to stderr (visible in terminal), JSON result to stdout.
  // Timeout: 90s per prompt / concurrency=5 * prompts, plus buffer. Use 15 min max.
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
  if (!result.l1.pass) lines.push(`L1 (TypeScript/registry errors):\n${result.l1.errors.map(e => `  - ${e}`).join('\n')}`);
  if (!result.l2.pass) lines.push(`L2 (missing components): ${result.l2.missing.join(', ')}`);
  if (!result.l3.pass) lines.push(`L3 (forbidden imports): ${result.l3.forbidden.join(', ')}`);
  return lines.join('\n');
}

async function getFix(result, failedOlds = []) {
  const snippet = readFileSync(SNIPPET_PATH, 'utf8');

  // Extract just the pitfalls section to keep the prompt short
  const pitfallsMatch = snippet.match(/5\. \*\*Common pitfalls[\s\S]*?(?=\n\d+\.|\n---|\n#)/);
  const pitfallsSection = pitfallsMatch ? pitfallsMatch[0] : snippet;

  const failedHint = failedOlds.length > 0
    ? `\nIMPORTANT: Previous fix attempts used these "old" strings which were NOT found verbatim in the documentation — do NOT use them again:\n${failedOlds.map(s => `  - "${s}"`).join('\n')}\nIf you cannot find an exact string to replace, set "old" to empty string "" to append a new bullet instead.\n`
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

Current documentation (pitfalls section):
${pitfallsSection}
${failedHint}
Identify the exact rule that is missing or unclear in the pitfalls section that caused this error.
The "old" value MUST be a substring that appears verbatim in the documentation above, or empty string "" to append a new bullet.
Output a JSON fix in this exact format (no other text, just the JSON):
{
  "diagnosis": "one sentence explaining the root cause",
  "old": "exact verbatim substring from the documentation above, or empty string to append",
  "new": "the replacement text (or new bullet to append if old is empty string)"
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
            { role: 'user', content: 'Output only the JSON fix object as instructed. No explanation, no markdown fences.' },
          ],
        }),
      });
      if (!response.ok) {
        const body = await response.text();
        if (response.status === 500 && body.includes('Excessively l')) {
          throw new Error(`Straico: fix prompt exceeds model context window for ${STRAICO_FIX_MODEL}.`);
        }
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
              { role: 'user', content: 'Output only the JSON fix object as instructed. No explanation, no markdown fences.' },
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
    const tmpFile = join(tmpdir(), `tale-ui-fix-prompt-${process.pid}.md`);
    writeFileSync(tmpFile, fixPrompt, 'utf8');
    const MAX_RETRIES = 3;
    let lastErr;
    try {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const raw = execFileSync(
            CLAUDE_BIN,
            ['--print', '--no-session-persistence', '--model', FIX_MODEL, '--append-system-prompt-file', tmpFile, '--output-format', 'json',
              'Output only the JSON fix object as instructed. No explanation, no markdown fences.'],
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

  // Extract JSON from the response (may be wrapped in fences)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  return JSON.parse(jsonMatch[0]);
}

function applyFix(fix) {
  const snippet = readFileSync(SNIPPET_PATH, 'utf8');
  let updated;
  if (!fix.old) {
    // Append as new bullet before the closing of the pitfalls section
    const insertBefore = '\n6. **Charts';
    updated = snippet.replace(insertBefore, `\n   - ${fix.new}${insertBefore}`);
  } else {
    if (!snippet.includes(fix.old)) {
      console.log(`      ⚠ Fix not applied — old string not found in snippet`);
      return false;
    }
    updated = snippet.replace(fix.old, fix.new);
  }
  writeFileSync(SNIPPET_PATH, updated, 'utf8');
  return true;
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
        if (/from\s+['"][^'"]+['"]\s*;?\s*$/.test(lines[i])) { i++; break; }
        i++;
      }
      // Extract the names block and package
      const namesMatch = block.match(/\{([\s\S]*?)\}/);
      const pkgMatch = block.match(/from\s+['"]([^'"]+)['"]/);
      if (namesMatch && pkgMatch) {
        const names = namesMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        results.push({ names, pkg: pkgMatch[1], isType });
      }
    } else {
      i++;
    }
  }
  return results;
}

function mergeImports(codeBlocks) {
  const named = new Map();   // pkg → Set<string>
  const typed = new Map();   // pkg → Set<string>

  for (const code of codeBlocks) {
    for (const { names, pkg, isType } of parseImports(code)) {
      const map = isType ? typed : named;
      if (!map.has(pkg)) map.set(pkg, new Set());
      for (const n of names) map.get(pkg).add(n);
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
  return 'Eval' + slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
}

function renameExport(code, slug) {
  const name = toFuncName(slug);
  // Handle: export function X, export default function X, export const X =
  const renamed = code
    .replace(/export\s+default\s+function\s+\w+/, `function ${name}`)
    .replace(/export\s+function\s+\w+/, `function ${name}`)
    .replace(/export\s+const\s+\w+\s*=/, `const ${name} =`);

  // If no function or const declaration was found, wrap bare JSX in a function
  if (!/^(function|const)\s+Eval/m.test(renamed)) {
    return `function ${name}() {\n  return (\n${renamed.split('\n').map(l => `    ${l}`).join('\n')}\n  );\n}`;
  }
  return renamed;
}

function generateEvalReview(passingResults, allPrompts) {
  const promptMap = new Map(allPrompts.map(p => [p.slug, p]));

  const codeBlocks = passingResults.map(r => r.code).filter(Boolean);
  const mergedImports = mergeImports(codeBlocks);

  const componentDefs = passingResults
    .filter(r => r.code)
    .map(r => {
      const body = renameExport(stripImports(r.code), r.slug);
      return `// ── ${r.slug} ${'─'.repeat(Math.max(0, 46 - r.slug.length))}\n${body}`;
    })
    .join('\n\n');

  const sections = passingResults
    .filter(r => r.code)
    .map(r => {
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
      </section>`.replace(/{r\.slug}/g, r.slug).replace(/{r\.difficulty}/g, r.difficulty);
    })
    .join('\n');

  return `// Auto-generated by eval-fix-review.mjs — re-run to update
import '@tale-ui/react-styles/index.css';
${mergedImports}

${componentDefs}

export default function EvalReview() {
  return (
    <div className="eval-review">
      <div className="eval-review__header">
        <h1>Eval Review</h1>
        <p>Generated code for ${passingResults.filter(r => r.code).length} golden prompts. Visual L4 inspection.</p>
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
    "import A2UIDemo from './demos/A2UIDemo';\nimport EvalReview from './demos/EvalReview';"
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
  { type: 'header', label: 'A2UI' },`
  );

  writeFileSync(ROUTES_FILE, routes, 'utf8');
}

/* ─── Playground server ───────────────────────────────────────────────────── */

function checkPort(port) {
  return new Promise(resolve => {
    const socket = connect(port, 'localhost');
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', () => { socket.destroy(); resolve(false); });
  });
}

async function waitForPort(port, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await checkPort(port)) return true;
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

async function findFreePort(start) {
  for (let port = start; port < start + 20; port++) {
    if (!await checkPort(port)) return port;
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
  const proc = spawn('pnpm', ['playground:dev', '--', '--port', String(port), '--strictPort'], {
    cwd: ROOT,
    detached: true,
    stdio: 'ignore',
  });
  proc.unref();

  const ready = await waitForPort(port);
  if (!ready) throw new Error(`Playground did not start on :${port} within 60s`);
  console.log(`  Playground ready on :${port}`);
  return port;
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

async function main() {
  const modelLabel = FIX_MODEL !== MODEL ? `${MODEL} / fix: ${FIX_MODEL}` : MODEL;
  const providerLabel = FIX_PROVIDER !== PROVIDER ? `${PROVIDER} / fix: ${FIX_PROVIDER}` : PROVIDER;
  console.log(`\n=== Eval → Fix → Review (${modelLabel}, ${providerLabel}) ===\n`);

  /* ── Step 1: Initial eval ── */
  console.log('Step 1/4  Running initial eval against all golden prompts...');
  let evalResult = runEval();

  // Load prompt text for fix loop
  const { readdirSync } = await import('fs');
  const goldenDir = join(__dirname, 'golden-prompts');
  const promptMap = new Map(
    readdirSync(goldenDir)
      .filter(f => f.endsWith('.json') && f !== 'index.json')
      .map(f => {
        const d = JSON.parse(readFileSync(join(goldenDir, f), 'utf8'));
        return [d.slug, d];
      })
  );

  // Annotate results with prompt text and code
  let results = evalResult.results.map(r => ({
    ...r,
    prompt: promptMap.get(r.slug)?.prompt ?? '',
  }));

  let passingCode = new Map(); // slug → code (keep best passing code)
  for (const r of results) {
    if (r.allPass && r.code) passingCode.set(r.slug, r);
  }

  let failing = results.filter(r => !r.allPass);
  console.log(`  ${results.length - failing.length}/${results.length} passed initially. ${failing.length} to fix.\n`);

  /* ── Step 2: Fix loop ── */
  if (!NO_FIX && failing.length > 0) {
    const attemptsLabel = UNTIL_PASS ? 'unlimited attempts per prompt' : `max ${MAX_ITER} attempts per prompt`;
    console.log(`Step 2/4  Fix loop (${attemptsLabel})...`);

    const stillFailing = [];
    for (const failure of failing) {
      console.log(`\n  Diagnosing: ${failure.slug}`);
      let current = failure;
      let passed = false;
      const failedOlds = [];
      for (let attempt = 1; attempt <= MAX_ITER; attempt++) {
        const attemptLabel = isFinite(MAX_ITER) ? `${attempt}/${MAX_ITER}` : `${attempt}`;
        try {
          const fix = await getFix(current, failedOlds);
          console.log(`    [${attemptLabel}] Diagnosis: ${fix.diagnosis}`);
          const applied = applyFix(fix);
          if (!applied) {
            if (fix.old) failedOlds.push(fix.old);
            console.log(`    [${attemptLabel}] Fix string not found in snippet — retrying with context`);
            continue;
          }
          console.log(`    [${attemptLabel}] Fix applied — re-evaluating...`);
          const reEval = runEval([current.slug]);
          const reResult = { ...reEval.results[0], prompt: promptMap.get(current.slug)?.prompt ?? '' };
          if (reResult.allPass && reResult.code) {
            passingCode.set(current.slug, reResult);
            console.log(`    [${attemptLabel}] ✓ Passing`);
            passed = true;
            break;
          }
          console.log(`    [${attemptLabel}] ✗ Still failing: L1=${reResult.l1.pass ? '✓' : '✗'} L2=${reResult.l2.pass ? '✓' : '✗'} L3=${reResult.l3.pass ? '✓' : '✗'}`);
          current = reResult; // use fresh result for next attempt's diagnosis
          failedOlds.length = 0; // reset — new failure context, old hints no longer relevant
        } catch (err) {
          if (err instanceof SyntaxError) {
            // Malformed JSON from the model — retryable
            console.log(`    [${attemptLabel}] ⚠ Malformed JSON response — retrying`);
            continue;
          }
          console.log(`    [${attemptLabel}] ⚠ Could not get fix: ${err.message}`);
          break;
        }
      }
      if (!passed) stillFailing.push(current);
    }

    const fixed = failing.length - stillFailing.length;
    console.log(`\n  Fixed ${fixed}/${failing.length} prompts. ${stillFailing.length} still failing.`);
    failing = stillFailing;
  } else if (NO_FIX) {
    console.log('Step 2/4  Fix loop skipped (--no-fix).');
  } else {
    console.log('Step 2/4  No failures — fix loop not needed.');
  }

  if (failing.length > 0) {
    console.log(`\n  ⚠ ${failing.length} prompt(s) still failing after fix loop:`);
    for (const f of failing) console.log(`    - ${f.slug}: L1=${f.l1.pass ? '✓' : '✗'} L2=${f.l2.pass ? '✓' : '✗'} L3=${f.l3.pass ? '✓' : '✗'}`);
  }

  /* ── Step 2b: Final fresh eval ── */
  console.log('\nStep 2b/4  Running fresh eval for final review generations...');
  const finalEval = runEval();
  for (const r of finalEval.results) {
    const withPrompt = { ...r, prompt: promptMap.get(r.slug)?.prompt ?? '' };
    if (r.allPass && r.code) passingCode.set(r.slug, withPrompt);
  }
  const finalFailing = finalEval.results.filter(r => !r.allPass);
  console.log(`  ${finalEval.results.length - finalFailing.length}/${finalEval.results.length} passing in final eval.`);

  /* ── Step 3: Generate review page ── */
  console.log('\nStep 3/4  Generating EvalReview.tsx...');
  const passingResults = [...passingCode.values()];

  if (passingResults.length === 0) {
    console.log('  No passing results — nothing to review.');
    process.exit(0);
  }

  const reviewCode = generateEvalReview(
    passingResults,
    [...promptMap.values()]
  );
  writeFileSync(REVIEW_COMPONENT, reviewCode, 'utf8');
  ensureEvalRoute();
  console.log(`  Written: ${passingResults.length} components to EvalReview.tsx`);

  if (NO_SERVE) {
    console.log(`\nStep 4/4  Skipped (--no-serve). Open playground manually: http://localhost:${PREFERRED_PORT}/eval-review`);
    return;
  }

  /* ── Step 4: Serve and open ── */
  console.log('\nStep 4/4  Starting playground...');
  const port = await startPlayground();

  const url = `http://localhost:${port}/eval-review`;
  console.log(`  Opening ${url}`);
  execFileSync('open', [url]);

  console.log('\nDone. Browser opened to eval review page.');
  if (failing.length > 0) {
    console.log(`\nNote: consumer snippet was patched during the fix loop.`);
    console.log(`Run \`git diff docs/consumer-claude-md-snippet.md\` to review changes.`);
  }
  console.log();
}

main().catch(err => { console.error(err); process.exit(1); });
