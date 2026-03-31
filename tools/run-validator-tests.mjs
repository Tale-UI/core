#!/usr/bin/env node
/**
 * Tale UI — Validator Test Suite
 *
 * Runs validate-generated.mjs against a set of known-good (positive) and
 * known-bad (negative) test cases to verify the validator itself is working.
 *
 * Positive tests: golden prompts in tools/golden-prompts/ (must pass)
 * Negative tests: tools/validator-tests/negative/*.json (must fail)
 *
 * Usage:
 *   node tools/run-validator-tests.mjs
 *   node tools/run-validator-tests.mjs --negative-only
 *   node tools/run-validator-tests.mjs --positive-only
 *   node tools/run-validator-tests.mjs --verbose
 *
 * Exit codes:
 *   0 — all tests behaved as expected
 *   1 — one or more tests produced unexpected results
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const VALIDATOR = resolve(__dirname, 'validate-generated.mjs');
const GOLDEN_DIR = resolve(__dirname, 'golden-prompts');
const NEGATIVE_DIR = resolve(__dirname, 'validator-tests/negative');

const args = process.argv.slice(2);
const negativeOnly = args.includes('--negative-only');
const positiveOnly = args.includes('--positive-only');
const verbose = args.includes('--verbose');

// ─── Test runner ─────────────────────────────────────────────────────────────

function runValidator(filePath) {
  try {
    execSync(`node ${VALIDATOR} --json ${filePath}`, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 60000,
    });
    return { exitCode: 0 };
  } catch (err) {
    const output = err.stdout || '';
    let result;
    try {
      result = JSON.parse(output);
    } catch {
      result = null;
    }
    return { exitCode: err.status || 1, result };
  }
}

// ─── Collect tests ──────────────────────────────────────────────────────────

const tests = [];

// Positive tests: golden prompts must all pass
if (!negativeOnly) {
  const goldenFiles = readdirSync(GOLDEN_DIR)
    .filter(f => f.endsWith('.json') && f !== 'index.json')
    .sort();

  for (const file of goldenFiles) {
    tests.push({
      type: 'positive',
      file: resolve(GOLDEN_DIR, file),
      label: `golden/${file}`,
    });
  }
}

// Negative tests: must all fail
if (!positiveOnly) {
  const negativeFiles = readdirSync(NEGATIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  for (const file of negativeFiles) {
    const data = JSON.parse(readFileSync(resolve(NEGATIVE_DIR, file), 'utf8'));
    tests.push({
      type: 'negative',
      file: resolve(NEGATIVE_DIR, file),
      label: `negative/${file}`,
      expectedError: data.expectedError,
      description: data.description,
    });
  }
}

// ─── Run tests ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

console.log(`Running ${tests.length} validator tests...\n`);

for (const test of tests) {
  const { exitCode, result } = runValidator(test.file);

  if (test.type === 'positive') {
    // Positive: must exit 0 (valid)
    if (exitCode === 0) {
      passed++;
      if (verbose) console.log(`  ✅ PASS (positive) ${test.label}`);
    } else {
      failed++;
      console.log(`  ❌ FAIL (positive should pass) ${test.label}`);
      if (result) {
        for (const err of (result.registryErrors || [])) {
          console.log(`       [registry] ${err.message}`);
        }
        for (const err of (result.typescriptErrors || [])) {
          const loc = err.line > 0 ? `:${err.line}` : '';
          console.log(`       [tsc${loc}] ${err.message}`);
        }
      }
    }
  } else {
    // Negative: must exit 1 (invalid)
    if (exitCode !== 0) {
      // Optionally check that the right error type was caught
      let correctErrorType = true;
      if (test.expectedError && result) {
        const registryErrors = result.registryErrors || [];
        const hasExpected = registryErrors.some(e => e.type === test.expectedError);
        if (!hasExpected) {
          correctErrorType = false;
          console.log(`  ⚠️  WARN (negative caught error, but not '${test.expectedError}') ${test.label}`);
          if (verbose && registryErrors.length > 0) {
            for (const err of registryErrors) {
              console.log(`       [registry:${err.type}] ${err.message}`);
            }
          }
        }
      }
      if (correctErrorType) {
        passed++;
        if (verbose) console.log(`  ✅ PASS (negative correctly rejected) ${test.label}`);
        if (verbose && test.description) console.log(`       ${test.description}`);
      } else {
        // Still counts as pass since it was rejected — just a different error type
        passed++;
      }
    } else {
      failed++;
      console.log(`  ❌ FAIL (negative should be rejected but passed) ${test.label}`);
      if (test.description) console.log(`       ${test.description}`);
    }
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('\nSome tests produced unexpected results. See above for details.');
  process.exit(1);
} else {
  console.log('\nAll tests behaved as expected.');
  process.exit(0);
}
