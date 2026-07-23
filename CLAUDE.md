# Tale UI — Monorepo

Unified monorepo managed with **pnpm workspaces**. This repository is the single source of truth for the Tale UI Design System, React component library, and supporting tooling.

## Packages

| Path                                         | Package                 | Description                                                                                      |
| -------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| [packages/tokens](packages/tokens/CLAUDE.md) | `@tale-ui/tokens`       | Canonical platform-neutral tokens; generates CSS and native objects                              |
| [packages/css](packages/css/CLAUDE.md)       | `@tale-ui/css`          | CSS foundations, utilities, and themes generated from the shared tokens                          |
| [packages/react](packages/react/)            | `@tale-ui/react`        | Styled React components — BEM class names applied automatically (built on React Aria Components) |
| [packages/styles](packages/styles/)          | `@tale-ui/react-styles` | CSS per component (uses `@tale-ui/css` tokens)                                                   |
| [packages/themes](packages/themes/CLAUDE.md) | `@tale-ui/themes`       | Optional standard and monochrome theme presets                                                   |
| [packages/utils](packages/utils/)            | `@tale-ui/utils`        | Shared utilities                                                                                 |
| [packages/charts](packages/charts/CLAUDE.md) | `@tale-ui/charts`       | Recharts-based chart components themed with design tokens                                        |
| [packages/a2ui](packages/a2ui/)              | `@tale-ui/a2ui`         | A2UI protocol renderer — maps agent messages to Tale UI components                               |
| [apps/mcp-studio](apps/mcp-studio/)          | `@tale-ui/mcp-studio`   | Visual maintainer tool: prompt → plan_ui → rendered preview → pitfall authoring                  |

## Documentation

| File                                                                             | What it covers                                                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [docs/workspace-structure.md](docs/workspace-structure.md)                       | Directory layout, conventions, and workspace CLI commands                                         |
| [docs/managing-packages.md](docs/managing-packages.md)                           | Creating new packages and importing external projects                                             |
| [docs/package-dependencies.md](docs/package-dependencies.md)                     | Cross-package `workspace:*` dependencies                                                          |
| [docs/consuming-design-system.md](docs/consuming-design-system.md)               | Installing @tale-ui/css in external projects                                                      |
| [docs/react-setup.md](docs/react-setup.md)                                       | Setting up a React app with Tale UI                                                               |
| [docs/design-philosophy.md](docs/design-philosophy.md)                           | Why React Aria, why BEM, why CSS-first, colour token system, dark mode                            |
| [docs/authoring-components.md](docs/authoring-components.md)                     | Contributor guide: adding new `@tale-ui/react` components                                         |
| [docs/react-aria-deviations.md](docs/react-aria-deviations.md)                   | Every difference between Tale UI and vanilla React Aria Components                                |
| [docs/upstream/react-aria-components.md](docs/upstream/react-aria-components.md) | Maintainer log for how Tale UI adopts, defers, or rejects upstream React Aria Components releases |
| [docs/component-index.md](docs/component-index.md)                               | All 112 React components plus 6 chart components at a glance: description, import path, sub-parts |
| [registry/components.json](registry/components.json)                             | Machine-readable component registry: props, parts, examples, CSS classes                          |
| [docs/components/](docs/components/index.md)                                     | Per-component usage guide: imports, parts, examples, CSS classes                                  |
| [docs/recipes/](docs/recipes/index.md)                                           | Copy-paste multi-component patterns (forms, tables, navigation, search, settings)                 |
| [docs/a2ui-integration.md](docs/a2ui-integration.md)                             | A2UI protocol integration: setup, catalog, renderer, validation                                   |
| [tools/README.md](tools/README.md)                                               | Monorepo tooling: audit scripts, build scripts, release process                                   |
| [tools/prompts/self-critique.md](tools/prompts/self-critique.md)                 | Second-pass validation prompt for AI-generated Tale UI code                                       |

## MCP Server

An MCP server at `tools/mcp-server.mjs` exposes Tale UI's component registry and recipes as tools. Configured in `.mcp.json`.

**Tools:** `list_components`, `get_component`, `search_components`, `list_recipes`, `get_recipe`, `search_docs`

## CSS Design System (@tale-ui/css)

See [packages/css/CLAUDE.md](packages/css/CLAUDE.md) for the full CSS contributor guide.

## Design Tokens (@tale-ui/tokens)

`packages/tokens/tokens.json` is the canonical token source. Never hand-edit
`packages/css/src/tokens/*.css` or `packages/tokens/src/generated.ts`; run
`pnpm tokens:generate` after editing the source.

## React Components (@tale-ui/react)

**Setup guide:** See [docs/react-setup.md](docs/react-setup.md) for the full consumer guide.

**Source locations:** Component source and private React utilities are in `packages/react/`. Public shared utilities are in `packages/utils/`.

**Docs locations:** Public component reference docs are generated under `docs/components/`. App-routed public docs live under `docs/src/app/(docs)/react/`; update them when changes must be visible in the docs site. Private manual-testing experiments live under `docs/src/app/(private)/experiments/`.

**Public demos:** When creating public docs demos, refer to the component's `hero` demo and follow its styles for both CSS Modules and Tailwind CSS versions. Other demos may contain relevant layout patterns. Do not add custom styling beyond the critical layout styles necessary for the demo.

**Styling Architecture:** Components in `packages/react/src/{name}/{Component}.styled.tsx` apply BEM class names automatically. The CSS rules themselves live in `packages/styles/src/` — consumers still import `@tale-ui/react-styles` for the stylesheet. Override via additional `className` props.

**Component CSS pattern:**

```css
.tale-button { ... }
.tale-button--primary { ... }   /* variant */
.tale-button--sm { ... }        /* size modifier */
.tale-button[data-disabled] { opacity: 0.45; pointer-events: none; }
```

**State data attributes:** `data-disabled`, `data-open`, `data-selected`, `data-pressed`, `data-focus-visible`, `data-focused`, `data-hovered`, `data-entering`, `data-exiting`, `data-placement="top|bottom|left|right"`

### Code Guidelines

- Use `useTimeout` from `@tale-ui/utils/useTimeout` instead of `window.setTimeout`, and `useAnimationFrame` from `@tale-ui/utils/useAnimationFrame` instead of `requestAnimationFrame`.
- Use `useStableCallback` from `@tale-ui/utils/useStableCallback` instead of `React.useCallback` when the function is called within an effect or event handler. `useStableCallback` cannot memoize functions that are called directly during render; use `React.useCallback` for those cases.
- Use `useIsoLayoutEffect` from `@tale-ui/utils/useIsoLayoutEffect` instead of `React.useLayoutEffect`.
- Avoid duplicating logic where components can share it. If two components can share logic, such as event handlers, define the logic in the parent and share it through context. Use an existing context when one exists.
- Do not add casts such as `as any` unless they are required after checking the type errors. Run `pnpm typescript` to verify types.

### Design Tokens

All component styles use tokens from `@tale-ui/css`:

- **Colors:** `--neutral-*` and `--color-*` (NEVER `--brand-*` in component CSS)
- **Foreground:** `--color-*-fg` and `--neutral-*-fg` for auto-contrasting text on any shade background
- **Spacing:** `--space-4xs` through `--space-4xl`
- **Typography:** `--label-s-font-size`, `--text-s-font-size`, etc.
- **Dark mode:** Automatic via `data-color-mode="dark"` on `<html>`
- **Category tokens:** `--field-*`, `--popup-*`, `--item-*`, `--group-label-*`, `--modal-*`, `--progress-*` — consumer-overridable tokens defined in `packages/styles/src/_primitives.css` that sit between semantic tokens and grouped component selectors. Override on `:root` to retheme entire component families (e.g. `--field-bg` changes all 9 field controls simultaneously). See [packages/css/docs/ai-reference.md § 1.6](packages/css/docs/ai-reference.md) for the full token table.

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
pnpm stylelint                  # lint all CSS with repo ignore rules
pnpm markdownlint               # lint Markdown and MDX
pnpm prettier                   # format changed files against master
pnpm audit:bem              # verify BEM classes have matching CSS
pnpm audit:brand            # verify no --brand-* in component CSS
pnpm audit:docs             # verify docs list all component props
pnpm audit:components       # 19-check component completeness audit
pnpm audit:coverage         # check ComponentAudit, Storybook, and A2UI full-showcase coverage
pnpm registry:generate      # regenerate registry/components.json from source
pnpm registry:check         # verify registry is up-to-date (CI mode)
pnpm validate:generated     # validate generated .tsx against registry + tsc
pnpm golden:validate        # validate all golden prompt references
pnpm golden:eval            # run prompts against Claude and score L1–L3 (add --mcp for agentic MCP mode)
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

If a repository command fails because dependencies are unavailable, run `pnpm install` and retry the command.

### Testing

- If source code changed, verify it with relevant tests and add tests where applicable.
- Run focused JSDOM tests with `pnpm test:jsdom {name} --no-watch`, for example `pnpm test:jsdom NumberField --no-watch`.
- Run focused Chromium tests with `pnpm test:chromium {name} --no-watch`, for example `pnpm test:chromium NumberField --no-watch`.
- Browser-layout-sensitive tests must be restricted to Chromium using `it.skipIf(isJSDOM)` or `describe.skipIf(isJSDOM)`.
- Do not call `await flushMicrotasks()` directly after `await render(...)` when there are no interactions or state changes between them; `render` is already awaited.
- Follow existing test conventions. Component tests live next to source with the filename `{Component}.test.tsx`, for example `PopoverRoot.test.tsx`.
- New tests should use Vitest's native `expect()` and `fn()` APIs. Do not assume Chai or Sinon APIs for new code.

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

## Public Errors

These rules apply to errors thrown by public packages.

Every error message must:

1. Say what happened.
2. Say why it is a problem.
3. Point toward how to solve it.

Format:

- Prefix with `Tale UI: `.
- Use string concatenation for readability when messages span multiple lines.
- Include a documentation link when applicable, using `https://tale-ui.com/...`.

## Commit Messages

- Use `[scope] Imperative summary`, for example `[popover] Fix focus trap`.
- Choose scopes that mirror the package or component names changed.
- Use `[all components]` for changes that broadly affect most components.

## Component Artifact Audit

Status of required artifacts for all 116 components. When adding or updating a component, update the relevant row below.

**Legend:** styled = `{Component}.styled.tsx` | index = `index.ts` | test = `{Component}.test.tsx` (non-trivial logic only) | css = `{component}.css` in styles/src | prim = `_primitives.css` entry (if shared declarations apply) | doc = `docs/components/{name}.md` | snip = consumer-claude-md-snippet.md | rdme = react/README.md | idx = `docs/component-index.md` entry | story = Storybook story | audit = ComponentAudit.tsx entry | a2ui = A2UI catalog adapter in `packages/a2ui/src/catalog.ts` | status = `@status` JSDoc tag in `{Component}.styled.tsx` (`stable` \| `experimental` \| `deprecated`)

**✓** = present | **✗** = missing | **n/a** = not applicable

**Non-trivial components requiring tests:** Drawer (custom state/swipe), Meter (percentage calc), ProgressBar (percentage calc + indeterminate), ColorModeToggle (localStorage/OS preference), Tabs (MutationObserver/ResizeObserver indicator), KeyValuePairs (ResizeObserver column calculation)

**Total:** 116 components | **Fully complete:** 116 | **Missing artifacts:** 0

### Form Controls

| Component         | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status     |
| ----------------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ---------- |
| Button            | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| Input             | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable     |
| InputGroup        | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| InputTags         | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| MultiSelect       | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| TagSelect         | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| Checkbox          | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | deprecated |
| CheckboxField     | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable     |
| CheckboxGroup     | n/a    | ✓     | n/a  | n/a | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| Radio             | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | deprecated |
| RadioField        | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable     |
| RadioGroup        | n/a    | ✓     | n/a  | n/a | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| Switch            | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | deprecated |
| SwitchField       | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable     |
| ToggleButton      | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| ToggleButtonGroup | n/a    | ✓     | n/a  | n/a | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| Select            | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| Combobox          | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| Autocomplete      | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| ListBox           | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable     |
| NumberField       | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| Slider            | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| SearchField       | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| TextField         | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| TextArea          | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| PaymentInput      | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| PinInput          | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |
| SelectNative      | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable     |

### Date & Time

| Component       | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| --------------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| Calendar        | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| RangeCalendar   | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| DateField       | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| DatePicker      | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| DateRangePicker | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| TimeField       | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |

### Color

| Component         | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| ----------------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| ColorArea         | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ColorSlider       | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ColorWheel        | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ColorSwatch       | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ColorSwatchPicker | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ColorField        | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ColorPicker       | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |

### Overlay

| Component   | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| ----------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| Dialog      | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| AlertDialog | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Popover     | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| PreviewCard | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Drawer      | ✓      | ✓     | ✓    | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Tooltip     | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |

### Navigation

| Component      | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| -------------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| Menu           | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ContextMenu    | ✓      | ✓     | n/a  | n/a | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| CommandPalette | ✓      | ✓     | ✓    | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| NavigationMenu | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Menubar        | ✓      | ✓     | n/a  | n/a | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| Breadcrumbs    | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Link           | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Pagination     | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| PaginationDot  | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| PaginationLine | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| Sidebar        | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| HeaderNav      | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |

### Layout

| Component  | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| ---------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| Accordion  | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Card       | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Carousel   | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Column     | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Disclosure | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Row        | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ScrollArea | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Separator  | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Tabs       | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Toolbar    | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |

### Feedback

| Component      | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| -------------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| Banner         | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ProgressBar    | ✓      | ✓     | ✓    | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| ProgressCircle | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Meter          | ✓      | ✓     | ✓    | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Spinner        | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |

### Display

| Component     | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| ------------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| Avatar        | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Badge         | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| DotIcon       | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| EmptyState    | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| FeaturedIcon  | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| GridList      | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Image         | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| KeyValuePairs | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| List          | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| QRCode        | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| RatingBadge   | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| RatingStars   | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Table         | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| TagGroup      | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Tree          | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| VideoPlayer   | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |

### Marketing

| Component         | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| ----------------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| AppStoreButton    | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| SocialButton      | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| SocialButtonGroup | n/a    | ✓     | n/a  | n/a | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| BadgeGroup        | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| SectionDivider    | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| BackgroundPattern | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| Illustration      | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| IphoneMockup      | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| CreditCard        | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |

### Form Structure

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| --------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| Field     | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Fieldset  | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| Form      | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |

### Interaction

| Component    | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status       |
| ------------ | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------------ |
| DropZone     | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable       |
| FileTrigger  | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable       |
| FileUpload   | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable       |
| ImageCropper | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable       |
| TextEditor   | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | experimental |

### Typography

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| --------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| Text      | ✓      | ✓     | n/a  | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |

### Utility

| Component       | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit | a2ui | status |
| --------------- | ------ | ----- | ---- | --- | ---- | --- | ---- | ---- | --- | ----- | ----- | ---- | ------ |
| ColorModeToggle | ✓      | ✓     | ✓    | ✓   | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| Container       | n/a    | ✓     | n/a  | n/a | n/a  | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | n/a  | stable |
| CSPProvider     | n/a    | ✓     | n/a  | n/a | n/a  | ✓   | ✓    | ✓    | ✓   | n/a   | n/a   | n/a  | stable |
| I18nProvider    | ✓      | ✓     | n/a  | n/a | n/a  | ✓   | ✓    | ✓    | ✓   | n/a   | n/a   | n/a  | stable |
| Icon            | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| IconButton      | ✓      | ✓     | n/a  | ✓   | ✓    | ✓   | ✓    | ✓    | ✓   | ✓     | ✓     | ✓    | stable |
| mergeProps      | n/a    | ✓     | n/a  | n/a | n/a  | ✓   | ✓    | ✓    | ✓   | n/a   | n/a   | n/a  | stable |
| Virtualizer     | n/a    | ✓     | n/a  | n/a | n/a  | ✓   | ✓    | ✓    | ✓   | n/a   | n/a   | n/a  | stable |

## Charts Package Artifact Audit (`@tale-ui/charts`)

Status of required artifacts for all 6 chart components and 3 shared utilities. When adding or updating a chart, update the relevant row below.

**Legend:** styled = `{Chart}.styled.tsx` | index = `index.ts` | test = `charts.test.tsx` coverage | css = `chart.css` entry | doc = `docs/components/{name}.md` | snip = consumer-claude-md-snippet.md | idx = `docs/component-index.md` entry | story = Storybook story

**✓** = present | **✗** = missing | **n/a** = not applicable

**Total:** 6 chart components + 3 shared utilities | **Fully complete:** 9 | **Missing artifacts:** 0

### Chart Components

| Component      | styled | index | test | css | doc | snip | idx | story |
| -------------- | ------ | ----- | ---- | --- | --- | ---- | --- | ----- |
| AreaChart      | ✓      | ✓     | ✓    | ✓   | ✓   | ✓    | ✓   | ✓     |
| BarChart       | ✓      | ✓     | ✓    | ✓   | ✓   | ✓    | ✓   | ✓     |
| LineChart      | ✓      | ✓     | ✓    | ✓   | ✓   | ✓    | ✓   | ✓     |
| PieChart       | ✓      | ✓     | ✓    | ✓   | ✓   | ✓    | ✓   | ✓     |
| RadarChart     | ✓      | ✓     | ✓    | ✓   | ✓   | ✓    | ✓   | ✓     |
| RadialBarChart | ✓      | ✓     | ✓    | ✓   | ✓   | ✓    | ✓   | ✓     |

### Shared Utilities

| Utility        | file | test | doc               |
| -------------- | ---- | ---- | ----------------- |
| ChartContainer | ✓    | n/a  | ✓ (in chart docs) |
| ChartTooltip   | ✓    | ✓    | ✓ (in chart docs) |
| ChartLegend    | ✓    | ✓    | ✓ (in chart docs) |

<!-- Last generated: 2026-03-27 -->
