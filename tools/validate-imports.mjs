#!/usr/bin/env node
/**
 * Import Liveness Test
 *
 * For each component in registry/components.json, generates a minimal
 * import statement and verifies it resolves via TypeScript.
 * Ensures registry import paths actually work at compile time.
 *
 * Run:  node tools/validate-imports.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const REGISTRY_PATH = join(ROOT, 'registry/components.json');
const SCRATCH_DIR = join(ROOT, '.generated-scratch');

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));

// Generate a single file that imports every component
const lines = [];
for (const comp of registry.components) {
  if (!comp.import) continue;
  const varName = comp.name.replace(/[^a-zA-Z0-9]/g, '_');
  if (comp.kind === 'compound') {
    lines.push(`import { ${comp.name} as ${varName} } from '${comp.import}';`);
    // Verify .Root exists for compound
    lines.push(`type _${varName}_Root = typeof ${varName}.Root;`);
  } else {
    lines.push(`import { ${comp.name} as ${varName} } from '${comp.import}';`);
    lines.push(`type _${varName} = typeof ${varName};`);
  }
}

const code = `// Auto-generated import liveness test\n${lines.join('\n')}\n`;

// Write to the same scratch dir used by validate-generated.mjs
mkdirSync(SCRATCH_DIR, { recursive: true });
const testFile = join(SCRATCH_DIR, 'imports.tsx');
writeFileSync(testFile, code);

// Use the existing tsconfig.generated.json which already resolves @tale-ui/* paths
const TSCONFIG_PATH = join(ROOT, 'tools/tsconfig.generated.json');

// Run tsc
let exitCode = 0;
try {
  execSync(`npx tsc -p ${TSCONFIG_PATH} --noEmit`, {
    cwd: ROOT,
    stdio: 'pipe',
    timeout: 30000,
  });
  console.log(`✅ All ${registry.components.length} component imports resolve successfully.`);
} catch (err) {
  const output = err.stdout?.toString() || err.stderr?.toString() || '';
  const errorLines = output.split('\n').filter(l => l.includes('error TS'));
  console.error(`❌ ${errorLines.length} import resolution errors:`);
  for (const line of errorLines.slice(0, 20)) {
    console.error(`  ${line.trim()}`);
  }
  exitCode = 1;
}

// Cleanup
try {
  rmSync(SCRATCH_DIR, { recursive: true, force: true });
} catch {}

process.exit(exitCode);
