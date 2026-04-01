# Documentation System

How Tale UI structures its per-component and project-level documentation.

---

## Overview

Tale UI maintains **5 layers of documentation** that must stay synchronized for every component:

1. **Markdown docs** — `docs/components/{name}.md` (67 component docs + index)
2. **JSDoc comments** — In `.styled.tsx` source files
3. **Code examples** — In markdown docs, JSDoc `@example` blocks, and READMEs
4. **Storybook stories** — `playground/storybook/src/stories/{Name}.stories.tsx` (56 files)
5. **Component Audit** — `playground/vite-app/src/demos/ComponentAudit.tsx` (2,682 lines)

The root `CLAUDE.md` enforces this sync requirement: when updating an existing component, all 5 layers must be kept in sync.

---

## Per-Component Documentation (`docs/components/`)

### Template Structure

Every component doc follows a consistent template:

```markdown
# ComponentName

> One-sentence description, mentioning React Aria base if applicable.

## Import

\`\`\`tsx
import { ComponentName } from '@tale-ui/react/component-name';
\`\`\`

## Parts (for compound components)

| Part | Description |
|------|-------------|
| ComponentName.Root | ... |
| ComponentName.Label | ... |

## Basic Usage

\`\`\`tsx
<ComponentName.Root>
  <ComponentName.Label>...</ComponentName.Label>
  ...
</ComponentName.Root>
\`\`\`

## Examples

### Variant A
\`\`\`tsx
...
\`\`\`

### Variant B
\`\`\`tsx
...
\`\`\`

## CSS Classes

| Class | Applies to |
|-------|-----------|
| `.tale-component` | Root element |
| `.tale-component__part` | Sub-element |
| `.tale-component--variant` | Variant modifier |

## Notes

- Default prop values
- Common mistakes
- Accessibility behaviour
- Keyboard interaction
```

### Coverage

67 component docs (+ 1 index) covering:

| Category | Components | Count |
|----------|-----------|-------|
| Form Controls | Button, Checkbox, CheckboxGroup, Input, TextField, Select, Combobox, Autocomplete, NumberField, Slider, SearchField, TextArea, Radio, RadioGroup, Switch, IconButton, ToggleButton, ToggleGroup | 18 |
| Date & Time | Calendar, RangeCalendar, DateField, DatePicker, DateRangePicker, TimeField | 6 |
| Color | ColorArea, ColorSlider, ColorWheel, ColorSwatch, ColorSwatchPicker, ColorField, ColorPicker | 7 |
| Overlay | Dialog, AlertDialog, Popover, PreviewCard, Drawer, Tooltip | 6 |
| Navigation | Menu, ContextMenu, NavigationMenu, Menubar, Breadcrumbs, Link | 6 |
| Layout | Accordion, Disclosure, Tabs, ScrollArea, Separator, Toolbar | 6 |
| Feedback | ProgressBar, Meter | 2 |
| Display | Avatar, GridList, Table, TagGroup, Tree | 5 |
| Form Structure | Field, Fieldset, Form | 3 |
| Interaction | DropZone, FileTrigger | 2 |
| Utility | ColorModeToggle, Container, CSPProvider, I18nProvider, Icon, mergeProps | 6 |
| Index | index.md (master navigation) | 1 |

### Key Design Decisions

1. **Import paths are explicit** — Every doc starts with the exact import statement. No ambiguity about which subpath to use.

2. **Parts tables for compound components** — Agents can immediately see available sub-components without reading source.

3. **CSS classes are listed** — Enables agents to generate correct selectors for custom styling without reading the CSS source.

4. **Notes capture pitfalls** — Common mistakes are documented inline, not buried in a separate troubleshooting doc.

---

## JSDoc Documentation

### In `.styled.tsx` Files

Components include JSDoc with `@example` blocks:

```typescript
/**
 * A push button that triggers an action.
 *
 * Built on React Aria's Button component.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...);
```

**Purpose:** These comments appear in:

- IDE tooltips and autocomplete
- Generated `.d.ts` type declaration files
- The `consumer-claude-md-snippet.md` directs agents to check `.d.ts` files in `node_modules` for these examples

### Coverage

JSDoc is present on:

- All exported component `forwardRef` wrappers
- All Props interfaces (with `@param`-style property docs where non-obvious)
- Key utility functions in `@tale-ui/utils`

---

## Project-Level Documentation

### Architecture & Philosophy (3 files, 1,006 lines)

| File | Lines | Purpose |
|------|-------|---------|
| `docs/design-philosophy.md` | 306 | Why every architectural decision was made |
| `docs/authoring-components.md` | 443 | Step-by-step new component guide with code examples |
| `docs/react-aria-deviations.md` | 257 | Every difference from vanilla React Aria |

### Consumer Guides (3 files)

| File | Purpose |
|------|---------|
| `docs/react-setup.md` | Full setup guide for React apps |
| `docs/consuming-design-system.md` | Using `@tale-ui/core` CSS directly |
| `docs/consumer-claude-md-snippet.md` | Portable AI instructions for consuming projects |

### Workspace & Package Docs (3 files)

| File | Purpose |
|------|---------|
| `docs/workspace-structure.md` | Directory layout and conventions |
| `docs/managing-packages.md` | Creating new packages |
| `docs/package-dependencies.md` | Cross-package dependency patterns |

### CSS Design System Docs (`packages/css/docs/`)

| File | Purpose |
|------|---------|
| `README.md` | Package overview and quick start |
| `ai-reference.md` | Complete token/class enumeration (975 lines) |
| `documentation.html` | Visual reference of all classes |
| `architecture.md` | Module structure and build pipeline |
| `naming-conventions.md` | Detailed naming rules |
| `design-tokens.md` | Token definitions |
| `building-components.md` | Component CSS patterns |
| `framework-integration.md` | Tailwind/shadcn coexistence |

---

## Documentation Sync Requirements

The root `CLAUDE.md` mandates that **all 5 artifacts stay synchronized** when a component changes:

| Artifact | Location | What to Update |
|----------|----------|----------------|
| Markdown docs | `docs/components/{name}.md` | Props, parts, examples, CSS classes |
| JSDoc | `{Component}.styled.tsx` | Props descriptions, `@example` blocks |
| Code examples | Docs and README | Reflect new API |
| Component Audit | `ComponentAudit.tsx` | Exercise the change |
| Storybook | `{Component}.stories.tsx` | Add/update stories |

This explicit sync checklist is critical for AI agents — without it, an agent might update the source code but forget to update docs or stories.

---

## Documentation Discovery Flow

### For an AI Agent Working Inside the Monorepo

1. `CLAUDE.md` loads automatically → sees package map and doc index
2. Task-specific routing:
   - **Adding a component:** → `authoring-components.md` → checklist
   - **Modifying a component:** → `docs/components/{name}.md` → sync checklist
   - **Writing CSS:** → `packages/css/CLAUDE.md` → `ai-reference.md`
   - **Understanding architecture:** → `design-philosophy.md`

### For an AI Agent in a Consuming Project

1. `consumer-claude-md-snippet.md` is in the consuming project's `CLAUDE.md`
2. Points to `react-setup.md` and `.d.ts` JSDoc examples
3. Lists 27 pitfalls to avoid
4. References `docs/components/{name}.md` for specific usage

---

## Quantitative Summary

| Metric | Value |
|--------|-------|
| Component docs | 67 component docs + 1 index |
| AI-specific files | 7 (llms.txt, 3x CLAUDE.md, consumer snippet, ai-reference, deviations) |
| Architecture docs | 3 files, 1,006 lines |
| CSS reference docs | 8 files in `packages/css/docs/` |
| Consumer/setup guides | 3 files |
| Total documentation lines | ~8,400 |
| Documented pitfalls | 27 (in consumer snippet) |
| Documented deviations from React Aria | 25+ (in deviations doc) |
