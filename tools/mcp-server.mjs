#!/usr/bin/env node
/**
 * Tale UI MCP Server
 *
 * Exposes the component registry and recipe docs as MCP tools
 * for AI agents (Claude Code, Cursor, Windsurf, etc.).
 *
 * Tools:
 *   list_components   — list all components with name, import, category, description
 *   get_component     — get full details for a component (props, parts, examples, CSS classes)
 *   search_components — fuzzy search components by intent/query
 *   get_recipe        — get a recipe's markdown content by name
 *   list_recipes      — list all available recipes
 *   search_docs       — keyword search across all documentation files
 *   list_a2ui_types       — list all A2UI catalog types with name, category, props
 *   get_a2ui_type         — get full details for an A2UI type (props, component, hints)
 *   get_a2ui_example      — get a few-shot A2UI message example by name
 *   validate_code         — validate generated Tale UI React code (registry + tsc)
 *   get_component_stories — get Storybook story source code for a component
 *   plan_ui               — plan which components/recipes to use before generating JSX
 *
 * Run:  node tools/mcp-server.mjs
 * Config (Claude Code .claude/settings.json):
 *   { "mcpServers": { "tale-ui": { "command": "node", "args": ["tools/mcp-server.mjs"] } } }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Detect whether we are running from the monorepo (tools/) or from a
// consumer's node_modules (@tale-ui/react/).  validate-generated.mjs only
// exists in the monorepo, so it is the most specific signal we can use.
const IS_MONOREPO = existsSync(join(__dirname, '../tools/validate-generated.mjs'));
const ROOT = IS_MONOREPO ? resolve(__dirname, '..') : __dirname;

const REGISTRY_PATH = join(ROOT, 'registry/components.json');
const A2UI_CATALOG_PATH = join(ROOT, 'registry/a2ui-catalog.json');
const PITFALLS_PATH = join(ROOT, 'registry/pitfalls.json');
const RECIPES_DIR = join(ROOT, 'docs/recipes');
const DOCS_DIR = join(ROOT, 'docs');
// STORIES_DIR is only used when running from the monorepo
const STORIES_DIR = join(ROOT, 'playground/storybook/src/stories');

// ─── Load data ──────────────────────────────────────────────────────────────

function loadRegistry() {
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
}

function loadA2UICatalog() {
  return JSON.parse(readFileSync(A2UI_CATALOG_PATH, 'utf8'));
}

function loadPitfalls() {
  try {
    return JSON.parse(readFileSync(PITFALLS_PATH, 'utf8'));
  } catch {
    return { crossComponentPitfalls: [], generalConventions: [], triggerStylingTable: null };
  }
}

function loadRecipeIndex() {
  const files = readdirSync(RECIPES_DIR).filter(f => f.endsWith('.md') && f !== 'index.md');
  return files.map(f => {
    const slug = f.replace('.md', '');
    const content = readFileSync(join(RECIPES_DIR, f), 'utf8').replace(/\r\n/g, '\n');
    const titleMatch = content.match(/^# (.+)/m);
    return {
      slug,
      title: titleMatch ? titleMatch[1] : slug,
      file: f,
    };
  });
}

// ─── Docs index ─────────────────────────────────────────────────────────────

function walkDir(dir, base = dir) {
  const entries = [];
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, item.name);
    if (item.isDirectory()) {
      entries.push(...walkDir(full, base));
    } else if (item.name.endsWith('.md') && item.name !== 'index.md') {
      entries.push(full);
    }
  }
  return entries;
}

let _docsIndex = null;
function loadDocsIndex() {
  if (_docsIndex) return _docsIndex;
  const files = walkDir(DOCS_DIR);
  _docsIndex = files.map(filePath => {
    const content = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    const titleMatch = content.match(/^# (.+)/m);
    const relativePath = filePath.replace(ROOT + '/', '').replace(ROOT + '\\', '').replace(/\\/g, '/');
    return {
      path: relativePath,
      title: titleMatch ? titleMatch[1] : relativePath,
      content,
    };
  });
  return _docsIndex;
}

function searchDocs(query) {
  const docs = loadDocsIndex();
  const q = query.toLowerCase();
  const queryWords = q.split(/\s+/).filter(Boolean);

  const scored = docs.map(doc => {
    const lower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();

    // Title match is highest signal
    let score = 0;
    if (titleLower.includes(q)) score += 50;
    for (const w of queryWords) {
      if (titleLower.includes(w)) score += 20;
    }

    // Count content matches
    for (const w of queryWords) {
      const count = (lower.split(w).length - 1);
      score += Math.min(count * 2, 20); // cap per-word contribution
    }

    // Extract matching context lines (up to 3)
    const lines = doc.content.split('\n');
    const snippets = [];
    for (const line of lines) {
      if (snippets.length >= 3) break;
      const lineLower = line.toLowerCase();
      if (queryWords.some(w => lineLower.includes(w)) && line.trim().length > 10) {
        snippets.push(line.trim());
      }
    }

    return { path: doc.path, title: doc.title, score, snippets };
  });

  return scored
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

// ─── Storybook story loader ──────────────────────────────────────────────────

let _storyMap = null;

/**
 * Returns a Map<PascalName, { path, source, storyNames }>
 * Built lazily on first call; cached thereafter.
 */
function loadStoryMap() {
  if (_storyMap) return _storyMap;
  _storyMap = new Map();
  if (!existsSync(STORIES_DIR)) return _storyMap;

  for (const file of readdirSync(STORIES_DIR)) {
    if (!file.endsWith('.stories.tsx') && !file.endsWith('.stories.ts')) continue;
    const filePath = join(STORIES_DIR, file);
    const source = readFileSync(filePath, 'utf8');

    // Extract exported story names (export const <Name>: Story = ...)
    const storyNames = [];
    const exportRegex = /^export\s+const\s+(\w+)\s*:/gm;
    let m;
    while ((m = exportRegex.exec(source)) !== null) {
      if (m[1] !== 'default') storyNames.push(m[1]);
    }

    // Derive component name from filename (Button.stories.tsx → Button)
    const componentName = file.replace(/\.stories\.(tsx?|jsx?)$/, '');
    _storyMap.set(componentName, { path: filePath.replace(ROOT + '/', ''), source, storyNames });
  }
  return _storyMap;
}

// ─── Search helpers ─────────────────────────────────────────────────────────

function fuzzyMatch(query, text) {
  if (!text) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t === q) return 100;
  if (t.includes(q)) return 80;
  // Word-level matching
  const queryWords = q.split(/\s+/);
  const matchedWords = queryWords.filter(w => t.includes(w));
  if (matchedWords.length === queryWords.length) return 70;
  if (matchedWords.length > 0) return 40 * (matchedWords.length / queryWords.length);
  return 0;
}

// Synonym map: common terms agents might search for → Tale UI component names
const SYNONYMS = {
  dropdown: ['Select', 'Combobox', 'Menu'],
  modal: ['Dialog', 'AlertDialog'],
  popup: ['Popover', 'Dialog', 'Tooltip'],
  overlay: ['Dialog', 'AlertDialog', 'Drawer', 'Popover'],
  sidebar: ['Drawer', 'NavigationMenu'],
  toggle: ['Switch', 'ToggleButton', 'ToggleButtonGroup'],
  'toggle button': ['ToggleButton'],
  'formatting toggle': ['ToggleButton'],
  'text formatting': ['ToggleButton', 'ToggleButtonGroup'],
  bold: ['ToggleButton'],
  toast: ['Banner'],
  notification: ['Banner'],
  alert: ['Banner', 'AlertDialog'],
  chip: ['Badge', 'TagGroup'],
  tag: ['TagGroup', 'Badge'],
  loader: ['Spinner', 'ProgressBar', 'ProgressCircle'],
  loading: ['Spinner', 'ProgressBar', 'ProgressCircle'],
  input: ['TextField', 'TextArea', 'NumberField', 'SearchField', 'Input'],
  'text input': ['TextField', 'Input'],
  'text field': ['TextField', 'Input'],
  textarea: ['TextArea'],
  autocomplete: ['Autocomplete', 'Combobox'],
  typeahead: ['Autocomplete', 'Combobox'],
  nav: ['NavigationMenu', 'Breadcrumbs', 'Tabs'],
  navigation: ['NavigationMenu', 'Breadcrumbs', 'Tabs'],
  stepper: ['NumberField'],
  accordion: ['Accordion', 'Disclosure'],
  collapse: ['Accordion', 'Disclosure'],
  expandable: ['Accordion', 'Disclosure'],
  table: ['Table'],
  grid: ['GridList', 'Table'],
  avatar: ['Avatar'],
  image: ['Image', 'Avatar'],
  icon: ['Icon', 'IconButton', 'FeaturedIcon'],
  'icon button': ['IconButton', 'Button'],
  iconbutton: ['IconButton'],
  'featured icon': ['FeaturedIcon'],
  'notification icon': ['FeaturedIcon', 'Icon'],
  'themed icon': ['FeaturedIcon'],
  rating: ['RatingStars', 'RatingBadge'],
  'star rating': ['RatingStars'],
  stars: ['RatingStars'],
  'color mode': ['ColorModeToggle'],
  'dark mode': ['ColorModeToggle'],
  'theme toggle': ['ColorModeToggle'],
  'light dark': ['ColorModeToggle'],
  destructive: ['Button', 'IconButton'],
  delete: ['IconButton', 'Button'],
  trash: ['IconButton'],
  spinner: ['Spinner', 'ProgressCircle'],
  'primary button': ['Button'],
  'secondary button': ['Button'],
  progress: ['ProgressBar', 'ProgressCircle', 'Meter'],
  meter: ['Meter', 'ProgressBar'],
  slider: ['Slider'],
  range: ['Slider', 'RangeCalendar'],
  date: ['DatePicker', 'DateField', 'Calendar', 'DateRangePicker'],
  calendar: ['Calendar', 'DatePicker', 'RangeCalendar'],
  time: ['TimeField'],
  color: ['ColorPicker', 'ColorArea', 'ColorSlider', 'ColorField', 'ColorWheel', 'ColorSwatch', 'ColorSwatchPicker'],
  form: ['Form', 'TextField', 'Select', 'Checkbox', 'Radio'],
  card: ['Card'],
  empty: ['EmptyState'],
  'empty state': ['EmptyState'],
  'no data': ['EmptyState'],
  file: ['FileTrigger', 'DropZone'],
  upload: ['FileTrigger', 'DropZone'],
  'drag and drop': ['DropZone'],
  paginate: ['Pagination'],
  paging: ['Pagination'],
  breadcrumb: ['Breadcrumbs'],
  tree: ['Tree'],
  list: ['List', 'GridList'],
};

function searchComponents(components, query) {
  const q = query.toLowerCase();

  // Check synonyms and boost matching components
  const synonymBoosts = new Map();
  for (const [term, targets] of Object.entries(SYNONYMS)) {
    if (q.includes(term)) {
      for (const target of targets) {
        synonymBoosts.set(target, (synonymBoosts.get(target) || 0) + 60);
      }
    }
  }

  const scored = components.map(c => {
    const nameScore = fuzzyMatch(query, c.name);
    const descScore = fuzzyMatch(query, c.description);
    const catScore = fuzzyMatch(query, c.category);
    const partsScore = c.parts ? Math.max(...c.parts.map(p => fuzzyMatch(query, p)), 0) * 0.5 : 0;
    const synonymScore = synonymBoosts.get(c.name) || 0;
    const score = Math.max(nameScore, descScore * 0.9, catScore * 0.7, partsScore, synonymScore);
    return { ...c, score };
  });

  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

// ─── MCP Server ─────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'tale-ui',
  version: '1.0.0',
});

// Tool: list_components
server.tool(
  'list_components',
  'List all Tale UI components with name, import path, category, description, and status. Use this to discover what components are available. Deprecated components are prefixed with ⚠️.',
  {},
  async () => {
    const registry = loadRegistry();
    const summary = registry.components.map(c => ({
      name: c.name,
      import: c.import,
      category: c.category,
      description: c.status === 'deprecated'
        ? `⚠️ Deprecated — ${c.deprecationNote || c.description}`
        : c.description,
      kind: c.kind,
      status: c.status || 'stable',
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  },
);

// Tool: get_component
server.tool(
  'get_component',
  'Get full details for a specific Tale UI component including props (with allowedValues arrays for enum props), parts, examples, and CSS classes. ALWAYS call this before generating code with any component — props include exact allowed strings for variant/size/etc so you never guess values. If the prompt does not request bespoke styling, use the component\'s default visual props and basic example as the baseline instead of inventing a nicer-looking variant, theme, size, shape, or color.',
  { name: z.string().describe('Component name (PascalCase like "Button" or kebab-case like "date-picker")') },
  async ({ name }) => {
    const registry = loadRegistry();
    const query = name.toLowerCase().replace(/-/g, '');
    const component = registry.components.find(c =>
      c.name.toLowerCase() === query ||
      c.slug.replace(/-/g, '') === query ||
      c.slug === name.toLowerCase(),
    );

    if (!component) {
      return {
        content: [{ type: 'text', text: `Component "${name}" not found. Use list_components to see available components.` }],
        isError: true,
      };
    }

    // Resolve crossPitfallRefs into full pitfall objects
    const pitfallData = loadPitfalls();
    const crossPitfalls = (component.crossPitfallRefs || [])
      .map(id => pitfallData.crossComponentPitfalls.find(p => p.id === id))
      .filter(Boolean);
    const hasTriggerStyling = crossPitfalls.some(p => p.category === 'trigger-styling');

    const result = { ...component };
    if (crossPitfalls.length > 0) result.crossComponentPitfalls = crossPitfalls;
    if (hasTriggerStyling && pitfallData.triggerStylingTable) {
      result.triggerStylingTable = pitfallData.triggerStylingTable;
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  },
);

// Tool: search_components
server.tool(
  'search_components',
  'Search Tale UI components by intent or description. Returns the most relevant components for a given UI need (e.g. "date input", "navigation sidebar", "form validation").',
  { query: z.string().describe('Search query describing the UI need') },
  async ({ query }) => {
    const registry = loadRegistry();
    const results = searchComponents(registry.components, query);

    if (results.length === 0) {
      return {
        content: [{ type: 'text', text: `No components match "${query}". Try broader terms or use list_components.` }],
      };
    }

    const summary = results.map(c => ({
      name: c.name,
      import: c.import,
      category: c.category,
      description: c.description,
      kind: c.kind,
      relevance: Math.round(c.score),
    }));

    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  },
);

// Tool: list_recipes
server.tool(
  'list_recipes',
  'List all available Tale UI recipes (multi-component patterns like forms, tables, navigation).',
  {},
  async () => {
    const recipes = loadRecipeIndex();
    return {
      content: [{ type: 'text', text: JSON.stringify(recipes, null, 2) }],
    };
  },
);

// Tool: get_recipe
server.tool(
  'get_recipe',
  'Get the full markdown content of a Tale UI recipe by name. Recipes are copy-paste-ready multi-component patterns.',
  { name: z.string().describe('Recipe slug (e.g. "form-with-validation", "data-table-with-sorting")') },
  async ({ name }) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const filePath = join(RECIPES_DIR, `${slug}.md`);
    try {
      const content = readFileSync(filePath, 'utf8');
      return {
        content: [{ type: 'text', text: content }],
      };
    } catch {
      const recipes = loadRecipeIndex();
      const available = recipes.map(r => r.slug).join(', ');
      return {
        content: [{ type: 'text', text: `Recipe "${name}" not found. Available: ${available}` }],
        isError: true,
      };
    }
  },
);

// Tool: search_docs
server.tool(
  'search_docs',
  'Search across all Tale UI documentation (component guides, recipes, design philosophy, setup guides, CSS reference). Use this to find usage patterns, examples, or design rationale.',
  { query: z.string().describe('Search query (e.g. "dark mode setup", "form validation pattern", "drawer vs dialog")') },
  async ({ query }) => {
    const results = searchDocs(query);

    if (results.length === 0) {
      return {
        content: [{ type: 'text', text: `No docs match "${query}". Try broader terms.` }],
      };
    }

    const summary = results.map(d => ({
      path: d.path,
      title: d.title,
      relevance: Math.round(d.score),
      snippets: d.snippets,
    }));

    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  },
);

// ─── A2UI Tools ─────────────────────────────────────────────────────────────

// Tool: list_a2ui_types
server.tool(
  'list_a2ui_types',
  'List all A2UI catalog types available for agent UI generation. Each type maps to a Tale UI component. Use this to discover what components agents can render via A2UI messages.',
  {},
  async () => {
    const catalog = loadA2UICatalog();
    const summary = catalog.types.map(t => ({
      name: t.name,
      category: t.category,
      component: t.component,
      props: t.props,
      isSubPart: t.isSubPart,
      description: t.description,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  },
);

// Tool: get_a2ui_type
server.tool(
  'get_a2ui_type',
  'Get full details for a specific A2UI catalog type including props (with allowedValues arrays for enum props and hint strings for documentation), the Tale UI component it maps to, and related information (usageHints for Text, icon names for Icon). Check allowedValues before setting any prop — never guess string values for variant, size, placement, etc.',
  { name: z.string().describe('A2UI type name (e.g. "Button", "TextInput", "Card")') },
  async ({ name }) => {
    const catalog = loadA2UICatalog();
    const type = catalog.types.find(t => t.name.toLowerCase() === name.toLowerCase());

    if (!type) {
      const available = catalog.types.filter(t => !t.isSubPart).map(t => t.name).join(', ');
      return {
        content: [{ type: 'text', text: `A2UI type "${name}" not found. Available types: ${available}` }],
        isError: true,
      };
    }

    const result = { ...type };

    // Enrich with related data
    if (type.name === 'Text') {
      result.usageHints = catalog.usageHints;
    }
    if (type.name === 'Icon') {
      result.availableIcons = catalog.iconNames;
    }

    // Find sub-parts that belong to this type
    const prefix = type.name;
    const subParts = catalog.types.filter(t =>
      t.isSubPart && t.name.startsWith(prefix) && t.name !== prefix
    );
    if (subParts.length > 0) {
      result.subParts = subParts.map(s => ({ name: s.name, description: s.description, props: s.props }));
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  },
);

// Tool: get_a2ui_example
server.tool(
  'get_a2ui_example',
  'Get a complete A2UI message example by name. Examples show full beginRendering + surfaceUpdate + dataModelUpdate sequences that render working Tale UI interfaces.',
  { name: z.string().describe('Example name (e.g. "simple-form", "dashboard", "settings-page", "component-audit")') },
  async ({ name }) => {
    const catalog = loadA2UICatalog();
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const example = catalog.examples[slug];

    if (!example) {
      const available = Object.keys(catalog.examples).join(', ');
      return {
        content: [{ type: 'text', text: `Example "${name}" not found. Available: ${available}` }],
        isError: true,
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(example, null, 2) }],
    };
  },
);

// validate_code and get_component_stories require monorepo-only tooling
// (validate-generated.mjs, Storybook source).  They are registered only when
// running from the monorepo so the consumer npm package stays self-contained.
if (IS_MONOREPO) {

// Tool: validate_code
server.tool(
  'validate_code',
  'Validate generated Tale UI React code against the component registry and TypeScript compiler. Returns registry errors (wrong imports, wrong kind usage) and tsc errors (invalid props, type mismatches). Call this after generating any Tale UI code to catch mistakes before returning it to the user.',
  {
    code: z.string().describe('The complete TSX/TypeScript code snippet to validate. Should include import statements.'),
  },
  async ({ code }) => {
    const validatorPath = join(ROOT, 'tools/validate-generated.mjs');
    try {
      const result = execFileSync(
        process.execPath,
        [validatorPath, '--code', code, '--json'],
        { cwd: ROOT, timeout: 30000, encoding: 'utf8' },
      );
      const parsed = JSON.parse(result);
      const registryErrors = parsed.registryErrors || [];
      const tsErrors = (parsed.typescriptErrors || []).map(e => `Line ${e.line}: ${e.message}`);
      const errors = [...registryErrors, ...tsErrors];
      if (errors.length === 0) {
        return { content: [{ type: 'text', text: '✅ Code is valid — no registry or TypeScript errors.' }] };
      }
      return {
        content: [{ type: 'text', text: `Found ${errors.length} error(s):\n\n${errors.map(e => `• ${e}`).join('\n')}` }],
        isError: true,
      };
    } catch (err) {
      // execFileSync throws on non-zero exit; stdout still has the JSON
      const stdout = err.stdout || '';
      try {
        const parsed = JSON.parse(stdout);
        const registryErrors = parsed.registryErrors || [];
        const tsErrors = (parsed.typescriptErrors || []).map(e => `Line ${e.line}: ${e.message}`);
        const errors = [...registryErrors, ...tsErrors];
        return {
          content: [{ type: 'text', text: `Found ${errors.length} error(s):\n\n${errors.map(e => `• ${e}`).join('\n')}` }],
          isError: true,
        };
      } catch {
        return {
          content: [{ type: 'text', text: `Validation failed: ${err.message}` }],
          isError: true,
        };
      }
    }
  },
);

// Tool: get_component_stories
server.tool(
  'get_component_stories',
  'Get the Storybook story source code for a Tale UI component. Stories show real-world usage examples with argTypes (allowed values for each prop) and render functions for every variant. Use this alongside get_component when you need concrete usage patterns beyond the registry examples.',
  { name: z.string().describe('Component name (PascalCase like "Button", "Select", "Dialog")') },
  async ({ name }) => {
    const stories = loadStoryMap();

    // Try exact match first, then case-insensitive
    const entry = stories.get(name) || [...stories.entries()].find(
      ([k]) => k.toLowerCase() === name.toLowerCase()
    )?.[1];

    if (!entry) {
      const available = [...stories.keys()].sort().join(', ');
      return {
        content: [{ type: 'text', text: `No story file found for "${name}". Components with stories: ${available}` }],
      };
    }

    const summary = {
      file: entry.path,
      storyNames: entry.storyNames,
      source: entry.source,
    };
    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  },
);

} // end IS_MONOREPO

// Tool: plan_ui
server.tool(
  'plan_ui',
  'Given a plain-language description of UI to build, return a structured component plan: which Tale UI components to use, how they nest, which recipe (if any) applies, and key pitfalls to avoid. Call this BEFORE generating any JSX so you choose the right components first. Unless the prompt explicitly requests a stylistic variation, assume default visual props and canonical basic composition.',
  { prompt: z.string().describe('Plain-language description of the UI you want to build (e.g. "a settings form with text fields and a save button")') },
  async ({ prompt }) => {
    const registry = loadRegistry();
    const recipes = loadRecipeIndex();

    // Find matching components (reuse existing search logic)
    const componentResults = searchComponents(registry.components, prompt).slice(0, 6);

    // Find the nearest recipe by checking if any recipe slug/title words appear in the prompt
    const pLower = prompt.toLowerCase();
    const recipeMatch = recipes.find(r =>
      r.slug.split('-').some(w => w.length > 3 && pLower.includes(w)) ||
      r.title.toLowerCase().split(/\s+/).some(w => w.length > 3 && pLower.includes(w))
    );

    // Load structured pitfall data
    const pitfallData = loadPitfalls();

    // Build the plan
    const lines = ['## Component Plan\n'];

    lines.push('### Recommended components\n');
    if (componentResults.length === 0) {
      lines.push('No matching components found. Use `list_components` to browse all available components.\n');
    } else {
      for (const c of componentResults) {
        const statusNote = c.status === 'deprecated' ? ' ⚠️ **deprecated**' : '';
        lines.push(`- **${c.name}**${statusNote} — \`${c.import}\``);
        lines.push(`  ${c.description || ''}`);
        lines.push(`  Kind: ${c.kind} | Call \`get_component\` for props, parts, and examples`);
        lines.push('');
      }
    }

    if (recipeMatch) {
      lines.push('### Applicable recipe\n');
      lines.push(`**${recipeMatch.title}** — \`${recipeMatch.slug}\``);
      lines.push('Call `get_recipe` with this slug for a copy-paste starting point.\n');
    }

    lines.push('### Default visual style\n');
    lines.push('- Use each component\'s default visual props when the prompt does not ask for a specific appearance.');
    lines.push('- Do not invent non-default `variant`, `theme`, `size`, `shape`, `color`, or decorative modifiers just to make the UI look nicer.');
    lines.push('- Prefer the component\'s basic example/default composition as the canonical baseline.\n');

    // Gather full pitfall details from structured data for matched components
    const pitfallLines = [];
    const seenCrossRefs = new Set();
    for (const c of componentResults) {
      const fullEntry = registry.components.find(comp => comp.name === c.name);
      if (fullEntry?.pitfalls?.length > 0) {
        for (const p of fullEntry.pitfalls) {
          pitfallLines.push(`- **${c.name}: ${p.summary}**`);
          if (p.detail) {
            // Indent the detail lines so they read as sub-content of the bullet
            for (const line of p.detail.split('\n')) {
              pitfallLines.push(`  ${line}`);
            }
          }
          if (p.antiPatterns?.length > 0) {
            for (const ap of p.antiPatterns) {
              pitfallLines.push(`  - anti-pattern: \`${ap}\``);
            }
          }
          if (p.fixes?.length > 0) {
            for (const fx of p.fixes) {
              pitfallLines.push(`  - fix: \`${fx}\``);
            }
          }
          if (p.completeExample) {
            pitfallLines.push('  - complete example:');
            pitfallLines.push('');
            pitfallLines.push('    ```tsx');
            for (const line of p.completeExample.split('\n')) {
              pitfallLines.push(`    ${line}`);
            }
            pitfallLines.push('    ```');
          }
          pitfallLines.push('');
        }
      }
      if (fullEntry?.crossPitfallRefs?.length > 0) {
        for (const refId of fullEntry.crossPitfallRefs) {
          if (seenCrossRefs.has(refId)) continue;
          seenCrossRefs.add(refId);
          const cp = pitfallData.crossComponentPitfalls.find(p => p.id === refId);
          if (!cp) continue;
          pitfallLines.push(`- **Cross-component: ${cp.summary}**`);
          if (cp.detail) {
            for (const line of cp.detail.split('\n')) {
              pitfallLines.push(`  ${line}`);
            }
          }
          if (cp.antiPatterns?.length > 0) {
            for (const ap of cp.antiPatterns) {
              pitfallLines.push(`  - anti-pattern: \`${ap}\``);
            }
          }
          if (cp.fixes?.length > 0) {
            for (const fx of cp.fixes) {
              pitfallLines.push(`  - fix: \`${fx}\``);
            }
          }
          if (cp.completeExample) {
            pitfallLines.push('  - complete example:');
            pitfallLines.push('');
            pitfallLines.push('    ```tsx');
            for (const line of cp.completeExample.split('\n')) {
              pitfallLines.push(`    ${line}`);
            }
            pitfallLines.push('    ```');
          }
          pitfallLines.push('');
        }
      }
    }
    // Add general conventions (always relevant — includes cross-cutting rules like Row/Column gap)
    for (const gc of pitfallData.generalConventions) {
      pitfallLines.push(`- **Convention: ${gc.summary}**`);
      if (gc.detail) {
        for (const line of gc.detail.split('\n')) {
          pitfallLines.push(`  ${line}`);
        }
      }
      if (gc.antiPatterns?.length > 0) {
        for (const ap of gc.antiPatterns) {
          pitfallLines.push(`  - anti-pattern: \`${ap}\``);
        }
      }
      if (gc.fixes?.length > 0) {
        for (const fx of gc.fixes) {
          pitfallLines.push(`  - fix: \`${fx}\``);
        }
      }
      if (gc.completeExample) {
        pitfallLines.push('  - complete example:');
        pitfallLines.push('');
        pitfallLines.push('    ```tsx');
        for (const line of gc.completeExample.split('\n')) {
          pitfallLines.push(`    ${line}`);
        }
        pitfallLines.push('    ```');
      }
      pitfallLines.push('');
    }

    if (pitfallLines.length > 0) {
      lines.push('### Pitfalls to avoid\n');
      lines.push(...pitfallLines);
    }

    // Relevant docs (searchDocs as fallback for non-pitfall documentation)
    const docResults = searchDocs(prompt).slice(0, 3);
    if (docResults.length > 0) {
      lines.push('### Relevant documentation\n');
      for (const d of docResults) {
        lines.push(`- **${d.title}** (\`${d.path}\`)`);
        if (d.snippets.length > 0) lines.push(`  > ${d.snippets[0]}`);
      }
      lines.push('');
    }

    lines.push('### Next steps\n');
    lines.push('1. Call `get_component` on each component above for exact props, allowed values, and sub-parts — even if a complete example is shown, `get_component` is the authoritative API reference.');
    lines.push('2. If the prompt is underspecified visually, start from the component\'s basic example and keep default visual props; do not add non-default `variant`, `theme`, `size`, `shape`, `color`, or decorative modifiers unless requested.');
    lines.push('3. If a pitfall has a `complete example:` block that matches your prompt, use it as the starting point for the JSX, but verify the import path and props against `get_component` output first.');
    lines.push('4. If a recipe was found, call `get_recipe` for the complete pattern.');
    if (IS_MONOREPO) {
      lines.push('5. Generate JSX using only the components listed. Call `validate_code` afterwards.');
    } else {
      lines.push('5. Generate JSX using only the components listed.');
    }

    return {
      content: [{ type: 'text', text: lines.join('\n') }],
    };
  },
);

// ─── Start ──────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
