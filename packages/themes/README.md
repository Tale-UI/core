# @tale-ui/themes

Optional themes for Tale UI. A **standard theme** has distinct brand and neutral colours. A
**monochrome theme** derives both scales from one named colour, matching the Theme Playground's
Monochrome theme option.

The package ships both collections as static production CSS plus typed metadata. The initial
monochrome suite is sourced from Bento Browser's seven non-default workspace themes.

## Installation

```bash
pnpm add @tale-ui/themes
```

`@tale-ui/css` is installed as a dependency. Import the theme stylesheet after Tale UI's base or
component styles:

```ts
import '@tale-ui/react-styles';
import '@tale-ui/themes/themes.css';
```

## Apply a theme

Use the data attribute when themes are controlled from JavaScript:

```tsx
import { applyStandardTheme } from '@tale-ui/themes';

applyStandardTheme('harbour'); // Sets data-tale-theme="harbour" on <html>.
```

Monochrome themes use a separate attribute so an identically named standard theme, such as
Terracotta, remains unambiguous:

```tsx
import { applyMonochromeTheme } from '@tale-ui/themes';

applyMonochromeTheme('terracotta'); // Sets data-tale-monochrome-theme="terracotta".
```

The apply helpers remove the other collection's attribute from the target, keeping theme selection
mutually exclusive.

Or apply a CSS class directly:

```html
<html class="standard-theme-harbour"></html>
<html class="monochrome-theme-antique"></html>
```

Both forms may be applied to a nested container when a section needs its own palette. Tale UI's
light mode, dark mode, and foreground contrast aliases continue to work.

## Available standard themes

`harbour` · `lagoon` · `blueprint` · `violet-dusk` · `wildflower` · `terracotta` ·
`amber-grove` · `fern`

```tsx
import { STANDARD_THEMES, type StandardThemeId } from '@tale-ui/themes';

const options = STANDARD_THEMES.map(({ id, name, description, brandPalette, neutralPalette }) => ({
  id: id satisfies StandardThemeId,
  name,
  description,
  brandSwatch: brandPalette.find(({ shade }) => shade === 60)?.hex,
  neutralSwatch: neutralPalette.find(({ shade }) => shade === 60)?.hex,
}));
```

## Available monochrome themes

`antique` · `forest` · `mauve` · `mountain-meadow` · `rosewater` · `teal` · `terracotta`

```tsx
import { MONOCHROME_THEMES, type MonochromeThemeId } from '@tale-ui/themes';

const options = MONOCHROME_THEMES.map(({ id, name, description, color, brandPalette }) => ({
  id: id satisfies MonochromeThemeId,
  name,
  description,
  anchor: color,
  swatch: brandPalette.find(({ shade }) => shade === 60)?.hex,
}));
```

## Development

Standard and monochrome theme definitions are canonical in `src/themes.ts`. Standard palettes use
the public generator in `@tale-ui/utils/color`; the package-local monochrome generator preserves the
Theme Playground algorithm without requiring a coordinated Utils release. The committed
`src/themes.css` is generated from those definitions.

```bash
pnpm generate
pnpm generate:check
pnpm test
pnpm build
pnpm test:package
```

## Extraction boundary

The package has no React or playground dependency. Its public surface is the metadata entry point
and generated CSS export, so it can move to its own repository later without changing consumer
imports. Its only Tale UI dependencies are the core token contract and shared colour utilities.

## License

MIT
