# @tale-ui/react

An accessible React component library with BEM class names applied automatically. Style via `@tale-ui/react-styles` (built on `@tale-ui/core` design tokens) and override using `className`.

## Installation

```bash
pnpm add @tale-ui/react @tale-ui/react-styles
```

`@tale-ui/react-styles` provides the CSS for every component — built on `@tale-ui/core` design tokens.

## Quick Start

```tsx
import '@tale-ui/react-styles';
import { Button } from '@tale-ui/react/button';

export default function App() {
  return <Button variant="primary">Click me</Button>;
}
```

For the full setup guide (colours, typography, dark mode): [docs/react-setup.md](../../docs/react-setup.md)

## Components

### Form Controls

Button · Checkbox · Checkbox Group · Combobox · Input · Number Field · Radio · Radio Group · Select · Slider · Switch · Toggle · Toggle Group

### Layout

Accordion · Collapsible · Scroll Area · Separator · Tabs

### Overlay

Alert Dialog · Dialog · Drawer · Popover · Preview Card · Tooltip

### Navigation

Context Menu · Menu · Menubar · Navigation Menu · Toolbar

### Feedback & Display

Avatar · Meter · Progress · Toast

### Form Structure

Autocomplete · Field · Fieldset · Form

### Utilities

Container · CSP Provider · Direction Provider · `mergeProps` · `useRender`

All components are imported from `@tale-ui/react/{name}`:

```ts
import { Dialog } from '@tale-ui/react/dialog';
import { Select } from '@tale-ui/react/select';
import { Container } from '@tale-ui/react/container';
```

## Styling

Components apply BEM base class names automatically (e.g. `tale-button`, `tale-select__popup`). State is exposed via data attributes (`data-disabled`, `data-open`, `data-checked`, etc.) for CSS selectors.

Components that support visual variants accept `variant` and/or `size` props — these apply the corresponding BEM modifier class automatically. Pass an extra `className` to add any modifier not exposed as a prop.

CSS rules live in `@tale-ui/react-styles`. See the [styles README](../styles/README.md) for architecture details and CSS class naming conventions.

## Documentation

- [React setup guide](../../docs/react-setup.md) — full consumer walkthrough
- [CSS design tokens](../css/docs/design-tokens.md) — all token values
- [Contributing](../../CONTRIBUTING.md)

## License

MIT — see [LICENSE](../../LICENSE).
