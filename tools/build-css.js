#!/usr/bin/env node
/**
 * Build script: concatenates all @tale-ui/core source files
 * into a single dist/style.css. No external dependencies required.
 *
 * Usage: node tools/build-css.js
 */

const fs = require('fs');
const path = require('path');

const CSS_ROOT = path.join(__dirname, '..', 'packages', 'css');
const SRC_DIR  = path.join(CSS_ROOT, 'src');
const DIST_DIR = path.join(CSS_ROOT, 'dist');
const INDEX    = path.join(SRC_DIR, 'index.css');

// Parse @import paths from a CSS file (single-level, no recursion needed
// since index.css is the only file with @import statements)
function parseImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /@import\s+['"](.+?)['"]\s*;?/g;
  const imports = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    imports.push(path.resolve(path.dirname(filePath), match[1]));
  }
  return imports;
}

// Build
const importPaths = parseImports(INDEX);

if (importPaths.length === 0) {
  console.error('No @import statements found in index.css');
  process.exit(1);
}

const timestamp = new Date().toISOString().split('T')[0];
let output = `/* @tale-ui/core — Built ${timestamp} */\n`;
output += `/* Source: packages/css/src/index.css */\n\n`;

for (const filePath of importPaths) {
  const rel = path.relative(SRC_DIR, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  output += `/* ============================================\n`;
  output += `   ${rel}\n`;
  output += `   ============================================ */\n`;
  output += content.trimEnd() + '\n\n';
}

// Zero-dependency CSS minification.
// Preserves spaces around + and - inside calc()/clamp()/min()/max() as required by the CSS spec.
function minifyCSS(css) {
  // 1. Strip comments
  let result = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // 2. Protect spaces around + and - inside math functions.
  //    Replace " + " and " - " with placeholders before collapsing whitespace.
  result = result.replace(/ \+ /g, '<<PLUS>>');
  result = result.replace(/ - /g, '<<MINUS>>');
  // 3. Collapse whitespace
  result = result.replace(/\s+/g, ' ');
  // 4. Remove space around delimiters
  result = result.replace(/\s*([{}:;,])\s*/g, '$1');
  // 5. Remove trailing semicolons before }
  result = result.replace(/;}/g, '}');
  // 6. Restore protected spaces
  result = result.replace(/<<PLUS>>/g, ' + ');
  result = result.replace(/<<MINUS>>/g, ' - ');
  return result.trim();
}

fs.mkdirSync(DIST_DIR, { recursive: true });
const outPath = path.join(DIST_DIR, 'style.css');
fs.writeFileSync(outPath, output, 'utf8');

const minified = minifyCSS(output);
const minPath = path.join(DIST_DIR, 'style.min.css');
fs.writeFileSync(minPath, minified, 'utf8');

const { gzipSync } = require('zlib');
const kb = (output.length / 1024).toFixed(1);
const gzipKb = (gzipSync(output).length / 1024).toFixed(1);
console.log(`✓ Built dist/style.css (${kb} KB, ${gzipKb} KB gzipped, ${importPaths.length} modules)`);

const minKb = (minified.length / 1024).toFixed(1);
const minGzipKb = (gzipSync(minified).length / 1024).toFixed(1);
console.log(`✓ Built dist/style.min.css (${minKb} KB, ${minGzipKb} KB gzipped)`);
