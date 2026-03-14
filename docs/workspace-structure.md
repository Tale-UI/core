# Workspace Structure

This monorepo is managed with **pnpm workspaces**.

## Directory Conventions

| Directory | Purpose | Published to npm? |
|-----------|---------|-------------------|
| `packages/` | Shared, reusable libraries (CSS, component libs, utilities) | Yes |
| `docs/` | Next.js static documentation site | No |
| `playground/` | Development sandboxes (Storybook, Vite app, scale tool) | No |
| `examples/` | Standalone example projects | No |
| `apps/` | End-user applications | No |
| `scripts/` | Build and release scripts | No |
| `tools/` | Build tools, generators, CLI tools for the monorepo | No |

## Directory Layout

```
core/
├── package.json           # Workspace root (private)
├── pnpm-workspace.yaml    # Declares packages/*, apps/*, tools/*, etc.
├── packages/
│   ├── css/               # @tale-ui/core — CSS design tokens & utilities
│   ├── react/             # @tale-ui/react — styled React components
│   ├── styles/            # @tale-ui/react-styles — per-component CSS
│   └── utils/             # @tale-ui/utils — shared hooks & helpers
├── docs/                  # Next.js documentation site
├── playground/
│   ├── storybook/         # Component Storybook (stories, visual reference)
│   ├── vite-app/          # Minimal Vite + React sandbox
│   └── scale/             # Tonal palette generator tool
├── examples/              # Standalone consumer examples
├── scripts/               # build-css.js, release-css.js
└── tools/                 # Monorepo tooling
```

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@tale-ui/core` | `packages/css/` | CSS design tokens, foundations, layout utilities, themes |
| `@tale-ui/react` | `packages/react/` | Styled React components (BEM class names auto-applied) |
| `@tale-ui/react-styles` | `packages/styles/` | Per-component CSS rules built on `@tale-ui/core` tokens |
| `@tale-ui/utils` | `packages/utils/` | Shared hooks, colour utilities, DOM helpers |

## Workspace CLI Commands

```bash
pnpm install                                         # Install all workspace deps
pnpm --filter @tale-ui/core <cmd>                   # Run command in a specific package
pnpm --filter @tale-ui/react <cmd>                  # Run command in another package
pnpm -r <cmd>                                        # Run command in all packages
pnpm --filter @tale-ui/my-app add pkg               # Add a dep to a specific package
```
