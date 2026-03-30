# Monorepo Tools

Scripts in this directory support development, auditing, building, releasing, and AI-assisted code generation for Tale UI packages. All scripts are run from the **workspace root**.

## How It All Fits Together

The agentic infrastructure forms a pipeline from source code to validated AI output:

```
Source (.styled.tsx, index.ts, CSS, docs)
  │
  ├─► generate-registry.js ──► registry/components.json (90 components)
  │                                │
  │                                ├─► mcp-server.mjs ──► 6 MCP tools (Claude Code, Cursor)
  │                                ├─► generate-cursorrules.js ──► .cursorrules (Cursor/Windsurf)
  │                                └─► validate-generated.mjs ──► validates any .tsx against registry + tsc
  │
  ├─► consumer-claude-md-snippet.md ──► consuming projects copy into their CLAUDE.md
  │
  └─► audit-snippet-kinds.js ──► verifies snippet lists match registry
```

**When you add a new component**, regenerate the chain:

```bash
pnpm registry:generate       # update registry/components.json
pnpm cursorrules:generate    # update .cursorrules
pnpm audit:snippet-kinds     # verify consumer snippet is correct
```

**CI runs 17 automated checks** on every PR across 4 jobs:

| Job | Check | pnpm command | What it catches |
| --- | ----- | ------------ | --------------- |
| check-css | BEM classes | `pnpm audit:bem` | `cx()` classes without matching CSS |
| check-css | Brand tokens | `pnpm audit:brand` | `--brand-*` in component CSS (breaks dark mode) |
| check-css | Doc props | `pnpm audit:docs` | Props added to code but not documented |
| check-css | Component completeness | `pnpm audit:components` | Missing artifacts (19-point check) |
| check-css | Registry freshness | `pnpm registry:check` | Registry out of sync with source |
| check-css | Cursor rules freshness | `pnpm cursorrules:check` | .cursorrules out of sync with registry |
| check-css | Snippet consistency | `pnpm audit:snippet-kinds` | Consumer snippet namespace/simple lists wrong |
| check-css | Golden prompts | `pnpm golden:validate` | Reference implementations broken by API changes |
| check-css | CSS build | `pnpm --filter @tale-ui/core build` | dist/style.css out of date |
| check-code | TypeScript | `pnpm typescript` | Type errors across all packages |
| check-code | ESLint | `pnpm eslint:ci` | JS/TS lint violations |
| check-code | Unit tests | `pnpm test:jsdom` | Test failures in jsdom environment |
| check-a2ui | A2UI catalog docs | `pnpm a2ui:check-docs` | Catalog tables in docs drift from catalog.ts |
| check-a2ui | A2UI examples | `pnpm a2ui:validate-examples` | Few-shot examples reference stale types/icons |
| check-a2ui | A2UI docs audit | `pnpm a2ui:audit-docs` | Counts and type lists in docs go stale |
| check-formatting | Markdown lint | `pnpm markdownlint` | Broken markdown tables, missing blank lines |
| check-formatting | Prettier | `pnpm prettier` | Formatting drift |

## Audit Tools

| Script | pnpm command | CI | Purpose |
|--------|-------------|-----|---------|
| `audit-bem.js` | `pnpm audit:bem` | Yes | Verifies every `cx()` class in styled components has matching CSS |
| `audit-brand.js` | `pnpm audit:brand` | Yes | Verifies component CSS never uses `--brand-*` tokens |
| `audit-docs.js` | `pnpm audit:docs` | Yes | Verifies component markdown docs list all Tale UI-specific props |
| `audit-components.js` | `pnpm audit:components` | Yes | Comprehensive 19-check component completeness audit |

### audit-bem.js

Scans every `packages/react/src/*/*.styled.tsx` file for `cx()` calls, extracts the BEM class strings passed to them (e.g. `cx('tale-button tale-button--primary', className)`), then verifies each class has a matching CSS rule in `packages/styles/src/`. Catches typos and renamed classes that would silently produce unstyled components.

### audit-brand.js

Greps all `packages/styles/src/*.css` files for `--brand-*` token usage. `--brand-*` tokens define the palette but don't invert in dark mode — component CSS must use `--color-*` instead. This prevents dark mode breakage.

### audit-docs.js

For each component with a `.styled.tsx` file, extracts the Tale UI-specific props from the TypeScript interfaces (variant, size, disabled, etc.) and checks that `docs/components/{name}.md` has a `## Props` table row for each one. Catches props that were added to the code but never documented.

### audit-components.js

The most thorough audit. Dynamically discovers all component directories under `packages/react/src/` and checks each one against 19 completeness criteria. New components are automatically picked up — no configuration needed for standard components.

```bash
pnpm audit:components                        # audit all components
pnpm audit:components -- --component=button  # audit a single component
pnpm audit:components -- --json              # machine-readable output
pnpm audit:components -- --verbose           # include warnings
```

**How it works:** For each component directory, the script reads the styled file, index, CSS, markdown doc, package.json exports, and cross-references them against each other. It parses JSDoc `@example` blocks to verify import paths, extracts exported part names to verify the component index is accurate, and diffs CSS selectors against documented class lists.

**What it checks (19 points):**

1. Styled file exists (`{Component}.styled.tsx`)
2. `index.ts` exists with re-exports
3. CSS file exists in `packages/styles/src/`
4. CSS `@import` in `packages/styles/src/index.css`
5. Markdown doc exists in `docs/components/`
6. Doc has required sections (Props/Parts, Examples, CSS Classes)
7. JSDoc `@example` on main export
8. `@example` import path matches `package.json` exports
9. Listed in `docs/component-index.md`
10. Listed in `docs/consumer-claude-md-snippet.md`
11. Listed in `packages/react/README.md`
12. Export in `packages/react/package.json`
13. Export in `packages/styles/package.json`
14. Storybook story exists
15. `ComponentAudit.tsx` entry exists
16. `CLAUDE.md` audit table row exists
17. Parts consistency (index vs actual exports)
18. Doc example import paths valid
19. CSS class documentation matches actual CSS

**Skip lists:** Non-component directories (adapters, types) and special-case components (providers, re-exports, utilities) are handled via hardcoded skip lists at the top of the file. Standard components require no configuration.

See also [`component-audit-prompt.md`](component-audit-prompt.md) — an AI agent guide for deep quality auditing beyond what the automated script checks.

## Build Tools

| Script | pnpm command | Purpose |
|--------|-------------|---------|
| `build-css.js` | `pnpm build:css` | Concatenates `@tale-ui/core` CSS source into `dist/style.css` |
| `build-package.mjs` | _(internal)_ | Produces CJS + ESM bundles for `@tale-ui/react` and `@tale-ui/utils` |

### build-css.js

Reads `packages/css/src/index.css`, resolves one level of `@import` statements, and concatenates everything into a single `packages/css/dist/style.css`. No PostCSS, no minification — just simple file concatenation. Only resolves imports one level deep (imports within imported files are not followed), so all component CSS must be imported directly from `index.css`.

### build-package.mjs

Used internally by `packages/react/package.json` and `packages/utils/package.json` build scripts. Runs `tsc` to emit ESM and CJS outputs, copies CSS and type declarations, and handles `--ignore` and `--copy` flags for package-specific needs. Not intended to be run directly.

## Release Tools

| Script | pnpm command | Purpose |
|--------|-------------|---------|
| `release-css.js` | `pnpm release:css` | Version bump, git tag, and npm publish for `@tale-ui/core` |

### release-css.js

Bumps the version in `packages/css/package.json`, rebuilds `dist/style.css`, commits the changes, creates a git tag (`@tale-ui/core@{version}`), and publishes to npm. Aborts if the git working tree is dirty.

```bash
pnpm release:css:patch      # bump patch version
pnpm release:css:minor      # bump minor version
pnpm release:css:major      # bump major version
pnpm release:css:dry-run    # patch bump without publishing
```

## Registry & Generators

| Script | pnpm command | CI | Purpose |
|--------|-------------|-----|---------|
| `generate-registry.js` | `pnpm registry:generate` | `pnpm registry:check` | Generates `registry/components.json` from source |
| `generate-cursorrules.js` | `pnpm cursorrules:generate` | `pnpm cursorrules:check` | Generates `.cursorrules` from registry + consumer snippet |
| `audit-snippet-kinds.js` | `pnpm audit:snippet-kinds` | Yes | Validates consumer snippet namespace/simple lists match registry |

### generate-registry.js

Scans all 90 component directories and produces `registry/components.json` — a machine-readable catalog with each component's name, import path, category, description, kind (compound/simple), props, parts, examples, and CSS classes.

Data sources per component:

- **kind** — from `index.ts` export pattern (`export * as` = compound, `export { }` = simple)
- **props** — from `.styled.tsx` interface definitions (regex-parsed)
- **parts** — from exported `const` declarations in `.styled.tsx`
- **category/description** — from `docs/component-index.md` table
- **examples** — from `docs/components/{name}.md` tsx code blocks
- **cssClasses** — from `packages/styles/src/{name}.css` BEM selectors

The registry includes `schemaVersion` (format version) and `taleUiVersion` (which `@tale-ui/react` version it was generated from).

```bash
pnpm registry:generate   # write registry/components.json
pnpm registry:check      # compare generated vs committed; exit 1 if different
```

### generate-cursorrules.js

Generates `.cursorrules` (Cursor/Windsurf rules file) by combining:

- **Dynamic data** from `registry/components.json` — namespace vs simple component lists stay in sync automatically
- **Static data** from `docs/consumer-claude-md-snippet.md` — pitfalls, CSS token rules, dark mode guidance

```bash
pnpm cursorrules:generate   # write .cursorrules
pnpm cursorrules:check      # compare generated vs committed; exit 1 if different
```

### audit-snippet-kinds.js

Parses the namespace/simple component lists in `docs/consumer-claude-md-snippet.md` and cross-checks every entry against the registry's `kind` field. Catches:

- Components listed as namespace that are actually simple (or vice versa)
- Components in the registry but missing from both lists
- Components in the lists but not in the registry

## MCP Server

| Script | Purpose |
|--------|---------|
| `mcp-server.mjs` | Model Context Protocol server exposing Tale UI data as tools |

### mcp-server.mjs

A stdio-based MCP server that exposes the component registry, recipe docs, and full documentation as tools for AI agents. Configured in `.mcp.json` at the project root.

**Tools:**

| Tool | Description |
|------|-------------|
| `list_components` | List all 90 components with name, import, category, description, kind |
| `get_component` | Get full details for one component (props, parts, examples, CSS classes) |
| `search_components` | Fuzzy search by intent (e.g. "date input", "navigation sidebar") |
| `list_recipes` | List all 12 recipes (form validation, data table, sidebar, etc.) |
| `get_recipe` | Get a recipe's full markdown content by slug |
| `search_docs` | Keyword search across all 121 documentation files |

**How agents use it:** Claude Code auto-discovers the server via `.mcp.json` and prompts for one-time approval. After that, agents can call these tools during code generation to look up correct imports, props, and patterns instead of guessing.

**Configuration (`.mcp.json`):**

```json
{
  "mcpServers": {
    "tale-ui": {
      "command": "node",
      "args": ["tools/mcp-server.mjs"]
    }
  }
}
```

## Validation & Evaluation

| Script | pnpm command | CI | Purpose |
|--------|-------------|-----|---------|
| `validate-generated.mjs` | `pnpm validate:generated` | No | Validates any `.tsx` against registry + TypeScript |
| `validate-golden-prompts.mjs` | `pnpm golden:validate` | Yes | Validates all golden prompt reference implementations |

### validate-generated.mjs

Standalone code validator that checks generated `.tsx` files against the component registry and TypeScript compiler. No API key needed — works on any code, whether LLM-generated or hand-written.

**Validation pipeline:**

1. **Registry checks** (fast, no subprocess) — invalid import paths, compound components used without `.Root`, simple components used with `.Root`
2. **TypeScript check** (`tsc --noEmit`) — type errors, missing props, wrong types

```bash
node tools/validate-generated.mjs path/to/file.tsx          # validate a file
node tools/validate-generated.mjs --code '<Button>Hi</Button>'  # validate inline code
node tools/validate-generated.mjs --golden prompt.json       # validate a golden prompt reference
node tools/validate-generated.mjs --json path/to/file.tsx    # JSON output
```

Uses `tsconfig.generated.json` (isolated tsconfig) and writes temp files to `.generated-scratch/` (gitignored).

### validate-golden-prompts.mjs

Runs `validate-generated.mjs` against every golden prompt reference implementation in `golden-prompts/`. Ensures references stay valid as components evolve. Runs in CI.

### golden-prompts/

20 reference prompts with validated implementations:

- **8 simple** — Button, Badge, Text, Image, Spinner, Separator, Link, IconButton
- **8 medium** — Card, Input, Tabs, Checkbox group, AlertDialog, SearchField, ProgressBar, List
- **4 complex** — Settings page, data display cards, FAQ accordion, user profile card

Each file (`{slug}.json`) contains:

```json
{
  "slug": "primary-button",
  "difficulty": "simple",
  "prompt": "Create a primary action button that says 'Save changes'",
  "reference": "import { Button } from '@tale-ui/react/button';\n...",
  "tags": ["button"]
}
```

## A2UI Integration

The `@tale-ui/a2ui` package (`packages/a2ui/`) provides an A2UI protocol renderer that maps agent messages to Tale UI components. It includes:

| Artifact | Path | Purpose |
|----------|------|---------|
| Protocol types | `packages/a2ui/src/types.ts` | TypeScript types for A2UI messages, components, catalog |
| Catalog | `packages/a2ui/src/catalog.ts` | Maps 21 standard A2UI types to Tale UI components |
| Icon registry | `packages/a2ui/src/icon-registry.ts` | 66 lucide-react icons resolvable by name string |
| Renderer | `packages/a2ui/src/renderer/` | React provider, surface renderer, tree reconstruction |
| Validator | `packages/a2ui/src/validation/validate.ts` | Message + catalog validation with structured errors |
| Agent prompt | `packages/a2ui/src/agent/system-prompt.md` | LLM system prompt documenting the Tale UI A2UI catalog |
| Few-shot examples | `packages/a2ui/src/agent/examples/` | 5 example A2UI message sequences |

**Anti-drift tooling:**

| Script | pnpm command | CI | Purpose |
|--------|-------------|-----|---------|
| `generate-a2ui-catalog-docs.js` | `pnpm a2ui:generate-docs` | `pnpm a2ui:check-docs` | Regenerates catalog tables in system-prompt.md and a2ui-integration.md from catalog.ts source |
| `validate-a2ui-examples.js` | `pnpm a2ui:validate-examples` | Yes | Validates few-shot example JSON against live catalog (types, icons, usageHints, child refs) |
| `audit-a2ui-catalog-docs.js` | `pnpm a2ui:audit-docs` | Yes | Cross-checks counts, type lists, and icon counts in all A2UI docs against source |

**When you change `catalog.ts` or `icon-registry.ts`**, run:

```bash
pnpm a2ui:generate-docs       # regenerate sentinel-delimited sections in docs
pnpm a2ui:validate-examples   # verify examples still valid
pnpm a2ui:audit-docs          # cross-check all docs
```

**Testing:**

```bash
pnpm vitest run --project @tale-ui/a2ui   # run 35 unit tests
pnpm playground:dev                        # open http://localhost:5173/a2ui for interactive demo
```

**Consumer guide:** See [docs/a2ui-integration.md](../docs/a2ui-integration.md).

## AI Rules & Prompts

| File | Purpose |
|------|---------|
| `prompts/self-critique.md` | Second-pass validation checklist for AI-generated code |
| `eslint-restrict-imports.mjs` | Shareable ESLint config blocking non-Tale UI imports |
| `component-audit-prompt.md` | AI agent guide for deep component quality auditing |

### prompts/self-critique.md

A 5-step validation checklist designed to be used as a second-pass prompt after code generation:

1. Verify all import paths exist in registry
2. Check compound vs simple usage (`.Root` or not)
3. Check common pitfalls (Drawer vs Dialog, Icon refs, Checkbox.Indicator, etc.)
4. Validate CSS tokens (no `--brand-*`, valid shade numbers, `--space-*` for spacing)
5. Fix and explain each issue found

### eslint-restrict-imports.mjs

A shareable ESLint flat config that warns when importing from competing component libraries (Chakra, MUI, Radix, Headless UI, Mantine, Ant Design, NextUI, shadcn). Consuming projects spread it into their ESLint config:

```js
import taleUiRestrictions from './path/to/eslint-restrict-imports.mjs';

export default [
  ...yourConfig,
  taleUiRestrictions,
];
```
