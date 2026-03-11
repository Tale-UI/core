# @tale-ui/core

A modular, token-based CSS design system. Framework-agnostic, no build tools required for development.

## Critical Rules

Before making any changes, read the [Critical Rules in ai-reference.md](docs/ai-reference.md#critical-rules). The most common errors:

- **Utility classes use DOUBLE dash:** `.gap--m`, `.grid--3`, `.display--none`
- **Theme classes use SINGLE dash:** `.color-red`, `.neutral-cool` (NOT `.color--red`)
- **Only `.gap--*` and `.center--*`** use double-selector specificity (`.class.class`) — nothing else
- **`--brand-*` is palette only** — always use `--color-*` in component/UI CSS so dark mode works
- **Neutral shades are irregular** — do not guess; use exact values from the reference

## Project Structure

```
src/
├── index.css         # Entry point — tokens → foundations → layout → utilities → themes
├── tokens/           # CSS custom properties (spacing, typography, colors, neutrals, effects)
├── foundations/      # Typography classes and base element defaults
├── layout/           # Gap, grid, flex, centering (all with responsive variants)
├── utilities/        # Display, visual, position, sizing, border, spacing
└── themes/           # Neutral families, color families, dark mode
```

## Adding a New Utility — Checklist

1. Create or edit the CSS file in the correct module directory (`layout/`, `utilities/`, etc.)
2. Follow naming: `.{block}--{modifier}` with design tokens — see [naming-conventions.md](docs/naming-conventions.md)
3. Add responsive variants if applicable (xl, l, m, s breakpoints)
4. Add `@import` to `src/index.css` in the correct layer (only if creating a new file)
5. Update [docs/ai-reference.md](docs/ai-reference.md) with the new class enumeration
6. Update [docs/documentation.html](docs/documentation.html) with a visual example
7. Run `pnpm build` to verify the concatenated output

## Build Constraints

- The build script (`tools/build-css.js`) resolves `@import` statements **one level deep only** — it reads `src/index.css` and concatenates the imported files. Nested `@import` within module files is not supported.
- All CSS modules must be flat files imported directly from `src/index.css`.

## Documentation

| File | What it covers |
|------|----------------|
| [docs/architecture.md](docs/architecture.md) | Module structure, import order, specificity patterns, adding new utilities |
| [docs/naming-conventions.md](docs/naming-conventions.md) | Utility class syntax, responsive variants, theme classes, BEM |
| [docs/design-tokens.md](docs/design-tokens.md) | Spacing, typography, color system, neutral system, effects, dark mode |
| [docs/building-components.md](docs/building-components.md) | Component patterns, BEM usage, import methods, required fonts |
| [docs/ai-reference.md](docs/ai-reference.md) | Complete class/token enumeration, valid shade numbers, responsive coverage matrix |
| [docs/framework-integration.md](docs/framework-integration.md) | Tailwind, shadcn/ui, Next.js, Vite, PostCSS setup — including the `62.5%` font-size issue |
