# Component Architecture

How Tale UI's React components are structured, styled, and exported.

---

## Overview

The `@tale-ui/react` package contains **67 documented components** and **7 internal/utility packages** across 74 directories in `packages/react/src/`. Every component wraps a React Aria Component (or is custom-built) and automatically applies BEM class names. Styling lives in a separate CSS package (`@tale-ui/react-styles`), keeping runtime cost at zero.

---

## Package Layout

```
packages/
├── react/          @tale-ui/react          Styled React components (BEM auto-applied)
│   └── src/
│       ├── button/
│       │   ├── Button.styled.tsx          Component source
│       │   ├── Button.test.tsx            Unit tests
│       │   └── index.ts                   Public API
│       ├── dialog/
│       │   ├── Dialog.styled.tsx
│       │   ├── index.ts
│       │   └── index.parts.ts            Individual part exports
│       ├── _cx.ts                         Class name helper
│       ├── utils/                         Internal utilities
│       └── react-aria-adapters/           State mapping helpers
├── styles/         @tale-ui/react-styles   CSS per component (no build step)
│   └── src/
│       ├── index.css                      All-in-one import
│       ├── _primitives.css                Shared selector groups (1,150 lines)
│       ├── button.css                     Per-component CSS
│       └── ... (58 component CSS files + _primitives.css + index.css)
├── utils/          @tale-ui/utils          Shared hooks and helpers
│   └── src/                               25 utility files
└── css/            @tale-ui/core           Design tokens (no component code)
```

---

## Component Patterns

### Pattern 1: Simple Component

**Example: Button** — Single element, no sub-parts.

```
button/
├── Button.styled.tsx    Props + forwardRef + BEM classes
├── Button.test.tsx      Unit tests
└── index.ts             Re-exports Button + ButtonProps
```

**Key characteristics:**

- Props interface extends React Aria, omits `className`, adds `variant`/`size`
- `React.forwardRef` wrapping
- BEM classes applied via `cx()`: `tale-button tale-button--${variant} tale-button--${size}`
- `displayName` set for DevTools
- `disabled` convenience alias for `isDisabled` (on components that support it, e.g., Button)

**Export:** `export { Button } from './Button.styled'`

### Pattern 2: Multi-Part (Compound) Component

**Example: TextField** — Root + Label + Input + Description + ErrorMessage.

```
text-field/
├── TextField.styled.tsx   All parts as named exports
└── index.ts               Namespace export: `export * as TextField`
```

**Key characteristics:**

- Each part is a separate `forwardRef` component
- Each part has its own Props interface
- `displayName` follows `ComponentName.PartName` convention (e.g., `TextField.Root`)
- BEM elements: `.tale-text-field`, `.tale-text-field__input`, `.tale-text-field__label`

**Export:** `export * as TextField from './TextField.styled'`
**Consumer usage:** `<TextField.Root>`, `<TextField.Input>`, etc.

**Optional `index.parts.ts`** — Exports individual parts for advanced tree-shaking:
```typescript
export { Root, Input, Label } from './TextField.styled';
```

### Pattern 3: Complex Composed Component

**Example: Dialog** — Composes multiple React Aria primitives into a cohesive API.

```
dialog/
├── Dialog.styled.tsx    Root, Trigger, Backdrop, Popup, Title, Description, Close, Actions
├── index.ts
└── index.parts.ts
```

**Key characteristics:**

- Some parts are direct re-exports (`Root = DialogTrigger`)
- Some wrap lower-level Aria components (Popup wraps `ModalOverlay` + `Modal` + `Dialog`)
- Pass-through props like `modalProps` for wrapper-level control
- Lucide React icons for default close button
- Complex children patterns (render props, conditional content)

### Pattern 4: Generic Component

**Example: Table** — Uses TypeScript generics for typed row data.

**Key characteristics:**

- Generic function signatures: `<T extends object>`
- `as any` cast pattern to work around TypeScript's `forwardRef` generic limitations
- Type overloads for proper consumer-facing types
- Same BEM pattern applied regardless of generics

---

## The `cx()` Helper

All components use a lightweight class name composition utility (`packages/react/src/_cx.ts`):

```typescript
export function cx(base: string, extra?: ClassName): ClassName {
  if (typeof extra === 'function') {
    return (state: any) => {
      const result = extra(state);
      return result ? `${base} ${result}` : base;
    };
  }
  return extra ? `${base} ${extra}` : base;
}
```

- Merges BEM base classes with consumer-provided `className`
- Supports React Aria's function-based `className` pattern (state → string)
- No external dependency (not clsx)

---

## BEM Naming Convention

| Level | Pattern | Example |
|-------|---------|---------|
| Block | `.tale-{component}` | `.tale-button` |
| Element | `.tale-{component}__{part}` | `.tale-text-field__input` |
| Modifier (variant) | `.tale-{component}--{variant}` | `.tale-button--primary` |
| Modifier (size) | `.tale-{component}--{size}` | `.tale-button--sm` |

**State is expressed via data attributes, NOT BEM modifiers:**

| Attribute | Meaning |
|-----------|---------|
| `[data-disabled]` | Disabled state |
| `[data-open]` | Open/expanded |
| `[data-selected]` | Selected/checked |
| `[data-pressed]` | Active press |
| `[data-focus-visible]` | Keyboard focus ring |
| `[data-focused]` | Any focus |
| `[data-hovered]` | Hover |
| `[data-invalid]` | Validation error |
| `[data-entering]` / `[data-exiting]` | Animation states |
| `[data-placement]` | Popover position |

---

## CSS Architecture

### Per-Component CSS (`packages/styles/src/`)

58 component CSS files (plus `_primitives.css` and `index.css`). Each component file:

- Uses design tokens (`--color-*`, `--neutral-*`, `--space-*`, `--radius-*`) for colors, spacing, and typography — some raw `rgba()` values appear in box-shadow declarations
- Styles states via `[data-*]` attribute selectors
- Never uses `--brand-*` tokens (those are palette-only)
- Includes hover, focus, disabled, and dark-mode-aware styling automatically

### Shared Primitives (`_primitives.css`, 1,150 lines)

22 grouped selector blocks for declarations that are byte-for-byte identical across components:

1. **Field Control** — Input, Select trigger, Combobox input, etc. (base, focus, placeholder)
2. **Field Label** — Layout for labeled field components
3. **Dropdown Popup** — Popover/select/menu popups
4. **Dropdown Item** — List items in dropdowns
5. **Group Label** — Section headers
6. **Misc** — Separator, popup arrow, item indicator
7. **Disclosure Panel** — Accordion/disclosure animation + typography
8. **Field Description** — Help text below fields
9. **Field Error** — Error message styling
10. **Date/Time Field Root** — Temporal component layout
11. **Date/Time Segment** — Input segments
12. **Date Picker Trigger** — Calendar open button
13. **Date Picker Popover** — Calendar popup
14. **Calendar** — Grid/cell/nav styling
15. **Heading Reset** — Shield from external heading styles
16. **Color Picker Thumb** — Shared thumb for color components
17. **Modal** — Dialog/AlertDialog/Drawer shared parts
18. **Progress/Meter** — Track/indicator/label
19. **Button Sizes** — Shared `--sm`, `--md`, `--lg` modifiers
20. **Choice Group Root** — CheckboxGroup/RadioGroup layout
21. **Combobox/Autocomplete** — Input group + empty state
22. **Semantic Element Shield** — Resets margin/padding/border on semantic HTML inside `.tale-*` containers

**Rule:** When adding a new field-like input, dropdown popup, or list item — check `_primitives.css` first and add the new selector to the relevant group.

---

## Props Conventions

| Convention | Details |
|------------|---------|
| Base props | Extend React Aria's props, `Omit<AriaProps, 'className'>` |
| className | Always re-added as `string \| undefined` (not function type for consumers) |
| variant | String union, defaults vary per component (`'primary'`, `'neutral'`, etc.) |
| size | String union: `'sm' \| 'md' \| 'lg'`, default `'md'` |
| disabled | Convenience alias for `isDisabled` on some components (e.g., Button) — not universal |
| Ref | All components use `React.forwardRef` |
| displayName | Set on every component for DevTools |

---

## Export Patterns

| Pattern | When Used | Example |
|---------|-----------|---------|
| Named export | Simple single-element components | `export { Button }` |
| Namespace export | Multi-part compound components | `export * as TextField` |
| Parts export | Optional granular access | `export { Root, Input }` from `index.parts.ts` |

All components are also re-exported from `packages/react/src/index.ts` and available via subpath imports: `@tale-ui/react/button`, `@tale-ui/react/text-field`, etc.

---

## Component Inventory (67 Documented + 7 Internal)

**Form Controls (18):** Autocomplete, Button, Checkbox, CheckboxGroup, Combobox, IconButton, Input, NumberField, Radio, RadioGroup, SearchField, Select, Slider, Switch, TextArea, TextField, ToggleButton, ToggleGroup

**Date & Time (6):** Calendar, DateField, DatePicker, DateRangePicker, RangeCalendar, TimeField

**Color (7):** ColorArea, ColorField, ColorPicker, ColorSlider, ColorSwatch, ColorSwatchPicker, ColorWheel

**Overlay (6):** AlertDialog, Dialog, Drawer, Popover, PreviewCard, Tooltip

**Navigation (6):** Breadcrumbs, ContextMenu, Link, Menu, Menubar, NavigationMenu

**Layout (6):** Accordion, Disclosure, ScrollArea, Separator, Tabs, Toolbar

**Feedback (2):** Meter, ProgressBar

**Display (5):** Avatar, GridList, Table, TagGroup, Tree

**Form Structure (3):** Field, Fieldset, Form

**Interaction (2):** DropZone, FileTrigger

**Utility (6):** ColorModeToggle, Container, CSPProvider, I18nProvider, Icon, mergeProps

**Providers (3):** TemporalAdapterProvider, TemporalAdapterDateFns, TemporalAdapterLuxon

**Internal (4):** ReactAriaAdapters, Types, UnstableUseMediaQuery, Utils
