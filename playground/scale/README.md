# Scale — Colour Palette Generator

Interactive playground for generating and previewing tonal colour palettes using the OKLCH colour space (via [culori](https://culorijs.org/)). Use it to design, test, and export colour families for the Tale UI design system.

## Run

```bash
pnpm scale:dev      # from monorepo root
pnpm scale:build    # production build
```

## Features

### Base colour input

Enter a hex value or use the visual colour picker (`react-colorful`) to set the base colour. The base is treated as the **shade-60** anchor — the entire palette is interpolated from it.

### Two palette modes

| Mode | Shades | Use case |
|------|--------|----------|
| **Named** (11 shades) | 5 · 10 · 20 · 30 · 40 · **60** · 70 · 80 · 90 · 100 | Accent/brand colour families (`--color-*`) |
| **Neutral** (27 shades) | 5 · 10 · 12–30 (by 2s) · 40–70 (by 10s) · 80–100 (by 2s) | Neutral/gray families (`--neutral-*`) |

### Contrast pivot selector

Controls where text colour switches from dark-on-light to light-on-dark. The auto-detected pivot uses WCAG contrast ratios to choose between shade 60 and 70 (Type A vs Type B palettes). You can override it manually per shade.

### Background preview

Toggle between four backgrounds — white, shade-5, shade-100, and black — to preview how the palette reads in different contexts. The entire UI adapts its text and border colours to stay legible on the selected background.

### CSS output

Generates a ready-to-paste `:root { }` block with `--{name}-{shade}: #hex;` tokens for every shade. One-click copy to clipboard.

### Randomise

Generates a random base colour that passes WCAG contrast validation against its own generated palette. Named mode produces moderate-to-high chroma colours; neutral mode produces low-chroma greys.

### Shareable URLs

The current colour, name, and mode are persisted in the URL hash (`#hex/name/mode`) so palettes can be bookmarked and shared.

## How the palette algorithm works

1. The base hex is converted to OKLCH (`L`, `C`, `H`).
2. **Tint** (shades < 60): lightness interpolates toward `L = 0.977` (near-white); chroma fades to a fixed near-white target to keep a visible hue tint.
3. **Shade** (shades > 60): two strategies depending on the base lightness:
   - **Type A** (`L ≤ 0.70`): darkens to ~55% of base L, retaining ~62% of chroma.
   - **Type B** (`L > 0.70`): steep linear interpolation to a dark end, with a chroma retention floor to keep the tint perceptible.
4. Neutral mode enforces a chroma cap (`0.002–0.05`) so all shades read as grey.
5. Every shade is gamut-clamped via `culori.clampChroma()` before converting to hex.

## Relationship to `@tale-ui/utils/color`

This playground's `src/utils.js` contains the reference implementation of `generatePalette`, `randomBaseColor`, and the WCAG contrast helpers. The production copies in `packages/utils/src/color.ts` are TypeScript ports of the same algorithms. Changes to the palette logic should be validated here first, then ported to the utils package.

## Tech stack

- **React 19** + **Vite 7**
- **styled-components v6** for layout/chrome
- **culori** for OKLCH colour math
- **react-colorful** for the hex colour picker
- **react-copy-to-clipboard** for the CSS copy button
- **@tale-ui/react-styles** (aliased to source) for design tokens
