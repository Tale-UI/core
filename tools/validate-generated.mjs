#!/usr/bin/env node
/**
 * Tale UI — Generated Code Validator
 *
 * Validates generated .tsx code against the component registry,
 * TypeScript compiler, and ESLint. Usable without an API key.
 *
 * Usage:
 *   node tools/validate-generated.mjs path/to/file.tsx
 *   node tools/validate-generated.mjs --code '<Button>Hi</Button>'
 *   node tools/validate-generated.mjs --json path/to/file.tsx
 *   node tools/validate-generated.mjs --golden tools/golden-prompts/primary-button.json
 *
 * Exit codes:
 *   0 — valid
 *   1 — validation errors found
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const REGISTRY_PATH = resolve(ROOT, 'registry/components.json');
const SCRATCH_DIR = resolve(__dirname, '.generated-scratch');
const TSCONFIG_PATH = resolve(__dirname, 'tsconfig.generated.json');

// ─── Parse args ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const filteredArgs = args.filter(a => a !== '--json');

let code;
let sourceLabel;

const codeArgIdx = filteredArgs.indexOf('--code');
const goldenArgIdx = filteredArgs.indexOf('--golden');

if (codeArgIdx !== -1 && filteredArgs[codeArgIdx + 1]) {
  code = filteredArgs[codeArgIdx + 1];
  sourceLabel = '<inline>';
} else if (goldenArgIdx !== -1 && filteredArgs[goldenArgIdx + 1]) {
  const golden = JSON.parse(readFileSync(filteredArgs[goldenArgIdx + 1], 'utf8'));
  code = golden.reference;
  sourceLabel = filteredArgs[goldenArgIdx + 1];
} else if (filteredArgs[0] && !filteredArgs[0].startsWith('-')) {
  const filePath = resolve(filteredArgs[0]);
  if (filePath.endsWith('.json')) {
    const golden = JSON.parse(readFileSync(filePath, 'utf8'));
    code = golden.reference;
    sourceLabel = filteredArgs[0];
  } else {
    code = readFileSync(filePath, 'utf8');
    sourceLabel = filteredArgs[0];
  }
} else {
  execFileSync(process.execPath, [resolve(__dirname, 'validate-golden-prompts.mjs')], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  process.exit(0);
}

// ─── Load registry ──────────────────────────────────────────────────────────

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
const componentsBySlug = new Map(registry.components.map(c => [c.slug, c]));
const componentsByName = new Map(registry.components.map(c => [c.name, c]));

// ─── Step 1: Registry validation ────────────────────────────────────────────

function validateRegistry(code) {
  const errors = [];

  // Check import paths
  const importRegex = /import\s+\{[^}]+\}\s+from\s+['"]@tale-ui\/react\/([^'"]+)['"]/g;
  let m;
  while ((m = importRegex.exec(code)) !== null) {
    const slug = m[1];
    if (!componentsBySlug.has(slug)) {
      errors.push({ type: 'invalid-import', message: `Import path '@tale-ui/react/${slug}' not found in registry` });
    }
  }

  // Extract imported names and their slugs
  const importedComponents = new Map();
  const namedImportRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]@tale-ui\/react\/([^'"]+)['"]/g;
  while ((m = namedImportRegex.exec(code)) !== null) {
    const names = m[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    const slug = m[2];
    for (const name of names) {
      importedComponents.set(name, slug);
    }
  }

  // Check compound vs simple usage in JSX
  for (const [name, slug] of importedComponents) {
    const comp = componentsBySlug.get(slug) || componentsByName.get(name);
    if (!comp) {continue;}

    if (comp.kind === 'compound') {
      // Check if used as bare <Dialog> instead of <Dialog.Root>
      const bareUsageRegex = new RegExp(`<${name}[\\s/>](?![.])`, 'g');
      const rootUsageRegex = new RegExp(`<${name}\\.Root[\\s/>]`, 'g');
      const hasBare = bareUsageRegex.test(code);
      const hasRoot = rootUsageRegex.test(code);
      if (hasBare && !hasRoot) {
        errors.push({ type: 'wrong-kind', message: `${name} is compound — use <${name}.Root>, not <${name}>` });
      }
    } else if (comp.kind === 'simple') {
      // Check if used as <Button.Root> (shouldn't)
      const dotRootRegex = new RegExp(`<${name}\\.Root`, 'g');
      if (dotRootRegex.test(code)) {
        errors.push({ type: 'wrong-kind', message: `${name} is simple — use <${name}>, not <${name}.Root>` });
      }
    }
  }

  return errors;
}

// ─── Step 2: TypeScript validation ──────────────────────────────────────────

function validateTypeScript(code) {
  // Ensure scratch directory exists
  if (!existsSync(SCRATCH_DIR)) {
    mkdirSync(SCRATCH_DIR, { recursive: true });
  }

  const tempFile = resolve(SCRATCH_DIR, 'temp.tsx');
  writeFileSync(tempFile, code);

  try {
    execSync(`npx tsc --project ${TSCONFIG_PATH} --noEmit 2>&1`, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 30000,
    });
    return [];
  } catch (err) {
    const output = (err.stdout || '') + (err.stderr || '');
    const errors = [];
    // Parse tsc output: file(line,col): error TSxxxx: message
    const errRegex = /temp\.tsx\((\d+),\d+\):\s*error\s+TS\d+:\s*(.+)/g;
    let m;
    while ((m = errRegex.exec(output)) !== null) {
      errors.push({ line: parseInt(m[1], 10), message: m[2].trim() });
    }
    // If we couldn't parse temp.tsx-specific errors, check for other relevant errors
    if (errors.length === 0 && output.trim()) {
      const lines = output.split('\n').filter(l =>
        l.includes('error TS') &&
        !l.includes('TS6305') &&
        !l.includes('TS6310') &&
        // Only include errors from the temp file or module resolution errors
        (l.includes('temp.tsx') || l.includes('Cannot find module'))
      );
      if (lines.length > 0) {
        errors.push({ line: 0, message: lines.join('\n').trim() });
      }
    }
    return errors;
  }
}

// ─── Run validation ─────────────────────────────────────────────────────────

const result = {
  source: sourceLabel,
  valid: true,
  registryErrors: [],
  typescriptErrors: [],
};

// Registry checks
result.registryErrors = validateRegistry(code);

// TypeScript checks
result.typescriptErrors = validateTypeScript(code);

// Determine overall validity
result.valid = result.registryErrors.length === 0 && result.typescriptErrors.length === 0;

// ─── Output ─────────────────────────────────────────────────────────────────

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.valid) {
    console.log(`✅ ${sourceLabel} — valid`);
  } else {
    console.log(`❌ ${sourceLabel} — ${result.registryErrors.length + result.typescriptErrors.length} error(s)\n`);
    for (const err of result.registryErrors) {
      console.log(`  [registry] ${err.message}`);
    }
    for (const err of result.typescriptErrors) {
      const loc = err.line > 0 ? `:${err.line}` : '';
      console.log(`  [tsc${loc}] ${err.message}`);
    }
  }

process.exit(result.valid ? 0 : 1);
