# Tale UI — Monorepo

Unified monorepo managed with **pnpm workspaces**. This repository is the single source of truth for the Tale UI Design System, React component library, and supporting tooling.

## Packages

| Path | Package | Description |
|------|---------|-------------|
| [packages/css](packages/css/CLAUDE.md) | `@tale-ui/core` | Modular token-based CSS design system |
| [packages/react](packages/react/) | `@tale-ui/react` | Styled React components — BEM class names applied automatically (forked from Base UI) |
| [packages/styles](packages/styles/) | `@tale-ui/react-styles` | CSS per component (uses @tale-ui/core tokens) |
| [packages/utils](packages/utils/) | `@tale-ui/utils` | Shared utilities |

## Documentation

| File | What it covers |
|------|----------------|
| [docs/workspace-structure.md](docs/workspace-structure.md) | Directory layout, conventions, and workspace CLI commands |
| [docs/managing-packages.md](docs/managing-packages.md) | Creating new packages and importing external projects |
| [docs/package-dependencies.md](docs/package-dependencies.md) | Cross-package `workspace:*` dependencies |
| [docs/consuming-design-system.md](docs/consuming-design-system.md) | Installing @tale-ui/core in external projects |
| [docs/react-setup.md](docs/react-setup.md) | Setting up a React app with Tale UI |

## CSS Design System (@tale-ui/core)

See [packages/css/CLAUDE.md](packages/css/CLAUDE.md) for the full CSS contributor guide.

## React Components (@tale-ui/react)

**Setup guide:** See [docs/react-setup.md](docs/react-setup.md) for the full consumer guide.

**Styling Architecture:** Components in `packages/react/src/{name}/{Component}.styled.tsx` apply BEM class names automatically. The CSS rules themselves live in `packages/styles/src/` — consumers still import `@tale-ui/react-styles` for the stylesheet. Override via additional `className` props.

**Component CSS pattern:**
```css
.tale-button { ... }
.tale-button--primary { ... }   /* variant */
.tale-button--sm { ... }        /* size modifier */
.tale-button[data-disabled] { opacity: 0.45; pointer-events: none; }
```

**State data attributes:** `data-disabled`, `data-open`, `data-checked`, `data-selected`, `data-highlighted`, `data-focus-visible`, `data-side="top|bottom|left|right"`

### Design Tokens

All component styles use tokens from `@tale-ui/core`:
- **Colors:** `--neutral-*` and `--color-*` (NEVER `--brand-*` in component CSS)
- **Foreground:** `--color-*-fg` and `--neutral-*-fg` for auto-contrasting text on any shade background
- **Spacing:** `--space-4xs` through `--space-4xl`
- **Typography:** `--label-s-font-size`, `--text-s-font-size`, etc.
- **Dark mode:** Automatic via `data-color-mode="dark"` on `<html>`

Full token reference: [packages/css/docs/ai-reference.md](packages/css/docs/ai-reference.md)

### Development Workflow

```bash
pnpm install                    # install all workspace deps
pnpm playground:dev             # run vite playground
pnpm build                      # build all packages (uses lerna)
pnpm test:jsdom                 # run unit tests in jsdom
pnpm test:chromium              # run tests in chromium
pnpm typescript                 # type check
pnpm eslint                     # lint JS/TS
pnpm lint:css                   # lint CSS design system
```

### Syncing upstream Base UI changes

```bash
git fetch upstream-mui
git log upstream-mui/main --oneline | head -20
git cherry-pick <commit>
```

### Component source conventions

```
packages/react/src/{component}/
  {Component}.tsx                  — headless implementation (Base UI fork)
  {Component}.styled.tsx           — styled wrapper (applies BEM class names)
  {Component}DataAttributes.tsx   — data-* attribute enum
  {Component}.test.tsx            — unit tests
  {Component}.spec.tsx            — browser tests (optional)
  index.ts                        — public API re-export (re-exports from .styled.tsx)
```

`index.ts` exports the styled version. Import paths like `@tale-ui/react/button` resolve to the styled component.

### Shared primitives (`_primitives.css`)

`packages/styles/src/_primitives.css` holds grouped selectors for declarations that are byte-for-byte identical across multiple components. When adding a new field-like input, dropdown popup, or list item — check `_primitives.css` first and add the new selector to the relevant group.
