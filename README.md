# @cloudiverse/design-system

A modular, token-based CSS design system with fluid responsive scaling, comprehensive colour theming, and dark mode support. Framework-agnostic — works with any stack.

## Features

- **Fluid design tokens** — Spacing and typography scale smoothly with `clamp()`
- **Modular CSS** — 20+ focused modules composed via `@import`
- **16 colour families** with 11 shades each, plus 6 neutral tone families
- **Dark mode** — Auto-inverting neutral scale via `data-color-mode` attribute
- **Responsive** — 4 breakpoints (480, 768, 992, 1600px) with utility variants
- **No build tools required** — CSS `@import` works natively in modern browsers

---

## Installation

```bash
npm install @cloudiverse/design-system
```

### Bundler (Next.js, Vite, webpack)

```css
@import '@cloudiverse/design-system';
```

### Plain HTML

```html
<link rel="stylesheet" href="node_modules/@cloudiverse/design-system/dist/style.css">
```

> **Framework note:** This design system sets `html { font-size: 62.5% }` (1rem = 10px). If using Tailwind, shadcn/ui, or Bootstrap, add `html { font-size: 100%; }` after the import to restore their default rem scale. See the [Framework Integration Guide](packages/css/docs/framework-integration.md) for details.

---

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <!-- Design System -->
  <link rel="stylesheet" href="node_modules/@cloudiverse/design-system/dist/style.css" />
</head>
<body>

  <!-- Responsive grid -->
  <div class="grid--3 grid--l-2 grid--m-1 gap--l gap--m-m">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>

  <!-- Themed section -->
  <section class="color-purple neutral-cool padding--l">
    <h1 class="text--display-l">Hello</h1>
    <p class="text--body-l">Welcome to the design system.</p>
  </section>

</body>
</html>
```

### Dark Mode

```html
<html data-color-mode="dark">
```

---

## Documentation

| Resource | Description |
|----------|-------------|
| [AI Reference](packages/css/docs/ai-reference.md) | Every valid class, token, and value — read this before generating code |
| [Framework Integration](packages/css/docs/framework-integration.md) | Using alongside Tailwind, shadcn/ui, Next.js, Vite, etc. |
| [Visual Docs](packages/css/docs/documentation.html) | Interactive component demos (open locally in browser) |
| [Contributor Guide](packages/css/CLAUDE.md) | Architecture, conventions, and how to extend the system |

---

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@cloudiverse/design-system` | [packages/css](packages/css) | Modular token-based CSS design system |

## License

MIT
