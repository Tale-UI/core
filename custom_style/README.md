# Custom Style Design System

This directory contains `style.css`, a comprehensive CSS design system with fluid typography, spacing tokens, color palettes, layout utilities, and dark/light mode support.

## Setup

Import `style.css` **before** your application styles:

```html
<link rel="stylesheet" href="style.css" />
<link rel="stylesheet" href="app.css" />
```

Or in a bundler (Vite, Webpack, etc.):

```js
import './styles/style.css';
import './styles/app.css';
```

### Font

The design system uses **Geist** (body/display) and **Roboto Mono** (monospace). Add this to your `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

---

## Dark / Light Mode

The color mode is controlled by the `data-color-mode` attribute on the `<html>` element. The design system provides three selectors:

| Selector | When it applies |
|---|---|
| `html[data-color-mode="dark"]` | Dark mode active |
| `html[data-color-mode="light"]` | Light mode active |
| `html:not([data-color-mode])` | No attribute set (defaults to light) |

### Implementing the toggle

Set `data-color-mode` on the `<html>` element and persist the choice to `localStorage`:

```js
function setColorMode(mode) {
  // mode should be 'dark' or 'light'
  document.documentElement.setAttribute('data-color-mode', mode);
  localStorage.setItem('color-mode', mode);
}

// Toggle example
function toggleColorMode() {
  const current = document.documentElement.getAttribute('data-color-mode') || 'light';
  setColorMode(current === 'dark' ? 'light' : 'dark');
}

// Restore on page load
const saved = localStorage.getItem('color-mode');
if (saved) {
  document.documentElement.setAttribute('data-color-mode', saved);
}
```

### React example

```tsx
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('color-mode');
  return saved ? saved === 'dark' : true; // default dark
});

useEffect(() => {
  const theme = darkMode ? 'dark' : 'light';
  document.documentElement.setAttribute('data-color-mode', theme);
  localStorage.setItem('color-mode', theme);
}, [darkMode]);

// In JSX:
<button onClick={() => setDarkMode(prev => !prev)}>
  {darkMode ? 'Light mode' : 'Dark mode'}
</button>
```

### How it works

When `data-color-mode="dark"` is set, the design system **inverts the neutral scale**. The `--neutral-10` token (normally the lightest shade) maps to the darkest value, and `--neutral-90` (normally darkest) maps to the lightest. This means you write your CSS once using neutral tokens and both modes work automatically:

```css
body {
  background: var(--neutral-10); /* light bg in light mode, dark bg in dark mode */
  color: var(--text-color);      /* dark text in light mode, light text in dark mode */
}

.card {
  background: var(--neutral-14); /* slightly off-background in both modes */
  border: 1px solid var(--neutral-28);
}
```

The brand/accent colors also invert their scale in dark mode (`--color-60` swaps direction), so accent colors remain visually appropriate in both modes.

---

## Neutral Tone Families

Apply a neutral tone class to a container to set the gray palette for everything inside it:

| Class | Character |
|---|---|
| `neutral-onyx` | Slightly warm-neutral, minimal color cast |
| `neutral-cool` | Blue-tinted grays |
| `neutral-slate` | Subtle blue-gray undertone |
| `neutral-gray` | Balanced neutral |
| `neutral-mono` | Pure grays, no color cast |
| `neutral-warm` | Warm-toned grays (default) |

```html
<div class="neutral-onyx">
  <!-- All --neutral-* tokens inside resolve to onyx shades -->
</div>
```

---

## Design Tokens

### Spacing (`--space-*`)

Fluid values using `clamp()` that scale between `--min-screen-width` (480px) and `--max-screen-width` (1600px):

| Token | Approximate range |
|---|---|
| `--space-4xs` | ~5px |
| `--space-3xs` | ~7px |
| `--space-2xs` | ~8-10px |
| `--space-xs` | ~10-14px |
| `--space-s` | ~13-20px |
| `--space-m` | ~16-28px |
| `--space-l` | ~20-40px |
| `--space-xl` | ~25-56px |
| `--space-2xl` | ~31-79px |
| `--space-3xl` | ~39-112px |
| `--space-4xl` | ~49-158px |

### Typography (`--text-*`)

Fluid font sizes:

| Token | Approximate range |
|---|---|
| `--text-xs` | ~12-11px |
| `--text-s` | ~13px |
| `--text-m` | ~14-16px |
| `--text-l` | ~15-19px |
| `--text-xl` | ~16-23px |
| `--text-2xl` | ~17-28px |
| `--text-3xl` | ~18-33px |
| `--text-4xl` | ~19-40px |
| `--text-5xl` | ~21-48px |
| `--text-6xl` | ~22-57px |
| `--text-7xl` | ~24-69px |
| `--text-8xl` | ~25-83px |

### Border Radius (`--radius-*`)

| Token | Value |
|---|---|
| `--radius-none` | 0 |
| `--radius-xs` | 0.25rem |
| `--radius-s` | 0.375rem |
| `--radius-m` | 0.5rem |
| `--radius-l` | 1rem |
| `--radius-xl` | 1.25rem |
| `--radius-2xl` | 1.5rem |
| `--radius-full` | 9999px |

### Shadows (`--shadow-*`)

`--shadow-xs`, `--shadow-s`, `--shadow-m`, `--shadow-l`, `--shadow-xl` (increasing depth).

### Colors

**Brand:** `--brand-5` through `--brand-100` (light to dark). Override with color classes like `color-red`, `color-purple`, etc.

**Semantic:** `--success-60`, `--error-60`, `--warning-60` plus their full 5-100 scales.

**Named colors:** `--red-60`, `--green-60`, `--blue-60`, `--violet-60`, etc. (each with 5-100 scale).

---

## Utility Classes

### Typography

| Class | Purpose |
|---|---|
| `text--display-l/m/s` | Large display headings |
| `text--heading-l/m/s` | Section headings |
| `text--title-l/m/s` | Titles |
| `text--label-l/m/s/xs` | Labels and UI text |
| `text--body-l/m/s/xs` | Body text |
| `text--mono-l/m/s/xs` | Monospace text |

### Layout

| Class | Purpose |
|---|---|
| `flex--row` | `display: flex; flex-direction: row` |
| `flex--col` | `display: flex; flex-direction: column` |
| `flex--wrap` | `flex-wrap: wrap` |
| `center--all` | Center content both axes |
| `center--x` / `center--y` | Center on one axis |
| `gap--xs` through `gap--2xl` | Gap utilities |
| `col-gap--*` / `row-gap--*` | Column/row gap |

### Grid

| Class | Purpose |
|---|---|
| `grid--1` through `grid--12` | Fixed column grids |
| `grid--auto-2` through `grid--auto-12` | Responsive auto-fit grids |
| `grid--1-2`, `grid--2-1`, etc. | Ratio-based two-column grids |
| `col-span--*` / `row-span--*` | Span utilities |

### Visual

| Class | Purpose |
|---|---|
| `radius--xs` through `radius--full` | Border radius |
| `shadow--xs` through `shadow--xl` | Box shadows |

### Responsive Breakpoints

Grid, gap, flex, and center utilities have responsive variants:

- **`xl`** suffix: applies at `max-width: 1600px` (e.g., `grid--xl-2`, `gap--xl-s`, `flex--col-xl`)
- **`l`** suffix: applies at `max-width: 992px` (e.g., `grid--l-1`, `gap--l-xs`, `flex--col-l`)
- **`m`** suffix: applies at `max-width: 768px`
- **`s`** suffix: applies at `max-width: 480px`
