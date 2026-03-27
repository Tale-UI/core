# Demos, Stories, and Testing

How Tale UI's interactive showcases, Storybook stories, and test infrastructure work as an integrated system.

---

## Overview

Tale UI maintains three complementary verification layers:

| Layer | Tool | Location | Purpose |
|-------|------|----------|---------|
| **Interactive stories** | Storybook 8 | `playground/storybook/` | Per-component interactive exploration with controls |
| **Component Audit** | Vite app | `playground/vite-app/` | All-components-on-one-page visual audit |
| **Automated tests** | Vitest + Playwright | `packages/react/src/*/` | BEM correctness, behaviour, accessibility |

---

## Storybook (56 Stories)

### Location
`playground/storybook/src/stories/` — 56 story files (some components share a story file; not every component has its own).

### Story Authoring Pattern

Every story follows this structure:

```typescript
import type { Meta, StoryObj } from '@storybook/react';

type Args = {
  variant: 'primary' | 'neutral' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  label: string;
};

const meta: Meta<Args> = {
  title: 'Components/Button',
  argTypes: {
    variant: { control: 'select', options: [...] },
    size: { control: 'select', options: [...] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { variant: 'primary', size: 'md', disabled: false, label: 'Button' },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Button {...args}>{args.label}</Button>,
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="story-row">
      <Button variant="primary">Primary</Button>
      <Button variant="neutral">Neutral</Button>
      ...
    </div>
  ),
};
```

### Story Types

| Type | Purpose | Controls |
|------|---------|----------|
| `Default` | Interactive playground with all props | Enabled |
| `AllVariants` | Side-by-side variant comparison | Disabled |
| `AllSizes` | Side-by-side size comparison | Disabled |
| `Disabled` | Disabled state showcase | Disabled |
| Component-specific | E.g., `WithIcon`, `Destructive`, `ScrollableContent` | Varies |

### Storybook Configuration

**Config:** `.storybook/main.ts`
- Vite-based bundler
- Loads CSS tokens directly from `packages/css/src/`
- Custom `managerHead` hook injects Tale UI tokens into Storybook chrome
- File system allow-list for monorepo CSS `@import` chains

**Preview:** `.storybook/preview.ts`
- Color mode decorator (light/dark toggle on every story)
- Story sort: Foundations → Playground → Components
- Custom theme builder resolving CSS variables to RGB for Storybook's theming

**Theme:** `.storybook/theme.ts`
- `buildTheme()` resolves CSS custom properties via hidden DOM elements
- Converts token values (rgb, px) to Storybook's expected format

**Story CSS:** `src/stories/stories.css` (350+ lines)
- Layout helpers: `.story-field`, `.story-row`, `.story-col`
- Component-specific demo wrappers
- Uses Tale UI tokens for consistent spacing

---

## Component Audit (2,682 lines)

### Location
`playground/vite-app/src/demos/ComponentAudit.tsx`

### Purpose
A single-page showcase of **all visual components** for visual regression review (64 of 67 documented components — excludes non-visual utilities CSPProvider, I18nProvider, and mergeProps). Exercises every variant, size, and state of every component in one scrollable view.

### Architecture

```
ComponentAudit.tsx
├── Table of Contents (sidebar)     Anchored links to each section
├── CSS Override Panel               Live CSS injection textarea
├── Section per component            Organized by category
│   ├── Header (component name + CSS class list)
│   ├── SubHeading groups
│   │   ├── Variants
│   │   ├── Sizes
│   │   ├── States (disabled, readonly, invalid)
│   │   └── Interactive demos (controlled state)
│   └── Row containers (flex layout)
└── Category organization
    ├── Form Controls (18 components)
    ├── Date & Time (6)
    ├── Color (7)
    ├── Overlay (6)
    ├── Navigation (6)
    ├── Layout (6)
    ├── Feedback (2)
    ├── Display (5)
    ├── Form Structure (3)
    ├── Interaction (2)
    └── Utility (3)
```

### Special Features

1. **CSS Override Panel** — A textarea that accepts pasted CSS (e.g., from a design tool export). The app:
   - Injects the CSS into a `<style>` element
   - Detects `.color-*` and `.neutral-*` class names
   - Applies detected theme classes to `<html>` for live token overrides
   - Persists to `localStorage` under `tale-ui-audit-css-override`

2. **Sidebar navigation** — TOC with anchor links (`#button`, `#checkbox`, etc.) for quick jumps.

3. **Interactive demos** — Complex components get stateful demo wrappers:
   - `CalendarSection()`: Calendar with header/grid/cells
   - `ColorPickerDemo()`: ColorArea + ColorSlider with state
   - `ComboboxDemo()`: Searchable dropdown with items
   - `MenuCheckboxDemo()`, `MenuRadioDemo()`: Menu selection variants
   - `DialogDemo()`, `DestructiveDialogDemo()`, `DismissableDialogDemo()`
   - `SortableTableDemo()`: Table with sorting state
   - `ControlledTabsDemo()`: Controlled tab selection

---

## Testing Infrastructure

### Stack

| Tool | Purpose |
|------|---------|
| Vitest | Test runner and assertions |
| @testing-library/react | DOM queries and rendering |
| @testing-library/user-event | User interaction simulation |
| chai + chai-dom | Assertion library |
| Playwright | Browser-based tests (chromium, webkit, firefox) |

### Test File Conventions

```
packages/react/src/{component}/
  {Component}.test.tsx      jsdom unit tests
  {Component}.spec.tsx      browser tests (optional, via Playwright)
```

### Test Utilities (`test/test-utils.ts`)

- `createRenderer()` — Factory producing render helpers with optional fake timers
- `screen`, `fireEvent`, `waitFor`, `within` — Re-exported from Testing Library
- `userEvent.setup()` — Pre-configured user event instance
- `setProps()`, `setPropsAsync()`, `forceUpdate()` — Re-render helpers
- SSR support: `renderToString()` and `.hydrate()`

### Custom Assertions (`test/setupVitest.ts`)

- `.toErrorDev()` — Capture expected `console.error` calls
- `.toBeInaccessible()` — Verify `aria-hidden` / `display:none`
- `failOnConsole()` — Fail tests on unexpected console warnings
- Global: `TALE_UI_ANIMATIONS_DISABLED = true`
- Touch polyfill for jsdom

### Test Patterns

```typescript
// 1. BEM class verification
it('applies BEM classes', () => {
  render(<Button variant="primary" size="md">Click</Button>);
  expect(screen.getByRole('button')).to.have.class('tale-button');
  expect(screen.getByRole('button')).to.have.class('tale-button--primary');
  expect(screen.getByRole('button')).to.have.class('tale-button--md');
});

// 2. className merging
it('merges consumer className', () => {
  render(<Button className="custom">Click</Button>);
  expect(screen.getByRole('button')).to.have.class('tale-button');
  expect(screen.getByRole('button')).to.have.class('custom');
});

// 3. Data attribute states
it('sets data-disabled', () => {
  render(<Button disabled>Click</Button>);
  expect(screen.getByRole('button')).to.have.attribute('data-disabled');
});

// 4. Ref forwarding
it('forwards ref', () => {
  const ref = React.createRef<HTMLButtonElement>();
  render(<Button ref={ref}>Click</Button>);
  expect(ref.current).to.be.instanceOf(HTMLButtonElement);
});

// 5. User interactions
it('calls onPress', async () => {
  const onPress = vi.fn();
  render(<Button onPress={onPress}>Click</Button>);
  await user.click(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalledOnce();
});
```

### Vitest Configuration

**Root:** `vitest.config.mts`
- Projects: `packages/*/vitest.config.mts`, `docs/vitest.config.mts`, `test/e2e`, `test/regressions`
- Coverage: Istanbul provider, includes `packages/*/src/**/*.{ts,tsx}`

**Commands:**
- `pnpm test:jsdom` — Fast jsdom environment
- `pnpm test:chromium` — Real browser via Playwright

---

## Integration Diagram

How source, docs, stories, audit, and tests form a verification system:

```
┌─────────────────────────────────────────────────┐
│            Component Source                       │
│  packages/react/src/button/Button.styled.tsx     │
│  • BEM classes via cx()                          │
│  • JSDoc with @example                           │
│  • Props interface with variant/size             │
└──────────┬──────────┬──────────┬────────────────┘
           │          │          │
     ┌─────▼────┐ ┌───▼────┐ ┌──▼──────────────┐
     │  Tests   │ │  Docs  │ │  Visual Demos    │
     │          │ │        │ │                  │
     │ .test.tsx│ │ .md    │ │ Stories + Audit  │
     └──────────┘ └────────┘ └─────────────────┘
           │          │          │
           ▼          ▼          ▼
     ┌─────────────────────────────────────────┐
     │          Verification                    │
     │  • Tests: BEM classes correct?           │
     │  • Tests: Props map to attributes?       │
     │  • Tests: Events fire correctly?         │
     │  • Docs: Import paths accurate?          │
     │  • Docs: CSS classes listed?             │
     │  • Stories: All variants rendered?       │
     │  • Audit: Visual appearance correct?     │
     └─────────────────────────────────────────┘
```

### What Each Layer Catches

| Issue | Tests | Docs | Stories | Audit |
|-------|-------|------|---------|-------|
| Wrong BEM class | Yes | — | — | — |
| Missing prop | Yes | — | — | — |
| Broken interaction | Yes | — | — | — |
| Outdated import path | — | Manual review | — | — |
| Visual regression | — | — | Visual | Visual |
| Dark mode issues | — | — | Yes (decorator) | Yes (override panel) |
| Token override issues | — | — | — | Yes (CSS panel) |
| Missing variant | — | — | Yes (AllVariants) | Yes |
| Accessibility | Yes (.toBeInaccessible) | Notes | — | — |

---

## Quantitative Summary

| Metric | Value |
|--------|-------|
| Storybook stories | 56 files |
| Component Audit | 1 file, 2,682 lines, 64 visual components |
| Test files | Co-located in component dirs |
| Test environments | jsdom (fast) + chromium/webkit/firefox (real browser) |
| Story CSS helpers | 350+ lines |
| Custom test assertions | 3 (toErrorDev, toBeInaccessible, failOnConsole) |
