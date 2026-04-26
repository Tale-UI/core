#!/usr/bin/env node
/**
 * Tale UI MCP Server
 *
 * Thin MCP protocol wrapper around the pure business logic in mcp-core.mjs.
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

import {
  IS_MONOREPO,
  listComponentsCore,
  getComponentCore,
  searchComponentsCore,
  listRecipesCore,
  getRecipeCore,
  searchDocsCore,
  listA2UITypesCore,
  getA2UITypeCore,
  getA2UIExampleCore,
  validateCodeCore,
  getComponentStoriesCore,
  planUiCore,
} from './mcp-core.mjs';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function wrap({ text, isError }) {
  return { content: [{ type: 'text', text }], ...(isError ? { isError: true } : {}) };
}

// ─── MCP Server ──────────────────────────────────────────────────────────────

const server = new McpServer({ name: 'tale-ui', version: '1.0.0' });

server.tool(
  'list_components',
  'List all Tale UI components with name, import path, category, description, and status. Use this to discover what components are available. Deprecated components are prefixed with ⚠️.',
  {},
  async () => wrap(listComponentsCore()),
);

server.tool(
  'get_component',
  'Get full details for a specific Tale UI component including props (with allowedValues arrays for enum props), parts, examples, and CSS classes. ALWAYS call this before generating code with any component — props include exact allowed strings for variant/size/etc so you never guess values. If the prompt does not request bespoke styling, use the component\'s default visual props and basic example as the baseline instead of inventing a nicer-looking variant, theme, size, shape, or color.',
  { name: z.string().describe('Component name (PascalCase like "Button" or kebab-case like "date-picker")') },
  async ({ name }) => wrap(getComponentCore(name)),
);

server.tool(
  'search_components',
  'Search Tale UI components by intent or description. Returns the most relevant components for a given UI need (e.g. "date input", "navigation sidebar", "form validation").',
  { query: z.string().describe('Search query describing the UI need') },
  async ({ query }) => wrap(searchComponentsCore(query)),
);

server.tool(
  'list_recipes',
  'List all available Tale UI recipes (multi-component patterns like forms, tables, navigation).',
  {},
  async () => wrap(listRecipesCore()),
);

server.tool(
  'get_recipe',
  'Get the full markdown content of a Tale UI recipe by name. Recipes are copy-paste-ready multi-component patterns.',
  { name: z.string().describe('Recipe slug (e.g. "form-with-validation", "data-table-with-sorting")') },
  async ({ name }) => wrap(getRecipeCore(name)),
);

server.tool(
  'search_docs',
  'Search across all Tale UI documentation (component guides, recipes, design philosophy, setup guides, CSS reference). Use this to find usage patterns, examples, or design rationale.',
  { query: z.string().describe('Search query (e.g. "dark mode setup", "form validation pattern", "drawer vs dialog")') },
  async ({ query }) => wrap(searchDocsCore(query)),
);

// ─── A2UI Tools ──────────────────────────────────────────────────────────────

server.tool(
  'list_a2ui_types',
  'List all A2UI catalog types available for agent UI generation. Each type maps to a Tale UI component. Use this to discover what components agents can render via A2UI messages.',
  {},
  async () => wrap(listA2UITypesCore()),
);

server.tool(
  'get_a2ui_type',
  'Get full details for a specific A2UI catalog type including props (with allowedValues arrays for enum props and hint strings for documentation), the Tale UI component it maps to, and related information (usageHints for Text, icon names for Icon). Check allowedValues before setting any prop — never guess string values for variant, size, placement, etc.',
  { name: z.string().describe('A2UI type name (e.g. "Button", "TextInput", "Card")') },
  async ({ name }) => wrap(getA2UITypeCore(name)),
);

server.tool(
  'get_a2ui_example',
  'Get a complete A2UI message example by name. Examples show full beginRendering + surfaceUpdate + dataModelUpdate sequences that render working Tale UI interfaces.',
  { name: z.string().describe('Example name (e.g. "simple-form", "dashboard", "settings-page", "component-audit")') },
  async ({ name }) => wrap(getA2UIExampleCore(name)),
);

// ─── Monorepo-only tools ─────────────────────────────────────────────────────

if (IS_MONOREPO) {

server.tool(
  'validate_code',
  'Validate generated Tale UI React code against the component registry and TypeScript compiler. Returns registry errors (wrong imports, wrong kind usage) and tsc errors (invalid props, type mismatches). Call this after generating any Tale UI code to catch mistakes before returning it to the user.',
  { code: z.string().describe('The complete TSX/TypeScript code snippet to validate. Should include import statements.') },
  async ({ code }) => wrap(validateCodeCore(code)),
);

server.tool(
  'get_component_stories',
  'Get the Storybook story source code for a Tale UI component. Stories show real-world usage examples with argTypes (allowed values for each prop) and render functions for every variant. Use this alongside get_component when you need concrete usage patterns beyond the registry examples.',
  { name: z.string().describe('Component name (PascalCase like "Button", "Select", "Dialog")') },
  async ({ name }) => wrap(getComponentStoriesCore(name)),
);

} // end IS_MONOREPO

server.tool(
  'plan_ui',
  'Given a plain-language description of UI to build, return a structured component plan: which Tale UI components to use, how they nest, which recipe (if any) applies, and key pitfalls to avoid. Call this BEFORE generating any JSX so you choose the right components first. Unless the prompt explicitly requests a stylistic variation, assume default visual props and canonical basic composition.',
  { prompt: z.string().describe('Plain-language description of the UI you want to build (e.g. "a settings form with text fields and a save button")') },
  async ({ prompt }) => wrap(planUiCore(prompt)),
);

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
