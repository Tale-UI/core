# Tale UI — Monorepo

Unified monorepo managed with **pnpm workspaces**. This repository is the single source of truth for the Tale UI Design System, React component library, and supporting tooling.

## Packages

| Path | Package | Description |
|------|---------|-------------|
| [packages/css](packages/css/CLAUDE.md) | `@tale-ui/core` | Modular token-based CSS design system |
| [packages/react](packages/react/) | `@tale-ui/react` | Styled React components — BEM class names applied automatically (built on React Aria Components) |
| [packages/styles](packages/styles/) | `@tale-ui/react-styles` | CSS per component (uses @tale-ui/core tokens) |
| [packages/utils](packages/utils/) | `@tale-ui/utils` | Shared utilities |
| [packages/charts](packages/charts/CLAUDE.md) | `@tale-ui/charts` | Recharts-based chart components themed with design tokens |
| [packages/a2ui](packages/a2ui/) | `@tale-ui/a2ui` | A2UI protocol renderer — maps agent messages to Tale UI components |

## Documentation

| File | What it covers |
|------|----------------|
| [docs/workspace-structure.md](docs/workspace-structure.md) | Directory layout, conventions, and workspace CLI commands |
| [docs/managing-packages.md](docs/managing-packages.md) | Creating new packages and importing external projects |
| [docs/package-dependencies.md](docs/package-dependencies.md) | Cross-package `workspace:*` dependencies |
| [docs/consuming-design-system.md](docs/consuming-design-system.md) | Installing @tale-ui/core in external projects |
| [docs/react-setup.md](docs/react-setup.md) | Setting up a React app with Tale UI |
| [docs/design-philosophy.md](docs/design-philosophy.md) | Why React Aria, why BEM, why CSS-first, colour token system, dark mode |
| [docs/authoring-components.md](docs/authoring-components.md) | Contributor guide: adding new `@tale-ui/react` components |
| [docs/react-aria-deviations.md](docs/react-aria-deviations.md) | Every difference between Tale UI and vanilla React Aria Components |
| [docs/component-index.md](docs/component-index.md) | All 90 components at a glance: description, import path, sub-parts |
| [registry/components.json](registry/components.json) | Machine-readable component registry: props, parts, examples, CSS classes |
| [docs/components/](docs/components/index.md) | Per-component usage guide: imports, parts, examples, CSS classes |
| [docs/recipes/](docs/recipes/index.md) | Copy-paste multi-component patterns (forms, tables, navigation, search, settings) |
| [docs/a2ui-integration.md](docs/a2ui-integration.md) | A2UI protocol integration: setup, catalog, renderer, validation |
| [tools/README.md](tools/README.md) | Monorepo tooling: audit scripts, build scripts, release process |
| [tools/prompts/self-critique.md](tools/prompts/self-critique.md) | Second-pass validation prompt for AI-generated Tale UI code |

## MCP Server

An MCP server at `tools/mcp-server.mjs` exposes Tale UI's component registry and recipes as tools. Configured in `.mcp.json`.

**Tools:** `list_components`, `get_component`, `search_components`, `list_recipes`, `get_recipe`, `search_docs`

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

**State data attributes:** `data-disabled`, `data-open`, `data-selected`, `data-pressed`, `data-focus-visible`, `data-focused`, `data-hovered`, `data-entering`, `data-exiting`, `data-placement="top|bottom|left|right"`

### Design Tokens

All component styles use tokens from `@tale-ui/core`:

- **Colors:** `--neutral-*` and `--color-*` (NEVER `--brand-*` in component CSS)
- **Foreground:** `--color-*-fg` and `--neutral-*-fg` for auto-contrasting text on any shade background
- **Spacing:** `--space-4xs` through `--space-4xl`
- **Typography:** `--label-s-font-size`, `--text-s-font-size`, etc.
- **Dark mode:** Automatic via `data-color-mode="dark"` on `<html>`

**Available `--neutral-*` shades (27 values — irregular scale):**

```
5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100
```

`--neutral-15` DOES NOT EXIST. `--neutral-25` DOES NOT EXIST. `--neutral-35` DOES NOT EXIST.

**Available `--color-*` shades (11 values — regular scale):**

```
5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
```

`--color-9` DOES NOT EXIST. `--color-55` DOES NOT EXIST. Same scale applies to `--brand-*`, `--red-*`, `--error-*`, etc.

**Foreground tokens:** Append `-fg` to any shade for auto-contrasting text: `--color-60-fg`, `--neutral-20-fg`

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
pnpm audit:bem              # verify BEM classes have matching CSS
pnpm audit:brand            # verify no --brand-* in component CSS
pnpm audit:docs             # verify docs list all component props
pnpm audit:components       # 19-check component completeness audit
pnpm audit:coverage         # check ComponentAudit, Storybook, and A2UI full-showcase coverage
pnpm registry:generate      # regenerate registry/components.json from source
pnpm registry:check         # verify registry is up-to-date (CI mode)
pnpm validate:generated     # validate generated .tsx against registry + tsc
pnpm golden:validate        # validate all golden prompt references
pnpm golden:eval            # run prompts against Claude (via Claude Code CLI) and score L1–L3
pnpm golden:fix-review      # eval → auto-fix consumer snippet → open visual review in playground
pnpm a2ui:generate-docs     # regenerate A2UI catalog tables in system-prompt.md + integration guide
pnpm a2ui:generate-catalog  # regenerate registry/a2ui-catalog.json for MCP server
pnpm a2ui:check-docs        # verify A2UI docs match source (CI mode)
pnpm a2ui:check-catalog     # verify A2UI catalog JSON matches source (CI mode)
pnpm a2ui:validate-examples # validate A2UI few-shot examples against catalog
pnpm a2ui:audit-docs        # cross-check A2UI type counts, names, hints across all docs
pnpm a2ui:golden:validate   # validate all A2UI golden prompt references
pnpm a2ui:golden:eval       # run A2UI prompts against a model and score L1–L3
pnpm a2ui:golden:fix-review # eval → auto-fix A2UI system prompt based on failures
```

**When changing `packages/a2ui/src/catalog.ts` or `tools/a2ui-catalog-metadata.js`**, regenerate:

```bash
pnpm a2ui:generate-docs       # updates system-prompt.md + a2ui-integration.md
pnpm a2ui:generate-catalog    # updates registry/a2ui-catalog.json
pnpm a2ui:validate-examples   # verifies examples still valid
pnpm a2ui:audit-docs          # cross-checks all docs
```

### Component source conventions

```
packages/react/src/{component}/
  {Component}.styled.tsx           — styled wrapper (applies BEM class names, wraps React Aria Components)
  {Component}.test.tsx            — unit tests
  {Component}.spec.tsx            — browser tests (optional)
  index.ts                        — public API re-export (re-exports from .styled.tsx)
```

`index.ts` exports the styled version. Import paths like `@tale-ui/react/button` resolve to the styled component.

### Component documentation

Every component has a usage guide at `docs/components/{name}.md` with imports, sub-parts, props, and examples. When adding a new component, you must also:

- Create `docs/components/{name}.md`
- Add the component name to `docs/consumer-claude-md-snippet.md` (the available components list)
- Add the component to the catalogue and per-component docs sections in `packages/react/README.md`
- **Create at least one golden prompt** in `tools/golden-prompts/{slug}.json` and add it to `tools/golden-prompts/index.json` (see below)

See [docs/authoring-components.md](docs/authoring-components.md) for the full checklist.

### Golden Prompts

Golden prompts are the evaluation benchmark for AI-generated Tale UI code. Each file in `tools/golden-prompts/` contains a natural-language `prompt`, a correct `reference` implementation, and `tags` (component names that must appear in generated output).

**When adding a new component**, create at least one golden prompt:

```json
{
  "slug": "my-component-use-case",
  "difficulty": "simple|medium|complex",
  "prompt": "Show a <description of the UI>.",
  "reference": "import { MyComponent } from '@tale-ui/react/my-component';\n\nexport function MyExample() {\n  return (\n    <MyComponent.Root>...</MyComponent.Root>\n  );\n}",
  "tags": ["MyComponent"]
}
```

- `difficulty`: `simple` = 1 component, no state; `medium` = 2–3 components or basic state; `complex` = multi-component composition, form state, or advanced patterns
- `reference`: a valid, self-contained TSX export that matches the exact API from the component docs — no raw HTML layout elements where Tale UI layout components exist
- `tags`: component names (namespace root, e.g. `"Button"`, `"Tabs"`) that must appear in agent-generated output to pass L2

Add the new entry to `tools/golden-prompts/index.json` and validate:

```bash
pnpm golden:validate   # all reference implementations must pass registry + tsc
```

**When adding variations** (new prop values, new patterns, new compositions), add additional golden prompts with a descriptive slug suffix (e.g. `button-destructive`, `tabs-pills-variant`).

Run `pnpm golden:eval` to score AI output against all prompts, and `pnpm golden:fix-review` for the full eval → auto-fix → visual review pipeline.

**When updating an existing component**, ensure all of the following are kept in sync:

- **Markdown docs** — update `docs/components/{name}.md` (props, parts, examples, CSS classes)
- **JSDoc** — update JSDoc comments on exported props/components in `{Component}.styled.tsx`
- **Code examples** — update any inline examples in docs and README to reflect the new API
- **Component Audit** — update `playground/vite-app/src/demos/ComponentAudit.tsx` to exercise the change
- **Storybook** — update or add stories in `playground/storybook/src/stories/{Component}.stories.tsx`

### Shared primitives (`_primitives.css`)

`packages/styles/src/_primitives.css` holds grouped selectors for declarations that are byte-for-byte identical across multiple components. When adding a new field-like input, dropdown popup, or list item — check `_primitives.css` first and add the new selector to the relevant group.

## Component Artifact Audit

Status of required artifacts for all 87 components. When adding or updating a component, update the relevant row below.

**Legend:** styled = `{Component}.styled.tsx` | index = `index.ts` | test = `{Component}.test.tsx` (non-trivial logic only) | css = `{component}.css` in styles/src | prim = `_primitives.css` entry (if shared declarations apply) | doc = `docs/components/{name}.md` | snip = consumer-claude-md-snippet.md | rdme = react/README.md | idx = `docs/component-index.md` entry | story = Storybook story | audit = ComponentAudit.tsx entry | a2ui = A2UI catalog adapter in `packages/a2ui/src/catalog.ts`

**✓** = present | **✗** = missing | **n/a** = not applicable

**Non-trivial components requiring tests:** Drawer (custom state/swipe), Meter (percentage calc), ProgressBar (percentage calc + indeterminate), ColorModeToggle (localStorage/OS preference), Tabs (MutationObserver/ResizeObserver indicator)

**Total:** 90 components | **Fully complete:** 90 | **Missing artifacts:** 0

### Form Controls

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Button | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Input | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | n/a |
| Checkbox | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CheckboxGroup | n/a | ✓ | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Radio | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RadioGroup | n/a | ✓ | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Switch | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ToggleButton | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ToggleButtonGroup | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Select | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Combobox | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Autocomplete | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NumberField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Slider | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SearchField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TextField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TextArea | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PaymentInput | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PinInput | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SelectNative | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Date & Time

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Calendar | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RangeCalendar | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DateField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DatePicker | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DateRangePicker | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TimeField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Color

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ColorArea | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorSlider | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorWheel | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorSwatch | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorSwatchPicker | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorPicker | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Overlay

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dialog | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AlertDialog | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Popover | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PreviewCard | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Drawer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tooltip | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Navigation

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Menu | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ContextMenu | ✓ | ✓ | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NavigationMenu | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Menubar | ✓ | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | n/a |
| Breadcrumbs | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Link | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pagination | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Layout

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accordion | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Card | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Carousel | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Column | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Disclosure | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Row | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ScrollArea | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Separator | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tabs | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Toolbar | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Feedback

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Banner | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ProgressBar | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ProgressCircle | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Meter | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Spinner | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Display

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Avatar | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Badge | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DotIcon | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| EmptyState | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| FeaturedIcon | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GridList | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Image | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| List | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RatingBadge | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RatingStars | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Table | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TagGroup | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tree | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Marketing

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AppStoreButton | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SocialButton | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SocialButtonGroup | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | n/a |

### Form Structure

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Field | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fieldset | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Form | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Interaction

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DropZone | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| FileTrigger | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Typography

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Text | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Utility

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ColorModeToggle | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | n/a |
| Container | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | n/a |
| CSPProvider | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | n/a | n/a | n/a |
| I18nProvider | ✓ | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | n/a | n/a | n/a |
| Icon | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| IconButton | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| mergeProps | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | n/a | n/a | n/a |

## Charts Package Artifact Audit (`@tale-ui/charts`)

Status of required artifacts for all 6 chart components and 3 shared utilities. When adding or updating a chart, update the relevant row below.

**Legend:** styled = `{Chart}.styled.tsx` | index = `index.ts` | test = `charts.test.tsx` coverage | css = `chart.css` entry | doc = `docs/components/{name}.md` | snip = consumer-claude-md-snippet.md | idx = `docs/component-index.md` entry | story = Storybook story

**✓** = present | **✗** = missing | **n/a** = not applicable

**Total:** 6 chart components + 3 shared utilities | **Fully complete:** 9 | **Missing artifacts:** 0

### Chart Components

| Component | styled | index | test | css | doc | snip | idx | story |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AreaChart | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| BarChart | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| LineChart | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PieChart | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RadarChart | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RadialBarChart | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Shared Utilities

| Utility | file | test | doc |
| --- | --- | --- | --- |
| ChartContainer | ✓ | n/a | ✓ (in chart docs) |
| ChartTooltip | ✓ | ✓ | ✓ (in chart docs) |
| ChartLegend | ✓ | ✓ | ✓ (in chart docs) |

<!-- Last generated: 2026-03-27 -->
