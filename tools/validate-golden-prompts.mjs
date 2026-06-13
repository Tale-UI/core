#!/usr/bin/env node
/**
 * Golden Prompt Validator
 *
 * Validates all golden prompt reference implementations against
 * the component registry and TypeScript compiler.
 *
 * Run: node tools/validate-golden-prompts.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GOLDEN_DIR = resolve(__dirname, 'golden-prompts');

// Discover all golden prompt files
const files = readdirSync(GOLDEN_DIR)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort();

if (files.length === 0) {
  console.error('No golden prompt files found.');
  process.exit(1);
}

let passed = 0;
let failed = 0;
const failures = [];

for (const file of files) {
  const filePath = join(GOLDEN_DIR, file);

  try {
    // Validate JSON is parseable and has required fields
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    if (!data.slug || !data.reference || !data.prompt) {
      throw new Error(`Missing required fields (slug, reference, prompt)`);
    }

    // Run the validator
    execSync(`node tools/validate-generated.mjs --golden "${filePath}"`, {
      cwd: resolve(__dirname, '..'),
      encoding: 'utf8',
      timeout: 30000,
      stdio: 'pipe',
    });

    passed++;
  } catch (err) {
    failed++;
    const output = (err.stdout || '') + (err.stderr || '');
    failures.push({ file, output: output.trim() });
  }
}

// Report
console.log(`\n── Golden Prompt Validation ──────────────────────`);
console.log(`  Total:  ${files.length}`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);

if (failures.length > 0) {
  console.log(`\n❌ Failures:\n`);
  for (const f of failures) {
    console.log(`  ${f.file}:`);
    for (const line of f.output.split('\n')) {
      if (line.trim()) {console.log(`    ${line}`);}
    }
    console.log();
  }
  process.exit(1);
} else {
  console.log(`\n✅ All ${passed} golden prompts pass validation.`);
}
