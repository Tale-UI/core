# Setting Up a React App with Tale UI

## Quick Start

```bash
pnpm add @tale-ui/react @tale-ui/react-styles
```

```tsx
// App entry — import styles once
import '@tale-ui/react-styles';

// Import components per-file
import { Button } from '@tale-ui/react/button';

export default function App() {
  return <Button className="tale-button tale-button--primary">Click me</Button>;
}
```

That's it. `@tale-ui/react-styles` pulls in `@tale-ui/core` (the design-token layer) automatically.

---

## Package Architecture

```
@tale-ui/core            CSS design tokens, foundations, layout utilities, themes
      ↑
@tale-ui/react-styles    Component CSS (.tale-button, .tale-select__popup, …)
      ↑
@tale-ui/react           Headless React components (no styles of their own)
      ↑
@tale-ui/utils           Shared hooks & helpers (pulled automatically)
```

| Package | What it provides |
|---------|-----------------|
| `@tale-ui/core` | Design tokens (`--color-*`, `--neutral-*`, `--space-*`, `--text-*`), utility classes (`.gap--m`, `.grid--3`), dark mode, typography foundations |
| `@tale-ui/react-styles` | Opinionated CSS for every `@tale-ui/react` component — built entirely on `@tale-ui/core` tokens |
| `@tale-ui/react` | Headless, accessible React components — unstyled by default |
| `@tale-ui/utils` | Internal utilities (colour generation, React hooks, DOM helpers) |

---

## CSS Import Strategies

### All-in-one (recommended)

```ts
import '@tale-ui/react-styles';          // tokens + all component CSS
```

This single import loads `@tale-ui/core` (tokens, foundations, themes) followed by every component stylesheet.

### Per-component

```ts
import '@tale-ui/core';                  // tokens — must import separately
import '@tale-ui/react-styles/button';   // just the button CSS
import '@tale-ui/react-styles/dialog';   // just the dialog CSS
```

When importing individual components you **must** also import `@tale-ui/core` yourself, because per-component exports do not re-import it.

---

## Colour System

### 17 named colour families

`red` · `orange` · `amber` · `yellow` · `lime` · `green` · `emerald` · `teal` · `cyan` · `sky` · `indigo` · `violet` · `purple` · `fuchsia` · `pink` · `rose` + semantic: `error` · `warning` · `success`

Each family spans 11 shades: **5 · 10 · 20 · 30 · 40 · 50 · 60 · 70 · 80 · 90 · 100**.

### Token rules

| Token layer | Purpose | Dark-mode behaviour |
|-------------|---------|---------------------|
| `--color-*` | All UI styling (buttons, borders, focus rings, etc.) | **Auto-inverts** |
| `--brand-*` | Palette definitions only (`:root` overrides, `.color-{name}` classes) | **Never inverts** |
| `--neutral-*` | Backgrounds, text, borders | **Auto-inverts** |

**Critical rule:** Never use `--brand-*` in component or UI CSS. Always use `--color-*` — it inverts automatically in dark mode.

### Setting a custom primary colour

Override `--brand-5` through `--brand-100` at `:root` in your app CSS (imported **after** the design system):

```css
:root {
  --brand-5:   #fbf5f9;
  --brand-60:  #7e4271;
  --brand-100: #36162f;
}
```

Dark-mode inversion works automatically — you only need to define the light-mode palette.

### Scoped colour

Add a `.color-{name}` class to any container. All `--color-*` tokens inside that subtree resolve to the named palette:

```html
<div class="color-red">
  <button class="tale-button tale-button--primary">Red primary</button>
</div>
```

### 6 neutral families

`neutral-cool` · `neutral-slate` · `neutral-gray` · `neutral-onyx` · `neutral-mono` · `neutral-warm` (default)

Neutral shades use an irregular scale: **5 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 26 · 28 · 30 · 40 · 50 · 60 · 70 · 80 · 82 · 84 · 86 · 88 · 90 · 92 · 94 · 96 · 98 · 100**.

Full token reference: [packages/css/docs/design-tokens.md](../packages/css/docs/design-tokens.md)

---

## Typography

### 6 type roles

| Role | Font family | Weights | Sizes |
|------|------------|---------|-------|
| **Display** | Inter | 600 | `--display-l-font-size` (4.1rem) · `m` (3.8rem) · `s` (3.4rem) |
| **Heading** | Inter | 600 | `--heading-l-font-size` (3.0rem) · `m` (2.73rem) · `s` (2.46rem) |
| **Title** | Inter | 600 | `--title-l-font-size` (2.41rem) · `m` (2.19rem) · `s` (2.11rem) |
| **Label** | Inter | 500 | `--label-l-font-size` (1.92rem) · `m` (1.60rem) · `s` (1.33rem) · `xs` (1.23rem) |
| **Body** | Inter | 400 | `--text-l-font-size` (1.92rem) · `m` (1.60rem) · `s` (1.33rem) · `xs` (1.23rem) |
| **Mono** | Roboto Mono | 400 | `--mono-l-font-size` (1.92rem) · `m` (1.60rem) · `s` (1.23rem) |

Additional font: **Playfair Display** (serif) is available via `--expressive-font-family`.

### CSS classes

```html
<h1 class="text--display-m">Display medium</h1>
<p class="text--body-m">Body text</p>
<code class="text--mono-s">code</code>
```

### Font-size caveat

The design system sets `html { font-size: 62.5% }` so that **1rem = 10px**. If your app also uses Tailwind, shadcn/ui, or Bootstrap, add `html { font-size: 100%; }` after the Tale UI import. See [framework-integration.md](../packages/css/docs/framework-integration.md) for the full workaround.

---

## Dark Mode / Light Mode

### Three-layer system

| Priority | Trigger | Selector |
|----------|---------|----------|
| 1 (lowest) | Default | `html:not([data-color-mode="dark"])` — light mode when no attribute is set |
| 2 | OS preference | `@media (prefers-color-scheme: dark)` + `html:not([data-color-mode="light"])` — auto-dark unless explicitly overridden to light |
| 3 (highest) | Explicit attribute | `html[data-color-mode="dark"]` — always dark regardless of OS |

### What happens in dark mode

- All `--neutral-*` shades **invert** (light ↔ dark)
- All `--color-*` shades **invert** (5 ↔ 100, 10 ↔ 90, etc.)
- `--brand-*` does **NOT** invert — it is palette-only
- `--text-color`, `--display-color`, `--mono-color` automatically adjust

### Setting it up

**Option A — OS preference only (no toggle)**

Add an inline script in `<head>` before any CSS to avoid a flash of wrong theme:

```html
<script>
  document.documentElement.setAttribute(
    'data-color-mode',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
</script>
```

**Option B — with a toggle**

```tsx
function useDarkMode() {
  const [dark, setDark] = React.useState(() => {
    const stored = localStorage.getItem('color-mode');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    const mode = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-mode', mode);
    localStorage.setItem('color-mode', mode);
  }, [dark]);

  return [dark, setDark] as const;
}
```

**Option C — scoped dark section**

```html
<div class="dark">
  <!-- everything inside uses dark-mode tokens -->
</div>
```

---

## Component Catalogue

All components are imported from `@tale-ui/react/{name}`:

### Form Controls

| Component | Import path | Key classes |
|-----------|------------|-------------|
| Button | `@tale-ui/react/button` | `.tale-button`, `--primary`, `--neutral`, `--ghost`, `--danger`, `--sm`, `--md`, `--lg` |
| Input | `@tale-ui/react/input` | `.tale-input`, `--sm`, `--lg` |
| Checkbox | `@tale-ui/react/checkbox` | `.tale-checkbox` |
| Checkbox Group | `@tale-ui/react/checkbox-group` | — |
| Radio | `@tale-ui/react/radio` | `.tale-radio` |
| Radio Group | `@tale-ui/react/radio-group` | — |
| Switch | `@tale-ui/react/switch` | `.tale-switch` |
| Toggle | `@tale-ui/react/toggle` | `.tale-toggle`, `--sm`, `--md`, `--lg` |
| Toggle Group | `@tale-ui/react/toggle-group` | — |
| Select | `@tale-ui/react/select` | `.tale-select__trigger`, `__popup`, `__item` |
| Combobox | `@tale-ui/react/combobox` | `.tale-combobox__input`, `__popup`, `__item` |
| Autocomplete | `@tale-ui/react/autocomplete` | `.tale-autocomplete__input`, `__popup`, `__item` |
| Number Field | `@tale-ui/react/number-field` | `.tale-number-field` |
| Slider | `@tale-ui/react/slider` | `.tale-slider` |

### Layout

| Component | Import path |
|-----------|------------|
| Accordion | `@tale-ui/react/accordion` |
| Collapsible | `@tale-ui/react/collapsible` |
| Tabs | `@tale-ui/react/tabs` |
| Scroll Area | `@tale-ui/react/scroll-area` |
| Separator | `@tale-ui/react/separator` |

### Overlay

| Component | Import path |
|-----------|------------|
| Dialog | `@tale-ui/react/dialog` |
| Alert Dialog | `@tale-ui/react/alert-dialog` |
| Popover | `@tale-ui/react/popover` |
| Drawer | `@tale-ui/react/drawer` |
| Tooltip | `@tale-ui/react/tooltip` |
| Preview Card | `@tale-ui/react/preview-card` |

### Navigation

| Component | Import path |
|-----------|------------|
| Menu | `@tale-ui/react/menu` |
| Context Menu | `@tale-ui/react/context-menu` |
| Menubar | `@tale-ui/react/menubar` |
| Navigation Menu | `@tale-ui/react/navigation-menu` |
| Toolbar | `@tale-ui/react/toolbar` |

### Feedback & Display

| Component | Import path |
|-----------|------------|
| Progress | `@tale-ui/react/progress` |
| Meter | `@tale-ui/react/meter` |
| Avatar | `@tale-ui/react/avatar` |
| Toast | `@tale-ui/react/toast` |

### Form Structure

| Component | Import path |
|-----------|------------|
| Field | `@tale-ui/react/field` |
| Fieldset | `@tale-ui/react/fieldset` |
| Form | `@tale-ui/react/form` |

### Utilities

| Export | Import path | Purpose |
|--------|------------|---------|
| Container | `@tale-ui/react/container` | Sets `--color-*` vars for a named/random palette |
| CSP Provider | `@tale-ui/react/csp-provider` | Content Security Policy nonce injection |
| Direction Provider | `@tale-ui/react/direction-provider` | RTL/LTR context |
| `mergeProps` | `@tale-ui/react/merge-props` | Merge multiple prop objects |
| `useRender` | `@tale-ui/react/use-render` | Custom render hook |

---

## Data Attributes for Styling

Components expose state via data attributes. Use these in CSS selectors:

| Attribute | Meaning |
|-----------|---------|
| `data-disabled` | Component is disabled |
| `data-open` | Popup / collapsible is open |
| `data-closed` | Popup / collapsible is closed |
| `data-checked` | Checkbox, radio, or switch is checked |
| `data-unchecked` | Checkbox, radio, or switch is unchecked |
| `data-selected` | Item is selected (select, combobox) |
| `data-highlighted` | Item has keyboard/pointer highlight |
| `data-focus-visible` | Keyboard focus is visible |
| `data-side="top\|bottom\|left\|right"` | Popup placement side |
| `data-starting-style` | Enter animation start |
| `data-ending-style` | Exit animation start |
| `data-popup-open` | Trigger element while its popup is open |

---

## Framework Notes

- **Vite:** Works out of the box. See `playground/vite-app/` for a working example.
- **Next.js (App Router):** See [framework-integration.md](../packages/css/docs/framework-integration.md#nextjs-app-router).
- **Tailwind coexistence:** See [framework-integration.md](../packages/css/docs/framework-integration.md) — note the `html { font-size }` conflict and workaround.

---

## Troubleshooting

**"Components render but look unstyled"**
You imported `@tale-ui/react` but forgot `@tale-ui/react-styles`. Add `import '@tale-ui/react-styles'` to your entry file.

**"CSS variables are undefined"**
You imported a per-component style (e.g. `@tale-ui/react-styles/button`) without importing `@tale-ui/core` first. Either switch to the all-in-one import or add `import '@tale-ui/core'` before component imports.

**"Dark mode doesn't work"**
Ensure `data-color-mode` is set on the `<html>` element (not `<body>`). The CSS selectors target `html[data-color-mode="dark"]`.

**Windows symlink issues with Turbopack**
pnpm symlinks may fail with Turbopack on Windows. Copy `dist/style.css` to a local path and import from there. See [framework-integration.md](../packages/css/docs/framework-integration.md) for details.
