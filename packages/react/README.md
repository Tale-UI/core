# @tale-ui/react

An accessible React component library built on React Aria Components, with BEM class names applied automatically. Styles and design tokens are included — one package, one style import.

## Installation

```bash
npm install @tale-ui/react
```

This single install pulls in `@tale-ui/react-styles` (component CSS) and `@tale-ui/core` (design tokens) automatically.

Peer dependencies: `react` and `react-dom` (^17, ^18, or ^19).

### AI agent setup (optional)

If you use Claude Code or other AI coding agents, run this once to add component documentation instructions to your project:

```bash
npx tale-ui-setup
```

This creates or updates your `CLAUDE.md` with instructions that tell the agent how to use Tale UI components correctly.

## Quick Start

```css
/* app root CSS */
html {
  font-size: 62.5%; /* Required — design tokens assume 1rem = 10px */
}
```

```tsx
import '@tale-ui/react/styles';           // tokens + all component CSS — import once
import { Button } from '@tale-ui/react/button';

export default function App() {
  return <Button variant="primary" size="md">Click me</Button>;
}
// Renders: <button class="tale-button tale-button--primary tale-button--md">Click me</button>
```

## Critical Setup Details

**Base font size** — The design system requires `html { font-size: 62.5%; }` so that `1rem = 10px`. Without this, all spacing and sizing will be wrong.

**Dark mode** — Set `data-color-mode="dark"` on `<html>`. All `--neutral-*` and `--color-*` tokens invert automatically.

```html
<html data-color-mode="dark">
```

**Token rule** — Always use `--color-*` (not `--brand-*`) in component and app CSS. `--brand-*` is palette-only and does NOT invert in dark mode.

```css
/* Correct */
.my-card { background: var(--color-60); color: var(--color-60-fg); }

/* Wrong — will break in dark mode */
.my-card { background: var(--brand-60); }
```

## Components

All components are imported from `@tale-ui/react/{name}`:

```ts
import { Button } from '@tale-ui/react/button';
import { Input } from '@tale-ui/react/input';
import { Dialog } from '@tale-ui/react/dialog';
import { Select } from '@tale-ui/react/select';
import { Checkbox } from '@tale-ui/react/checkbox';
```

### Form Controls

Button · Checkbox · Checkbox Group · Combobox · Input · Number Field · Radio · Radio Group · Search Field · Select · Slider · Switch · Text Area · Text Field · Toggle Button · Toggle Button Group · Date Field · Date Picker · Date Range Picker · Time Field · Color Picker

### Layout

Accordion · Disclosure · Scroll Area · Separator · Tabs

### Overlay

Alert Dialog · Dialog · Drawer · Popover · Preview Card · Tooltip

### Navigation

Breadcrumbs · Context Menu · Link · Menu · Menubar · Navigation Menu · Toolbar

### Data Display

Calendar · Grid List · Range Calendar · Table · Tag Group · Tree

### Feedback & Display

Avatar · Meter · ProgressBar

### Form Structure

Autocomplete · Field · Fieldset · Form

### Utilities

Container · CSP Provider · I18nProvider · `mergeProps`

## Styling

Components apply BEM base class names automatically. Variant and size props map to BEM modifiers:

```tsx
<Button variant="primary" size="sm">Save</Button>
// → class="tale-button tale-button--primary tale-button--sm"
```

State is exposed via data attributes (`data-disabled`, `data-open`, `data-checked`, `data-focus-visible`, `data-selected`, `data-highlighted`, etc.) for CSS selectors.

## Custom Theme

Create a `tale-ui-overrides.css` file in your project (next to your app entry):

```css
/* tale-ui-overrides.css
 *
 * Paste your generated theme from https://tale-ui.github.io/core/scale
 * This file overrides the default --brand-* palette tokens.
 * Import AFTER @tale-ui/react/styles so overrides take effect.
 */
```

Import it after the Tale UI styles:

```tsx
import '@tale-ui/react/styles';
import './tale-ui-overrides.css';        // your custom theme — must come after
```

To generate a theme, visit https://tale-ui.github.io/core/scale, configure your colour scale, and paste the generated `:root` block into `tale-ui-overrides.css`. Dark mode inversion works automatically — you only define the light-mode palette.

## Per-component CSS Imports

For smaller bundles, import individual component styles instead of the all-in-one:

```ts
import '@tale-ui/core';                  // tokens — required when using per-component imports
import '@tale-ui/react-styles/button';
import '@tale-ui/react-styles/dialog';
```

## Documentation

For the complete guides on typography, colour system, dark mode, component composition patterns, accessibility, and framework integration:

- [React setup guide](https://raw.githubusercontent.com/Tale-UI/core/main/docs/react-setup.md) — full consumer walkthrough
- [Design tokens reference](https://raw.githubusercontent.com/Tale-UI/core/main/packages/css/docs/ai-reference.md) — every CSS class, token, and valid value
- [Design philosophy](https://raw.githubusercontent.com/Tale-UI/core/main/docs/design-philosophy.md) — architectural decisions
- [Component authoring](https://raw.githubusercontent.com/Tale-UI/core/main/docs/authoring-components.md) — contributor guide

### Per-component documentation

Each component has a detailed usage guide with imports, sub-parts, props, and examples. Fetch the doc for any component by name:

```
https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/{name}.md
```

For example: `button.md`, `dialog.md`, `select.md`, `checkbox.md`, `tabs.md`, `table.md`, `date-picker.md`.

## License

MIT
