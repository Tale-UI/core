#!/usr/bin/env node
/**
 * Tale UI MCP Server
 *
 * Exposes the component registry and recipe docs as MCP tools
 * for AI agents (Claude Code, Cursor, Windsurf, etc.).
 *
 * Tools:
 *   list_components  — list all components with name, import, category, description
 *   get_component    — get full details for a component (props, parts, examples, CSS classes)
 *   search_components — fuzzy search components by intent/query
 *   get_recipe       — get a recipe's markdown content by name
 *   list_recipes     — list all available recipes
 *   search_docs      — keyword search across all documentation files
 *
 * Run:  node tools/mcp-server.mjs
 * Config (Claude Code .claude/settings.json):
 *   { "mcpServers": { "tale-ui": { "command": "node", "args": ["tools/mcp-server.mjs"] } } }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const REGISTRY_PATH = join(ROOT, 'registry/components.json');
const RECIPES_DIR = join(ROOT, 'docs/recipes');
const DOCS_DIR = join(ROOT, 'docs');

// ─── Load data ──────────────────────────────────────────────────────────────

function loadRegistry() {
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
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

function searchComponents(components, query) {
  const scored = components.map(c => {
    const nameScore = fuzzyMatch(query, c.name);
    const descScore = fuzzyMatch(query, c.description);
    const catScore = fuzzyMatch(query, c.category);
    const partsScore = c.parts ? Math.max(...c.parts.map(p => fuzzyMatch(query, p)), 0) * 0.5 : 0;
    const score = Math.max(nameScore, descScore * 0.9, catScore * 0.7, partsScore);
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
  'List all Tale UI components with name, import path, category, and description. Use this to discover what components are available.',
  {},
  async () => {
    const registry = loadRegistry();
    const summary = registry.components.map(c => ({
      name: c.name,
      import: c.import,
      category: c.category,
      description: c.description,
      kind: c.kind,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  },
);

// Tool: get_component
server.tool(
  'get_component',
  'Get full details for a specific Tale UI component including props, parts, examples, and CSS classes. Use this before generating code with a component you haven\'t used yet.',
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

    return {
      content: [{ type: 'text', text: JSON.stringify(component, null, 2) }],
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

// ─── Start ──────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
