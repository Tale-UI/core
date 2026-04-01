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
 *   node tools/eval-golden-prompts.mjs
 *   node tools/eval-golden-prompts.mjs --model sonnet
 *   node tools/eval-golden-prompts.mjs --model claude-haiku-4-5-20251001
 *   node tools/eval-golden-prompts.mjs --difficulty simple
 *   node tools/eval-golden-prompts.mjs --slug primary-button
 *   node tools/eval-golden-prompts.mjs --json
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { tmpdir } from 'os';

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

const CLAUDE_BIN = findClaude();
if (!CLAUDE_BIN) {
  console.error('ERROR: Claude Code CLI not found.');
  console.error('Install it from https://claude.ai/download or set CLAUDE_PATH to the binary location.');
  process.exit(1);
}

/* ─── CLI args ────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const getArg = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag = (flag) => args.includes(flag);

const MODEL = getArg('--model') ?? 'sonnet';
const FILTER_DIFFICULTY = getArg('--difficulty');
const FILTER_SLUG = getArg('--slug');
const FILTER_SLUGS = getArg('--slugs')?.split(',').map(s => s.trim()) ?? null;
const JSON_OUTPUT = hasFlag('--json');

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

const SYSTEM_PROMPT = `You are a React developer working on a project that uses Tale UI components.

${snippetContent}

---

When asked to create UI, generate a single self-contained TypeScript/TSX code block.
Rules:
- Return ONLY the code block, no explanation before or after.
- Use Tale UI components exclusively — no raw HTML layout elements like <div> where a Tale UI layout component exists.
- Follow all import, composition, and pitfall rules listed above exactly.`;

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

/* ─── Claude CLI call ─────────────────────────────────────────────────────── */

// Write system prompt to a temp file once — avoids shell arg length limits
const SYSTEM_PROMPT_FILE = join(tmpdir(), `tale-ui-eval-system-${process.pid}.md`);
writeFileSync(SYSTEM_PROMPT_FILE, SYSTEM_PROMPT, 'utf8');
process.on('exit', () => { try { unlinkSync(SYSTEM_PROMPT_FILE); } catch { /* ignore */ } });

function callClaude(userPrompt) {
  const result = execFileSync(
    CLAUDE_BIN,
    [
      '--print',
      '--model', MODEL,
      '--append-system-prompt-file', SYSTEM_PROMPT_FILE,
      '--output-format', 'json',
      userPrompt,
    ],
    { cwd: ROOT, timeout: 60000, encoding: 'utf8' }
  );

  const parsed = JSON.parse(result);
  if (parsed.is_error) throw new Error(parsed.result ?? 'Claude CLI returned an error');
  return parsed.result ?? '';
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

function main() {
  if (!JSON_OUTPUT) {
    console.log(`\n=== Golden Prompt Eval — ${MODEL} ===\n`);
    if (FILTER_DIFFICULTY) console.log(`  Filter: difficulty=${FILTER_DIFFICULTY}`);
    if (FILTER_SLUG) console.log(`  Filter: slug=${FILTER_SLUG}`);
    console.log(`  Prompts: ${prompts.length}`);
    console.log(`  CLI:     ${CLAUDE_BIN}\n`);
  }

  const results = [];

  for (const prompt of prompts) {
    if (!JSON_OUTPUT) {
      process.stdout.write(`  ${prompt.slug.padEnd(30)} [${prompt.difficulty}] ... `);
    }

    let code = '';
    let callError = null;

    try {
      const rawOutput = callClaude(prompt.prompt);
      code = extractCode(rawOutput);
    } catch (err) {
      callError = err.message;
    }

    const l1 = callError ? { pass: false, errors: [callError] } : checkL1(code);
    const l2 = callError ? { pass: false, missing: prompt.tags ?? [] } : checkL2(code, prompt.tags ?? []);
    const l3 = callError ? { pass: false, forbidden: [] } : checkL3(code);

    const allPass = l1.pass && l2.pass && l3.pass;

    results.push({
      slug: prompt.slug,
      difficulty: prompt.difficulty,
      allPass,
      l1, l2, l3,
      ...(JSON_OUTPUT ? { code } : {}),
    });

    if (!JSON_OUTPUT) {
      const checks = [
        l1.pass ? '✓ L1' : '✗ L1',
        l2.pass ? '✓ L2' : '✗ L2',
        l3.pass ? '✓ L3' : '✗ L3',
      ].join('  ');
      console.log(checks);

      if (!l1.pass) {
        for (const e of l1.errors.slice(0, 3)) console.log(`      L1: ${e}`);
        if (l1.errors.length > 3) console.log(`      L1: ... and ${l1.errors.length - 3} more`);
      }
      if (!l2.pass) console.log(`      L2: missing components: ${l2.missing.join(', ')}`);
      if (!l3.pass) console.log(`      L3: forbidden imports: ${l3.forbidden.join(', ')}`);
    }
  }

  /* ── Summary ── */

  const total = results.length;
  const passed = results.filter(r => r.allPass).length;
  const l1Pass = results.filter(r => r.l1.pass).length;
  const l2Pass = results.filter(r => r.l2.pass).length;
  const l3Pass = results.filter(r => r.l3.pass).length;

  if (JSON_OUTPUT) {
    console.log(JSON.stringify({ model: MODEL, total, passed, l1Pass, l2Pass, l3Pass, results }, null, 2));
  } else {
    console.log(`\n${'─'.repeat(52)}`);
    console.log(`  Model:          ${MODEL}`);
    console.log(`  Overall:        ${passed}/${total} passed all checks`);
    console.log(`  L1 validity:    ${l1Pass}/${total}`);
    console.log(`  L2 components:  ${l2Pass}/${total}`);
    console.log(`  L3 imports:     ${l3Pass}/${total}`);
    for (const diff of ['simple', 'medium', 'complex']) {
      const group = results.filter(r => r.difficulty === diff);
      if (group.length === 0) continue;
      const gPassed = group.filter(r => r.allPass).length;
      console.log(`  ${diff.padEnd(8)}: ${gPassed}/${group.length}`);
    }
    console.log();
  }
}

main();
