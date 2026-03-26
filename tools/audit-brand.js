#!/usr/bin/env node
/**
 * Brand Token Audit — verifies component CSS never uses --brand-* tokens.
 * --brand-* tokens do not invert in dark mode; use --color-* instead.
 * Run: node tools/audit-brand.js
 */
const fs = require('fs');
const path = require('path');

const cssDir = 'packages/styles/src';

const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
const violations = [];

for (const file of cssFiles) {
  const filePath = path.join(cssDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Strip CSS comments to avoid false positives
  const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '');

  const lines = stripped.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/var\(--brand-/.test(lines[i])) {
      violations.push({ file, line: i + 1, text: lines[i].trim() });
    }
  }
}

if (violations.length === 0) {
  console.log('✅ No --brand-* tokens found in component CSS.');
  process.exit(0);
} else {
  console.log(`❌ ${violations.length} --brand-* violation(s) found:\n`);
  for (const { file, line, text } of violations) {
    console.log(`  ${file}:${line}  ${text}`);
  }
  process.exit(1);
}
