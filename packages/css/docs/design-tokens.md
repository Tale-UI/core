# Design Tokens

## Spacing

All spacing uses fluid `clamp()` scaling between `--min-screen-width` (480px) and `--max-screen-width` (1600px):

- **General:** `--space-4xs` through `--space-4xl` (11 steps)
- **Section:** `--section-space-xs` through `--section-space-xl` (5 steps, larger scale)

## Typography

Six typography categories, each with font-family, size, weight, line-height, and letter-spacing tokens:

| Category | Sizes | Use |
|----------|-------|-----|
| `display` | l, m, s | Hero headings, page titles |
| `heading` | l, m, s | Section headings |
| `title` | l, m, s | Card titles, sub-sections |
| `label` | l, m, s, xs | UI labels, navigation |
| `body` (`text`) | l, m, s, xs | Body text, paragraphs |
| `mono` | l, m, s, xs | Code, technical content |

Fonts: **Inter** (display + body), **Playfair Display** (expressive), **Roboto Mono** (code).

## Color System

**16 named color families** with 11 shades each (5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100):
red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, indigo, violet, purple, fuchsia, pink, rose

**Semantic colors:** `--error-*`, `--warning-*`, `--success-*`

**Brand colors:** `--brand-5` through `--brand-100` (default teal, overridable via `.color-*` classes)

### Shade guidelines

- 5–30: Light backgrounds, subtle surfaces
- 40–60: Primary actions, interactive elements — `-60` is the BASE/primary shade and the contrast switch point
- 70–100: Dark fills, text, strong contrast

### Contrast pairing (applies to all color families including semantic)

- Shades **below 60** are light — pair with `-100` for text/icons
- Shades **above 60** are dark — pair with `-5` for text/icons
- `-50` and `-70` are edge shades: fail WCAG 4.5:1 AA for normal text but pass for large text (18px+) — do not use for body text

### Foreground tokens (`*-fg`)

Every color and neutral shade has a paired `-fg` token for text/icons on that shade as background:

```css
background: var(--color-60);
color: var(--color-60-fg);    /* auto-contrasting text */
```

- `--color-*-fg` (11 shades) and `--neutral-*-fg` (27 shades) — pivot at 60; dark mode inversion automatic
- `--error-*-fg` (11 shades) — pivot at 60 (error-60 passes 6.2:1 contrast with white)
- `--warning-*-fg` (11 shades) — pivot at 70 (warning-60 is too light for white text: 2.3:1)
- `--success-*-fg` (11 shades) — pivot at 70 (same reason as warning)
- Semantic fg tokens are **static** (do not invert in dark mode) — semantic states stay visually consistent
- Per-family pivot: `.color-{name}` theme classes override `--color-60-fg` / `--color-70-fg` for lighter families (yellow, lime, etc.) so contrast is always correct

### `--brand-*` vs `--color-*`

> **Rule: `--brand-*` is palette-only.** It belongs only in `:root` overrides and `.color-{name}` class definitions — **never in component or UI CSS**. `--brand-*` does not invert in dark mode; `--color-*` does.

## Neutral System

6 tone families, each with 25+ shades (5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100):

- `neutral-warm` (default)
- `neutral-cool`, `neutral-slate`, `neutral-gray`, `neutral-onyx`, `neutral-mono`

**Always use `--neutral-*` tokens** (not `--neutral-warm-*` etc.) so components adapt to the active neutral family and dark mode:

```css
/* Good — adapts to any neutral family */
background: var(--neutral-14);
color: var(--neutral-90);

/* Bad — locked to one family */
background: var(--neutral-warm-14);
```

### Text contrast rule

Text must never be lighter than `--neutral-50`. Use `--neutral-60` or darker for all text. Use `--neutral-70`–`--neutral-90` for body and heading text.

## Effects

- **Radius:** `--radius-none`, `--radius-xs`, `--radius-s`, `--radius-m`, `--radius-l`, `--radius-xl`, `--radius-2xl`, `--radius-full`
- **Shadows:** `--shadow-xs`, `--shadow-s`, `--shadow-m`, `--shadow-l`, `--shadow-xl`

## Dark Mode

### Setup

Set `data-color-mode` on `<html>`:

```html
<html data-color-mode="dark">  <!-- or "light" -->
```

### Auto-inversion

When dark mode is active, the neutral scale inverts automatically:
- `--neutral-10` (lightest in light mode) → maps to `--neutral-default-100` (darkest)
- `--neutral-90` (darkest in light mode) → maps to `--neutral-default-20` (lightest)

`--color-*` tokens also invert. Any component using `--neutral-*` and `--color-*` tokens automatically works in both modes — no separate dark mode CSS needed.

**Foreground tokens** (`*-fg`) also auto-invert — they reference `--color-*` / `--neutral-*` aliases, so both the background and foreground flip together. No dark mode overrides needed for `-fg` tokens.

### JavaScript toggle

```javascript
// Restore on load — always set an explicit value so OS preference doesn't override a user choice.
// If nothing is saved, fall back to the OS preference.
const saved = localStorage.getItem('color-mode');
const mode = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-color-mode', mode);

// Toggle
function toggleColorMode() {
  const current = document.documentElement.getAttribute('data-color-mode');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-color-mode', next);
  localStorage.setItem('color-mode', next);
}
```

> **Note:** Never use `removeAttribute('data-color-mode')` to "reset to light" — removing the attribute causes the OS `prefers-color-scheme: dark` media query to take effect again. Always set `"light"` explicitly to force light mode.
