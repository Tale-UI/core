# AI Documentation Architecture

How Tale UI structures its documentation ecosystem for AI agents and LLM-powered development tools.

---

## Overview

Tale UI maintains a **layered documentation architecture** purpose-built for AI consumption. Six primary files form a hierarchy from high-level entry point to exhaustive enumeration, with 67 per-component docs providing granular usage guidance.

Total AI-relevant documentation: ~2,400 lines across core files, plus ~67 component docs totalling ~5,200 lines.

---

## The Documentation Hierarchy

```
                    ┌─────────────┐
                    │   llms.txt  │  Entry point — architecture + critical rules
                    │  (199 lines)│
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
     ┌────────────────┐       ┌──────────────────────┐
     │   CLAUDE.md    │       │  design-philosophy.md │  "Why" behind decisions
     │  (103 lines)   │       │     (306 lines)       │
     └───────┬────────┘       └──────────────────────┘
             │
    ┌────────┼─────────────────┐
    ▼        ▼                 ▼
┌─────────┐ ┌──────────────┐ ┌───────────────────────┐
│css/     │ │authoring-    │ │consumer-claude-md-     │  Portable snippet
│CLAUDE.md│ │components.md │ │snippet.md (95 lines)   │  for consuming projects
│(51 ln)  │ │(443 lines)   │ └───────────────────────┘
└────┬────┘ └──────────────┘
     ▼
┌────────────────────┐
│ai-reference.md     │  Exhaustive enumeration
│(975 lines)         │  of every token, class, value
└────────────────────┘
```

---

## File-by-File Analysis

### 1. `llms.txt` (199 lines) — The Entry Point

The first file an AI agent should read. Provides a complete system overview in a single document.

**Contents:**
- 4-package architecture (core → styles → react → utils)
- Quick-start code for React apps
- Critical rules for code generation (naming conventions, shade numbers)
- 3-layer colour token system (`--brand-*` vs `--color-*` vs `--neutral-*`)
- Dark mode setup (3-priority system)
- BEM class naming patterns
- State data attributes reference
- Design token categories
- Responsive breakpoints

**Design decision:** Structured as a self-contained briefing document. An agent reading only this file could generate mostly-correct code.

### 2. `CLAUDE.md` — Root (103 lines) — Monorepo Contributor Guide

Loaded automatically by Claude Code and similar tools that honour `CLAUDE.md` conventions.

**Contents:**
- Package table with paths and npm names
- Documentation index (links to every doc file with one-line descriptions)
- CSS design system pointer to `packages/css/CLAUDE.md`
- React component styling architecture
- Development workflow commands (`pnpm install`, `pnpm build`, `pnpm test:jsdom`, etc.)
- Component source conventions (file structure per component)
- Component documentation requirements (what must be updated when changing a component)
- Shared primitives pattern (`_primitives.css`)

**Design decision:** Acts as a routing table — directs agents to the right detailed doc based on their task.

### 3. `packages/css/CLAUDE.md` (51 lines) — CSS Contributor Guide

**Contents:**
- 5 critical rules (naming, specificity, shade numbering, `--brand-*` prohibition)
- Project structure (`src/` organization by layer)
- "Adding a new utility" checklist
- Build constraints (one-level-deep `@import`)
- Links to detailed architecture, naming, token, and component docs

**Design decision:** Minimal, rule-focused. Prevents the most common mistakes without overwhelming.

### 3b. `packages/react/CLAUDE.md` (4 lines) — React Package Pointer

A short pointer directing agents to read the full `README.md` before using the library. Highlights that critical setup steps (font-size base, style imports, theme overrides, dark mode) will produce broken output if skipped.

### 4. `docs/consumer-claude-md-snippet.md` (95 lines) — Portable AI Instructions

A snippet designed to be copied into consuming projects' own `CLAUDE.md` files, so that AI agents working in those projects understand Tale UI conventions.

**Contents:**
- Setup guide reference
- JSDoc example locations (`.d.ts` files)
- Per-component doc pointers
- **~27 specific pitfalls** with exact examples:
  - Namespace components (`TextField.Root`, not `TextFieldRoot`)
  - Drawer vs Dialog API differences
  - Meter/ProgressBar text children requirements
  - Trigger button styling inconsistencies
  - Icon and IconButton patterns
  - Token size suffixes (`-s`, `-m`, `-l` not Bootstrap style)
  - AlertDialog vs Dialog distinction
  - I18nProvider and CSPProvider setup
  - Dark mode persistence
  - Global CSS shield behaviour

**Design decision:** This is the portability mechanism — it lets Tale UI's AI documentation follow the design system into any project that uses it.

### 5. `packages/css/docs/ai-reference.md` (975 lines) — Exhaustive Enumeration

The complete lookup table for every CSS class, token, and valid value in the design system.

**Contents:**
- Critical rules (duplicated from `llms.txt` for standalone use)
- Naming conventions with examples
- Specificity patterns (only `.gap--*` and `.center--*` use double-selector)
- Complete shade number tables (irregular neutral: 5,10,12-30 by 2s, 40-70 by 10s, 80-100 by 2s)
- Text contrast rules with minimum darkness levels
- Foreground token system (`*-fg` with pivot points per family)
- Color theming mechanics
- Complete spacing token table with fluid `clamp()` values
- Typography scale with category-to-size mappings
- Every utility class with responsive variant availability
- Theme classes and color families
- Dark mode inversion rules
- 62.5% reset explanation and framework coexistence

**Design decision:** Designed for lookup, not linear reading. An agent generating CSS can query this file for exact valid values.

### 6. `docs/design-philosophy.md` (306 lines) — The "Why" Document

Explains the reasoning behind every architectural decision.

**Sections:**
1. Core Principles (CSS-first, token-driven, zero runtime, accessibility)
2. Why React Aria Components
3. Why the 4-Package Split
4. Why BEM + Data Attributes
5. The Colour Token System (3-layer hierarchy)
6. Light/Dark Mode (3-priority system)
7. Token-Driven Theming
8. The 62.5% Reset
9. Fluid Spacing
10. Build Simplicity

**Design decision:** By explaining "why," agents can make correct judgment calls in edge cases not covered by explicit rules.

### 7. `docs/react-aria-deviations.md` (257 lines) — Gotcha Prevention

Every difference between Tale UI and vanilla React Aria Components.

**Contents:**
- Components NOT built on React Aria (Drawer, NavigationMenu, ScrollArea, Avatar, Icon, Container)
- Drawer-specific API differences
- Custom props not in RAC (variant, size)
- Auto-rendered icons table (20 component parts)
- Trigger button styling inconsistencies
- Hardcoded close button styling

**Design decision:** Prevents the most dangerous class of AI errors — generating React Aria code that doesn't work with Tale UI's wrappers.

### 8. `docs/authoring-components.md` (443 lines) — Component Creation Guide

Step-by-step tutorial for adding new components.

**Contents:**
- File structure conventions
- Simple component example (Button with `forwardRef`, `displayName`, `cx()`)
- Composite component example (Select with namespace exports)
- `cx()` helper usage
- Variant & size prop conventions
- CSS authoring rules (BEM, tokens, data attributes)
- Shared primitives pattern
- Index file patterns
- Package configuration
- Testing conventions with boilerplate
- 15-step checklist

---

## Cross-Reference Strategy

The documentation uses deliberate cross-referencing:

| Source File | Links To | Purpose |
|-------------|----------|---------|
| `llms.txt` | `ai-reference.md` | "For complete enumeration..." |
| `CLAUDE.md` | Every doc file | Routing table |
| `CLAUDE.md` | `packages/css/CLAUDE.md` | CSS-specific work |
| `css/CLAUDE.md` | `ai-reference.md`, architecture docs | Detailed references |
| `consumer-snippet` | `react-setup.md`, `.d.ts` files | Consumer context |
| `authoring-components.md` | `_primitives.css`, component docs | Implementation details |

**No circular dependencies** — the hierarchy is strictly top-down.

---

## Information Architecture Principles

1. **Layered depth**: Entry point (llms.txt) → routing (CLAUDE.md) → philosophy (design-philosophy.md) → rules (ai-reference.md) → specifics (component docs)

2. **Redundancy at critical points**: The `--brand-*` prohibition and shade number rules appear in 4+ files because they are the highest-frequency AI errors.

3. **Separation of "what" and "why"**: `ai-reference.md` tells you what's valid; `design-philosophy.md` tells you why.

4. **Portable consumer context**: `consumer-claude-md-snippet.md` travels with the npm package, ensuring AI agents in consuming projects still get guidance.

5. **Task-oriented routing**: An agent adding a CSS utility follows a different documentation path than one building a React component or integrating Tale UI into an app.

---

## Total Documentation Footprint

| Category | Files | Lines |
|----------|-------|-------|
| AI entry points | 3 (`llms.txt`, `CLAUDE.md`, `react/CLAUDE.md`) | 306 |
| CSS guides | 2 (`css/CLAUDE.md`, `ai-reference.md`) | 1,026 |
| Consumer guide | 1 (`consumer-claude-md-snippet.md`) | 95 |
| Architecture docs | 3 (philosophy, authoring, deviations) | 1,006 |
| Component docs | 67 component docs + index in `docs/components/` | ~5,200 |
| Setup/workspace docs | 5 (react-setup, workspace-structure, etc.) | ~830 |
| **Total** | **~82 files** | **~8,400** |
