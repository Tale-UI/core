# Design System

[![Publish design system](https://github.com/Tale-UI/core/actions/workflows/publish.yml/badge.svg)](https://github.com/Tale-UI/core/actions/workflows/publish.yml)

A modular, token-based CSS design system with fluid responsive scaling, comprehensive color theming, and dark mode support. Framework-agnostic — works with any stack.

## Features

- **Fluid design tokens** — Spacing and typography scale smoothly with `clamp()`
- **Modular CSS** — 20+ focused modules composed via `@import`
- **16 color families** with 11 shades each, plus 6 neutral tone families
- **Dark mode** — Auto-inverting neutral scale via `data-color-mode` attribute
- **Responsive** — 4 breakpoints (480, 768, 992, 1600px) with utility variants
- **No build tools required** — CSS `@import` works natively in modern browsers

## Installation

```bash
npm install @cloudiverse/design-system
```

**Bundler (Next.js, Vite, webpack):**
```css
@import '@cloudiverse/design-system';
```

**Plain HTML:**
```html
<link rel="stylesheet" href="node_modules/@cloudiverse/design-system/dist/style.css">
```

> **Framework note:** This design system sets `html { font-size: 62.5% }` (1rem = 10px). If using Tailwind, shadcn/ui, or Bootstrap, add `html { font-size: 100%; }` after the import.

## Quick Start

```html
<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet" />

<!-- Design System -->
<link rel="stylesheet" href="node_modules/@cloudiverse/design-system/dist/style.css" />
```

### Dark Mode

```html
<html data-color-mode="dark">
```

## Usage Examples

```html
<!-- Responsive grid with gap -->
<div class="grid--3 grid--l-2 grid--m-1 gap--l gap--m-m">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>

<!-- Centered content -->
<section class="center--all padding--l">
    <h1 class="text--display-l">Hello</h1>
    <p class="text--body-l">Welcome to the design system.</p>
</section>

<!-- Themed section -->
<section class="color-purple neutral-cool">
    <button style="background: var(--color-60); color: var(--neutral-10);">
        Purple Button
    </button>
</section>
```

## Documentation

- **[AI Reference](https://github.com/Tale-UI/core/blob/main/packages/css/docs/ai-reference.md)** — Every valid class, token, and value
- **[Framework Integration](https://github.com/Tale-UI/core/blob/main/packages/css/docs/framework-integration.md)** — Using alongside Tailwind, shadcn/ui, Next.js, Vite, etc.
- **[Visual Docs](https://github.com/Tale-UI/core/blob/main/packages/css/docs/documentation.html)** — Interactive component demos
- **[Contributor Guide](https://github.com/Tale-UI/core/blob/main/packages/css/CLAUDE.md)** — Architecture, conventions, and how to extend the system

## Project Structure

```
src/                    # Modular CSS source
├── index.css           # Entry point (@imports in order)
├── tokens/             # Design tokens (spacing, typography, colors, effects)
├── foundations/         # Typography classes, text utilities, base elements
├── layout/             # Grid, flex, gap, centering + responsive variants
├── utilities/          # Display, visual, position, sizing, border, spacing
└── themes/             # Color themes, neutral families, dark mode
```

See [CLAUDE.md](./CLAUDE.md) for the complete architecture reference.

## License

MIT
