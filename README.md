# Tale UI

Unified monorepo for the Tale UI design system and React component library.

## Packages

| Package                                     | Description                                                                                            | npm                                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [`@tale-ui/core`](packages/css/)            | Modular token-based CSS design system                                                                  | [![npm](https://img.shields.io/npm/v/@tale-ui/core)](https://www.npmjs.com/package/@tale-ui/core)                 |
| [`@tale-ui/react`](packages/react/)         | Styled React components built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) | [![npm](https://img.shields.io/npm/v/@tale-ui/react)](https://www.npmjs.com/package/@tale-ui/react)               |
| [`@tale-ui/react-styles`](packages/styles/) | Component CSS using @tale-ui/core design tokens                                                        | [![npm](https://img.shields.io/npm/v/@tale-ui/react-styles)](https://www.npmjs.com/package/@tale-ui/react-styles) |
| [`@tale-ui/themes`](packages/themes/)       | Optional standard and monochrome theme suites                                                          | [![npm](https://img.shields.io/npm/v/@tale-ui/themes)](https://www.npmjs.com/package/@tale-ui/themes)             |
| [`@tale-ui/utils`](packages/utils/)         | Shared utilities                                                                                       | [![npm](https://img.shields.io/npm/v/@tale-ui/utils)](https://www.npmjs.com/package/@tale-ui/utils)               |

## Installation

```bash
# CSS design system only
npm install @tale-ui/core

# React components + styles
npm install @tale-ui/react @tale-ui/react-styles

# Optional standard themes
npm install @tale-ui/themes
```

**Requirements:** React 17, 18, or 19. Node 22+.

## Usage

### CSS Design System

```css
@import '@tale-ui/core';
```

### React Components

```tsx
import { Button } from '@tale-ui/react/button';
import '@tale-ui/react-styles/button';

export function MyButton() {
  return <Button className="tale-button tale-button--primary">Click me</Button>;
}
```

Or import all styles at once:

```tsx
import '@tale-ui/react-styles';
```

Add an optional standard theme:

```tsx
import '@tale-ui/themes/themes.css';
import { applyStandardTheme } from '@tale-ui/themes';

applyStandardTheme('harbour');
```

Or apply a monochrome theme whose brand and neutral scales share one colour anchor:

```tsx
import { applyMonochromeTheme } from '@tale-ui/themes';

applyMonochromeTheme('mountain-meadow');
```

## Components

Accordion, Alert Dialog, Autocomplete, Avatar, Breadcrumbs, Button, Calendar, Checkbox, Checkbox Group, Color Area, Color Field, Color Picker, Color Slider, Color Swatch, Color Swatch Picker, Color Wheel, Combobox, Context Menu, Date Field, Date Picker, Date Range Picker, Dialog, Disclosure, Drawer, Drop Zone, Field, Fieldset, File Trigger, Form, Grid List, Input, Link, Menu, Menubar, Meter, Navigation Menu, Number Field, Popover, Preview Card, ProgressBar, Radio, Radio Group, Range Calendar, Scroll Area, Search Field, Select, Separator, Slider, Switch, Table, Tabs, Tag Group, Text Area, Text Field, Time Field, Toggle Button, Toggle Button Group, Toolbar, Tooltip, Tree

## Development

```bash
pnpm install                 # install all workspace deps
pnpm start                   # install + launch playground
pnpm playground:dev          # run vite playground
pnpm storybook               # run storybook
pnpm build                   # build all packages
pnpm build:css               # build CSS design system only
pnpm test:jsdom              # unit tests (jsdom)
pnpm test:chromium           # unit tests (browser)
pnpm typescript              # type check
pnpm eslint                  # lint JS/TS
pnpm lint:css                # lint CSS design system
```

## Publishing

Publishing is automated via [.github/workflows/publish.yml](.github/workflows/publish.yml).

- **CSS design system:** Tag with `css-v*.*.*` (e.g. `css-v1.2.0`) or use `pnpm release:css`
- **React release set:** Tag with `react-v*.*.*` to publish `@tale-ui/utils`, `@tale-ui/react`, `@tale-ui/react-styles`, and `@tale-ui/themes` at the coordinated version
- **Themes-only exception:** Tag with `themes-v*.*.*` only for an explicitly requested package-only release
- **Manual dispatch:** Run the workflow from GitHub Actions with scope (`css`, `react`, or `themes`) and version

Requires repository secret `NPM_TOKEN` with publish permissions for the `@tale-ui` npm scope.

## License

MIT
