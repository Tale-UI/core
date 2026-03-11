# Tale UI

Unified monorepo for the Tale UI design system and React component library.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [`@tale-ui/core`](packages/css/) | Modular token-based CSS design system | [![npm](https://img.shields.io/npm/v/@tale-ui/core)](https://www.npmjs.com/package/@tale-ui/core) |
| [`@tale-ui/react`](packages/react/) | Headless React components (forked from [Base UI](https://github.com/mui/base-ui)) | [![npm](https://img.shields.io/npm/v/@tale-ui/react)](https://www.npmjs.com/package/@tale-ui/react) |
| [`@tale-ui/react-styles`](packages/styles/) | Component CSS using @tale-ui/core design tokens | [![npm](https://img.shields.io/npm/v/@tale-ui/react-styles)](https://www.npmjs.com/package/@tale-ui/react-styles) |
| [`@tale-ui/utils`](packages/utils/) | Shared utilities | [![npm](https://img.shields.io/npm/v/@tale-ui/utils)](https://www.npmjs.com/package/@tale-ui/utils) |

## Installation

```bash
# CSS design system only
npm install @tale-ui/core

# React components + styles
npm install @tale-ui/react @tale-ui/react-styles
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

## Components

Accordion, Alert Dialog, Autocomplete, Avatar, Button, Checkbox, Checkbox Group, Collapsible, Combobox, Context Menu, Dialog, Drawer, Field, Fieldset, Form, Input, Menu, Menubar, Meter, Navigation Menu, Number Field, Popover, Preview Card, Progress, Radio, Radio Group, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Toolbar, Tooltip

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

## License

MIT
