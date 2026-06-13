#!/usr/bin/env node
/**
 * BEM Class Audit — verifies every cx() class in styled components has matching CSS.
 * Run: node tools/audit-bem.js
 */
const fs = require('fs');
const path = require('path');

const srcDir = 'packages/react/src';
const cssDir = 'packages/styles/src';

// Collect all styled component files
const dirs = fs.readdirSync(srcDir, { withFileTypes: true }).filter(d => d.isDirectory());
const styledFiles = [];
for (const d of dirs) {
  const dirPath = path.join(srcDir, d.name);
  for (const f of fs.readdirSync(dirPath)) {
    if ((f.endsWith('.styled.tsx') || f === 'CheckboxGroup.tsx') && !f.includes('.test.') && !f.includes('.spec.')) {
      styledFiles.push(path.join(dirPath, f));
    }
  }
}

// Collect all CSS content
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
const allCss = cssFiles.map(f => fs.readFileSync(path.join(cssDir, f), 'utf8')).join('\n');

// Known intentionally unstyled classes (triggers/close buttons styled by consumers)
const INTENTIONAL = new Set([
  'tale-alert-dialog__trigger', 'tale-alert-dialog__close',
  'tale-context-menu__trigger',
  'tale-drawer__trigger', 'tale-drawer__close',
  'tale-preview-card__trigger',
  'tale-tooltip__trigger',
]);

const mismatches = [];

for (const file of styledFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const comp = path.basename(path.dirname(file));
  const regex = /cx\(['"]([^'"]*)['"]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const classes = m[1].split(/\s+/).filter(c => c.startsWith('tale-') && !c.includes('${'));
    for (const cls of classes) {
      if (INTENTIONAL.has(cls)) {continue;}
      if (!allCss.includes(`.${  cls}`)) {
        mismatches.push({ comp, cls, file: path.basename(file) });
      }
    }
  }
}

if (mismatches.length === 0) {
  console.log('✅ All cx() classes have matching CSS.');
  process.exit(0);
} else {
  console.log(`❌ ${mismatches.length} classes missing CSS:\n`);
  for (const { comp, cls } of mismatches) {
    console.log(`  ${comp}: .${cls}`);
  }
  process.exit(1);
}
