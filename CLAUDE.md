# Design System — Monorepo

Monorepo managed with **pnpm workspaces**.

## Packages

| Path | Package | Description |
|------|---------|-------------|
| [packages/css](packages/css/CLAUDE.md) | `@cloudiverse/design-system` | Modular token-based CSS design system |

## Directory Conventions

| Directory | Purpose | Published to npm? |
|-----------|---------|-------------------|
| `packages/` | Shared, reusable libraries (CSS, component libs, utilities) | Yes |
| `apps/` | End-user applications (web apps, demo sites, docs) | No |
| `tools/` | Build scripts, generators, CLI tools for the monorepo | No |

## Creating a New Package from Scratch

1. Create the directory: `packages/<name>/`, `apps/<name>/`, or `tools/<name>/`
2. Add a `package.json` with `"name": "@cloudiverse/<name>"`
3. Add a `CLAUDE.md` documenting conventions for that package
4. Run `pnpm install` from the root to link workspaces

## Importing an External Project

To bring an existing external project into the monorepo:

1. **Copy the project** into the appropriate subdirectory:
   ```bash
   cp -r /path/to/external-project apps/<name>
   # or for a package:
   cp -r /path/to/external-project packages/<name>
   ```

2. **Update its `package.json`** name to follow the workspace convention:
   ```json
   { "name": "@cloudiverse/<name>" }
   ```

3. **Add a `CLAUDE.md`** to the package documenting its conventions (if it doesn't have one)

4. **Run `pnpm install`** from the monorepo root to link the new workspace:
   ```bash
   pnpm install
   ```

5. **Verify** the package is recognized:
   ```bash
   pnpm --filter @cloudiverse/<name> <cmd>
   ```

> **Git submodules:** If the external project must keep its own independent git history, use a submodule instead:
> `git submodule add <repo-url> packages/<name>`

## Cross-Package Dependencies

To use one workspace package from another (e.g., an app consuming the CSS package):

```json
// apps/my-app/package.json
{
  "dependencies": {
    "@cloudiverse/design-system": "workspace:*"
  }
}
```

Then run `pnpm install` from root. pnpm will symlink the local package instead of fetching from npm.

From the CLI:
```bash
pnpm --filter @cloudiverse/my-app add @cloudiverse/design-system --workspace
```

## Using the Design System in External Projects

### Method 1: npm install (recommended)

```bash
npm install @cloudiverse/design-system
```

**Import (bundler — Next.js, Vite, webpack):**
```css
@import '@cloudiverse/design-system';   /* → dist/style.css */
```

**Import (plain HTML):**
```html
<link rel="stylesheet" href="node_modules/@cloudiverse/design-system/dist/style.css">
```

### Method 2: Local live-sync with `pnpm link --global` (development only)

Use this when you want changes to the design system source to reflect immediately in a consumer project without republishing.

**Prerequisites:** Run `pnpm setup` once and open a new terminal so `PNPM_HOME` is in PATH.

**One-time setup — run from inside `packages/css/`:**
```bash
cd packages/css
pnpm link --global
```

**In each consumer project:**
```bash
pnpm link --global @cloudiverse/design-system
```

To remove: `pnpm unlink --global @cloudiverse/design-system`

### Method 3: Direct path reference (for HTML-only projects, no npm)

```html
<link rel="stylesheet" href="../design-system/packages/css/src/index.css">
```

Adjust the relative path to match the actual directory relationship.

### Consumer project CLAUDE.md snippet

Add this to the consumer project's `CLAUDE.md`. Documentation links use GitHub raw URLs so Claude Code can fetch them with WebFetch from any machine.

````markdown
## Design System

This project uses `@cloudiverse/design-system` (v1.1.0).

**Install:**
```bash
npm install @cloudiverse/design-system
```

**Import (bundler — Next.js, Vite, webpack):**
```css
@import '@cloudiverse/design-system';       /* → dist/style.css */
```
**Import (plain HTML):**
```html
<link rel="stylesheet" href="node_modules/@cloudiverse/design-system/dist/style.css">
```

**Framework note:** The design system sets `html { font-size: 62.5% }` (1rem = 10px).
If using Tailwind or shadcn/ui, add `html { font-size: 100%; }` after the import.
Full guide: https://raw.githubusercontent.com/CloudiverseHQ/design-system/main/packages/css/docs/framework-integration.md

**Quick reference — do not guess these values:**
- **`--brand-*` is for palette definitions ONLY** (`:root` overrides and `.color-{name}` classes) — **NEVER use `--brand-*` in component or UI CSS**. Always use `--color-*` for component styling; it inverts automatically in dark mode. `--brand-*` never inverts.
- Neutral shades: `5 10 12 14 16 18 20 22 24 26 28 30 40 50 60 70 80 82 84 86 88 90 92 94 96 98 100`
- Color/brand shades: `5 10 20 30 40 50 60 70 80 90 100`
- Utility classes use **double-dash**: `.gap--m` `.grid--3` `.display--none` `.radius--m`
- Theme classes use **single-dash**: `.color-red` `.neutral-cool` (NOT `.color--red`)
- NO responsive variants for: `opacity--` `aspect--` `line-clamp--` `radius--` `shadow--` `border` `padding--` `width--` `height--`
- Only `.gap--*` and `.center--*` use double-selector (`.class.class`) in CSS source — write once in HTML

**Custom palettes — extension points, do not guess:**
- **Global primary colour** — override `--brand-5` through `--brand-100` at `:root` in your app CSS (imported after the design system). Dark-mode inversion works automatically. Do NOT override `--color-*` directly.
  ```css
  :root { --brand-5: #fbf5f9; --brand-60: #7e4271; --brand-100: #36162f; }
  ```
- **Scoped named colour** — create a `.color-{name}` class that maps `--brand-5` through `--brand-100` (11 shades: 5 10 20 30 40 50 60 70 80 90 100) to raw values. Apply the class to any container.
- **Custom neutral family** — create a `.neutral-{name}` class that maps `--neutral-default-5` through `--neutral-default-100` (25 shades: 5 10 12 14 16 18 20 22 24 26 28 30 40 50 60 70 80 82 84 86 88 90 92 94 96 98 100) to raw values, then add `--display-color`, `--text-color`, and `--mono-color` each set to `var(--neutral-default-90)`. Apply the class to any container.
- Raw values go directly inside the class — do not create intermediate `--myColor-*` variables.

**Full reference:** https://raw.githubusercontent.com/CloudiverseHQ/design-system/main/packages/css/docs/ai-reference.md
**Contributor guide:** https://raw.githubusercontent.com/CloudiverseHQ/design-system/main/packages/css/CLAUDE.md
````

## Workspace Commands

```bash
pnpm install                                   # Install all workspace deps
pnpm --filter @cloudiverse/design-system <cmd>         # Run command in a specific package
pnpm -r <cmd>                                          # Run command in all packages
pnpm --filter @cloudiverse/my-app add pkg              # Add a dep to a specific package
```

## Workspace Structure

```
design-system/
├── package.json           # Workspace root (private)
├── pnpm-workspace.yaml    # Declares packages/*, apps/*, tools/*
├── packages/              # Publishable packages
│   └── css/               # @cloudiverse/design-system — see packages/css/CLAUDE.md
├── apps/                  # Applications (internal, not published)
└── tools/                 # Build tools, scripts, generators
```
