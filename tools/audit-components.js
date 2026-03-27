#!/usr/bin/env node
/**
 * Comprehensive Component Audit
 * Checks every component for completeness and consistency across all artifacts.
 *
 * Run: node tools/audit-components.js [--json] [--component=button]
 *
 * Checks per component:
 *   1. styled file exists (packages/react/src/{name}/{Name}.styled.tsx)
 *   2. index.ts exists and re-exports
 *   3. CSS file exists (packages/styles/src/{name}.css)
 *   4. CSS @import in packages/styles/src/index.css
 *   5. Markdown doc exists (docs/components/{name}.md)
 *   6. Doc has required sections: Props (or Parts+Props), Examples, CSS Classes
 *   7. JSDoc @example exists on Root/main export
 *   8. @example import path matches actual package.json export
 *   9. Component listed in docs/component-index.md
 *  10. Component listed in docs/consumer-claude-md-snippet.md
 *  11. Component listed in packages/react/README.md
 *  12. Export in packages/react/package.json
 *  13. Export in packages/styles/package.json
 *  14. Storybook story exists
 *  15. ComponentAudit.tsx entry exists
 *  16. CLAUDE.md audit table row exists
 *  17. Parts listed in component-index.md match actual exports
 *  18. Doc examples use correct import paths
 *  19. Doc CSS classes match actual CSS file selectors
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REACT_SRC = path.join(ROOT, 'packages/react/src');
const STYLES_SRC = path.join(ROOT, 'packages/styles/src');
const DOCS_DIR = path.join(ROOT, 'docs/components');
const STORIES_DIR = path.join(ROOT, 'playground/storybook/src/stories');
const AUDIT_FILE = path.join(ROOT, 'playground/vite-app/src/demos/ComponentAudit.tsx');

// Parse args
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const componentFilter = args.find(a => a.startsWith('--component='))?.split('=')[1];
const verbose = args.includes('--verbose') || args.includes('-v');

// Non-component directories to skip
const SKIP_DIRS = new Set([
  'types', 'utils', 'react-aria-adapters',
  'temporal-adapter-date-fns', 'temporal-adapter-luxon', 'temporal-adapter-provider',
  'unstable-use-media-query',
]);

// Components that don't have a .styled.tsx file (re-exports, providers, utilities)
const NO_STYLED_FILE = new Set([
  'checkbox-group', 'radio-group', 'toggle-group', 'social-button-group',
  'container', 'csp-provider', 'merge-props',
]);

// Re-export components where @example lives in the source package, not in their own dir
const REEXPORT_SKIP_EXAMPLE = new Set([
  'checkbox-group', 'radio-group', 'toggle-group', 'social-button-group',
]);

// Components that don't need CSS files
const NO_CSS = new Set([
  'checkbox-group', 'radio-group', 'toggle-group', 'social-button-group',
  'container', 'csp-provider', 'i18n-provider', 'merge-props',
  'context-menu', 'menubar',
]);

// Components that don't need storybook stories
const NO_STORY = new Set(['csp-provider', 'i18n-provider', 'merge-props']);

// Components that don't need ComponentAudit entries
const NO_AUDIT_ENTRY = new Set(['csp-provider', 'i18n-provider', 'merge-props']);

// ─── Helper functions ────────────────────────────────────────────────────────

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

// Special PascalCase overrides for acronyms and name mismatches
const PASCAL_OVERRIDES = {
  'csp-provider': 'CSPProvider',
  'i18n-provider': 'I18nProvider',
  'toggle-group': 'ToggleButtonGroup',
  'merge-props': 'mergeProps',
};

function kebabToPascal(kebab) {
  if (PASCAL_OVERRIDES[kebab]) return PASCAL_OVERRIDES[kebab];
  return kebab.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

/** Find the styled file for a component */
function findStyledFile(name) {
  const dir = path.join(REACT_SRC, name);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir);

  // Try {Name}.styled.tsx first
  const pascal = kebabToPascal(name);
  const styledName = `${pascal}.styled.tsx`;
  if (files.includes(styledName)) return path.join(dir, styledName);

  // Try {Name}.tsx (for some components like CheckboxGroup)
  const plainName = `${pascal}.tsx`;
  if (files.includes(plainName) && !plainName.includes('.test.') && !plainName.includes('.spec.')) {
    return path.join(dir, plainName);
  }

  // Fallback: find any .styled.tsx
  const styled = files.find(f => f.endsWith('.styled.tsx'));
  if (styled) return path.join(dir, styled);

  return null;
}

/** Extract @example block from source */
function extractJSDocExample(content) {
  // Normalize line endings to \n
  const c = content.replace(/\r\n/g, '\n');
  // Try JSDoc comment style: * @example\n * ```tsx\n ... * ```
  const match = c.match(/@example\s*\n\s*\*\s*```tsx?\n([\s\S]*?)\*\s*```/);
  if (match) return match[1].replace(/^\s*\*\s?/gm, '').trim();
  // Try non-JSDoc comment style: @example\n```tsx\n ... ```
  const match2 = c.match(/@example\s*\n\s*\*?\s*```tsx?\n([\s\S]*?)```/);
  if (match2) return match2[1].replace(/^\s*\*\s?/gm, '').trim();
  // Simplest check: does @example exist at all?
  if (/@example/.test(c)) return '(found but unparseable)';
  return null;
}

/** Extract all BEM class names from a CSS file */
function extractCSSClasses(cssContent) {
  const classes = new Set();
  const regex = /\.(tale-[\w-]+(?:__[\w-]+)?(?:--[\w-]+)?)/g;
  let m;
  while ((m = regex.exec(cssContent)) !== null) {
    classes.add(m[1]);
  }
  return [...classes];
}

/** Extract CSS classes documented in a markdown file */
function extractDocCSSClasses(mdContent) {
  const section = mdContent.split(/^## CSS Classes/m)[1];
  if (!section) return null;
  const sectionContent = section.split(/^## /m)[0];
  const classes = [];
  const regex = /`\.(tale-[\w-]+(?:__[\w-]+)?(?:--[\w-]+)?)`/g;
  let m;
  while ((m = regex.exec(sectionContent)) !== null) {
    classes.push(m[1]);
  }
  return classes;
}

/** Check if doc has required sections */
function checkDocSections(mdContent) {
  const missing = [];
  // Props or Parts table
  if (!/^## Props/m.test(mdContent) && !/^## Parts/m.test(mdContent)) {
    missing.push('Props/Parts');
  }
  // Examples
  if (!/^## (Examples|Basic Usage)/m.test(mdContent) && !/```tsx/m.test(mdContent)) {
    missing.push('Examples');
  }
  // CSS Classes
  if (!/^## CSS Classes/m.test(mdContent)) {
    missing.push('CSS Classes');
  }
  return missing;
}

/** Extract exported part names from index.ts (for namespace components) */
function extractExportedParts(indexContent, styledContent) {
  // Check if it's a namespace export: export * as Foo from ...
  if (/export \* as \w+ from/.test(indexContent)) {
    // Extract all exported const/function names from the styled file
    const parts = [];
    const regex = /export (?:const|function) (\w+)/g;
    let m;
    while ((m = regex.exec(styledContent)) !== null) {
      parts.push(m[1]);
    }
    return parts;
  }
  return null; // Simple component, no parts
}

// ─── Main audit ──────────────────────────────────────────────────────────────

function auditComponent(name) {
  const issues = [];
  const warnings = [];
  const pascal = kebabToPascal(name);

  // Load shared files (lazy, cached below)
  const reactPkgJson = JSON.parse(readFile(path.join(ROOT, 'packages/react/package.json')));
  const stylesPkgJson = JSON.parse(readFile(path.join(ROOT, 'packages/styles/package.json')));
  const stylesIndex = readFile(path.join(STYLES_SRC, 'index.css'));
  const componentIndex = readFile(path.join(ROOT, 'docs/component-index.md'));
  const consumerSnippet = readFile(path.join(ROOT, 'docs/consumer-claude-md-snippet.md'));
  const reactReadme = readFile(path.join(ROOT, 'packages/react/README.md'));
  const claudeMd = readFile(path.join(ROOT, 'CLAUDE.md'));
  const auditTsx = readFile(AUDIT_FILE);

  // 1. Styled file
  const styledPath = findStyledFile(name);
  const styledContent = styledPath ? readFile(styledPath) : null;
  if (!NO_STYLED_FILE.has(name) && !styledContent) {
    issues.push(`Missing styled file: ${pascal}.styled.tsx`);
  }

  // 2. index.ts
  const indexPath = path.join(REACT_SRC, name, 'index.ts');
  const indexContent = readFile(indexPath);
  if (!indexContent) {
    issues.push('Missing index.ts');
  }

  // 3. CSS file
  const cssPath = path.join(STYLES_SRC, `${name}.css`);
  const cssContent = readFile(cssPath);
  if (!NO_CSS.has(name) && !cssContent) {
    issues.push(`Missing CSS file: packages/styles/src/${name}.css`);
  }

  // 4. CSS @import in index.css
  if (!NO_CSS.has(name) && stylesIndex) {
    if (!stylesIndex.includes(`'./${name}.css'`) && !stylesIndex.includes(`"./${name}.css"`)) {
      issues.push(`Missing @import in styles/src/index.css`);
    }
  }

  // 5. Markdown doc
  const docPath = path.join(DOCS_DIR, `${name}.md`);
  const docContent = readFile(docPath);
  if (!docContent) {
    issues.push(`Missing doc: docs/components/${name}.md`);
  }

  // 6. Doc required sections
  if (docContent) {
    const missingSections = checkDocSections(docContent);
    // Filter out CSS Classes requirement for components without CSS
    const filteredMissing = NO_CSS.has(name)
      ? missingSections.filter(s => s !== 'CSS Classes')
      : missingSections;
    if (filteredMissing.length > 0) {
      issues.push(`Doc missing sections: ${filteredMissing.join(', ')}`);
    }
  }

  // 7. JSDoc @example
  if (REEXPORT_SKIP_EXAMPLE.has(name)) {
    // Skip — @example is on the source component, not the re-export
  } else if (styledContent) {
    const example = extractJSDocExample(styledContent);
    if (!example) {
      issues.push('Missing JSDoc @example on main export');
    } else {
      // 8. @example import path check
      const importMatch = example.match(/from\s+['"](@tale-ui\/react\/[\w-]+)['"]/);
      if (importMatch) {
        const importPath = importMatch[1].replace('@tale-ui/react/', './');
        if (!reactPkgJson.exports[importPath]) {
          issues.push(`@example import path "${importMatch[1]}" not in package.json exports`);
        }
      } else if (!example.includes('@tale-ui/react')) {
        warnings.push('@example block has no import statement');
      }
    }
  }

  // 9. Component in component-index.md
  if (componentIndex) {
    const indexRegex = new RegExp(`\\|\\s*${pascal.replace(/([$()*+.?[\\\]^{|}])/g, '\\$1')}\\s*\\|`, 'i');
    if (!indexRegex.test(componentIndex)) {
      issues.push('Missing from docs/component-index.md');
    }
  }

  // 10. Component in consumer-claude-md-snippet.md
  if (consumerSnippet && !consumerSnippet.includes(pascal) && !consumerSnippet.includes(`\`${pascal}\``)) {
    issues.push('Missing from docs/consumer-claude-md-snippet.md');
  }

  // 11. Component in packages/react/README.md
  // README uses space-separated display names: "Alert Dialog", "Color Area", etc.
  // Also handle special names: CSPProvider → "CSP Provider", mergeProps → "mergeProps"
  const displayName = pascal.replace(/([a-z])([A-Z])/g, '$1 $2');
  const displayNameAlt = pascal.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').replace(/([a-z])([A-Z])/g, '$1 $2');
  if (reactReadme && !reactReadme.includes(pascal) && !reactReadme.includes(displayName) && !reactReadme.includes(displayNameAlt) && !reactReadme.includes(`\`${pascal}\``)) {
    issues.push('Missing from packages/react/README.md');
  }

  // 12. Export in packages/react/package.json
  const reactExportKey = `./${name}`;
  if (!reactPkgJson.exports[reactExportKey]) {
    issues.push(`Missing export "${reactExportKey}" in packages/react/package.json`);
  }

  // 13. Export in packages/styles/package.json
  if (!NO_CSS.has(name)) {
    const stylesExportKey = `./${name}`;
    if (!stylesPkgJson.exports[stylesExportKey]) {
      issues.push(`Missing export "${stylesExportKey}" in packages/styles/package.json`);
    }
  }

  // 14. Storybook story
  if (!NO_STORY.has(name)) {
    const storyFiles = fs.readdirSync(STORIES_DIR);
    const hasStory = storyFiles.some(f => {
      const base = f.replace('.stories.tsx', '').replace('.stories.ts', '');
      return base === pascal || base.toLowerCase() === pascal.toLowerCase() ||
             base.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() === name;
    });
    if (!hasStory) {
      // Check for combined stories (e.g., ColorComponents covers multiple, ToggleButton covers ToggleGroup)
      const anyStoryMentions = storyFiles.some(f => {
        const content = readFile(path.join(STORIES_DIR, f));
        return content && (content.includes(`from '@tale-ui/react/${name}'`) || content.includes(pascal));
      });
      if (!anyStoryMentions) {
        issues.push('Missing Storybook story');
      }
    }
  }

  // 15. ComponentAudit.tsx entry
  if (!NO_AUDIT_ENTRY.has(name) && auditTsx) {
    if (!auditTsx.includes(`@tale-ui/react/${name}`) && !auditTsx.includes(pascal)) {
      issues.push('Missing from ComponentAudit.tsx');
    }
  }

  // 16. CLAUDE.md audit table row
  if (claudeMd) {
    const tableRowRegex = new RegExp(`\\|\\s*${pascal}\\s*\\|`);
    if (!tableRowRegex.test(claudeMd)) {
      issues.push('Missing row in CLAUDE.md audit table');
    }
  }

  // 17. Parts consistency (component-index.md vs actual exports)
  if (styledContent && indexContent && componentIndex) {
    const parts = extractExportedParts(indexContent, styledContent);
    if (parts && parts.length > 0) {
      // Find the component-index row
      const indexRow = componentIndex.split('\n').find(line => {
        const rowRegex = new RegExp(`\\|\\s*${pascal}\\s*\\|`);
        return rowRegex.test(line);
      });
      if (indexRow) {
        // Parts cell is the last column in the table row
        const cells = indexRow.split('|').filter(c => c.trim());
        const partsCell = cells.length >= 4 ? cells[3].trim() : '';
        // Skip Visual exports (they are internal building blocks, not listed in docs)
        const publicParts = parts.filter(p => p !== 'Root' && p !== 'Visual');
        for (const part of publicParts) {
          if (partsCell !== '--' && !partsCell.includes(part)) {
            warnings.push(`Part "${part}" exported but not listed in component-index.md`);
          }
        }
        // Also check for parts listed in index that aren't exported
        if (partsCell !== '--') {
          const listedParts = partsCell.split(',').map(p => p.trim()).filter(Boolean);
          for (const listed of listedParts) {
            if (listed !== 'Root' && !parts.includes(listed)) {
              warnings.push(`Part "${listed}" in component-index.md but not exported`);
            }
          }
        }
      }
    }
  }

  // 18. Doc examples import path check
  if (docContent) {
    const importRegex = /from\s+['"](@tale-ui\/react\/[\w-]+)['"]/g;
    let m;
    while ((m = importRegex.exec(docContent)) !== null) {
      const importPath = m[1].replace('@tale-ui/react/', './');
      if (!reactPkgJson.exports[importPath]) {
        issues.push(`Doc has invalid import path: ${m[1]}`);
        break; // Only report once
      }
    }
  }

  // 19. CSS class consistency (doc vs actual CSS)
  if (docContent && cssContent) {
    const actualClasses = extractCSSClasses(cssContent);
    const docClasses = extractDocCSSClasses(docContent);
    if (docClasses !== null && actualClasses.length > 0) {
      // Check for base classes in CSS not documented
      const baseClasses = actualClasses.filter(c =>
        !c.includes('--') && !c.includes(':') &&
        c.startsWith(`tale-${name.replace(/-/g, '-')}`)
      );
      for (const cls of baseClasses) {
        if (!docClasses.includes(cls)) {
          // Check if a sibling doc file covers this class (e.g. social-button-group.md)
          const siblingName = cls.replace('tale-', '');
          const siblingDocPath = path.join(DOCS_DIR, `${siblingName}.md`);
          const siblingDoc = readFile(siblingDocPath);
          if (siblingDoc) {
            const siblingDocClasses = extractDocCSSClasses(siblingDoc);
            if (siblingDocClasses && siblingDocClasses.includes(cls)) continue;
          }
          warnings.push(`CSS class ".${cls}" not documented in markdown`);
        }
      }
    }
  }

  return { name, pascal, issues, warnings };
}

// ─── Run ─────────────────────────────────────────────────────────────────────

// Discover all component directories
const allDirs = fs.readdirSync(REACT_SRC, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('_') && !SKIP_DIRS.has(d.name))
  .map(d => d.name)
  .sort();

const components = componentFilter
  ? allDirs.filter(d => d === componentFilter)
  : allDirs;

if (components.length === 0) {
  console.error(componentFilter
    ? `Component "${componentFilter}" not found.`
    : 'No components found.');
  process.exit(1);
}

const results = components.map(auditComponent);

// ─── Output ──────────────────────────────────────────────────────────────────

if (jsonOutput) {
  const output = results
    .filter(r => r.issues.length > 0 || r.warnings.length > 0)
    .map(r => ({ component: r.name, issues: r.issues, warnings: r.warnings }));
  console.log(JSON.stringify(output, null, 2));
} else {
  const withIssues = results.filter(r => r.issues.length > 0);
  const withWarnings = results.filter(r => r.warnings.length > 0 && r.issues.length === 0);
  const clean = results.filter(r => r.issues.length === 0 && r.warnings.length === 0);

  if (withIssues.length > 0) {
    console.log(`\n❌ ${withIssues.length} component(s) with issues:\n`);
    for (const r of withIssues) {
      console.log(`  ${r.pascal} (${r.name}):`);
      for (const issue of r.issues) {
        console.log(`    ✗ ${issue}`);
      }
      for (const warn of r.warnings) {
        console.log(`    ⚠ ${warn}`);
      }
    }
  }

  if (withWarnings.length > 0 && verbose) {
    console.log(`\n⚠ ${withWarnings.length} component(s) with warnings only:\n`);
    for (const r of withWarnings) {
      console.log(`  ${r.pascal} (${r.name}):`);
      for (const warn of r.warnings) {
        console.log(`    ⚠ ${warn}`);
      }
    }
  }

  const totalIssues = results.reduce((s, r) => s + r.issues.length, 0);
  const totalWarnings = results.reduce((s, r) => s + r.warnings.length, 0);

  console.log(`\n── Summary ──────────────────────────────────────`);
  console.log(`  Components scanned: ${results.length}`);
  console.log(`  Clean:    ${clean.length}`);
  console.log(`  Issues:   ${totalIssues} across ${withIssues.length} component(s)`);
  console.log(`  Warnings: ${totalWarnings} across ${withWarnings.length + withIssues.filter(r => r.warnings.length > 0).length} component(s)`);

  if (totalIssues > 0) {
    console.log(`\nRun with --verbose for warnings on clean components.`);
    console.log(`Run with --json for machine-readable output.`);
    console.log(`Run with --component=button to audit a single component.\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${results.length} components pass structural audit.`);
    if (totalWarnings > 0) {
      console.log(`   (${totalWarnings} warnings — run with --verbose to see them)\n`);
    }
    process.exit(0);
  }
}
