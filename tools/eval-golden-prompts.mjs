#!/usr/bin/env node
/**
 * eval-golden-prompts.mjs
 *
 * Runs each golden prompt against Claude (via the Claude Code CLI) and scores
 * the output across three automated checks:
 *
 *   L1 — Validity:    output passes validate-generated.mjs (registry + TypeScript)
 *   L2 — Components:  all expected `tags` components appear in the output
 *   L3 — Imports:     no imports from packages outside the allowed set
 *
 * Requires: Claude Code CLI installed (~/.local/bin/claude or on PATH)
 *
 * Usage:
 * Provider: Claude Code CLI (default) or Straico API
 *
 *   node tools/eval-golden-prompts.mjs
 *   node tools/eval-golden-prompts.mjs --model sonnet
 *   node tools/eval-golden-prompts.mjs --model claude-haiku-4-5-20251001
 *   node tools/eval-golden-prompts.mjs --difficulty simple
 *   node tools/eval-golden-prompts.mjs --slug primary-button
 *   node tools/eval-golden-prompts.mjs --concurrency 10
 *   node tools/eval-golden-prompts.mjs --json
 *   node tools/eval-golden-prompts.mjs --no-cache    # skip call cache, always call provider
 *   node tools/eval-golden-prompts.mjs --fresh       # skip both caches, true benchmark run
 *
 * Straico provider (set STRAICO_API_KEY env var):
 *   node tools/eval-golden-prompts.mjs --provider straico
 *   node tools/eval-golden-prompts.mjs --provider straico --model anthropic/claude-sonnet-4
 *   node tools/eval-golden-prompts.mjs --provider straico --model openai/gpt-4o
 *   node tools/eval-golden-prompts.mjs --provider straico --model google/gemini-2.0-flash
 *
 * Local provider — Ollama or LM Studio (both expose an OpenAI-compatible API):
 *   node tools/eval-golden-prompts.mjs --provider ollama --model llama3.2
 *   node tools/eval-golden-prompts.mjs --provider lm-studio --model llama3.2
 *   node tools/eval-golden-prompts.mjs --provider local --model llama3.2                         # same as --provider ollama
 *   node tools/eval-golden-prompts.mjs --provider local --model llama3.2 --local-url http://localhost:1234/v1
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, spawn } from 'child_process';
import { tmpdir } from 'os';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const GOLDEN_DIR = join(__dirname, 'golden-prompts');
const SNIPPET_PATH = join(ROOT, 'docs/consumer-claude-md-snippet.md');

/* ─── Claude CLI resolution ───────────────────────────────────────────────── */

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

  // Fall back to PATH lookup
  try {
    const result = execFileSync('which', ['claude'], { encoding: 'utf8' }).trim();
    if (result) return result;
  } catch { /* not on PATH */ }

  return null;
}

/* ─── CLI args ────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const getArg = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag = (flag) => args.includes(flag);

const rawProvider = getArg('--provider') ?? 'claude'; // 'claude' | 'straico' | 'local' | 'ollama' | 'lm-studio'
const PROVIDER = (rawProvider === 'ollama' || rawProvider === 'lm-studio') ? 'local' : rawProvider;
const LOCAL_URL = getArg('--local-url') ?? (rawProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const LOCAL_API_KEY = process.env.LOCAL_API_KEY ?? 'ollama'; // some servers require a non-empty key
const FILTER_DIFFICULTY = getArg('--difficulty');
const FILTER_SLUG = getArg('--slug');
const FILTER_SLUGS = getArg('--slugs')?.split(',').map(s => s.trim()) ?? null;
const JSON_OUTPUT = hasFlag('--json');
const CONCURRENCY = parseInt(getArg('--concurrency') ?? '5', 10);
const NO_CACHE = hasFlag('--no-cache') || hasFlag('--fresh');
const FRESH = hasFlag('--fresh'); // bypass both caches

/* ─── Model resolution ────────────────────────────────────────────────────── */

// Claude shorthands → full model IDs used by the Claude Code CLI
const CLAUDE_MODEL_ALIASES = {
  sonnet: 'claude-sonnet-4-6',
  opus:   'claude-opus-4-6',
  haiku:  'claude-haiku-4-5-20251001',
};

// Straico shorthands → Straico model strings (provider/model-name format)
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

const rawModel = getArg('--model') ?? 'sonnet';
const MODEL = PROVIDER === 'straico'
  ? (STRAICO_MODEL_ALIASES[rawModel] ?? rawModel)
  : (CLAUDE_MODEL_ALIASES[rawModel] ?? rawModel);

/* ─── Provider setup ─────────────────────────────────────────────────────── */

let CLAUDE_BIN = null;
let STRAICO_API_KEY = null;

if (PROVIDER === 'straico') {
  STRAICO_API_KEY = process.env.STRAICO_API_KEY;
  if (!STRAICO_API_KEY) {
    console.error('ERROR: STRAICO_API_KEY environment variable is not set.');
    console.error('Get your API key at https://platform.straico.com/user-settings');
    process.exit(1);
  }
} else if (PROVIDER === 'local') {
  // No validation needed — local servers need no API key.
  // Connection errors will surface naturally on first call.
} else {
  CLAUDE_BIN = findClaude();
  if (!CLAUDE_BIN) {
    console.error('ERROR: Claude Code CLI not found.');
    console.error('Install it from https://claude.ai/download or set CLAUDE_PATH to the binary location.');
    process.exit(1);
  }
}

/* ─── Allowed imports (L3) ────────────────────────────────────────────────── */

const ALLOWED_IMPORT_PREFIXES = [
  '@tale-ui/react',
  '@tale-ui/charts',
  'react',
  'react-aria-components',
  'lucide-react',
  '@internationalized/',
];

/* ─── System prompt ───────────────────────────────────────────────────────── */

const snippetRaw = readFileSync(SNIPPET_PATH, 'utf8');
const snippetContent = snippetRaw.replace(/^[\s\S]*?(?=^## UI Components)/m, '');

// Eval-lite: strip sections not needed for L1/L2/L3 checks (Charts, A2UI, Dark mode).
// Used automatically for Straico to stay within smaller context windows.
function makeEvalLiteContent(content) {
  return content
    .replace(/\n6\. \*\*Charts[\s\S]*?(?=\n\d+\.|\n---|$)/m, '')
    .replace(/\n7\. \*\*Dark mode[\s\S]*?(?=\n\d+\.|\n---|$)/m, '')
    .replace(/\n8\. \*\*A2UI[\s\S]*?(?=\n\d+\.|\n---|$)/m, '')
    .trim();
}

const fullContent = snippetContent;
const liteContent = makeEvalLiteContent(snippetContent);

function buildSystemPrompt(content) {
  return `You are a React developer working on a project that uses Tale UI components.

${content}

---

When asked to create UI, generate a single self-contained TypeScript/TSX code block.
Rules:
- Return ONLY the code block, no explanation before or after.
- Use Tale UI components exclusively — no raw HTML layout elements like <div> where a Tale UI layout component exists.
- Follow all import, composition, and pitfall rules listed above exactly.`;
}

// Local and Straico use the lite prompt to stay within smaller context limits.
// Claude CLI uses the full prompt.
const SYSTEM_PROMPT = buildSystemPrompt(PROVIDER === 'claude' ? fullContent : liteContent);

/* ─── Cache ───────────────────────────────────────────────────────────────── */
//
// Two-level cache to minimise Claude calls and redundant TypeScript checks:
//
//   L1 — Call cache   (tools/.eval-call-cache.json)
//     Key:   model + snippet hash + registry hash + prompt content hash
//     Value: the generated code string
//     Valid: only while snippet, registry, and prompt are unchanged
//     Accuracy: NOT guaranteed — same inputs can produce different LLM output.
//               Use for iteration (patching docs), not for scoring.
//     Bypass: --no-cache or --fresh
//
//   L2 — Check cache  (tools/.eval-check-cache.json)
//     Key:   code hash + registry hash
//     Value: {l1, l2, l3} check results
//     Valid: always — same code against same registry always produces same result.
//             L1/L2/L3 checks are deterministic.
//     Bypass: --fresh only
//
// Typical workflows:
//   Default run    — call cache skips prompts Claude already passed; check cache
//                    avoids re-running tsc on code we've seen before.
//   --no-cache     — always calls Claude but still uses check cache (saves tsc time).
//   --fresh        — bypasses both caches. Use for accurate benchmark scores.

const CALL_CACHE_FILE = join(__dirname, '.eval-call-cache.json');
const CHECK_CACHE_FILE = join(__dirname, '.eval-check-cache.json');
const REGISTRY_PATH = join(ROOT, 'registry/components.json');

function hashString(s) {
  return createHash('sha256').update(s).digest('hex').slice(0, 16);
}

const snippetHash = hashString(SYSTEM_PROMPT);
const registryHash = existsSync(REGISTRY_PATH)
  ? hashString(readFileSync(REGISTRY_PATH, 'utf8'))
  : 'no-registry';

function makeCallCacheKey(slug, promptText) {
  return `${MODEL}:${snippetHash}:${registryHash}:${hashString(slug + promptText)}`;
}

function makeCheckCacheKey(code) {
  return `${registryHash}:${hashString(code)}`;
}

// Load call cache (bypassed by --no-cache / --fresh)
let callCache = {};
if (!NO_CACHE && existsSync(CALL_CACHE_FILE)) {
  try { callCache = JSON.parse(readFileSync(CALL_CACHE_FILE, 'utf8')); } catch { callCache = {}; }
}

// Load check cache (bypassed by --fresh only)
let checkCache = {};
if (!FRESH && existsSync(CHECK_CACHE_FILE)) {
  try { checkCache = JSON.parse(readFileSync(CHECK_CACHE_FILE, 'utf8')); } catch { checkCache = {}; }
}

function saveCallCache(key, code) {
  if (NO_CACHE) return;
  callCache[key] = code;
  try { writeFileSync(CALL_CACHE_FILE, JSON.stringify(callCache, null, 2), 'utf8'); } catch { /* ignore */ }
}

function saveCheckCache(key, checks) {
  if (FRESH) return;
  checkCache[key] = checks;
  try { writeFileSync(CHECK_CACHE_FILE, JSON.stringify(checkCache, null, 2), 'utf8'); } catch { /* ignore */ }
}

/* ─── Load prompts ────────────────────────────────────────────────────────── */

const files = readdirSync(GOLDEN_DIR)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort();

let prompts = files.map(f => JSON.parse(readFileSync(join(GOLDEN_DIR, f), 'utf8')));

if (FILTER_DIFFICULTY) prompts = prompts.filter(p => p.difficulty === FILTER_DIFFICULTY);
if (FILTER_SLUG) prompts = prompts.filter(p => p.slug === FILTER_SLUG);
if (FILTER_SLUGS) prompts = prompts.filter(p => FILTER_SLUGS.includes(p.slug));

if (prompts.length === 0) {
  console.error('No prompts matched the given filters.');
  process.exit(1);
}

/* ─── Provider calls ──────────────────────────────────────────────────────── */

// Write system prompt to a temp file once (Claude CLI only)
const SYSTEM_PROMPT_FILE = join(tmpdir(), `tale-ui-eval-system-${process.pid}.md`);
if (PROVIDER === 'claude') {
  writeFileSync(SYSTEM_PROMPT_FILE, SYSTEM_PROMPT, 'utf8');
  process.on('exit', () => { try { unlinkSync(SYSTEM_PROMPT_FILE); } catch { /* ignore */ } });
}

function callClaude(userPrompt) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      CLAUDE_BIN,
      [
        '--print',
        '--no-session-persistence',
        '--model', MODEL,
        '--append-system-prompt-file', SYSTEM_PROMPT_FILE,
        '--output-format', 'json',
        userPrompt,
      ],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let stdout = '';
    proc.stdout.on('data', d => { stdout += d; });

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('Claude CLI timed out after 90s'));
    }, 90000);

    proc.on('close', () => {
      clearTimeout(timer);
      try {
        const parsed = JSON.parse(stdout);
        if (parsed.is_error) return reject(new Error(parsed.result ?? 'Claude CLI returned an error'));
        resolve(parsed.result ?? '');
      } catch {
        reject(new Error(`Failed to parse Claude output: ${stdout.slice(0, 200)}`));
      }
    });

    proc.on('error', (err) => { clearTimeout(timer); reject(err); });
  });
}

async function callStraico(userPrompt, { retries = 3 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120000);
    try {
      const response = await fetch('https://api.straico.com/v0/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAICO_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 16384,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text();
        // 500 with "Excessively long" = context overflow — no point retrying
        if (response.status === 500 && body.includes('Excessively l')) {
          throw new Error(`Straico: system prompt exceeds context window for ${MODEL}. The pitfalls section is ~46k chars — use a model with ≥100k context (e.g. --model sonnet, --model gpt-4o) or use --provider claude.`);
        }
        // 502/503/504 are transient — retry with backoff
        if ((response.status === 502 || response.status === 503 || response.status === 504) && attempt < retries) {
          lastErr = new Error(`Straico API error (${response.status}) — retrying (${attempt}/${retries})`);
          await new Promise(r => setTimeout(r, attempt * 2000));
          continue;
        }
        throw new Error(`Straico API error (${response.status}): ${body.slice(0, 200)}`);
      }

      const json = await response.json();
      const completion = json.data?.completion ?? json.completion ?? json;
      const content = completion?.choices?.[0]?.message?.content ?? '';
      if (!content) throw new Error(`Straico returned an empty response: ${JSON.stringify(json).slice(0, 200)}`);
      return content;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('Straico timed out after 120s');
      // Non-retryable errors bubble immediately
      if (!err.message.startsWith('Straico API error (502') &&
          !err.message.startsWith('Straico API error (503') &&
          !err.message.startsWith('Straico API error (504')) throw err;
      lastErr = err;
      if (attempt < retries) await new Promise(r => setTimeout(r, attempt * 2000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

async function callLocal(userPrompt, { retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180000); // 3 min — local models can be slow
    try {
      const response = await fetch(`${LOCAL_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOCAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Local API error (${response.status}): ${body.slice(0, 200)}`);
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content ?? '';
      if (!content) throw new Error(`Local model returned an empty response: ${JSON.stringify(json).slice(0, 200)}`);
      return content;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error(`Local model timed out after 180s — model may be too slow or not loaded`);
      if (err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
        throw new Error(`Cannot connect to local server at ${LOCAL_URL} — is Ollama/LM Studio running?`);
      }
      lastErr = err;
      if (attempt < retries) await new Promise(r => setTimeout(r, 2000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

function callProvider(userPrompt) {
  if (PROVIDER === 'straico') return callStraico(userPrompt);
  if (PROVIDER === 'local') return callLocal(userPrompt);
  return callClaude(userPrompt);
}

/* ─── Code extraction ─────────────────────────────────────────────────────── */

function extractCode(text) {
  const fenced = text.match(/```(?:tsx?|jsx?)\n([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const importIdx = text.indexOf('import ');
  if (importIdx !== -1) return text.slice(importIdx).trim();
  return text.trim();
}

/* ─── L1: Validity ────────────────────────────────────────────────────────── */

function checkL1(code) {
  try {
    const result = execFileSync(
      process.execPath,
      [join(__dirname, 'validate-generated.mjs'), '--code', code, '--json'],
      { cwd: ROOT, timeout: 30000, encoding: 'utf8', stdio: 'pipe' }
    );
    const parsed = JSON.parse(result);
    const errors = [
      ...(parsed.registryErrors ?? []),
      ...(parsed.typescriptErrors ?? []).map(e => `Line ${e.line}: ${e.message}`),
    ];
    return { pass: errors.length === 0, errors };
  } catch (err) {
    try {
      const parsed = JSON.parse(err.stdout || '{}');
      const errors = [
        ...(parsed.registryErrors ?? []),
        ...(parsed.typescriptErrors ?? []).map(e => `Line ${e.line}: ${e.message}`),
      ];
      return { pass: errors.length === 0, errors };
    } catch {
      return { pass: false, errors: [(err.stdout || err.message || 'Validator failed').trim()] };
    }
  }
}

/* ─── L2: Component coverage ──────────────────────────────────────────────── */

function checkL2(code, tags) {
  const missing = tags.filter(tag => !code.includes(tag));
  return { pass: missing.length === 0, missing };
}

/* ─── L3: Import cleanliness ──────────────────────────────────────────────── */

function checkL3(code) {
  const importLines = [...code.matchAll(/^import\s+.*?\s+from\s+['"]([^'"]+)['"]/gm)];
  const forbidden = importLines
    .map(m => m[1])
    .filter(pkg => !ALLOWED_IMPORT_PREFIXES.some(prefix => pkg.startsWith(prefix)));
  return { pass: forbidden.length === 0, forbidden };
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

// When in --json mode, progress goes to stderr so it's visible in the terminal
// while stdout stays clean for machine-readable JSON parsing.
const log = JSON_OUTPUT
  ? (...args) => process.stderr.write(args.join(' ') + '\n')
  : (...args) => process.stdout.write(args.join(' ') + '\n');
const logInline = JSON_OUTPUT
  ? (s) => process.stderr.write(s)
  : (s) => process.stdout.write(s);

async function evalPrompt(prompt, nth, total) {
  const callKey = makeCallCacheKey(prompt.slug, prompt.prompt);
  const counter = `[${String(nth).padStart(String(total).length)}/${total}]`;

  // ── Level 1: call cache ──────────────────────────────────────────────────
  // If we have cached code for this exact prompt+snippet+model, skip Claude.
  // Note: this is an optimistic shortcut for iteration, not a benchmark.
  const cachedCode = callCache[callKey];
  let code = '';
  let callError = null;
  let callCacheHit = false;

  if (cachedCode !== undefined) {
    code = cachedCode;
    callCacheHit = true;
  } else {
    try {
      const rawOutput = await callProvider(prompt.prompt);
      code = extractCode(rawOutput);
    } catch (err) {
      callError = err.message;
    }
  }

  // ── Level 2: check cache ─────────────────────────────────────────────────
  // Check results (L1/L2/L3) are deterministic: same code + same registry
  // always produces the same result. Always safe to cache.
  let l1, l2, l3;
  let checkCacheHit = false;

  if (callError) {
    l1 = { pass: false, errors: [callError] };
    l2 = { pass: false, missing: prompt.tags ?? [] };
    l3 = { pass: false, forbidden: [] };
  } else {
    const checkKey = makeCheckCacheKey(code);
    const cachedChecks = checkCache[checkKey];

    if (cachedChecks) {
      ({ l1, l2, l3 } = cachedChecks);
      checkCacheHit = true;
    } else {
      l1 = checkL1(code);
      l2 = checkL2(code, prompt.tags ?? []);
      l3 = checkL3(code);
      saveCheckCache(checkKey, { l1, l2, l3 });
    }
  }

  const allPass = l1.pass && l2.pass && l3.pass;

  // Save to call cache only on full pass — failures may be transient
  if (allPass && !callCacheHit) saveCallCache(callKey, code);

  // ── Log ──────────────────────────────────────────────────────────────────
  const checks = [
    l1.pass ? '✓ L1' : '✗ L1',
    l2.pass ? '✓ L2' : '✗ L2',
    l3.pass ? '✓ L3' : '✗ L3',
  ].join('  ');
  const cacheLabel = callCacheHit ? '  (call cached)' : checkCacheHit ? '  (checks cached)' : '';
  log(`  ${counter}  ${prompt.slug.padEnd(30)} [${prompt.difficulty}]  ${checks}${cacheLabel}`);
  if (!l1.pass) {
    for (const e of l1.errors.slice(0, 3)) log(`      L1: ${e}`);
    if (l1.errors.length > 3) log(`      L1: ... and ${l1.errors.length - 3} more`);
  }
  if (!l2.pass) log(`      L2: missing components: ${l2.missing.join(', ')}`);
  if (!l3.pass) log(`      L3: forbidden imports: ${l3.forbidden.join(', ')}`);

  return {
    slug: prompt.slug,
    difficulty: prompt.difficulty,
    allPass,
    l1, l2, l3,
    _callCached: callCacheHit,
    _checkCached: checkCacheHit,
    ...(JSON_OUTPUT ? { code } : {}),
  };
}

async function runPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let next = 0;
  let completed = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], completed + 1, items.length);
      completed++;
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

async function main() {
  log(`\n=== Golden Prompt Eval — ${MODEL} ===\n`);
  if (FILTER_DIFFICULTY) log(`  Filter: difficulty=${FILTER_DIFFICULTY}`);
  if (FILTER_SLUG) log(`  Filter: slug=${FILTER_SLUG}`);
  log(`  Prompts:     ${prompts.length}`);
  log(`  Concurrency: ${CONCURRENCY}`);
  const providerLabel = PROVIDER === 'straico' ? `straico (${MODEL})`
    : PROVIDER === 'local' ? `local @ ${LOCAL_URL} (${MODEL})`
    : `claude cli (${CLAUDE_BIN})`;
  log(`  Provider:    ${providerLabel}\n`);

  const results = await runPool(prompts, CONCURRENCY, evalPrompt);

  /* ── Summary ── */

  const total = results.length;
  const passed = results.filter(r => r.allPass).length;
  const l1Pass = results.filter(r => r.l1.pass).length;
  const l2Pass = results.filter(r => r.l2.pass).length;
  const l3Pass = results.filter(r => r.l3.pass).length;
  const callCacheHits = results.filter(r => r._callCached).length;
  const checkCacheHits = results.filter(r => !r._callCached && r._checkCached).length;

  log(`\n${'─'.repeat(52)}`);
  log(`  Model:          ${MODEL}`);
  log(`  Overall:        ${passed}/${total} passed all checks`);
  if (callCacheHits > 0) log(`  Call cache:     ${callCacheHits}/${total} skipped Claude calls`);
  if (checkCacheHits > 0) log(`  Check cache:    ${checkCacheHits}/${total} skipped tsc checks`);
  log(`  L1 validity:    ${l1Pass}/${total}`);
  log(`  L2 components:  ${l2Pass}/${total}`);
  log(`  L3 imports:     ${l3Pass}/${total}`);
  for (const diff of ['simple', 'medium', 'complex']) {
    const group = results.filter(r => r.difficulty === diff);
    if (group.length === 0) continue;
    const gPassed = group.filter(r => r.allPass).length;
    log(`  ${diff.padEnd(8)}: ${gPassed}/${group.length}`);
  }
  log('');

  if (JSON_OUTPUT) {
    process.stdout.write(JSON.stringify({ model: MODEL, total, passed, l1Pass, l2Pass, l3Pass, results }, null, 2) + '\n');
  }
}

main();
