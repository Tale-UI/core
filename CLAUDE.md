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
| [docs/component-index.md](docs/component-index.md) | All 69 components at a glance: description, import path, sub-parts |
| [docs/components/](docs/components/index.md) | Per-component usage guide: imports, parts, examples, CSS classes |
| [docs/recipes/](docs/recipes/index.md) | Copy-paste multi-component patterns (forms, tables, navigation, search, settings) |

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

See [docs/authoring-components.md](docs/authoring-components.md) for the full checklist.

**When updating an existing component**, ensure all of the following are kept in sync:

- **Markdown docs** — update `docs/components/{name}.md` (props, parts, examples, CSS classes)
- **JSDoc** — update JSDoc comments on exported props/components in `{Component}.styled.tsx`
- **Code examples** — update any inline examples in docs and README to reflect the new API
- **Component Audit** — update `playground/vite-app/src/demos/ComponentAudit.tsx` to exercise the change
- **Storybook** — update or add stories in `playground/storybook/src/stories/{Component}.stories.tsx`

### Shared primitives (`_primitives.css`)

`packages/styles/src/_primitives.css` holds grouped selectors for declarations that are byte-for-byte identical across multiple components. When adding a new field-like input, dropdown popup, or list item — check `_primitives.css` first and add the new selector to the relevant group.

## Component Artifact Audit

Status of required artifacts for all 81 components. When adding or updating a component, update the relevant row below.

**Legend:** styled = `{Component}.styled.tsx` | index = `index.ts` | test = `{Component}.test.tsx` (non-trivial logic only) | css = `{component}.css` in styles/src | prim = `_primitives.css` entry (if shared declarations apply) | doc = `docs/components/{name}.md` | snip = consumer-claude-md-snippet.md | rdme = react/README.md | idx = `docs/component-index.md` entry | story = Storybook story | audit = ComponentAudit.tsx entry

**✓** = present | **✗** = missing | **n/a** = not applicable

**Non-trivial components requiring tests:** Drawer (custom state/swipe), Meter (percentage calc), ProgressBar (percentage calc + indeterminate), ColorModeToggle (localStorage/OS preference), Tabs (MutationObserver/ResizeObserver indicator)

**Total:** 82 components | **Fully complete:** 82 | **Missing artifacts:** 0

### Form Controls

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Button | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Input | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Checkbox | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CheckboxGroup | n/a | ✓ | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Radio | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RadioGroup | n/a | ✓ | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Switch | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ToggleButton | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ToggleButtonGroup | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Select | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Combobox | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Autocomplete | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NumberField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Slider | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SearchField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TextField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TextArea | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PaymentInput | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PinInput | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SelectNative | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Date & Time

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Calendar | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RangeCalendar | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DateField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DatePicker | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DateRangePicker | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TimeField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Color

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ColorArea | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorSlider | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorWheel | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorSwatch | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorSwatchPicker | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorField | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ColorPicker | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Overlay

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dialog | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AlertDialog | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Popover | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PreviewCard | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Drawer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tooltip | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Navigation

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Menu | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ContextMenu | ✓ | ✓ | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NavigationMenu | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Menubar | ✓ | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Breadcrumbs | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Link | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pagination | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Layout

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accordion | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Disclosure | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tabs | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ScrollArea | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Separator | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Toolbar | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Carousel | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Feedback

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Banner | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ProgressBar | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Meter | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Spinner | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Display

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Avatar | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| EmptyState | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GridList | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Table | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TagGroup | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tree | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Badge | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DotIcon | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| FeaturedIcon | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RatingStars | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RatingBadge | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Marketing

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AppStoreButton | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SocialButton | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Form Structure

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Field | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fieldset | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Form | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Interaction

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DropZone | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| FileTrigger | ✓ | ✓ | n/a | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Utility

| Component | styled | index | test | css | prim | doc | snip | rdme | idx | story | audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ColorModeToggle | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Container | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CSPProvider | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | n/a | n/a |
| I18nProvider | ✓ | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | n/a | n/a |
| Icon | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| IconButton | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| mergeProps | n/a | ✓ | n/a | n/a | n/a | ✓ | ✓ | ✓ | ✓ | n/a | n/a |

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
