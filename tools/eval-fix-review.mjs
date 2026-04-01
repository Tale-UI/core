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
import { execFileSync, spawn } from 'child_process';
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
const FILTER_DIFFICULTY = getArg('--difficulty');
const NO_FIX = hasFlag('--no-fix');
const NO_SERVE = hasFlag('--no-serve');
const MAX_ITER = 3;
const PLAYGROUND_PORT = 5173;

/* ─── Claude CLI ──────────────────────────────────────────────────────────── */

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

const CLAUDE_BIN = findClaude();
if (!CLAUDE_BIN) {
  console.error('ERROR: Claude Code CLI not found.');
  process.exit(1);
}

/* ─── Run eval ────────────────────────────────────────────────────────────── */

function runEval(slugs = null) {
  const extraArgs = [];
  if (MODEL !== 'sonnet') extraArgs.push('--model', MODEL);
  if (FILTER_DIFFICULTY) extraArgs.push('--difficulty', FILTER_DIFFICULTY);
  if (slugs?.length) extraArgs.push('--slugs', slugs.join(','));

  const output = execFileSync(
    process.execPath,
    [EVAL_SCRIPT, '--json', ...extraArgs],
    { cwd: ROOT, timeout: 300000, encoding: 'utf8' }
  );
  return JSON.parse(output);
}

/* ─── Fix loop ────────────────────────────────────────────────────────────── */

function buildErrorSummary(result) {
  const lines = [];
  if (!result.l1.pass) lines.push(`L1 (TypeScript/registry errors):\n${result.l1.errors.map(e => `  - ${e}`).join('\n')}`);
  if (!result.l2.pass) lines.push(`L2 (missing components): ${result.l2.missing.join(', ')}`);
  if (!result.l3.pass) lines.push(`L3 (forbidden imports): ${result.l3.forbidden.join(', ')}`);
  return lines.join('\n');
}

function getFix(result) {
  const snippet = readFileSync(SNIPPET_PATH, 'utf8');

  // Extract just the pitfalls section to keep the prompt short
  const pitfallsMatch = snippet.match(/5\. \*\*Common pitfalls[\s\S]*?(?=\n\d+\.|\n---|\n#)/);
  const pitfallsSection = pitfallsMatch ? pitfallsMatch[0] : snippet;

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

Identify the exact rule that is missing or unclear in the pitfalls section that caused this error.
Output a JSON fix in this exact format (no other text, just the JSON):
{
  "diagnosis": "one sentence explaining the root cause",
  "old": "exact string to find and replace in the documentation (use empty string to append a new bullet)",
  "new": "the replacement text (or new bullet to append if old is empty string)"
}`;

  const tmpFile = join(tmpdir(), `tale-ui-fix-prompt-${process.pid}.md`);
  writeFileSync(tmpFile, fixPrompt, 'utf8');

  try {
    const raw = execFileSync(
      CLAUDE_BIN,
      ['--print', '--model', MODEL, '--append-system-prompt-file', tmpFile, '--output-format', 'json',
        'Output only the JSON fix object as instructed. No explanation, no markdown fences.'],
      { cwd: ROOT, timeout: 60000, encoding: 'utf8' }
    );
    const parsed = JSON.parse(raw);
    const text = parsed.result ?? '';
    // Extract JSON from the response (may be wrapped in fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]);
  } finally {
    try { execFileSync('rm', [tmpFile]); } catch { /* ignore */ }
  }
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

function mergeImports(codeBlocks) {
  const named = new Map();   // pkg → Set<string>
  const typed = new Map();   // pkg → Set<string>

  for (const code of codeBlocks) {
    for (const line of code.split('\n')) {
      const namedMatch = line.match(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/);
      if (namedMatch) {
        const pkg = namedMatch[2];
        if (!named.has(pkg)) named.set(pkg, new Set());
        for (const n of namedMatch[1].split(',').map(s => s.trim()).filter(Boolean)) named.get(pkg).add(n);
        continue;
      }
      const typeMatch = line.match(/^import\s+type\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/);
      if (typeMatch) {
        const pkg = typeMatch[2];
        if (!typed.has(pkg)) typed.set(pkg, new Set());
        for (const n of typeMatch[1].split(',').map(s => s.trim()).filter(Boolean)) typed.get(pkg).add(n);
      }
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
  return code
    .split('\n')
    .filter(l => !l.match(/^import\s/))
    .join('\n')
    .trim();
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
        <p className="eval-review__prompt">${(prompt?.prompt ?? '').replace(/"/g, '&quot;')}</p>
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

async function startPlayground() {
  const alreadyRunning = await checkPort(PLAYGROUND_PORT);
  if (alreadyRunning) {
    console.log(`  Playground already running on :${PLAYGROUND_PORT}`);
    return;
  }

  console.log(`  Starting playground dev server...`);
  const proc = spawn('pnpm', ['playground:dev'], {
    cwd: ROOT,
    detached: true,
    stdio: 'ignore',
  });
  proc.unref();

  const ready = await waitForPort(PLAYGROUND_PORT);
  if (!ready) throw new Error('Playground did not start within 60s');
  console.log(`  Playground ready on :${PLAYGROUND_PORT}`);
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

async function main() {
  console.log(`\n=== Eval → Fix → Review (${MODEL}) ===\n`);

  /* ── Step 1: Initial eval ── */
  console.log('Step 1/4  Running initial eval...');
  let evalResult = runEval();
  const allPrompts = evalResult.results.map(r => ({
    slug: r.slug,
    difficulty: r.difficulty,
    prompt: null, // loaded below
  }));

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
    console.log('Step 2/4  Fix loop (max', MAX_ITER, 'iterations)...');

    for (let iter = 1; iter <= MAX_ITER && failing.length > 0; iter++) {
      console.log(`\n  Iteration ${iter}/${MAX_ITER} — ${failing.length} failing prompt(s)`);

      for (const failure of failing) {
        console.log(`\n  Diagnosing: ${failure.slug}`);
        try {
          const fix = getFix(failure);
          console.log(`    Diagnosis: ${fix.diagnosis}`);
          const applied = applyFix(fix);
          if (applied) console.log(`    Fix applied to consumer snippet`);
        } catch (err) {
          console.log(`    ⚠ Could not get fix: ${err.message}`);
        }
      }

      // Re-eval only failing slugs
      console.log(`\n  Re-running eval for ${failing.length} prompt(s)...`);
      const reEval = runEval(failing.map(f => f.slug));
      const reResults = reEval.results.map(r => ({
        ...r,
        prompt: promptMap.get(r.slug)?.prompt ?? '',
      }));

      for (const r of reResults) {
        if (r.allPass && r.code) passingCode.set(r.slug, r);
      }

      const stillFailing = reResults.filter(r => !r.allPass);
      const fixed = failing.length - stillFailing.length;
      console.log(`  Fixed ${fixed}/${failing.length} this iteration. ${stillFailing.length} still failing.`);
      failing = stillFailing;
    }
  } else if (NO_FIX) {
    console.log('Step 2/4  Fix loop skipped (--no-fix).');
  } else {
    console.log('Step 2/4  No failures — fix loop not needed.');
  }

  if (failing.length > 0) {
    console.log(`\n  ⚠ ${failing.length} prompt(s) still failing after fix loop:`);
    for (const f of failing) console.log(`    - ${f.slug}: L1=${f.l1.pass ? '✓' : '✗'} L2=${f.l2.pass ? '✓' : '✗'} L3=${f.l3.pass ? '✓' : '✗'}`);
  }

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
    console.log('\nStep 4/4  Skipped (--no-serve). Open playground manually: http://localhost:5173/eval-review');
    return;
  }

  /* ── Step 4: Serve and open ── */
  console.log('\nStep 4/4  Starting playground...');
  await startPlayground();

  const url = `http://localhost:${PLAYGROUND_PORT}/eval-review`;
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
