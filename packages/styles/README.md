# @tale-ui/react-styles

CSS rules for `@tale-ui/react` components. Built entirely on `@tale-ui/css` design tokens (`--neutral-*`, `--color-*`, `--space-*`, `--text-*`).

`@tale-ui/react` components apply BEM class names automatically (e.g. `tale-button`, `tale-select__popup`). This package provides the CSS rules for those classes.

## Installation

```bash
pnpm add @tale-ui/react-styles
```

This automatically pulls in `@tale-ui/css` (the design-token layer).

## Usage

### All components (recommended)

```ts
import '@tale-ui/react-styles'; // tokens + every component stylesheet
```

### Per-component (tree-shakeable CSS)

```ts
import '@tale-ui/css'; // tokens — required when using per-component imports
import '@tale-ui/react-styles/button';
import '@tale-ui/react-styles/dialog';
```

### Available per-component exports

`accordion` · `alert-dialog` · `autocomplete` · `avatar` · `button` · `checkbox` · `combobox` · `dialog` · `disclosure` · `drawer` · `field` · `fieldset` · `form` · `input` · `menu` · `meter` · `navigation-menu` · `number-field` · `popover` · `preview-card` · `progress` · `radio` · `scroll-area` · `select` · `separator` · `slider` · `switch` · `tabs` · `toast` · `toggle` · `toolbar` · `tooltip`

## Architecture

```
@tale-ui/css          (tokens, foundations, layout, themes)
      ↓
_primitives.css        (shared declarations for field controls, popups, items, etc.)
      ↓
{component}.css        (only the differentiating styles for each component)
```

### `_primitives.css`

Grouped selectors for declarations that are byte-for-byte identical across multiple components. Five groups:

1. **Field controls** — `.tale-input`, `.tale-select__trigger`, `.tale-combobox__input`, `.tale-autocomplete__input` (shared border, padding, font, focus ring)
2. **Dropdown popups** — `.tale-select__popup`, `.tale-combobox__popup`, `.tale-menu__popup`, etc. (shared background, border-radius, shadow, animation)
3. **Dropdown items** — `.tale-select__item`, `.tale-menu__item`, etc. (shared layout, hover, disabled states)
4. **Group labels** — `.tale-select__group-label`, `.tale-menu__group-label`, etc.
5. **Misc** — separators, popup arrows, item indicators

### Individual component files

Each file contains only the styles that differ from the shared primitives. For example, `menu.css` adds menu-specific padding and submenu trigger arrow, but inherits popup background, border-radius, and shadow from `_primitives.css`.

## CSS Class Naming

```
.tale-{component}                     — root element
.tale-{component}--{variant}          — variant modifier
.tale-{component}__{element}          — child element (BEM)
.tale-{component}[data-disabled]      — state via data attribute
```

Examples:

```css
.tale-button                          /* root */
.tale-button--primary                 /* variant */
.tale-button--sm                      /* size */
.tale-select__trigger                 /* child element */
.tale-select__item[data-highlighted]  /* state */
```

## Contributing a New Component Style

1. Create `src/{component}.css` with a header comment documenting the component's data attributes and usage
2. Check `_primitives.css` — if your component shares declarations with existing groups (field controls, popups, items), add its selector to the relevant group instead of duplicating
3. Add `@import './{component}.css'` to `src/index.css` in the appropriate category section
4. Add `"./{component}": "./src/{component}.css"` to `package.json` exports

## License

MIT
