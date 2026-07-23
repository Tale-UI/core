# @tale-ui/core

[![Publish design system](https://github.com/Tale-UI/core/actions/workflows/publish.yml/badge.svg)](https://github.com/Tale-UI/core/actions/workflows/publish.yml)

> **Deprecated:** `@tale-ui/core` has moved to `@tale-ui/css`. Replace the package name in your
> dependency manifest and CSS imports. Version `1.3.57` is the final release under this name.

The foundational CSS layer of the Tale UI Design System — design tokens, layout utilities, and theming primitives. Framework-agnostic, no build tools required.

> **Scope:** This package provides the *foundations* — tokens, layout, utilities, and theming. It does **not** include UI components (buttons, modals, forms, etc.). Component libraries are separate packages that depend on this one.

## Features

- **Fluid design tokens** — Spacing and typography scale smoothly with `clamp()`
- **Modular CSS** — 20+ focused modules composed via `@import`
- **16 color families** with 11 shades each, plus 6 neutral tone families
- **Dark mode** — Auto-inverting neutral scale via `data-color-mode` attribute
- **Responsive** — 4 breakpoints (480, 768, 992, 1600px) with utility variants
- **No build tools required** — CSS `@import` works natively in modern browsers

## Installation

```bash
npm install @tale-ui/core
```

**Bundler (Next.js, Vite, webpack):**
```css
@import '@tale-ui/core';
```

**Plain HTML:**
```html
<link rel="stylesheet" href="node_modules/@tale-ui/core/dist/style.css">
```

> **Framework note:** This design system uses the browser-standard rem base (`html { font-size: 100%; }`, normally `1rem = 16px`) so it can coexist with Tailwind, shadcn/ui, Bootstrap, and other rem-based frameworks without a root-size workaround.

## Quick Start

```html
<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />

<!-- Design System -->
<link rel="stylesheet" href="node_modules/@tale-ui/core/dist/style.css" />
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
