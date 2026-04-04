#!/usr/bin/env node
/**
 * eval-a2ui-golden-prompts.mjs
 *
 * Runs each A2UI golden prompt against a model and scores the output across
 * three automated checks:
 *
 *   L1 — Validity:   output passes deep multi-source validation (catalog types,
 *                    prop names, prop values, icon names, usageHints, protocol structure)
 *   L2 — Coverage:   all expected `tags` component types appear in the output
 *   L3 — Structural: beginRendering before surfaceUpdate, rootComponentId exists,
 *                    no orphaned children, no duplicate IDs
 *
 * Usage:
 *   node tools/eval-a2ui-golden-prompts.mjs
 *   node tools/eval-a2ui-golden-prompts.mjs --model sonnet
 *   node tools/eval-a2ui-golden-prompts.mjs --provider ollama --model qwen3-coder-next
 *   node tools/eval-a2ui-golden-prompts.mjs --provider straico --model openai/gpt-4o
 *   node tools/eval-a2ui-golden-prompts.mjs --difficulty simple
 *   node tools/eval-a2ui-golden-prompts.mjs --slug simple-form
 *   node tools/eval-a2ui-golden-prompts.mjs --concurrency 10
 *   node tools/eval-a2ui-golden-prompts.mjs --json
 *   node tools/eval-a2ui-golden-prompts.mjs --no-cache
 *   node tools/eval-a2ui-golden-prompts.mjs --fresh
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, spawn } from 'child_process';
import { tmpdir } from 'os';
import { createHash } from 'crypto';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const GOLDEN_DIR = join(__dirname, 'a2ui-golden-prompts');
const SYSTEM_PROMPT_PATH = join(ROOT, 'packages/a2ui/src/agent/system-prompt.md');

const require = createRequire(import.meta.url);
const { PROP_ALLOWED_VALUES } = require('./a2ui-catalog-metadata.js');

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

const rawProvider = getArg('--provider') ?? 'claude';
const PROVIDER = (rawProvider === 'ollama' || rawProvider === 'lm-studio') ? 'local' : rawProvider;
const LOCAL_URL = getArg('--local-url') ?? (rawProvider === 'lm-studio' ? 'http://localhost:1234/v1' : 'http://localhost:11434/v1');
const LOCAL_API_KEY = process.env.LOCAL_API_KEY ?? 'ollama';
const FILTER_DIFFICULTY = getArg('--difficulty');
const FILTER_SLUG = getArg('--slug');
const FILTER_SLUGS = getArg('--slugs')?.split(',').map(s => s.trim()) ?? null;
const JSON_OUTPUT = hasFlag('--json');
const CONCURRENCY = parseInt(getArg('--concurrency') ?? '5', 10);
const NO_CACHE = hasFlag('--no-cache') || hasFlag('--fresh');
const FRESH = hasFlag('--fresh');

/* ─── Model resolution ────────────────────────────────────────────────────── */

const CLAUDE_MODEL_ALIASES = {
  sonnet: 'claude-sonnet-4-6',
  opus:   'claude-opus-4-6',
  haiku:  'claude-haiku-4-5-20251001',
};

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
    process.exit(1);
  }
} else if (PROVIDER === 'local') {
  // No validation needed — connection errors surface on first call.
} else {
  CLAUDE_BIN = findClaude();
  if (!CLAUDE_BIN) {
    console.error('ERROR: Claude Code CLI not found.');
    console.error('Install it from https://claude.ai/download or set CLAUDE_PATH to the binary location.');
    process.exit(1);
  }
}

/* ─── System prompt ───────────────────────────────────────────────────────── */

const systemPromptRaw = readFileSync(SYSTEM_PROMPT_PATH, 'utf8');

const SYSTEM_PROMPT = `${systemPromptRaw}

---

When asked to create UI, generate A2UI JSON messages in a fenced \`\`\`json code block.
Rules:
- Output ONLY the JSON code block, no explanation before or after.
- Always begin with a \`beginRendering\` message, then a \`surfaceUpdate\` message.
- Use only component types listed in the catalog above.
- Follow all prop constraints and structural rules exactly.
- The output format must be: \`{"messages": [...]}\``;

/* ─── Cache ───────────────────────────────────────────────────────────────── */

const CALL_CACHE_FILE = join(__dirname, '.eval-a2ui-call-cache.json');
const CHECK_CACHE_FILE = join(__dirname, '.eval-a2ui-check-cache.json');
const CATALOG_JSON_PATH = join(ROOT, 'registry/a2ui-catalog.json');

function hashString(s) {
  return createHash('sha256').update(s).digest('hex').slice(0, 16);
}

const snippetHash = hashString(SYSTEM_PROMPT);
const catalogHash = existsSync(CATALOG_JSON_PATH)
  ? hashString(readFileSync(CATALOG_JSON_PATH, 'utf8'))
  : 'no-catalog';

function makeCallCacheKey(slug, promptText) {
  return `${MODEL}:${snippetHash}:${catalogHash}:${hashString(slug + promptText)}`;
}

function makeCheckCacheKey(messages) {
  return `${catalogHash}:${hashString(JSON.stringify(messages))}`;
}

let callCache = {};
if (!NO_CACHE && existsSync(CALL_CACHE_FILE)) {
  try { callCache = JSON.parse(readFileSync(CALL_CACHE_FILE, 'utf8')); } catch { callCache = {}; }
}

let checkCache = {};
if (!FRESH && existsSync(CHECK_CACHE_FILE)) {
  try { checkCache = JSON.parse(readFileSync(CHECK_CACHE_FILE, 'utf8')); } catch { checkCache = {}; }
}

function saveCallCache(key, messages) {
  if (NO_CACHE) return;
  callCache[key] = messages;
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

const SYSTEM_PROMPT_FILE = join(tmpdir(), `tale-ui-a2ui-eval-system-${process.pid}.md`);
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
        if (response.status === 500 && body.includes('Excessively l')) {
          throw new Error(`Straico: system prompt exceeds context window for ${MODEL}. Use a model with ≥32k context.`);
        }
        if ((response.status === 502 || response.status === 503 || response.status === 504) && attempt < retries) {
          lastErr = new Error(`Straico API error (${response.status})`);
          await new Promise(r => setTimeout(r, attempt * 2000));
          continue;
        }
        throw new Error(`Straico API error (${response.status}): ${body.slice(0, 200)}`);
      }

      const json = await response.json();
      const completion = json.data?.completion ?? json.completion ?? json;
      const content = completion?.choices?.[0]?.message?.content ?? '';
      if (!content) throw new Error(`Straico returned empty response: ${JSON.stringify(json).slice(0, 200)}`);
      return content;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('Straico timed out after 120s');
      if (!err.message?.startsWith('Straico API error (502') &&
          !err.message?.startsWith('Straico API error (503') &&
          !err.message?.startsWith('Straico API error (504')) throw err;
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
    const timer = setTimeout(() => controller.abort(), 180000);
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
      if (!content) throw new Error(`Local model returned empty response: ${JSON.stringify(json).slice(0, 200)}`);
      return content;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('Local model timed out after 180s');
      if (err.message?.includes('ECONNREFUSED') || err.message?.includes('fetch failed')) {
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

/* ─── JSON extraction ─────────────────────────────────────────────────────── */

function extractMessages(text) {
  // Strip <think>...</think> tokens from reasoning models
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Try fenced ```json block first
  const fenced = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : cleaned;

  // Try parsing as {"messages": [...]}
  try {
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.messages)) return parsed.messages;
  } catch { /* fall through */ }

  // Fall back: find the first [ or { and parse from there
  const arrIdx = candidate.indexOf('[');
  const objIdx = candidate.indexOf('{');
  const startIdx = arrIdx !== -1 && (objIdx === -1 || arrIdx < objIdx) ? arrIdx : objIdx;

  if (startIdx !== -1) {
    try {
      const parsed = JSON.parse(candidate.slice(startIdx));
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.messages)) return parsed.messages;
    } catch { /* give up */ }
  }

  return null;
}

/* ─── Validation infrastructure ───────────────────────────────────────────── */

const CATALOG_PATH = join(ROOT, 'packages/a2ui/src/catalog.ts');
const ICON_REGISTRY_PATH = join(ROOT, 'packages/a2ui/src/icon-registry.ts');

function extractCatalogKeys(source) {
  const keys = [];
  for (const match of source.matchAll(/^\s{2}(\w+):\s*\{$/gm)) {
    keys.push(match[1]);
  }
  return keys;
}

function extractIconNames(source) {
  const names = [];
  const mapMatch = source.match(/const iconMap[^{]*\{([\s\S]*?)\n\};/);
  if (!mapMatch) return names;
  for (const match of mapMatch[1].matchAll(/^\s+'?([\w-]+)'?\s*:/gm)) {
    names.push(match[1]);
  }
  return names;
}

function extractUsageHints(source) {
  const hints = [];
  for (const match of source.matchAll(/case '([^']+)':/g)) {
    hints.push(match[1]);
  }
  return hints;
}

const ALWAYS_ALLOWED_PROPS = new Set(['children', 'id']);

function buildAllowedPropsMap(catalogJson) {
  const map = new Map();
  for (const type of catalogJson.types || []) {
    const allowed = new Set(ALWAYS_ALLOWED_PROPS);
    for (const prop of type.props || []) {
      allowed.add(prop.name);
    }
    map.set(type.name, allowed);
  }
  return map;
}

// Load validation sources once
const catalogSource = readFileSync(CATALOG_PATH, 'utf8');
const iconSource = readFileSync(ICON_REGISTRY_PATH, 'utf8');
const catalogJson = JSON.parse(readFileSync(CATALOG_JSON_PATH, 'utf8'));

const catalogSet = new Set(extractCatalogKeys(catalogSource));
const iconSet = new Set(extractIconNames(iconSource));
const hintSet = new Set(extractUsageHints(catalogSource));
const allowedPropsMap = buildAllowedPropsMap(catalogJson);

/* ─── L1: Deep validity ───────────────────────────────────────────────────── */

function checkL1(messages) {
  const errors = [];

  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      errors.push({ source: 'protocol', msg: 'Message must be a non-null object' });
      continue;
    }
    if (!msg.type || typeof msg.type !== 'string') {
      errors.push({ source: 'protocol', msg: 'Message missing required "type" field' });
      continue;
    }

    if (msg.type === 'beginRendering') {
      if (!msg.surfaceId) errors.push({ source: 'protocol', msg: 'beginRendering missing "surfaceId"' });
      if (!msg.rootComponentId) errors.push({ source: 'protocol', msg: 'beginRendering missing "rootComponentId"' });
    } else if (msg.type === 'surfaceUpdate') {
      if (!msg.surfaceId) errors.push({ source: 'protocol', msg: 'surfaceUpdate missing "surfaceId"' });
      if (!Array.isArray(msg.components)) {
        errors.push({ source: 'protocol', msg: 'surfaceUpdate missing "components" array' });
        continue;
      }

      const ids = new Set(msg.components.map(c => c.id).filter(Boolean));

      for (const comp of msg.components) {
        if (!comp.component || typeof comp.component !== 'object') {
          errors.push({ source: 'protocol', msg: `Component "${comp.id}" has no "component" field` });
          continue;
        }
        const typeKeys = Object.keys(comp.component);
        if (typeKeys.length === 0) {
          errors.push({ source: 'protocol', msg: `Component "${comp.id}" has no type key` });
          continue;
        }
        const typeName = typeKeys[0];

        // Unknown type (source: registry/a2ui-catalog.json)
        if (!catalogSet.has(typeName)) {
          errors.push({
            source: 'catalog (registry/a2ui-catalog.json)',
            msg: `Unknown component type "${typeName}" on "${comp.id}"`,
          });
          continue;
        }

        const props = comp.component[typeName] || {};

        // Icon name (source: packages/a2ui/src/icon-registry.ts)
        if (typeName === 'Icon' && props.name) {
          const iconName = String(props.name).toLowerCase();
          if (!iconSet.has(iconName)) {
            errors.push({
              source: 'icon-registry.ts',
              msg: `Invalid icon name "${props.name}" on "${comp.id}" — not in Lucide icon registry`,
            });
          }
        }

        if (typeName === 'EmptyState' && props.icon && typeof props.icon === 'string') {
          const iconName = props.icon.toLowerCase();
          if (!iconSet.has(iconName)) {
            errors.push({
              source: 'icon-registry.ts',
              msg: `Invalid EmptyState icon "${props.icon}" on "${comp.id}" — not in Lucide icon registry`,
            });
          }
        }

        // usageHint (source: catalog.ts mapTextHint())
        if (typeName === 'Text' && props.usageHint) {
          if (!hintSet.has(props.usageHint)) {
            errors.push({
              source: 'catalog.ts (mapTextHint)',
              msg: `Invalid usageHint "${props.usageHint}" on "${comp.id}". Valid: ${[...hintSet].join(', ')}`,
            });
          }
        }

        // Prop name (source: registry/a2ui-catalog.json per-type prop lists)
        const allowedProps = allowedPropsMap.get(typeName);
        if (allowedProps) {
          for (const propName of Object.keys(props)) {
            if (!allowedProps.has(propName)) {
              errors.push({
                source: 'registry/a2ui-catalog.json prop list',
                msg: `Unknown prop "${propName}" on ${typeName} "${comp.id}". Allowed: ${[...allowedProps].filter(p => !ALWAYS_ALLOWED_PROPS.has(p)).join(', ')}`,
              });
            }
          }
        }

        // Prop value (source: a2ui-catalog-metadata.js PROP_ALLOWED_VALUES with type-specific overrides)
        for (const [propName, propValue] of Object.entries(props)) {
          if (typeof propValue !== 'string') continue;
          const typeKey = `${typeName}.${propName}`;
          const allowed = typeKey in PROP_ALLOWED_VALUES
            ? PROP_ALLOWED_VALUES[typeKey]
            : PROP_ALLOWED_VALUES[propName];
          if (!allowed) continue;
          if (!allowed.includes(propValue)) {
            errors.push({
              source: `a2ui-catalog-metadata.js PROP_ALLOWED_VALUES[${JSON.stringify(typeKey)}]`,
              msg: `Invalid value "${propValue}" for ${typeName}.${propName} on "${comp.id}". Allowed: ${allowed.join(', ')}`,
            });
          }
        }

        // Orphaned children
        if (Array.isArray(props.children)) {
          for (const childId of props.children) {
            if (typeof childId === 'string' && !ids.has(childId)) {
              errors.push({
                source: 'protocol',
                msg: `Orphaned child ref "${childId}" in "${comp.id}".children`,
              });
            }
          }
        }
      }
    } else if (msg.type === 'dataModelUpdate') {
      if (!msg.surfaceId) errors.push({ source: 'protocol', msg: 'dataModelUpdate missing "surfaceId"' });
      if (typeof msg.path !== 'string' && (!msg.data || typeof msg.data !== 'object')) {
        errors.push({ source: 'protocol', msg: 'dataModelUpdate requires "path" string or "data" object' });
      }
    } else if (msg.type === 'deleteSurface') {
      if (!msg.surfaceId) errors.push({ source: 'protocol', msg: 'deleteSurface missing "surfaceId"' });
    } else {
      errors.push({ source: 'protocol', msg: `Unknown message type: "${msg.type}"` });
    }
  }

  return {
    pass: errors.length === 0,
    errors: errors.map(e => `[${e.source}] ${e.msg}`),
  };
}

/* ─── L2: Type coverage ───────────────────────────────────────────────────── */

function checkL2(messages, tags) {
  // Collect all type names used across all surfaceUpdate components
  const usedTypes = new Set();
  for (const msg of messages) {
    if (msg.type === 'surfaceUpdate' && Array.isArray(msg.components)) {
      for (const comp of msg.components) {
        if (comp.component && typeof comp.component === 'object') {
          for (const typeName of Object.keys(comp.component)) {
            usedTypes.add(typeName);
          }
        }
      }
    }
  }

  const missing = tags.filter(tag => !usedTypes.has(tag));
  return { pass: missing.length === 0, missing };
}

/* ─── L3: Structural correctness ─────────────────────────────────────────── */

function checkL3(messages) {
  const errors = [];

  // beginRendering ordering
  const seenBeginRendering = new Set();
  const duplicateIds = new Set();

  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') continue;

    if (msg.type === 'beginRendering') {
      seenBeginRendering.add(msg.surfaceId);
    } else if (msg.type === 'surfaceUpdate') {
      if (!seenBeginRendering.has(msg.surfaceId)) {
        errors.push(`surfaceUpdate for "${msg.surfaceId}" appears before beginRendering`);
      }

      if (!Array.isArray(msg.components)) continue;

      const ids = new Set();
      for (const comp of msg.components) {
        if (ids.has(comp.id)) {
          if (!duplicateIds.has(comp.id)) {
            errors.push(`Duplicate component ID: "${comp.id}"`);
            duplicateIds.add(comp.id);
          }
        }
        ids.add(comp.id);
      }

      // rootComponentId exists
      const beginMsg = messages.find(m => m.type === 'beginRendering' && m.surfaceId === msg.surfaceId);
      if (beginMsg?.rootComponentId && !ids.has(beginMsg.rootComponentId)) {
        errors.push(`rootComponentId "${beginMsg.rootComponentId}" not found in surfaceUpdate components`);
      }
    }
  }

  if (!messages.some(m => m && m.type === 'beginRendering')) {
    errors.push('No beginRendering message found');
  }

  return { pass: errors.length === 0, errors };
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

const log = JSON_OUTPUT
  ? (...a) => process.stderr.write(a.join(' ') + '\n')
  : (...a) => process.stdout.write(a.join(' ') + '\n');

async function evalPrompt(prompt, nth, total) {
  const callKey = makeCallCacheKey(prompt.slug, prompt.prompt);
  const counter = `[${String(nth).padStart(String(total).length)}/${total}]`;

  const cachedMessages = callCache[callKey];
  let messages = null;
  let callError = null;
  let callCacheHit = false;

  if (cachedMessages !== undefined) {
    messages = cachedMessages;
    callCacheHit = true;
  } else {
    try {
      const rawOutput = await callProvider(prompt.prompt);
      messages = extractMessages(rawOutput);
      if (!messages) {
        callError = `Could not extract JSON messages from model output: ${rawOutput.slice(0, 200)}`;
      }
    } catch (err) {
      callError = err.message;
    }
  }

  let l1, l2, l3;
  let checkCacheHit = false;

  if (callError || !messages) {
    l1 = { pass: false, errors: [callError ?? 'No messages extracted'] };
    l2 = { pass: false, missing: prompt.tags ?? [] };
    l3 = { pass: false, errors: ['No messages to validate'] };
  } else {
    const checkKey = makeCheckCacheKey(messages);
    const cachedChecks = checkCache[checkKey];

    if (cachedChecks) {
      ({ l1, l2, l3 } = cachedChecks);
      checkCacheHit = true;
    } else {
      l1 = checkL1(messages);
      l2 = checkL2(messages, prompt.tags ?? []);
      l3 = checkL3(messages);
      saveCheckCache(checkKey, { l1, l2, l3 });
    }
  }

  const allPass = l1.pass && l2.pass && l3.pass;

  if (allPass && !callCacheHit) saveCallCache(callKey, messages);

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
  if (!l2.pass) log(`      L2: missing types: ${l2.missing.join(', ')}`);
  if (!l3.pass) for (const e of l3.errors) log(`      L3: ${e}`);

  return {
    slug: prompt.slug,
    difficulty: prompt.difficulty,
    allPass,
    l1, l2, l3,
    _callCached: callCacheHit,
    _checkCached: checkCacheHit,
    ...(JSON_OUTPUT ? { messages } : {}),
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
  log(`\n=== A2UI Golden Prompt Eval — ${MODEL} ===\n`);
  if (FILTER_DIFFICULTY) log(`  Filter: difficulty=${FILTER_DIFFICULTY}`);
  if (FILTER_SLUG) log(`  Filter: slug=${FILTER_SLUG}`);
  log(`  Prompts:     ${prompts.length}`);
  log(`  Concurrency: ${CONCURRENCY}`);
  const providerLabel = PROVIDER === 'straico' ? `straico (${MODEL})`
    : PROVIDER === 'local' ? `local @ ${LOCAL_URL} (${MODEL})`
    : `claude cli (${CLAUDE_BIN})`;
  log(`  Provider:    ${providerLabel}\n`);

  const results = await runPool(prompts, CONCURRENCY, evalPrompt);

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
  if (callCacheHits > 0) log(`  Call cache:     ${callCacheHits}/${total} skipped model calls`);
  if (checkCacheHits > 0) log(`  Check cache:    ${checkCacheHits}/${total} skipped validation`);
  log(`  L1 validity:    ${l1Pass}/${total}`);
  log(`  L2 coverage:    ${l2Pass}/${total}`);
  log(`  L3 structural:  ${l3Pass}/${total}`);
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

main().catch(err => { console.error(err); process.exit(1); });
