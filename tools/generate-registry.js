#!/usr/bin/env node
/**
 * Registry Generator
 * Generates registry/components.json from source files.
 *
 * Run:   node tools/generate-registry.js          # generate and write
 *        node tools/generate-registry.js --check   # compare against committed file; exit 1 if different
 *
 * Data sources per component:
 *   - packages/react/src/{name}/index.ts          → kind (compound vs simple)
 *   - packages/react/src/{name}/{Name}.styled.tsx → props, parts, JSDoc examples
 *   - packages/styles/src/{name}.css              → CSS classes
 *   - docs/component-index.md                     → category, description
 *   - docs/components/{name}.md                   → usage examples
 *   - packages/react/package.json                 → import path
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REACT_SRC = path.join(ROOT, 'packages/react/src');
const STYLES_SRC = path.join(ROOT, 'packages/styles/src');
const DOCS_DIR = path.join(ROOT, 'docs/components');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');

const args = process.argv.slice(2);
const checkMode = args.includes('--check');

// ─── Shared constants (from audit-components.js) ────────────────────────────

const SKIP_DIRS = new Set([
  'types', 'utils', 'react-aria-adapters',
  'temporal-adapter-date-fns', 'temporal-adapter-luxon', 'temporal-adapter-provider',
  'unstable-use-media-query',
]);

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

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return null; }
}

// ─── Component discovery ────────────────────────────────────────────────────

function discoverComponents() {
  return fs.readdirSync(REACT_SRC, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_') && !SKIP_DIRS.has(d.name))
    .map(d => d.name)
    .sort();
}

function findStyledFile(name) {
  const dir = path.join(REACT_SRC, name);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const pascal = kebabToPascal(name);
  const styledName = `${pascal}.styled.tsx`;
  if (files.includes(styledName)) return path.join(dir, styledName);
  const plainName = `${pascal}.tsx`;
  if (files.includes(plainName) && !plainName.includes('.test.') && !plainName.includes('.spec.')) {
    return path.join(dir, plainName);
  }
  const styled = files.find(f => f.endsWith('.styled.tsx'));
  if (styled) return path.join(dir, styled);
  return null;
}

// ─── Category & description from component-index.md ─────────────────────────

function parseComponentIndex() {
  const raw = readFile(path.join(ROOT, 'docs/component-index.md'));
  if (!raw) return new Map();
  const content = raw.replace(/\r\n/g, '\n');

  const map = new Map();
  let currentCategory = null;
  for (const line of content.split('\n')) {
    const catMatch = line.match(/^## (.+?) \(\d+\)/);
    if (catMatch) { currentCategory = catMatch[1]; continue; }
    // Table row: | Component | Description | Import | Parts |
    const rowMatch = line.match(/^\|\s*(\w+)\s*\|\s*(.+?)\s*\|\s*`(.+?)`\s*\|\s*(.+?)\s*\|/);
    if (rowMatch && currentCategory) {
      map.set(rowMatch[1], {
        category: currentCategory,
        description: rowMatch[2].trim(),
        import: rowMatch[3].trim(),
        parts: rowMatch[4].trim() === '--' ? null : rowMatch[4].trim().split(',').map(p => p.trim()),
      });
    }
  }
  return map;
}

// ─── Kind detection ─────────────────────────────────────────────────────────

function detectKind(indexContent) {
  if (!indexContent) return 'simple';
  return /export \* as \w+ from/.test(indexContent) ? 'compound' : 'simple';
}

// ─── Props extraction ───────────────────────────────────────────────────────

function extractProps(styledContent, pascal) {
  if (!styledContent) return [];

  // Find exported interfaces (only those that end with Props)
  const props = [];
  const normalized = styledContent.replace(/\r\n/g, '\n');

  // Identify the "main" props interface: RootProps, {Pascal}Props, or {Pascal}RootProps
  const mainPropNames = new Set([
    'RootProps',
    `${pascal}Props`,
    `${pascal}RootProps`,
  ]);

  // Match exported interface blocks: export interface FooProps ... { ... }
  const ifaceRegex = /export\s+interface\s+(\w*Props\w*)\s+(?:extends\s+[^{]+)?\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
  let ifaceMatch;

  while ((ifaceMatch = ifaceRegex.exec(normalized)) !== null) {
    const ifaceName = ifaceMatch[1];
    const body = ifaceMatch[2];
    if (!mainPropNames.has(ifaceName)) continue;

    // Parse each member
    const memberRegex = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;]+);/gs;
    let memberMatch;
    while ((memberMatch = memberRegex.exec(body)) !== null) {
      const description = memberMatch[1]
        ? memberMatch[1].replace(/\s*\*\s*/g, ' ').replace(/\s+/g, ' ').trim()
        : null;
      const name = memberMatch[2];
      const required = !memberMatch[3];
      let type = memberMatch[4].trim();
      // Remove trailing `| undefined` if optional
      type = type.replace(/\s*\|\s*undefined\s*$/, '').trim();

      // Skip className — every component has it, not useful in registry
      if (name === 'className') continue;
      // Skip children — implicit in React
      if (name === 'children') continue;

      props.push({ name, type, required, description });
    }

    // Only process the first/main interface per component
    break;
  }

  // Also try `export type FooProps = Omit<...> & { custom?: ... }` pattern
  if (props.length === 0) {
    const typeRegex = /export\s+type\s+(\w*Props\w*)(?:<[^>]*>)?\s*=\s*[^{]*&\s*\{([^}]*)\}/g;
    let typeMatch;
    while ((typeMatch = typeRegex.exec(normalized)) !== null) {
      if (!mainPropNames.has(typeMatch[1])) continue;
      const body = typeMatch[2];
      const memberRegex2 = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;]+);/gs;
      let mm;
      while ((mm = memberRegex2.exec(body)) !== null) {
        const name = mm[2];
        if (name === 'className' || name === 'children') continue;
        const description = mm[1] ? mm[1].replace(/\s*\*\s*/g, ' ').replace(/\s+/g, ' ').trim() : null;
        const required = !mm[3];
        let type = mm[4].trim().replace(/\s*\|\s*undefined\s*$/, '').trim();
        props.push({ name, type, required, description });
      }
      break;
    }
  }

  return props;
}

// Attempt to extract default values from the forwardRef destructuring
function extractDefaults(styledContent) {
  if (!styledContent) return {};
  const defaults = {};
  // Match destructured defaults: { prop = 'value', prop2 = true, ... }
  const destructRegex = /\(\s*\{([^}]+)\}/;
  const match = styledContent.match(destructRegex);
  if (match) {
    const defaultRegex = /(\w+)\s*=\s*(['"][\w-]+['"]|true|false|\d+)/g;
    let dm;
    while ((dm = defaultRegex.exec(match[1])) !== null) {
      defaults[dm[1]] = dm[2];
    }
  }
  return defaults;
}

// ─── Parts extraction ───────────────────────────────────────────────────────

function extractParts(indexContent, styledContent) {
  if (!indexContent || !/export \* as \w+ from/.test(indexContent)) return null;
  if (!styledContent) return null;
  const parts = [];
  const regex = /export (?:const|function) (\w+)/g;
  let m;
  while ((m = regex.exec(styledContent)) !== null) {
    // Skip internal helpers (lowercase first letter or starts with 'use')
    if (/^[a-z]/.test(m[1]) || m[1].startsWith('use')) continue;
    parts.push(m[1]);
  }
  return parts.length > 0 ? parts : null;
}

// ─── CSS class extraction ───────────────────────────────────────────────────

function extractCSSClasses(cssContent) {
  if (!cssContent) return [];
  const classes = new Set();
  const regex = /\.(tale-[\w-]+(?:__[\w-]+)?(?:--[\w-]+)?)/g;
  let m;
  while ((m = regex.exec(cssContent)) !== null) {
    classes.add(m[1]);
  }
  return [...classes].sort();
}

// ─── Example extraction from docs ───────────────────────────────────────────

function extractDocExamples(docContent) {
  if (!docContent) return [];
  const normalized = docContent.replace(/\r\n/g, '\n');
  const examples = [];
  const regex = /```tsx\n([\s\S]*?)```/g;
  let m;
  while ((m = regex.exec(normalized)) !== null) {
    const code = m[1].trim();
    if (code) examples.push(code);
  }
  return examples;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function generateRegistry() {
  const componentIndex = parseComponentIndex();
  const reactPkg = JSON.parse(readFile(path.join(ROOT, 'packages/react/package.json')));
  const slugs = discoverComponents();

  const components = [];

  for (const slug of slugs) {
    const pascal = kebabToPascal(slug);
    const styledPath = findStyledFile(slug);
    const styledContent = styledPath ? readFile(styledPath) : null;
    const indexContent = readFile(path.join(REACT_SRC, slug, 'index.ts'));
    const cssContent = readFile(path.join(STYLES_SRC, `${slug}.css`));
    const docContent = readFile(path.join(DOCS_DIR, `${slug}.md`));

    const indexInfo = componentIndex.get(pascal);
    const kind = detectKind(indexContent);
    const importPath = reactPkg.exports[`./${slug}`] ? `@tale-ui/react/${slug}` : null;

    // Props
    const rawProps = extractProps(styledContent, pascal);
    const defaults = extractDefaults(styledContent);
    const props = rawProps.map(p => ({
      ...p,
      default: defaults[p.name] || null,
    }));

    // Parts
    const parts = extractParts(indexContent, styledContent);

    // CSS classes
    const cssClasses = extractCSSClasses(cssContent);

    // Examples
    const examples = extractDocExamples(docContent);

    components.push({
      name: pascal,
      slug,
      import: importPath,
      category: indexInfo?.category || null,
      description: indexInfo?.description || null,
      kind,
      props,
      parts,
      examples: examples.length > 0 ? examples : null,
      cssClasses: cssClasses.length > 0 ? cssClasses : null,
    });
  }

  return {
    schemaVersion: '1.0.0',
    taleUiVersion: reactPkg.version,
    components,
  };
}

// ─── Run ────────────────────────────────────────────────────────────────────

const registry = generateRegistry();
const output = JSON.stringify(registry, null, 2) + '\n';

if (checkMode) {
  const existing = readFile(REGISTRY_PATH);
  if (existing === output) {
    console.log('✅ Registry is up-to-date.');
    process.exit(0);
  } else {
    console.error('❌ Registry is out of date. Run: pnpm registry:generate');
    process.exit(1);
  }
} else {
  // Ensure registry directory exists
  const registryDir = path.dirname(REGISTRY_PATH);
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }
  fs.writeFileSync(REGISTRY_PATH, output);
  console.log(`✅ Generated registry/components.json (${registry.components.length} components)`);
}
