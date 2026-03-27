# Monorepo Tools

Scripts in this directory support development, auditing, building, and releasing Tale UI packages. All scripts are run from the **workspace root**.

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
