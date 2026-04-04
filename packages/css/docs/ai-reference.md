# Design System — AI Reference

This document enumerates every valid class name, token, and value in the design system.
Read this before generating any code that uses this design system.
Source of truth: the CSS files in `src/`. This reference is derived directly from them.

> **Framework coexistence:** This design system sets `html { font-size: 62.5% }` (1rem = 10px). This conflicts with Tailwind CSS, shadcn/ui, and other frameworks that assume 1rem = 16px. See [framework-integration.md](framework-integration.md) for the workaround and token mapping guide.

> **Distribution:** Use `dist/style.css` (pre-bundled, single file) for build-tool environments. Use `src/index.css` for native browser `@import` or PostCSS with `postcss-import`.

---

## CRITICAL RULES

### Naming conventions

- Utility classes use **DOUBLE dash:** `.gap--m`, `.grid--3`, `.display--none`, `.radius--m`
- Theme classes use **SINGLE dash:** `.color-red`, `.neutral-cool`
- There is NO class like `.color--red` (double dash) — this is a common error

### Specificity patterns

- `.gap--*`, `.col-gap--*`, `.row-gap--*`, and `.center--*` classes ONLY use **double-selector**: `.gap--m.gap--m { }` in source CSS
- ALL other classes use single selector: `.display--none { }`
- Do NOT apply double-selector to opacity, radius, shadow, flex, grid, display, etc.
- When writing HTML you always write the class once: `class="gap--m"` — the double-selector is only in the CSS source

### Shade numbers — do not guess, use only these exact values

**Neutral shades** (`--neutral-*`):
```
5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100
```
`--neutral-15` DOES NOT EXIST. `--neutral-25` DOES NOT EXIST. `--neutral-35` DOES NOT EXIST.

**Color/brand shades** (`--brand-*`, `--red-*`, `--color-*`, semantic colors):
```
5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
```
`--brand-55` DOES NOT EXIST. `--red-15` DOES NOT EXIST.

### Responsive coverage at a glance

**HAVE** responsive variants (append `-xl`, `-l`, `-m`, `-s`):
`gap--` · `col-gap--` · `row-gap--` · `grid--` · `grid-rows--` · `col-span--` · `row-span--` · `col-start--` · `col-end--` · `row-start--` · `row-end--` · `order--first/last` · `flex--` (direction only) · `center--` · `display--` · `visibility--` · `text--` (alignment only: left/center/right)

**DO NOT HAVE** responsive variants:
`opacity--` · `aspect--` · `object-fit--` · `line-clamp--` · `radius--` · `shadow--` · `border` · `divider` · `padding--` · `z--` · `relative` · `sticky` · `width--` · `height--` · `flex--wrap` · `flex--grow` · `text--justify` · text transform/weight/style/decoration/wrapping

### Text contrast

- Text must **never** be lighter than `--neutral-50` — this is the absolute minimum
- Use `--neutral-60` or darker for text; `--neutral-60` is the ideal minimum for readable text
- Body/heading text: `--neutral-70` through `--neutral-90`; secondary/muted text: `--neutral-60`

### Named and semantic colour contrast

Applies to all named colour families (`--red-*`, `--green-*`, etc.), semantic colours (`--error-*`, `--warning-*`, `--success-*`), and brand/color alias tokens (`--color-*`).

The `-60` shade is the BASE — the primary shade and the contrast switch point for each family.

**Contrast pairing (light mode):**

| Shade range | Background type | Text/icon contrast pair |
|---|---|---|
| `*-5` → `*-50` | Light | `*-100` |
| `*-60` | Switch point | `*-5` or `*-100` (hue-dependent — check per family) |
| `*-70` → `*-100` | Dark | `*-5` |

**Edge shades:**

- `*-50` and `*-70` typically **fail 4.5:1 AA** for normal-size text — do not use for body copy
- `*-50` and `*-70` generally **pass 3:1** — safe for large text (18px+ / 14px bold) and decorative elements

### Foreground tokens (`*-fg`)

Every color and neutral shade has a paired `-fg` token that resolves to the appropriate contrasting shade for text/icons when that shade is used as a background.

**Color:** `--color-5-fg` through `--color-100-fg`
**Neutral:** `--neutral-5-fg` through `--neutral-100-fg` (all 27 shades)
**Semantic:** `--error-5-fg` through `--error-100-fg` · `--warning-5-fg` through `--warning-100-fg` · `--success-5-fg` through `--success-100-fg`

| Family | Pivot | Shades → `*-100` (dark text) | Shades → `*-5` (light text) |
|---|---|---|---|
| `--color-*` | 60 | 5–50 | 60–100 |
| `--neutral-*` | 60 | 5–50 | 60–100 |
| `--error-*` | 60 | 5–50 | 60–100 |
| `--warning-*` | 70 | 5–60 | 70–100 |
| `--success-*` | 70 | 5–60 | 70–100 |

**Usage:**
```css
.my-badge {
  background: var(--color-60);
  color: var(--color-60-fg);    /* resolves to --color-5 */
}
.my-surface {
  background: var(--neutral-14);
  color: var(--neutral-14-fg);  /* resolves to --neutral-100 */
}
.alert {
  background: var(--warning-10);
  color: var(--warning-10-fg);  /* resolves to --warning-100 */
}
```

**Dark mode:** No overrides needed for `--color-*-fg` / `--neutral-*-fg` — they reference inverting aliases. Semantic (`--error-*`, `--warning-*`, `--success-*`) tokens are static and do not invert — this is intentional: semantic states should stay visually consistent across modes.

**Theme classes:** Works automatically with `.color-{name}` and `.neutral-{family}` — the `-fg` tokens follow whatever palette is active.

**Per-family pivot overrides:** Some lighter color families need dark foreground on shade 60 or 70 (where the default gives light foreground). These overrides are built into the `.color-{name}` theme classes:

| Family | `--color-60-fg` override | `--color-70-fg` override |
|---|---|---|
| orange, sky | `var(--color-100)` | — (default) |
| amber, yellow, lime, green, emerald, teal, cyan | `var(--color-100)` | `var(--color-100)` |
| red, indigo, violet, purple, fuchsia, pink, rose | — (default) | — (default) |

Consumers don't need to worry about this — applying `.color-yellow` (for example) automatically adjusts `--color-60-fg` and `--color-70-fg` so contrast is correct.

### Color theming

- `.color-red` remaps ALL `--brand-*` tokens (5–100) to red shades — does NOT affect `--red-*` tokens directly
- In dark mode, `--color-*` tokens invert: `--color-5` → brand-100 equivalent, `--color-60` → brand-40 equivalent
- Always use `--neutral-*` (not `--neutral-warm-*` or `--neutral-cool-*`) for theme-adaptive components
- **Never use `--brand-*` tokens in component or UI CSS** — they are the raw palette and do NOT invert in dark mode. Use `--color-*` instead. Rule: `--brand-*` is only for theme definitions (inside `.color-{name}` classes or overriding at `:root`); `--color-*` is for all UI and component usage.

---

## 1. Design Tokens

### 1.1 Spacing

All spacing uses fluid `clamp()` scaling between 480px and 1600px viewport width.

**General spacing — `--space-*`**

| Token | ~Min (480px) | ~Max (1600px) |
|---|---|---|
| `--space-4xs` | 0.49rem | 0.52rem |
| `--space-3xs` | 0.66rem | 0.70rem |
| `--space-2xs` | 0.82rem | 0.99rem |
| `--space-xs` | 1.02rem | 1.40rem |
| `--space-s` | 1.28rem | 1.98rem |
| `--space-m` | 1.60rem | 2.80rem |
| `--space-l` | 2.00rem | 3.96rem |
| `--space-xl` | 2.50rem | 5.60rem |
| `--space-2xl` | 3.13rem | 7.92rem |
| `--space-3xl` | 3.91rem | 11.19rem |
| `--space-4xl` | 4.88rem | 15.83rem |

NOTE: `--space-3xl` and `--space-4xl` exist as tokens but have **no gap utility class**. Gap classes stop at `2xl`. Use these tokens directly in custom component CSS.

**Section spacing — `--section-space-*`** (larger scale for vertical page rhythm)

| Token | ~Min (480px) | ~Max (1600px) |
|---|---|---|
| `--section-space-xs` | 2.00rem | 3.96rem |
| `--section-space-s` | 3.13rem | 7.92rem |
| `--section-space-m` | 3.91rem | 11.19rem |
| `--section-space-l` | 4.88rem | 15.83rem |
| `--section-space-xl` | 6.10rem | 22.37rem |

Used by `.padding--*` utility classes.

---

### 1.2 Typography

**Font-size scale — `--text-*`**

`--text-xs`, `--text-s`, `--text-m`, `--text-l`, `--text-xl`, `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-6xl`, `--text-7xl`, `--text-8xl`

**Category-to-size mapping**

| Category | Size | Font-size token | HTML element |
|---|---|---|---|
| display-l | — | `--text-7xl` | — |
| display-m | — | `--text-6xl` | `h1` |
| display-s | — | `--text-5xl` | `h2` |
| heading-l | — | `--text-4xl` | `h3` |
| heading-m | — | `--text-3xl` | `h4` |
| heading-s | — | `--text-2xl` | — |
| title-l | — | `calc(--text-xl * 1.1)` | `h5` |
| title-m | — | `--text-xl` | `h6` |
| title-s | — | `calc(--text-l * 1.1)` | — |
| label-l | — | `--text-l` | — |
| label-m | — | `--text-m` | — |
| label-s | — | `--text-s` | — |
| label-xs | — | `--text-xs` | — |
| body-l | — | `--text-l` | — |
| body-m | — | `--text-m` | `body` |
| body-s | — | `--text-s` | — |
| body-xs | — | `--text-xs` | — |
| mono-l | — | `--text-l` | — |
| mono-m | — | `--text-m` | — |
| mono-s | — | `--text-xs` | — |
| mono-xs | — | `--text-2xs` | — |

**Other typography tokens**

Font families: `--display-font-family`, `--heading-font-family`, `--title-font-family`, `--label-font-family`, `--text-font-family`, `--mono-font-family`

Font weights: `--display-font-weight` (600), `--heading-font-weight` (600), `--title-font-weight` (600), `--label-font-weight` (500), `--text-font-weight` (400), `--mono-font-weight` (400)

Colors: `--display-color`, `--text-color`, `--mono-color` (all default to `--neutral-90`)

Line heights: `--display-line-height`, `--heading-line-height`, etc. (all 1.5)

---

### 1.3 Colors

**Brand tokens** (default: teal; overridable via `.color-*` classes)

Valid shades: `5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100`

`--brand-5` `--brand-10` `--brand-20` `--brand-30` `--brand-40` `--brand-50` `--brand-60` `--brand-70` `--brand-80` `--brand-90` `--brand-100`

**Color alias tokens** (mode-aware — invert in dark mode)

`--color-5` `--color-10` `--color-20` `--color-30` `--color-40` `--color-50` `--color-60` `--color-70` `--color-80` `--color-90` `--color-100`

In light mode: `--color-60` = `--brand-60`. In dark mode: `--color-60` = `--brand-40` (inverted).

**16 named color families** — each has shades `5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100`

`red` · `orange` · `amber` · `yellow` · `lime` · `green` · `emerald` · `teal` · `cyan` · `sky` · `indigo` · `violet` · `purple` · `fuchsia` · `pink` · `rose`

Pattern: `--{color}-{shade}` — e.g. `--red-60`, `--emerald-20`, `--violet-90`, `--rose-5`

**Semantic colors** — same shades `5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100`

`--error-5` through `--error-100` · `--warning-5` through `--warning-100` · `--success-5` through `--success-100`

**Single-value aliases** (all resolve to the -60 shade)

`--primary` (= `--color-60`) · `--red` (= `--red-60`) · `--orange` · `--amber` · `--yellow` · `--lime` · `--green` · `--emerald` · `--teal` · `--cyan` · `--sky` · `--indigo` · `--violet` · `--purple` · `--fuchsia` · `--pink` · `--rose` · `--error` · `--warning` · `--success`

---

### 1.4 Neutrals

**Always use `--neutral-*` tokens in component CSS** — never `--neutral-warm-*` or `--neutral-cool-*` etc. The `--neutral-*` tokens automatically remap when a neutral theme class is applied or dark mode is active.

**Valid neutral shades — exact list:**
```
5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100
```

**Shade usage guidelines**

| Range | Typical use |
|---|---|
| 5–30 | Backgrounds, subtle surfaces, light borders |
| 40–60 | Borders, interactive states, midtones |
| 70–100 | Text, strong contrast, dark fills |

**Text contrast rule:** Text must never be lighter than `--neutral-50`. Ideally use `--neutral-60` or darker for text content. Shades below 50 lack sufficient contrast against light backgrounds and fail accessibility guidelines. Use `--neutral-60` as the default for secondary/muted text; `--neutral-70`–`--neutral-90` for body and heading text.

**6 neutral family tokens** (for theme definitions only, not component CSS):

`--neutral-warm-*` · `--neutral-cool-*` · `--neutral-slate-*` · `--neutral-gray-*` · `--neutral-onyx-*` · `--neutral-mono-*`

Each family has the same 27 shade values listed above.

---

### 1.5 Effects

**Radius tokens**

`--radius-none` (0) · `--radius-xs` (0.5rem) · `--radius-s` (0.75rem) · `--radius-m` (1rem) · `--radius-l` (1.5rem) · `--radius-xl` (2rem) · `--radius-2xl` (3rem) · `--radius-full` (9999px)

**Shadow tokens**

`--shadow-xs` · `--shadow-s` · `--shadow-m` · `--shadow-l` · `--shadow-xl`

**Scrim tokens**

`--scrim-subtle` (24% `--neutral-default-100`) · `--scrim` (48% `--neutral-default-100`) · `--scrim-strong` (72% `--neutral-default-100`)

---

### 1.6 Category Tokens

Category tokens sit between the semantic tokens and the component grouped selectors. They let consumers retheme entire component families by overriding a single CSS custom property on `:root`. All 43 tokens are defined in `packages/styles/src/_primitives.css`.

**Field controls** — `--field-*` (Groups 1, 2, 8, 9 in `_primitives.css`)

Covers: Input, Select trigger, Combobox, Autocomplete, SearchField, TextField, DateField, TimeField, PaymentInput inputs, plus labels, descriptions, and errors across 12+ components.

| Token | Default |
|---|---|
| `--field-min-height` | `3.6rem` |
| `--field-padding-block` | `var(--space-3xs)` |
| `--field-padding-inline` | `var(--space-xs)` |
| `--field-border-color` | `var(--neutral-26)` |
| `--field-radius` | `var(--radius-m)` |
| `--field-bg` | `var(--neutral-5)` |
| `--field-color` | `var(--neutral-90)` |
| `--field-font-family` | `var(--text-font-family)` |
| `--field-font-size` | `var(--text-m-font-size)` |
| `--field-focus-border` | `var(--focus-ring-color)` |
| `--field-focus-glow` | `0 0 0 3px var(--focus-ring-glow)` |
| `--field-placeholder-color` | `var(--neutral-50)` |
| `--field-label-color` | `var(--neutral-70)` |
| `--field-label-font-size` | `var(--label-s-font-size)` |
| `--field-label-font-weight` | `var(--label-font-weight)` |
| `--field-description-color` | `var(--neutral-60)` |
| `--field-error-color` | `var(--red-60)` |

**Dropdown popups & items** — `--popup-*` and `--item-*` (Groups 3, 4, 5)

Covers: Select, Combobox, Autocomplete, Menu, ContextMenu, Popover popups and all item variants.

| Token | Default |
|---|---|
| `--popup-bg` | `var(--neutral-10)` |
| `--popup-border-color` | `var(--neutral-20)` |
| `--popup-radius` | `var(--radius-l)` |
| `--popup-shadow` | `var(--shadow-m)` |
| `--item-padding-block` | `var(--space-2xs)` |
| `--item-padding-inline` | `var(--space-xs)` |
| `--item-gap` | `var(--space-2xs)` |
| `--item-radius` | `var(--radius-m)` |
| `--item-color` | `var(--neutral-80)` |
| `--item-font-size` | `var(--text-m-font-size)` |
| `--item-focus-bg` | `var(--neutral-14)` |
| `--item-focus-color` | `var(--neutral-90)` |
| `--group-label-color` | `var(--neutral-50)` |
| `--group-label-font-size` | `var(--label-s-font-size)` |

**Modals** — `--modal-*` (Group 17)

Covers: AlertDialog, Dialog, Drawer (title, description, backdrop, actions).

| Token | Default |
|---|---|
| `--modal-title-color` | `var(--neutral-94)` |
| `--modal-title-font-size` | `var(--label-l-font-size)` |
| `--modal-description-color` | `var(--neutral-70)` |
| `--modal-description-font-size` | `var(--text-m-font-size)` |
| `--modal-backdrop-bg` | `var(--scrim)` |
| `--modal-actions-gap` | `var(--space-xs)` |

**Progress / Meter** — `--progress-*` (Group 18)

Covers: ProgressBar, Meter (track, indicator, label, value).

| Token | Default |
|---|---|
| `--progress-track-height` | `0.8rem` |
| `--progress-track-bg` | `var(--neutral-24)` |
| `--progress-track-radius` | `var(--radius-full)` |
| `--progress-indicator-bg` | `var(--neutral-24-fg)` |
| `--progress-label-color` | `var(--neutral-80)` |
| `--progress-value-color` | `var(--neutral-60)` |

**Usage example** — override a whole component family at once:

```css
:root {
  /* Make all form fields use a warmer off-white background */
  --field-bg: var(--neutral-10);
  --field-border-color: var(--neutral-20);

  /* Square corners on all dropdown popups */
  --popup-radius: var(--radius-s);

  /* Tighter progress bars */
  --progress-track-height: 0.4rem;
}
```

---

## 2. Class Enumeration by Module

### 2.1 Typography Classes

**Text role classes** (foundations/_typography.css)

```
.text--display-l  .text--display-m  .text--display-s
.text--heading-l  .text--heading-m  .text--heading-s
.text--title-l    .text--title-m    .text--title-s
.text--label-l    .text--label-m    .text--label-s    .text--label-xs
.text--body-l     .text--body-m     .text--body-s     .text--body-xs
.text--mono-l     .text--mono-m     .text--mono-s     .text--mono-xs
```

**HTML element defaults** (applied automatically, no class needed):

- `h1` → display-m, `h2` → display-s, `h3` → heading-l, `h4` → heading-m, `h5` → title-l, `h6` → title-m
- `body` → body-m

**Text utility classes** (foundations/_text-utilities.css)

Alignment — HAS responsive variants (`-xl`, `-l`, `-m`, `-s`):
```
.text--left   .text--center   .text--right   .text--justify
```
Responsive: `.text--left-xl` `.text--center-xl` `.text--right-xl` (and `-l`, `-m`, `-s`)
NOTE: `.text--justify` has NO responsive variants.

Transform — NO responsive variants:
```
.text--uppercase   .text--lowercase   .text--capitalize
```

Font weight — NO responsive variants:
```
.text--100  .text--200  .text--300  .text--400  .text--500
.text--600  .text--700  .text--800  .text--900  .text--bold
```

Font style — NO responsive variants:
```
.text--italic   .text--oblique
```

Decoration — NO responsive variants:
```
.text--underline        .text--line-through       .text--overline
.text--decoration-none  .text--underline-wavy
.text--underline-dotted .text--underline-dashed
```

Wrapping — NO responsive variants:
```
.text--pretty   .text--balance   .text--nowrap
```

---

### 2.2 Gap Classes

Source: `src/layout/_gap.css`

**All gap classes use DOUBLE-SELECTOR specificity** in the CSS source. In HTML, write the class once normally.

**`.gap--*`** (sets row + column gap simultaneously)

Valid sizes: `4xs, 3xs, 2xs, xs, s, m, l, xl, 2xl`
```
.gap--4xs  .gap--3xs  .gap--2xs  .gap--xs  .gap--s
.gap--m    .gap--l    .gap--xl   .gap--2xl
```

Special: `.gap--none` — sets gap to 0. NOTE: This class is defined inside `@media (max-width: 480px)` in the source, so it only applies at ≤480px viewport width.

**`.col-gap--*`** (column gap only)

Valid sizes: `xs, s, m, l, xl, 2xl` (no 4xs/3xs/2xs variants)
```
.col-gap--xs  .col-gap--s  .col-gap--m  .col-gap--l  .col-gap--xl  .col-gap--2xl
```

**`.row-gap--*`** (row gap only)

Valid sizes: `xs, s, m, l, xl, 2xl` (no 4xs/3xs/2xs variants)
```
.row-gap--xs  .row-gap--s  .row-gap--m  .row-gap--l  .row-gap--xl  .row-gap--2xl
```

**Responsive gap variants** — format: `.{gap-type}--{breakpoint}-{size}`

All three gap types × 4 breakpoints × sizes xs/s/m/l/xl/2xl:
```
.gap--xl-xs   .gap--xl-s    .gap--xl-m    .gap--xl-l    .gap--xl-xl   .gap--xl-2xl
.gap--l-xs    .gap--l-s     .gap--l-m     .gap--l-l     .gap--l-xl    .gap--l-2xl
.gap--m-xs    .gap--m-s     .gap--m-m     .gap--m-l     .gap--m-xl    .gap--m-2xl
.gap--s-xs    .gap--s-s     .gap--s-m     .gap--s-l     .gap--s-xl    .gap--s-2xl

.col-gap--xl-xs  .col-gap--xl-s  .col-gap--xl-m  .col-gap--xl-l  .col-gap--xl-xl  .col-gap--xl-2xl
.col-gap--l-*    .col-gap--m-*   .col-gap--s-*   (same pattern)

.row-gap--xl-xs  .row-gap--xl-s  .row-gap--xl-m  .row-gap--xl-l  .row-gap--xl-xl  .row-gap--xl-2xl
.row-gap--l-*    .row-gap--m-*   .row-gap--s-*   (same pattern)
```
All responsive gap variants also use double-selector in source CSS.

---

### 2.3 Grid Classes

Source: `src/layout/_grid.css`

Grid classes use `display: grid !important`.

**Fixed column grids** (1–12 equal columns)
```
.grid--1  .grid--2  .grid--3  .grid--4  .grid--5  .grid--6
.grid--7  .grid--8  .grid--9  .grid--10 .grid--11 .grid--12
```
INVALID: `.grid--0`, `.grid--13` and above.

**Ratio grids** (2-column, unequal widths)
```
.grid--1-2  .grid--1-3  .grid--2-1  .grid--2-3  .grid--3-1  .grid--3-2
```

**Row definition**
```
.grid-rows--1  through  .grid-rows--12
```

**Auto-fit grids** (responsive, wraps based on container width and column count hint)
```
.grid--auto-2  .grid--auto-3  .grid--auto-4  .grid--auto-5  .grid--auto-6
.grid--auto-7  .grid--auto-8  .grid--auto-9  .grid--auto-10 .grid--auto-11 .grid--auto-12
```
Auto-fit ratio variants (override fixed column template):
```
.grid--auto-1-2  .grid--auto-1-3  .grid--auto-2-1
.grid--auto-2-3  .grid--auto-3-1  .grid--auto-3-2
```
Modifier: `.grid--auto-rows` (equalizes row heights using `grid-auto-rows: minmax(min-content, 1fr)`)

**Grid item placement** — all 1–12, NO higher values:
```
.col-span--1  through  .col-span--12   plus  .col-span--all  (span full width)
.row-span--1  through  .row-span--12
.col-start--1 through  .col-start--12
.col-end--1   through  .col-end--12    plus  .col-end--last  (grid-column-end: -1)
.row-start--1 through  .row-start--12
.row-end--1   through  .row-end--12
```

**Order**
```
.order--first   (order: -1)
.order--last    (order: 999)
```

**Responsive grid variants** — format: `.grid--{breakpoint}-{cols}` (1–12)
```
.grid--xl-1  through  .grid--xl-12
.grid--l-1   through  .grid--l-12
.grid--m-1   through  .grid--m-12
.grid--s-1   through  .grid--s-12
```

**Responsive row variants** — format: `.grid-rows--{breakpoint}-{rows}` (1–12)
```
.grid-rows--xl-1  through  .grid-rows--xl-12
.grid-rows--l-1   through  .grid-rows--l-12
.grid-rows--m-1   through  .grid-rows--m-12
.grid-rows--s-1   through  .grid-rows--s-12
```

**Responsive placement variants** — all breakpoints × values 1–12 (plus `all`/`last` where applicable)
```
.col-span--xl-{1-12}  .col-span--xl-all
.col-span--l-{1-12}   .col-span--l-all
.col-span--m-{1-12}   .col-span--m-all
.col-span--s-{1-12}   .col-span--s-all

.row-span--xl-{1-12}  .row-span--l-{1-12}   .row-span--m-{1-12}   .row-span--s-{1-12}
.col-start--xl-{1-12} .col-start--l-{1-12}  .col-start--m-{1-12}  .col-start--s-{1-12}
.col-end--xl-{1-12}   .col-end--xl-last
.col-end--l-{1-12}    .col-end--l-last
.col-end--m-{1-12}    .col-end--m-last
.col-end--s-{1-12}    .col-end--s-last
.row-start--xl-{1-12} .row-start--l-{1-12}  .row-start--m-{1-12}  .row-start--s-{1-12}
.row-end--xl-{1-12}   .row-end--l-{1-12}    .row-end--m-{1-12}    .row-end--s-{1-12}

.order--first-xl  .order--last-xl
.order--first-l   .order--last-l
.order--first-m   .order--last-m
.order--first-s   .order--last-s
```

**Alternating layouts** — use `min-width` breakpoints (opposite of other utilities)

Applied to a parent container; flips even-numbered child ratio grids (e.g. `.grid--1-2` becomes `.grid--2-1`):
```
.grid--alternate-s   (applies at min-width: 480px)
.grid--alternate-m   (applies at min-width: 768px)
.grid--alternate-l   (applies at min-width: 992px)
.grid--alternate-xl  (applies at min-width: 1600px)
```
Works with child grids: `.grid--2`, `.grid--1-2`, `.grid--1-3`, `.grid--2-1`, `.grid--2-3`, `.grid--3-1`, `.grid--3-2`

---

### 2.4 Flex Classes

Source: `src/layout/_flex.css`

**Base flex** — NO responsive variants for wrap/grow:
```
.flex--row          (display: flex; flex-direction: row)
.flex--col          (display: flex; flex-direction: column)
.flex--col-reverse  (display: flex; flex-direction: column-reverse)
.flex--row-reverse  (display: flex; flex-direction: row-reverse)
.flex--wrap         (flex-wrap: wrap) — NO responsive variants
.flex--grow         (applies flex-grow: 1 to direct children) — NO responsive variants
```

**Responsive flex direction** — format: `.flex--{direction}-{breakpoint}`
```
.flex--col-xl         .flex--row-xl         .flex--col-reverse-xl  .flex--row-reverse-xl
.flex--col-l          .flex--row-l          .flex--col-reverse-l   .flex--row-reverse-l
.flex--col-m          .flex--row-m          .flex--col-reverse-m   .flex--row-reverse-m
.flex--col-s          .flex--row-s          .flex--col-reverse-s   .flex--row-reverse-s
```
INVALID: `.flex--wrap-m`, `.flex--grow-l` (these do not exist)

---

### 2.5 Centering Classes

Source: `src/layout/_centering.css`

**All centering classes use DOUBLE-SELECTOR** in source CSS. Write the class once in HTML.

**Base centering** (7 directions):
```
.center--all     (flex column, all axes centered, text-align: center)
.center--x       (flex column, horizontally centered only)
.center--y       (flex column, vertically centered only)
.center--left    (flex column, vertically centered, left-aligned)
.center--right   (flex column, vertically centered, right-aligned)
.center--top     (flex column, top-aligned, horizontally centered)
.center--bottom  (flex column, bottom-aligned, horizontally centered)
```

**Responsive centering** — all 7 directions × 4 breakpoints:
```
.center--all-xl  .center--x-xl  .center--y-xl  .center--left-xl  .center--right-xl  .center--top-xl  .center--bottom-xl
.center--all-l   .center--x-l   .center--y-l   .center--left-l   .center--right-l   .center--top-l   .center--bottom-l
.center--all-m   .center--x-m   .center--y-m   .center--left-m   .center--right-m   .center--top-m   .center--bottom-m
.center--all-s   .center--x-s   .center--y-s   .center--left-s   .center--right-s   .center--top-s   .center--bottom-s
```
All responsive variants also use double-selector in source CSS.

---

### 2.6 Display and Visibility Classes

Source: `src/utilities/_display.css`

**Base display:**
```
.display--none         .display--block      .display--inline-block
.display--inline       .display--flex       .display--grid
.display--contents
.visibility--hidden    .visibility--visible
.sr-only  (screen reader only — uses !important, hides visually but accessible)
```

**Responsive display** — format: `.display--{value}-{breakpoint}`

Available at each breakpoint (`-xl`, `-l`, `-m`, `-s`):
```
.display--none-{bp}          .display--block-{bp}
.display--inline-block-{bp}  .display--flex-{bp}
.display--grid-{bp}          .display--contents-{bp}
.visibility--hidden-{bp}     .visibility--visible-{bp}
```
INVALID: `.display--inline-xl` — `.display--inline` has **no responsive variants**.

---

### 2.7 Visual Classes

Source: `src/utilities/_visual.css`

**None of these have responsive variants.**

**Radius:**
```
.radius--xs  .radius--s  .radius--m  .radius--l  .radius--xl  .radius--2xl  .radius--full
```
NOTE: There is **no `.radius--none` class**. Use inline style or custom CSS for zero radius.

**Shadow:**
```
.shadow--xs  .shadow--s  .shadow--m  .shadow--l  .shadow--xl
```

**Aspect ratio:**
```
.aspect--1-1   .aspect--2-1   .aspect--1-2   .aspect--3-2   .aspect--2-3
.aspect--4-3   .aspect--3-4   .aspect--16-9  .aspect--9-16  .aspect--21-9
```
On `img` and `video` elements, aspect ratio classes also set `object-fit: cover` and `width/height: 100%` automatically.

**Object-fit:**
```
.object-fit--cover    .object-fit--contain   .object-fit--fill    .object-fit--none
```
Object position modifiers (combine with an object-fit class):
```
.object-fit--top-left      .object-fit--top-center      .object-fit--top-right
.object-fit--center-left   .object-fit--center          .object-fit--center-right
.object-fit--bottom-left   .object-fit--bottom-center   .object-fit--bottom-right
```

**Line clamp (text truncation):**
```
.line-clamp--1  .line-clamp--2  .line-clamp--3  .line-clamp--4  .line-clamp--5
```
INVALID: `.line-clamp--6` and above.

**Opacity** — valid values are ONLY these 9:
```
.opacity--0    .opacity--5    .opacity--10   .opacity--25
.opacity--50   .opacity--75   .opacity--90   .opacity--95   .opacity--100
```
INVALID: `.opacity--20`, `.opacity--30`, `.opacity--40`, `.opacity--80`, `.opacity--50-m` (no responsive variants)

---

### 2.8 Position Classes

Source: `src/utilities/_position.css`

**No responsive variants.**

**Z-index scale:**
```
.z--bottom  (z-index: -1)
.z--0       .z--10  .z--20  .z--30  .z--40  .z--50  .z--60  .z--70  .z--80  .z--90
.z--top     (z-index: 9999)
```
INVALID: `.z--1`, `.z--5`, `.z--15`, `.z--100` (not defined)

**Position utilities:**
```
.relative   (position: relative)
.sticky     (position: sticky; top: var(--sticky-offset, 0))
```
For `.sticky`, set the top offset via a custom property: `style="--sticky-offset: 60px"`

---

### 2.9 Sizing Classes

Source: `src/utilities/_sizing.css`

**No responsive variants.**

**Width (percentage of parent):**
```
.width--10   .width--20   .width--25   .width--30   .width--33
.width--40   .width--50   .width--60   .width--66   .width--70
.width--75   .width--80   .width--90   .width--100  .width--auto
```
Notes: `.width--33` = 33.333%, `.width--66` = 66.666%
INVALID: `.width--15`, `.width--45`, `.width--55`, `.width--65`, `.width--85`, `.width--95`

**Height (min-height in viewport units):**
```
.height--25   (min-height: 25vh)
.height--50   (min-height: 50vh)
.height--75   (min-height: 75vh)
.height--100  (min-height: 100vh)
.height--auto (height: auto)
```
INVALID: `.height--33`, `.height--60`, `.height--80` (not defined)

---

### 2.10 Border and Divider Classes

Source: `src/utilities/_border.css`

**No responsive variants.**

**Border sides** — use SINGLE dash (not double):
```
.border         (all sides: 1px solid --neutral-30)
.border-top     .border-right    .border-bottom   .border-left
.border-block   (top + bottom)
.border-inline  (left + right)
```

**Border color modifiers** — use DOUBLE dash:
```
.border--light   (border-color: --neutral-20)
.border--dark    (border-color: --neutral-50)
.border--none    (border: none)
```

**Dividers** (border + padding):
```
.divider-top    (border-top + padding-top)
.divider-bottom (border-bottom + padding-bottom)
```
Custom properties for dividers:

- `--divider-size` (default: `1px`) — controls border thickness
- `--divider-gap` (default: `var(--space-m)`) — controls padding amount

---

### 2.11 Section Padding Classes

Source: `src/utilities/_spacing.css`

Applies `padding-block` (top + bottom) using section-space tokens.

**No responsive variants.**

```
.padding--xs   .padding--s   .padding--m   .padding--l   .padding--xl
```
INVALID: `.padding--2xl`, `.padding--3xs`, `.padding--none`, `.padding--4xs`

---

### 2.12 Theme Classes

**Color themes** — remap `--brand-*` tokens to a named color family.

Applied to a container; affects all `--brand-*` and `--color-*` usage inside:
```
.color-red      .color-orange   .color-amber    .color-yellow
.color-lime     .color-green    .color-emerald  .color-teal
.color-cyan     .color-sky      .color-indigo   .color-violet
.color-purple   .color-fuchsia  .color-pink     .color-rose
```
Use SINGLE dash. `.color-teal` is the default; applying it is redundant but valid.

**Neutral family themes** — remap `--neutral-*` tokens to a specific neutral tone.

Applied to a container; affects all `--neutral-*` usage inside:
```
.neutral-warm    (default warm-tinted neutrals)
.neutral-cool    (cool blue-tinted neutrals)
.neutral-slate   (slate-tinted neutrals)
.neutral-gray    (pure gray neutrals)
.neutral-onyx    (warm dark neutrals — good for dark sections)
.neutral-mono    (true monochrome neutrals)
```

**Choosing a neutral family:**

- `.neutral-warm` — editorial, lifestyle, warm brand tones (default)
- `.neutral-cool` or `.neutral-slate` — tech, corporate, professional UIs
- `.neutral-gray` — minimal, neutral-toned interfaces
- `.neutral-onyx` — high-contrast, bold dark sections
- `.neutral-mono` — pure black/white, maximum contrast

**Dark/light mode**

Set `data-color-mode` on the `<html>` element:
```html
<html data-color-mode="dark">   <!-- dark mode -->
<html data-color-mode="light">  <!-- explicit light mode -->
<html>                          <!-- no attribute = defaults to light -->
```
Utility classes for applying mode to any element (not just html):
```
.dark    (applies dark mode neutral/color inversion)
.light   (applies light mode neutral/color mapping)
```

**What dark mode does:**

- Neutral scale inverts: `--neutral-10` (lightest in light) → maps to darkest value
- Brand colors invert: `--color-5` → `--brand-100`, `--color-60` → `--brand-40`
- Any component using only `--neutral-*` and `--color-*` tokens works in both modes automatically

---

## 3. Responsive Coverage Matrix

| Module | Base | `-xl` | `-l` | `-m` | `-s` |
|---|---|---|---|---|---|
| `gap--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `col-gap--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `row-gap--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `grid--` (columns) | ✓ | ✓ | ✓ | ✓ | ✓ |
| `grid-rows--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `col-span--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `row-span--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `col-start--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `col-end--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `row-start--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `row-end--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `order--first/last` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `flex--` direction | ✓ | ✓ | ✓ | ✓ | ✓ |
| `flex--wrap` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `flex--grow` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `center--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `display--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `display--inline` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `visibility--` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `text--` alignment (left/center/right) | ✓ | ✓ | ✓ | ✓ | ✓ |
| `text--justify` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `text--` transform/weight/style/decoration/wrapping | ✓ | ✗ | ✗ | ✗ | ✗ |
| `opacity--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `radius--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `shadow--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `aspect--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `object-fit--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `line-clamp--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `border` / `divider` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `padding--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `z--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `relative` / `sticky` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `width--` | ✓ | ✗ | ✗ | ✗ | ✗ |
| `height--` | ✓ | ✗ | ✗ | ✗ | ✗ |

---

## 4. Common Composition Patterns

**Responsive card grid (3 cols → 2 → 1)**
```html
<div class="grid--3 grid--l-2 grid--m-1 gap--m gap--m-s">
```

**Hero section with centered content**
```html
<section class="center--all padding--xl">
```

**Sidebar (1/4) + content (3/4) layout that stacks on tablet**
```html
<div class="grid--1-3 gap--l flex--col-m">
```

**Responsive flex nav (row → column on mobile)**
```html
<nav class="flex--row flex--col-m gap--m gap--m-s">
```

**Responsive image with fixed aspect ratio**
```html
<img class="aspect--16-9 object-fit--cover radius--m" src="..." alt="..." />
```

**Sticky navigation**
```html
<nav class="sticky z--50" style="--sticky-offset: 0px">
```

**Neutral-adaptive card (works in light + dark mode automatically)**
```html
<div class="radius--m shadow--s">
```
```css
.card {
    background: var(--neutral-14);
    border: 1px solid var(--neutral-24);
    padding: var(--space-m);
    color: var(--neutral-90);
}
```

**Dark-themed section with specific neutral tone**
```html
<section data-color-mode="dark" class="neutral-onyx padding--xl">
```

**Red-branded section**
```html
<section class="color-red padding--l">
  <button style="background: var(--color-60); color: white;">Primary action</button>
</section>
```

**Alternating content/image rows**
```html
<div class="grid--alternate-l">
  <div class="grid--2-1 gap--l">
    <div>Content</div>
    <img class="aspect--4-3 object-fit--cover radius--m" src="..." alt="..." />
  </div>
  <div class="grid--2-1 gap--l">  <!-- visually becomes 1-2 on large screens -->
    <div>Content</div>
    <img class="aspect--4-3 object-fit--cover radius--m" src="..." alt="..." />
  </div>
</div>
```

**Grid item spanning full width**
```html
<div class="grid--3 gap--m">
  <div class="col-span--all">Full-width header</div>
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>
```

**Element visible only on desktop, hidden on mobile**
```html
<div class="display--none-m">Desktop only content</div>
```

**Typography hierarchy example**
```html
<h1 class="text--display-l">Hero Heading</h1>
<h2 class="text--heading-l">Section Title</h2>
<h3 class="text--title-m">Card Title</h3>
<p class="text--body-m">Body paragraph text</p>
<span class="text--label-s text--uppercase">Category Label</span>
<code class="text--mono-m">code snippet</code>
```

---

## 5. Common Mistakes Reference

| Wrong | Correct | Why |
|---|---|---|
| `.color--red` | `.color-red` | Theme classes use single dash |
| `.neutral--cool` | `.neutral-cool` | Theme classes use single dash |
| `--neutral-15` | `--neutral-14` or `--neutral-16` | 15 is not a valid neutral shade |
| `--neutral-25` | `--neutral-24` or `--neutral-26` | 25 is not a valid neutral shade |
| `--brand-55` | `--brand-50` or `--brand-60` | Brand shades are 10s only |
| `.col-span--13` | `.col-span--12` or `.col-span--all` | Max is 12, or use `all` |
| `.opacity--20` | `.opacity--25` | 20 is not a valid opacity value |
| `.opacity--50-m` | `.opacity--50` | opacity has no responsive variants |
| `.padding--2xl` | `.padding--xl` | Max section padding size is xl |
| `.radius--none` | `border-radius: 0` (inline/custom CSS) | No `.radius--none` class exists |
| `--neutral-warm-14` | `--neutral-14` | Use default neutral tokens, not family-specific |
| `var(--brand-60)` in UI CSS | `var(--color-60)` | `--brand-*` is the raw palette — it does not invert in dark mode; `--color-*` is the mode-aware alias |
| `.flex--wrap-m` | `.flex--wrap` (base only) | flex--wrap has no responsive variants |
| `.display--inline-m` | Use `.display--none-m` or another value | display--inline has no responsive variants |
| `.gap--3xl` | `.gap--2xl` (max gap class) | Gap classes stop at 2xl; use `--space-3xl` token in custom CSS |
| `.grid--alternate-l` without ratio grid children | Combine with `.grid--2-1`, `.grid--1-2`, etc. | Alternate only works with ratio grid children |

---

## 6. Validation: Test Prompts

Use these to verify an AI correctly understands this reference.

**Q1:** What is the valid class for a 3-column grid that collapses to 1 column on tablet portrait (≤768px)?
**A:** `class="grid--3 grid--m-1"`

**Q2:** What is wrong with `--neutral-15`?
**A:** Does not exist. Valid neutral shades skip from 14 to 16. Use `--neutral-14` or `--neutral-16`.

**Q3:** What is wrong with `class="color--red"`?
**A:** Double dash is wrong. Color theme classes use single dash: `class="color-red"`

**Q4:** Which of these opacity classes are valid: `.opacity--20`, `.opacity--50`, `.opacity--75`, `.opacity--80`?
**A:** Only `.opacity--50` and `.opacity--75` are valid. `.opacity--20` and `.opacity--80` do not exist.

**Q5:** Which utility classes use double-selector specificity in their source CSS?
**A:** Only `.gap--*`, `.col-gap--*`, `.row-gap--*`, and `.center--*` classes (including their responsive variants).

**Q6:** I want an element visible on desktop but hidden on tablets (≤768px). What class?
**A:** `class="display--none-m"` (applies `display: none` at max-width 768px)

**Q7:** What token should I use for a card background that automatically adapts to dark mode?
**A:** `var(--neutral-14)` — low-numbered neutrals map to light values in light mode, dark values in dark mode automatically.

**Q8:** Write the classes for a 4-column auto-fit grid with medium gap.
**A:** `class="grid--auto-4 gap--m"`

**Q9:** I need a sticky header with a 60px top offset. What HTML do I write?
**A:** `<header class="sticky z--50" style="--sticky-offset: 60px">`

**Q10:** Does `.gap--none` work at all screen sizes?
**A:** No. `.gap--none` is defined inside `@media (max-width: 480px)` in the source, so it only applies at ≤480px viewport width.

**Q11:** Does `--brand-60` change value in dark mode?
**A:** No. `--brand-*` tokens never invert. Only `--color-*` and `--neutral-*` tokens adapt to dark mode. This is why component CSS must use `--color-*`, never `--brand-*`.

**Q12:** Which token should you use in component CSS for colors that adapt to dark mode?
**A:** `--color-*` (e.g. `var(--color-60)`). Never use `--brand-*` in component CSS — it won't invert in dark mode.

**Q13:** A container has `class="neutral-cool"`. Should its child component use `var(--neutral-cool-14)` or `var(--neutral-14)` for a background?
**A:** `var(--neutral-14)`. Always use generic `--neutral-*` tokens so the component automatically adapts to whichever neutral family is active. Never reference family-specific tokens like `--neutral-cool-*` in components.
