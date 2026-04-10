#!/usr/bin/env node
/**
 * eval-golden-prompts.mjs
 *
 * Runs each golden prompt against an LLM provider and scores
 * the output across three automated checks:
 *
 *   L1 — Validity:    output passes validate-generated.mjs (registry + TypeScript)
 *   L2 — Components:  all expected `tags` components appear in the output
 *   L3 — Imports:     no imports from packages outside the allowed set
 *
 * Requires: a provider CLI/API configured for the selected provider
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
 *
 * Codex CLI provider (OpenAI Codex — requires `codex` on PATH or CODEX_PATH env var):
 *   node tools/eval-golden-prompts.mjs --provider codex                          # default model: o4-mini
 *   node tools/eval-golden-prompts.mjs --provider codex --model o3
 *   node tools/eval-golden-prompts.mjs --provider codex --model gpt-4.1
 *   node tools/eval-golden-prompts.mjs --provider codex --slug primary-button --no-cache
 *
 * MCP mode (Claude CLI or Codex CLI) — agentic mode with the Tale UI MCP server:
 *   Uses the lightweight consumer snippet (~1,300 tokens) instead of the full eval context.
 *   The model calls plan_ui / get_component for just-in-time pitfall delivery.
 *   node tools/eval-golden-prompts.mjs --mcp
 *   node tools/eval-golden-prompts.mjs --mcp --model sonnet
 *   node tools/eval-golden-prompts.mjs --provider codex --model gpt-5.4 --mcp
 *   node tools/eval-golden-prompts.mjs --mcp --slug primary-button --no-cache
 *   node tools/eval-golden-prompts.mjs --mcp --mcp-max-turns 8      # raise agent turn cap (default: 5)
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, spawn } from 'child_process';
import { tmpdir } from 'os';
import { createHash } from 'crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import {
  buildCodexExecArgs,
  buildCodexMcpConfigOverride,
  loadTaleUiMcpServerSpec,
  ALLOWED_IMPORT_PREFIXES,
  extractCode,
  checkL1,
  checkL2,
  checkL3,
} from './eval-golden-prompts-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const GOLDEN_DIR = join(__dirname, 'golden-prompts');
const EVAL_CONTEXT_PATH = join(__dirname, '.eval-context.md');
const SNIPPET_FALLBACK_PATH = join(ROOT, 'docs/consumer-claude-md-snippet.md');

/* ─── CLI binary resolution ───────────────────────────────────────────────── */

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
  } catch {
    /* not on PATH */
  }

  return null;
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
    const result = execFileSync('which', ['codex'], { encoding: 'utf8' }).trim();
    if (result) return result;
  } catch {
    /* not on PATH */
  }

  return null;
}

/* ─── CLI args ────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const rawProvider = getArg('--provider') ?? 'claude'; // 'claude' | 'straico' | 'local' | 'ollama' | 'lm-studio' | 'codex'
const PROVIDER = rawProvider === 'ollama' || rawProvider === 'lm-studio' ? 'local' : rawProvider;
const LOCAL_URL =
  getArg('--local-url') ??
  (rawProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const LOCAL_API_KEY = process.env.LOCAL_API_KEY ?? 'ollama'; // some servers require a non-empty key
const FILTER_DIFFICULTY = getArg('--difficulty');
const FILTER_SLUG = getArg('--slug');
const FILTER_SLUGS =
  getArg('--slugs')
    ?.split(',')
    .map((s) => s.trim()) ?? null;
const JSON_OUTPUT = hasFlag('--json');
const QUIET_PASSING = hasFlag('--quiet-passing'); // suppress one-liners for passing prompts
const NO_CACHE = hasFlag('--no-cache') || hasFlag('--fresh');
const SKIP_GENERATE = hasFlag('--skip-generate');
const FRESH = hasFlag('--fresh'); // bypass both caches
const MCP_MODE = hasFlag('--mcp');
const MCP_CONFIG_PATH = join(ROOT, '.mcp.json');
const MCP_MAX_TURNS = parseInt(getArg('--mcp-max-turns') ?? '5', 10);
// MCP mode spawns an MCP server per invocation — default to lower concurrency
const CONCURRENCY = parseInt(getArg('--concurrency') ?? (MCP_MODE ? '3' : '5'), 10);

/* ─── Model resolution ────────────────────────────────────────────────────── */

// Claude shorthands → full model IDs used by the Claude Code CLI
const CLAUDE_MODEL_ALIASES = {
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
  haiku: 'claude-haiku-4-5-20251001',
};

// Straico shorthands → Straico model strings (provider/model-name format)
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

// Codex shorthands → OpenAI model IDs used by the Codex CLI
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

const rawModel = getArg('--model') ?? (PROVIDER === 'codex' ? 'o4-mini' : 'sonnet');
const MODEL =
  PROVIDER === 'straico'
    ? (STRAICO_MODEL_ALIASES[rawModel] ?? rawModel)
    : PROVIDER === 'codex'
      ? (CODEX_MODEL_ALIASES[rawModel] ?? rawModel)
      : (CLAUDE_MODEL_ALIASES[rawModel] ?? rawModel);

/* ─── Provider setup ─────────────────────────────────────────────────────── */

let CLAUDE_BIN = null;
let CODEX_BIN = null;
let STRAICO_API_KEY = null;
let CODEX_MCP_CONFIG_OVERRIDE = null;
let LOCAL_MCP_CLIENT = null;
let LOCAL_MCP_TOOLS = [];

async function closeLocalMcpClient() {
  if (!LOCAL_MCP_CLIENT) return;
  const client = LOCAL_MCP_CLIENT;
  LOCAL_MCP_CLIENT = null;
  try {
    await client.close();
  } catch {
    /* ignore cleanup errors */
  }
}

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
} else if (PROVIDER === 'codex') {
  CODEX_BIN = findCodex();
  if (!CODEX_BIN) {
    console.error('ERROR: Codex CLI not found.');
    console.error(
      'Install it from https://github.com/openai/codex or set CODEX_PATH to the binary location.',
    );
    process.exit(1);
  }
} else {
  CLAUDE_BIN = findClaude();
  if (!CLAUDE_BIN) {
    console.error('ERROR: Claude Code CLI not found.');
    console.error(
      'Install it from https://claude.ai/download or set CLAUDE_PATH to the binary location.',
    );
    process.exit(1);
  }
}

// MCP mode uses the lightweight consumer snippet as system prompt.
// Claude attaches the MCP server via --mcp-config/--allowedTools.
// Codex attaches the repo-local Tale UI MCP server via per-run config overrides.
if (MCP_MODE && (PROVIDER === 'claude' || PROVIDER === 'codex' || PROVIDER === 'local') && !existsSync(MCP_CONFIG_PATH)) {
  console.error(`ERROR: --mcp mode requires ${MCP_CONFIG_PATH} to exist.`);
  process.exit(1);
}
if (MCP_MODE && PROVIDER === 'codex') {
  try {
    CODEX_MCP_CONFIG_OVERRIDE = buildCodexMcpConfigOverride(MCP_CONFIG_PATH);
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    process.exit(1);
  }
}

// ALLOWED_IMPORT_PREFIXES imported from eval-golden-prompts-lib.mjs

/* ─── Eval context (auto-generated, includes expanded pitfalls) ───────────── */

// MCP mode uses the consumer snippet directly (it already says "call plan_ui first").
// Generating the full eval context would override the MCP pointer with front-loaded pitfalls.
if (!SKIP_GENERATE && !MCP_MODE) {
  try {
    execFileSync(process.execPath, [join(__dirname, 'generate-eval-context.js')], {
      cwd: ROOT,
      timeout: 10000,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (err) {
    // Non-fatal: fall back to the consumer snippet if generation fails
    process.stderr.write(`Warning: could not generate eval context: ${err.message}\n`);
  }
}

/* ─── System prompt ───────────────────────────────────────────────────────── */

// MCP mode: use the lightweight consumer snippet so the provider can call MCP tools for JIT pitfalls.
// Non-MCP mode: use the expanded eval context (~11k tokens of pre-loaded pitfall knowledge).
const snippetPath = MCP_MODE
  ? SNIPPET_FALLBACK_PATH
  : existsSync(EVAL_CONTEXT_PATH)
    ? EVAL_CONTEXT_PATH
    : SNIPPET_FALLBACK_PATH;
const snippetRaw = readFileSync(snippetPath, 'utf8');
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
- Do not include app-level global stylesheet imports such as '@tale-ui/react/styles' or '@tale-ui/react-styles' unless the prompt is specifically about app setup or styling infrastructure.
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
  // MCP and non-MCP runs use different system prompts → keep separate cache buckets
  const modePrefix = MCP_MODE ? 'mcp:' : '';
  return `${modePrefix}${MODEL}:${snippetHash}:${registryHash}:${hashString(slug + promptText)}`;
}

function makeCheckCacheKey(code) {
  return `${registryHash}:${hashString(code)}`;
}

// Load call cache (bypassed by --no-cache / --fresh)
let callCache = {};
if (!NO_CACHE && existsSync(CALL_CACHE_FILE)) {
  try {
    callCache = JSON.parse(readFileSync(CALL_CACHE_FILE, 'utf8'));
  } catch {
    callCache = {};
  }
}

// Load check cache (bypassed by --fresh only)
let checkCache = {};
if (!FRESH && existsSync(CHECK_CACHE_FILE)) {
  try {
    checkCache = JSON.parse(readFileSync(CHECK_CACHE_FILE, 'utf8'));
  } catch {
    checkCache = {};
  }
}

function saveCallCache(key, code) {
  if (NO_CACHE) return;
  callCache[key] = code;
  try {
    writeFileSync(CALL_CACHE_FILE, JSON.stringify(callCache, null, 2), 'utf8');
  } catch {
    /* ignore */
  }
}

function saveCheckCache(key, checks) {
  if (FRESH) return;
  checkCache[key] = checks;
  try {
    writeFileSync(CHECK_CACHE_FILE, JSON.stringify(checkCache, null, 2), 'utf8');
  } catch {
    /* ignore */
  }
}

/* ─── Load prompts ────────────────────────────────────────────────────────── */

const files = readdirSync(GOLDEN_DIR)
  .filter((f) => f.endsWith('.json') && f !== 'index.json')
  .sort();

let prompts = files.map((f) => JSON.parse(readFileSync(join(GOLDEN_DIR, f), 'utf8')));

if (FILTER_DIFFICULTY) prompts = prompts.filter((p) => p.difficulty === FILTER_DIFFICULTY);
if (FILTER_SLUG) prompts = prompts.filter((p) => p.slug === FILTER_SLUG);
if (FILTER_SLUGS) prompts = prompts.filter((p) => FILTER_SLUGS.includes(p.slug));

if (prompts.length === 0) {
  console.error('No prompts matched the given filters.');
  process.exit(1);
}

/* ─── Provider calls ──────────────────────────────────────────────────────── */

// Write system prompt to a temp file once (Claude CLI only)
const SYSTEM_PROMPT_FILE = join(tmpdir(), `tale-ui-eval-system-${process.pid}.md`);
if (PROVIDER === 'claude') {
  writeFileSync(SYSTEM_PROMPT_FILE, SYSTEM_PROMPT, 'utf8');
  process.on('exit', () => {
    try {
      unlinkSync(SYSTEM_PROMPT_FILE);
    } catch {
      /* ignore */
    }
  });
}

function callClaude(userPrompt) {
  return new Promise((resolve, reject) => {
    const cliArgs = [
      '--print',
      '--no-session-persistence',
      '--model',
      MODEL,
      '--append-system-prompt-file',
      SYSTEM_PROMPT_FILE,
      '--output-format',
      'json',
    ];

    if (MCP_MODE) {
      // Enable the tale-ui MCP server and pre-approve all its read-only tools.
      // '--allowedTools' is variadic — it consumes subsequent positional args as tool names
      // unless we terminate flag parsing with '--' before the user prompt.
      cliArgs.push(
        '--mcp-config',
        MCP_CONFIG_PATH,
        '--max-turns',
        String(MCP_MAX_TURNS),
        '--allowedTools',
        'mcp__tale-ui__plan_ui',
        '--allowedTools',
        'mcp__tale-ui__get_component',
        '--allowedTools',
        'mcp__tale-ui__search_components',
        '--allowedTools',
        'mcp__tale-ui__list_components',
        '--allowedTools',
        'mcp__tale-ui__get_recipe',
        '--allowedTools',
        'mcp__tale-ui__search_docs',
        '--', // terminate flag parsing so userPrompt is not consumed as another tool name
      );
    }

    cliArgs.push(userPrompt);

    const proc = spawn(CLAUDE_BIN, cliArgs, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => { stdout += d; });
    proc.stderr.on('data', (d) => { stderr += d; });

    // MCP mode takes longer: each tool call round-trip adds latency
    const timeoutMs = MCP_MODE ? 180000 : 90000;
    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error(`Claude CLI timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        return reject(
          new Error(
            `Claude CLI exited with code ${code}\nstderr: ${stderr.slice(0, 500)}\nstdout: ${stdout.slice(0, 500)}`,
          ),
        );
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed.is_error) {
          return reject(
            new Error(
              `Claude CLI reported is_error: ${parsed.result ?? 'no message'}\nstderr: ${stderr.slice(0, 500)}`,
            ),
          );
        }
        resolve(parsed.result ?? '');
      } catch {
        reject(
          new Error(
            `Failed to parse Claude output (exit ${code})\nstderr: ${stderr.slice(0, 500)}\nstdout: ${stdout.slice(0, 500)}`,
          ),
        );
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
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
          Authorization: `Bearer ${STRAICO_API_KEY}`,
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
          throw new Error(
            `Straico: system prompt exceeds context window for ${MODEL}. The eval context with pitfalls is ~11k tokens — use a model with ≥32k context (e.g. --model sonnet, --model gpt-4o) or use --provider claude.`,
          );
        }
        // 502/503/504 are transient — retry with backoff
        if (
          (response.status === 502 || response.status === 503 || response.status === 504) &&
          attempt < retries
        ) {
          lastErr = new Error(
            `Straico API error (${response.status}) — retrying (${attempt}/${retries})`,
          );
          await new Promise((r) => setTimeout(r, attempt * 2000));
          continue;
        }
        throw new Error(`Straico API error (${response.status}): ${body.slice(0, 200)}`);
      }

      const json = await response.json();
      const completion = json.data?.completion ?? json.completion ?? json;
      const content = completion?.choices?.[0]?.message?.content ?? '';
      if (!content)
        throw new Error(
          `Straico returned an empty response: ${JSON.stringify(json).slice(0, 200)}`,
        );
      return content;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('Straico timed out after 120s');
      // Non-retryable errors bubble immediately
      if (
        !err.message.startsWith('Straico API error (502') &&
        !err.message.startsWith('Straico API error (503') &&
        !err.message.startsWith('Straico API error (504')
      )
        throw err;
      lastErr = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, attempt * 2000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

class LocalToolsUnsupportedError extends Error {
  constructor(model, detail) {
    super(
      `Local model "${model}" does not support tool calling${detail ? `: ${detail}` : ''}`,
    );
    this.name = 'LocalToolsUnsupportedError';
  }
}

// Low-level: POST to the local OpenAI-compatible chat completions endpoint.
// Retries on transient errors; throws LocalToolsUnsupportedError immediately on capability failures.
async function postLocalChat(body, { retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180000); // 3 min — local models can be slow
    try {
      const response = await fetch(`${LOCAL_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LOCAL_API_KEY}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const respBody = await response.text();
        // Hard-fail immediately — model categorically cannot do tool calling; retrying won't help.
        if (
          response.status === 400 &&
          (respBody.includes('does not support tools') ||
            respBody.includes('does not support tool') ||
            (respBody.toLowerCase().includes('tools') &&
              respBody.toLowerCase().includes('not support')))
        ) {
          throw new LocalToolsUnsupportedError(MODEL, respBody.slice(0, 200));
        }
        throw new Error(`Local API error (${response.status}): ${respBody.slice(0, 200)}`);
      }

      return await response.json();
    } catch (err) {
      if (err instanceof LocalToolsUnsupportedError) throw err; // never retry
      if (err.name === 'AbortError')
        throw new Error(`Local model timed out after 180s — model may be too slow or not loaded`);
      if (err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
        throw new Error(
          `Cannot connect to local server at ${LOCAL_URL} — is Ollama/LM Studio running?`,
        );
      }
      lastErr = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 2000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

// Execute one MCP tool call and flatten the result to a string for the tool message.
async function runLocalMcpTool(call) {
  const toolName = call.function?.name;
  let toolArgs;
  try {
    toolArgs = JSON.parse(call.function?.arguments ?? '{}');
  } catch {
    return `[tool error] Could not parse arguments for ${toolName}: ${call.function?.arguments}`;
  }
  try {
    const result = await LOCAL_MCP_CLIENT.callTool({ name: toolName, arguments: toolArgs });
    const text = (result.content ?? [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n\n');
    return result.isError ? `[tool error] ${text}` : text || '[tool returned no text]';
  } catch (err) {
    return `[tool error] ${err.message}`;
  }
}

// Single-turn local call (non-MCP path) — identical to the previous callLocal implementation.
async function callLocalSingleTurn(userPrompt, { retries = 2 } = {}) {
  const json = await postLocalChat(
    {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
    },
    { retries },
  );
  const content = json.choices?.[0]?.message?.content ?? '';
  if (!content)
    throw new Error(
      `Local model returned an empty response: ${JSON.stringify(json).slice(0, 200)}`,
    );
  return content;
}

async function callLocal(userPrompt, { retries = 2 } = {}) {
  if (!MCP_MODE) return callLocalSingleTurn(userPrompt, { retries });

  // MCP path: agentic tool-use loop bounded by MCP_MAX_TURNS.
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ];

  for (let turn = 0; turn < MCP_MAX_TURNS; turn++) {
    const json = await postLocalChat({
      model: MODEL,
      messages,
      tools: LOCAL_MCP_TOOLS,
      tool_choice: 'auto',
      stream: false,
    });

    const msg = json.choices?.[0]?.message ?? {};
    const toolCalls =
      Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0 ? msg.tool_calls : null;

    if (!toolCalls) {
      // Model finished — return the final text response.
      const content = msg.content ?? '';
      if (!content)
        throw new Error(
          `Local model returned empty response: ${JSON.stringify(json).slice(0, 200)}`,
        );
      return content;
    }

    // Append assistant message with tool calls, then execute each tool.
    messages.push({ role: 'assistant', content: msg.content ?? '', tool_calls: toolCalls });
    for (const call of toolCalls) {
      const result = await runLocalMcpTool(call);
      messages.push({ role: 'tool', tool_call_id: call.id, content: result });
    }
  }

  throw new Error(
    `Local MCP tool loop exceeded ${MCP_MAX_TURNS} turns for model "${MODEL}" — aborting.`,
  );
}

// Bootstrap: connect the MCP client, list tools, and run a capability probe.
// Called from main() before the worker pool starts.
async function bootstrapLocalMcp() {
  // 1. Load and validate the tale-ui server spec from .mcp.json.
  let spec;
  try {
    spec = loadTaleUiMcpServerSpec(MCP_CONFIG_PATH);
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    process.exit(1);
  }

  // 2. Connect the MCP client as a singleton for the lifetime of this eval run.
  const transport = new StdioClientTransport({
    command: spec.command,
    args: spec.args,
    cwd: ROOT,
    env: { ...process.env, ...(spec.env ?? {}) },
  });
  const client = new Client({ name: 'tale-ui-eval', version: '1.0.0' });
  try {
    await client.connect(transport);
  } catch (err) {
    console.error(`ERROR: Failed to start Tale UI MCP server: ${err.message}`);
    process.exit(1);
  }
  LOCAL_MCP_CLIENT = client;

  // 3. List tools and filter to the same 6-tool set that Claude MCP uses.
  const ALLOWED_MCP_TOOL_NAMES = new Set([
    'plan_ui',
    'get_component',
    'search_components',
    'list_components',
    'get_recipe',
    'search_docs',
  ]);
  const { tools } = await client.listTools();
  LOCAL_MCP_TOOLS = tools
    .filter((t) => ALLOWED_MCP_TOOL_NAMES.has(t.name))
    .map((t) => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema,
      },
    }));

  if (LOCAL_MCP_TOOLS.length === 0) {
    console.error(
      `ERROR: MCP server exposed no recognized tools. Check ${MCP_CONFIG_PATH} and tools/mcp-server.mjs.`,
    );
    await client.close().catch(() => {});
    process.exit(1);
  }

  // 4. Capability probe — a cheap one-shot request that will 400 immediately if the model
  //    cannot handle tool calling at all, before we waste time running every prompt.
  try {
    await postLocalChat(
      {
        model: MODEL,
        messages: [{ role: 'user', content: 'ping' }],
        tools: LOCAL_MCP_TOOLS,
        tool_choice: 'auto',
        max_tokens: 1,
        stream: false,
      },
      { retries: 1 },
    );
  } catch (err) {
    await client.close().catch(() => {});
    if (err instanceof LocalToolsUnsupportedError || err.message.includes('tool')) {
      console.error(`ERROR: ${err.message}`);
      console.error(
        `  Pick a tool-capable model (e.g. qwen3-coder, qwen2.5-coder, llama3.1, llama3.2).`,
      );
    } else {
      console.error(`ERROR: Local capability probe failed: ${err.message}`);
    }
    process.exit(1);
  }

  // 5. Tear down cleanly when the process exits.
  const cleanup = () => client.close().catch(() => {});
  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(143);
  });
}

function callCodex(userPrompt) {
  return new Promise((resolve, reject) => {
    const outputFile = join(tmpdir(), `tale-ui-eval-codex-${process.pid}-${Date.now()}.txt`);

    // Codex has no --system flag; prepend the system prompt as a leading section.
    // Pipe via stdin (using `-` prompt arg) to avoid OS arg length limits with large prompts.
    const fullPrompt = `${SYSTEM_PROMPT}\n\n---\n\n${userPrompt}`;

    const proc = spawn(
      CODEX_BIN,
      buildCodexExecArgs({
        model: MODEL,
        outputFile,
        mcpConfigOverride: MCP_MODE ? CODEX_MCP_CONFIG_OVERRIDE : null,
      }),
      { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] },
    );

    proc.stdin.write(fullPrompt);
    proc.stdin.end();

    const timeoutMs = MCP_MODE ? 180000 : 120000;
    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error(`Codex CLI timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    proc.on('close', () => {
      clearTimeout(timer);
      try {
        if (!existsSync(outputFile)) {
          return reject(
            new Error('Codex did not write output — it may have failed or produced no response'),
          );
        }
        const content = readFileSync(outputFile, 'utf8').trim();
        try {
          unlinkSync(outputFile);
        } catch {
          /* ignore */
        }
        if (!content) return reject(new Error('Codex returned an empty response'));
        resolve(content);
      } catch (err) {
        reject(err);
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function callProvider(userPrompt) {
  if (PROVIDER === 'straico') return callStraico(userPrompt);
  if (PROVIDER === 'local') return callLocal(userPrompt);
  if (PROVIDER === 'codex') return callCodex(userPrompt);
  return callClaude(userPrompt);
}

// extractCode, checkL1, checkL2, checkL3 imported from eval-golden-prompts-lib.mjs

/* ─── Main ────────────────────────────────────────────────────────────────── */

// When in --json mode, progress goes to stderr so it's visible in the terminal
// while stdout stays clean for machine-readable JSON parsing.
const log = JSON_OUTPUT
  ? (...args) => process.stderr.write(args.join(' ') + '\n')
  : (...args) => process.stdout.write(args.join(' ') + '\n');
const logInline = JSON_OUTPUT ? (s) => process.stderr.write(s) : (s) => process.stdout.write(s);

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
      if (!code) callError = 'Model returned no code block';
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
      l1 = checkL1(code, { root: ROOT, validatorPath: join(__dirname, 'validate-generated.mjs') });
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
  if (!allPass || !QUIET_PASSING) {
    log(`  ${counter}  ${prompt.slug.padEnd(30)} [${prompt.difficulty}]  ${checks}${cacheLabel}`);
  }
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
    l1,
    l2,
    l3,
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
  if (MCP_MODE && PROVIDER === 'local') {
    await bootstrapLocalMcp();
  }

  try {
    log(`\n=== Golden Prompt Eval — ${MODEL}${MCP_MODE ? ' (MCP)' : ''} ===\n`);
    if (FILTER_DIFFICULTY) log(`  Filter: difficulty=${FILTER_DIFFICULTY}`);
    if (FILTER_SLUG) log(`  Filter: slug=${FILTER_SLUG}`);
    log(`  Prompts:     ${prompts.length}`);
    log(`  Concurrency: ${CONCURRENCY}`);
    const mcpSuffix = MCP_MODE
      ? PROVIDER === 'claude' || PROVIDER === 'codex' || PROVIDER === 'local'
        ? ' + MCP'
        : ' (snippet-only)'
      : '';
    const providerLabel =
      PROVIDER === 'straico'
        ? `straico (${MODEL})${mcpSuffix}`
        : PROVIDER === 'local'
          ? `local @ ${LOCAL_URL} (${MODEL})${mcpSuffix}`
          : PROVIDER === 'codex'
            ? `codex cli (${CODEX_BIN}) — ${MODEL}${mcpSuffix}`
            : `claude cli (${CLAUDE_BIN})${mcpSuffix}`;
    log(`  Provider:    ${providerLabel}\n`);

    const results = await runPool(prompts, CONCURRENCY, evalPrompt);

    /* ── Summary ── */

    const total = results.length;
    const passed = results.filter((r) => r.allPass).length;
    const l1Pass = results.filter((r) => r.l1.pass).length;
    const l2Pass = results.filter((r) => r.l2.pass).length;
    const l3Pass = results.filter((r) => r.l3.pass).length;
    const callCacheHits = results.filter((r) => r._callCached).length;
    const checkCacheHits = results.filter((r) => !r._callCached && r._checkCached).length;

    log(`\n${'─'.repeat(52)}`);
    log(`  Model:          ${MODEL}`);
    log(`  Overall:        ${passed}/${total} passed all checks`);
    if (callCacheHits > 0) log(`  Call cache:     ${callCacheHits}/${total} skipped Claude calls`);
    if (checkCacheHits > 0) log(`  Check cache:    ${checkCacheHits}/${total} skipped tsc checks`);
    log(`  L1 validity:    ${l1Pass}/${total}`);
    log(`  L2 components:  ${l2Pass}/${total}`);
    log(`  L3 imports:     ${l3Pass}/${total}`);
    for (const diff of ['simple', 'medium', 'complex']) {
      const group = results.filter((r) => r.difficulty === diff);
      if (group.length === 0) continue;
      const gPassed = group.filter((r) => r.allPass).length;
      log(`  ${diff.padEnd(8)}: ${gPassed}/${group.length}`);
    }
    log('');

    if (JSON_OUTPUT) {
      process.stdout.write(
        JSON.stringify({ model: MODEL, total, passed, l1Pass, l2Pass, l3Pass, results }, null, 2) +
          '\n',
      );
    }
  } finally {
    await closeLocalMcpClient();
  }
}

main();
