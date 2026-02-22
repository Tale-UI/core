# Design System

> **AI code generation reference:** See [docs/ai-reference.md](docs/ai-reference.md) for the complete class/token enumeration, valid shade numbers, and responsive coverage matrix.
> **Framework integration:** See [docs/framework-integration.md](docs/framework-integration.md) for Tailwind, shadcn/ui, Next.js, Vite, and PostCSS setup — including the `62.5%` font-size coexistence issue.

A modular, token-based CSS design system. Framework-agnostic, no build tools required.

## Project Structure

```
src/
├── index.css              # Entry point — imports all modules in order
├── tokens/                # CSS custom properties (design tokens)
│   ├── _base.css          # HTML reset (62.5%), screen constraints, --background
│   ├── _spacing.css       # --space-4xs..4xl, --section-space-xs..xl (fluid clamp)
│   ├── _typography.css    # --text-xs..8xl, font system tokens, grid-auto tokens
│   ├── _colors.css        # Brand, 16 color families × 11 shades, semantic (error/warning/success)
│   ├── _neutrals.css      # 6 neutral families × 25+ shades, --neutral-default-* mappings
│   └── _effects.css       # --radius-*, --shadow-* tokens
├── foundations/            # Typography classes and base elements
│   ├── _typography.css    # .text--display/heading/title/label/body/mono, .h1-.h6, h1-h6 elements
│   ├── _text-utilities.css # Alignment, transform, weight, style, decoration, wrapping
│   └── _base-elements.css # Focus, paragraph, body defaults
├── layout/                # Structural layout systems (each includes responsive variants)
│   ├── _gap.css           # .gap--, .col-gap--, .row-gap-- (double-selector specificity)
│   ├── _grid.css          # .grid--1..12, ratio grids, auto-fit, col/row span, alternates
│   ├── _flex.css          # .flex--row/col/reverse, .flex--wrap, .flex--grow
│   └── _centering.css     # .center--all/x/y/left/right/top/bottom (double-selector)
├── utilities/             # Visual and behavioral utilities
│   ├── _display.css       # .display--, .visibility--, .sr-only + responsive variants
│   ├── _visual.css        # .radius--, .shadow--, .aspect--, .object-fit--, .line-clamp--, .opacity--
│   ├── _position.css      # .z--, .relative, .sticky
│   ├── _sizing.css        # .width--10..100/auto, .height--25..100/auto
│   ├── _border.css        # .border, .border-top/right/bottom/left, .divider-top/bottom
│   └── _spacing.css       # .padding--xs..xl (section padding)
└── themes/                # Color theming and dark mode
    ├── _neutral-themes.css # .neutral-cool/slate/gray/onyx/mono/warm
    ├── _color-themes.css   # .color-red/orange/amber/.../rose (overrides --brand-*)
    └── _color-modes.css    # data-color-mode dark/light, reduced-motion

docs/                      # Documentation
├── documentation.html     # Interactive visual documentation
└── README.md              # Original framework documentation

reference/                 # Reference implementations
└── automatic.css          # AutomaticCSS v4 reference

custom_style/              # DEPRECATED — original monolithic file (backup only)
└── style.css
```

## Import Order (Critical)

In `src/index.css`, modules are imported in this exact order:

1. **Tokens** — Variables must be defined before use
2. **Foundations** — Typography classes and base elements
3. **Layout** — Gap, grid, flex, centering
4. **Utilities** — Display, visual, position, sizing, border, spacing
5. **Themes** — Last, so color overrides cascade correctly

When adding a new module, place its `@import` in the correct layer.

## Naming Conventions

### Utility Classes: `.{block}--{modifier}`

```css
.text--display-l    /* block: text, modifier: display-l */
.gap--xl            /* block: gap, modifier: xl */
.grid--auto-3       /* block: grid, modifier: auto-3 */
.center--all        /* block: center, modifier: all */
.display--none      /* block: display, modifier: none */
.radius--m          /* block: radius, modifier: m */
```

- Double-dash `--` separates block from modifier
- Single dash `-` for compound words within block or modifier
- Sizing scale: `xs`, `s`, `m`, `l`, `xl`, `2xl` (plus `3xl`/`4xl` for spacing)

### Responsive Variants: `.{block}--{breakpoint}-{modifier}`

```css
.gap--xl-m          /* gap xl-size at xl breakpoint */
.grid--l-2          /* 2-column grid at l breakpoint */
.flex--col-m        /* flex column at m breakpoint */
.text--center-s     /* text center at s breakpoint */
.display--none-xl   /* display none at xl breakpoint */
```

### Theme Classes: `.{type}-{name}`

```css
.color-red          /* single dash, no -- */
.neutral-cool       /* single dash, no -- */
```

### Component Classes (when building): BEM

```css
.card               /* block */
.card__title        /* element */
.card__title--large /* modifier */
```

## Responsive System

### Breakpoints

| Suffix | Media Query | Use Case |
|--------|------------|----------|
| `-xl` | `max-width: 1600px` | Large desktop |
| `-l` | `max-width: 992px` | Desktop/tablet landscape |
| `-m` | `max-width: 768px` | Tablet portrait |
| `-s` | `max-width: 480px` | Mobile |

Min-width mirrors exist for `.grid--alternate-{bp}` patterns only.

### Which utilities have responsive variants

- **Gap** — all sizes (`gap--`, `col-gap--`, `row-gap--`)
- **Grid** — column counts, row counts, spans, starts, ends, order, alternates
- **Centering** — all directions
- **Flex** — direction, wrap
- **Text alignment** — left, center, right
- **Display/visibility** — all display modes + visibility

### Adding responsive variants to a module

Each module contains its own `@media` queries at the bottom:

```css
/* Base */
.gap--m.gap--m {
    gap: var(--space-m);
    --row-gap: var(--space-m);
    --col-gap: var(--space-m);
    --grid-gap: var(--space-m);
}

/* Responsive */
@media (max-width: 1600px) {
    .gap--xl-m.gap--xl-m {
        gap: var(--space-m);
        --row-gap: var(--space-m);
        --col-gap: var(--space-m);
        --grid-gap: var(--space-m);
    }
}
@media (max-width: 992px) {
    .gap--l-m.gap--l-m { /* ... */ }
}
@media (max-width: 768px) {
    .gap--m-m.gap--m-m { /* ... */ }
}
@media (max-width: 480px) {
    .gap--s-m.gap--s-m { /* ... */ }
}
```

## Specificity Patterns

### Double-Selector: `.class.class`

Used for **gap** and **centering** utilities to reliably override other layout properties:

```css
.gap--m.gap--m { gap: var(--space-m); }
.center--all.center--all { display: flex; align-items: center; justify-content: center; }
```

**When to use:** Layout utilities that must override conflicting properties from grid/flex containers.

### Single Selector

Used for everything else (display, visual, text, etc.):

```css
.display--none { display: none; }
.radius--m { border-radius: var(--radius-m); }
```

### `!important`

Used sparingly:
- `.sr-only` (must override everything for accessibility)
- `.grid--N` uses `display: grid !important` (intentional override)

## Design Token System

### Spacing

All spacing uses fluid `clamp()` scaling between `--min-screen-width` (480px) and `--max-screen-width` (1600px):

- **General:** `--space-4xs` through `--space-4xl` (11 steps)
- **Section:** `--section-space-xs` through `--section-space-xl` (5 steps, larger scale)

### Typography

Six typography categories, each with font-family, size, weight, line-height, letter-spacing tokens:

| Category | Sizes | Use |
|----------|-------|-----|
| `display` | l, m, s | Hero headings, page titles |
| `heading` | l, m, s | Section headings |
| `title` | l, m, s | Card titles, sub-sections |
| `label` | l, m, s, xs | UI labels, navigation |
| `body` (`text`) | l, m, s, xs | Body text, paragraphs |
| `mono` | l, m, s, xs | Code, technical content |

Fonts: **Geist** (display + body), **Roboto Mono** (code).

### Color System

**16 named color families** with 11 shades each (5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100):
red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, indigo, violet, purple, fuchsia, pink, rose

**Semantic colors:** `--error-*`, `--warning-*`, `--success-*`

**Brand colors:** `--brand-5` through `--brand-100` (default teal, overridable via `.color-*` classes)

**Shade guidelines:**
- 5–30: Light backgrounds, subtle surfaces
- 40–60: Primary actions, interactive elements — `color-60` is the BASE/primary shade
- 70–100: Dark fills, text, strong contrast

**Named and semantic colour contrast pairing** (applies to all colour families including `--error-*`, `--warning-*`, `--success-*`):
- The `-60` shade is the switch point. Shades **below 60** are light — pair with `-100` for text/icons. Shades **above 60** are dark — pair with `-5` for text/icons.
- `-50` and `-70` are edge shades: typically fail WCAG 4.5:1 AA for normal text but pass for large text (18px+) and decorative use (3:1). Do not use them for body text.
- `-60` meets 4.5:1 with one palette end — which end depends on hue, verify per family.

**Text contrast rule:** Text must never be lighter than `--neutral-50`. Ideally use `--neutral-60` or darker for all text content. Use `--neutral-60` for secondary/muted text; `--neutral-70`–`--neutral-90` for body and heading text.

### Neutral System

6 tone families, each with 25+ shades (5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100):

- `neutral-warm` (default)
- `neutral-cool`, `neutral-slate`, `neutral-gray`, `neutral-onyx`, `neutral-mono`

**Always use `--neutral-*` tokens** (not `--neutral-warm-*` etc.) so components adapt to the active neutral family:

```css
/* Good — adapts to any neutral family */
background: var(--neutral-14);
color: var(--neutral-90);

/* Bad — locked to one family */
background: var(--neutral-warm-14);
```

### Effects

- **Radius:** `--radius-none`, `--radius-xs`, `--radius-s`, `--radius-m`, `--radius-l`, `--radius-xl`, `--radius-2xl`, `--radius-full`
- **Shadows:** `--shadow-xs`, `--shadow-s`, `--shadow-m`, `--shadow-l`, `--shadow-xl`

## Dark Mode

### How it works

Set `data-color-mode` on `<html>`:

```html
<html data-color-mode="dark">  <!-- or "light" -->
```

### Auto-inversion

When dark mode is active, the neutral scale inverts automatically:
- `--neutral-10` (lightest in light mode) → maps to `--neutral-default-100` (darkest)
- `--neutral-90` (darkest in light mode) → maps to `--neutral-default-20` (lightest)

Brand colors (`--color-*`) also invert.

**This means any component using `--neutral-*` and `--color-*` tokens automatically works in both modes.** No separate dark mode CSS needed.

### JavaScript toggle

```javascript
// Toggle
const current = document.documentElement.getAttribute('data-color-mode');
document.documentElement.setAttribute('data-color-mode', current === 'dark' ? 'light' : 'dark');

// Persist
localStorage.setItem('color-mode', mode);

// Restore on load
const saved = localStorage.getItem('color-mode');
if (saved) document.documentElement.setAttribute('data-color-mode', saved);
```

## How to Add New Utilities

1. **Choose the correct module** based on what it does (layout → `src/layout/`, visual → `src/utilities/`, etc.)

2. **Follow naming conventions:** `.{block}--{modifier}`

3. **Use design tokens** instead of hardcoded values:
   ```css
   /* Good */
   .card { border-radius: var(--radius-m); box-shadow: var(--shadow-s); }
   /* Bad */
   .card { border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
   ```

4. **Add responsive variants** if the utility should respond to screen size — append `@media` blocks at the bottom of the module file

5. **Use double-selector** only for layout utilities that need to override flex/grid properties

6. **Do not add** utilities to `src/index.css` — it only contains `@import` statements. Add utilities to the appropriate module file.

## How to Build Components

Components live in the consuming project, not in this design system. Build them by composing utilities + custom CSS with tokens.

### Example: Card

```html
<div class="card radius--m shadow--s">
    <img class="card__image aspect--16-9 object-fit--cover" src="..." alt="..." />
    <div class="card__body">
        <h3 class="card__title text--title-l">Title</h3>
        <p class="card__description text--body-m">Description text...</p>
    </div>
</div>
```

```css
.card {
    background: var(--neutral-14);
    border: 1px solid var(--neutral-24);
    overflow: hidden;
}
.card__body {
    padding: var(--space-m);
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
}
.card__title { color: var(--neutral-90); margin: 0; }
.card__description { color: var(--neutral-70); margin: 0; }
```

### Principles

- Use **BEM** for component internals (`.block__element--modifier`)
- Reference **design tokens** for all spacing, colors, effects
- Compose with **utility classes** for layout (grid, flex, gap, radius, shadow)
- Use `--color-*` (not `--brand-*`) for all accent/primary colour in components

  > **Rule: `--brand-*` is palette-only.** It belongs only in `:root` overrides and `.color-{name}` class definitions — never in component or UI CSS. `--brand-*` does **not** invert in dark mode; `--color-*` does.
- Use `--neutral-*` (not `--neutral-warm-*` etc.) so components adapt to the active neutral family and dark mode
- Keep component CSS minimal — leverage the utility layer

## Bricks Builder Integration

Some classes include Bricks Builder selectors (`.bricks-is-frontend`). These are in `src/foundations/_typography.css` and `src/foundations/_base-elements.css`. They're harmless in non-Bricks environments.

## Usage

### Direct import (development)

```html
<link rel="stylesheet" href="path/to/design-system/packages/css/src/index.css" />
```

Modern browsers resolve `@import` natively. No build step needed.

### Bundled (production)

For production, bundle with any CSS tool (PostCSS, Lightning CSS, or simple concatenation) to resolve `@import` statements and output a single file to `dist/style.css`.

### Required fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet" />
```
