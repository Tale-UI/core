# UntitledUI Pro vs Tale UI — Side-by-Side Comparison

## Architecture Overview

| Dimension | UntitledUI Pro | Tale UI |
|---|---|---|
| **Package model** | Single starter kit (copy source) | Published npm packages (monorepo) |
| **Workspace** | Single package | pnpm workspaces (css, react, styles, utils) |
| **React version** | 19.2.4 | 18/19 compatible |
| **Accessibility** | React Aria Components | React Aria Components |
| **TypeScript** | Yes (5.9.3) | Yes |
| **Build tool** | Vite | Vite (playground) + Lerna (packages) |
| **Styling approach** | Tailwind CSS (utility-first) | BEM + CSS custom properties (token-based) |

## Component Composition

### UntitledUI: Pre-composed + Namespace

Simple components are single tags; complex components use namespace objects:

```tsx
// Simple — single tag
<Checkbox label="Remember me" size="sm" />
<Toggle label="Notifications" />
<Button color="primary" size="md">Save</Button>

// Complex — namespace compound
<TextEditor.Root>
    <TextEditor.Toolbar />
    <TextEditor.Content />
</TextEditor.Root>

// Data-driven — items array
<RadioGroups.IconCard items={[...]} />
```

### Tale UI: Compound Parts

All components expose composable parts for explicit structure:

```tsx
// Consumer controls the structure
<Checkbox.Root value="apple">
    <Checkbox.Indicator>
        <Icon icon={Check} size="sm" />
    </Checkbox.Indicator>
    Apple
</Checkbox.Root>

// Complex — same pattern, more parts
<Select.Root>
    <Select.Label>Country</Select.Label>
    <Select.Trigger />
    <Select.Popover>
        <Select.ListBox>
            <Select.Option value="us">United States</Select.Option>
        </Select.ListBox>
    </Select.Popover>
</Select.Root>
```

### Trade-offs

| Factor | UntitledUI (pre-composed) | Tale UI (compound parts) |
|---|---|---|
| Lines of consumer code | Fewer | More |
| Structure correctness | Guaranteed | Consumer responsibility |
| Customization | Props/slots only | Full JSX control |
| CSS targeting | Must know internal BEM/classes | Parts = visible elements |
| Debugging | Structure hidden | Structure in JSX |
| Learning curve | Lower initial | Higher initial, lower ceiling |

## Styling

### UntitledUI: Tailwind Utility Classes

```tsx
// Styles co-located in component files
const styles = sortCx({
    common: { root: "inline-flex items-center rounded-lg" },
    sizes: { sm: { root: "h-8 px-3 text-sm" } },
    colors: { primary: { root: "bg-brand-solid text-white" } },
});

// Applied via cx() merge
<button className={cx(styles.common.root, styles.sizes[size].root)} />
```

### Tale UI: BEM + CSS Tokens

```css
/* Styles in separate packages/styles/src/ files */
.tale-button { /* base */ }
.tale-button--primary { background: var(--color-primary-9); }
.tale-button--sm { height: var(--space-xl); padding: var(--space-xs); }
.tale-button[data-disabled] { opacity: 0.45; }
```

```tsx
// Styled component applies BEM classes automatically
<Button variant="primary" size="sm">Save</Button>
// Renders: <button class="tale-button tale-button--primary tale-button--sm">
```

### Trade-offs

| Factor | UntitledUI (Tailwind) | Tale UI (BEM + tokens) |
|---|---|---|
| Consumer overrides | `className` prop or Tailwind config | CSS targeting BEM classes |
| Theming | CSS variables in theme.css | CSS custom properties from @tale-ui/core |
| Dark mode | `.dark-mode` class on `<html>` | `data-color-mode="dark"` on `<html>` |
| Bundle | All Tailwind utils (tree-shaken) | Separate CSS package, only import what you need |
| Predictability | Must read className to know output | BEM classes are documented and stable |
| Override specificity | `cx()` handles merge conflicts | Standard CSS cascade |
| Inspector debugging | Long utility class lists | Semantic BEM class names |

## Documentation

### UntitledUI

- **CLAUDE.md** (36KB): Single comprehensive AI guide
- **JSDoc**: Props-level documentation
- **TypeScript**: Interfaces as implicit docs
- **External**: untitledui.com for consumer docs
- **No Storybook, no per-component markdown**

### Tale UI

- **CLAUDE.md** (root + per-package): Layered instructions
- **docs/components/{name}.md**: Per-component usage guide (all 67 components)
- **JSDoc**: Props + `@example` blocks
- **TypeScript**: Full interfaces
- **Storybook**: Interactive component browser
- **ComponentAudit.tsx**: Exercises all components in one page
- **ai-reference.md**: Token/class reference for AI

### Trade-offs

| Factor | UntitledUI | Tale UI |
|---|---|---|
| AI context loading | 1 file read (36KB) | Multiple files |
| Completeness | Partial (~8 components detailed) | Comprehensive (all components) |
| Maintenance burden | Single file | Many files to sync |
| Consumer docs | External website | In-repo markdown |
| Visual demos | None | Storybook + playground |

## Export Patterns

### UntitledUI

```tsx
// Named exports (simple)
export const Checkbox = ...;
export const CheckboxBase = ...;

// Namespace object (complex)
export const TextEditor = { Root, Content, Label, ... };

// Type-augmented namespace
const _Select = Select as typeof Select & { ComboBox, Item };
export { _Select as Select };

// Barrel re-exports (variants)
export { RadioGroupIconCard as IconCard } from "./radio-group-icon-card";
```

### Tale UI

```tsx
// index.ts re-exports styled version
export { CheckboxRoot as Root } from './CheckboxRoot.styled';
export { CheckboxIndicator as Indicator } from './CheckboxIndicator.styled';

// Consumer import
import { Checkbox } from '@tale-ui/react/checkbox';
// Access: Checkbox.Root, Checkbox.Indicator
```

## State Management

### UntitledUI

- React Aria render functions for state access
- React Context for group → child propagation
- React Hook Form integration for forms
- `useState`/`useRef` for local state

### Tale UI

- React Aria render functions (same foundation)
- React Aria built-in context (less custom context)
- React Aria native form validation
- Simpler state model (fewer abstractions)

## React Aria Integration

### UntitledUI

```tsx
// Always aliased with Aria prefix
import { Checkbox as AriaCheckbox } from "react-aria-components";

// Wrapped with render function
<AriaCheckbox {...props}>
    {({ isSelected }) => <CheckboxBase isSelected={isSelected} />}
</AriaCheckbox>
```

### Tale UI

```tsx
// Direct styled wrapper
import { Checkbox as AriaCheckbox } from "react-aria-components";

// Styled component applies BEM and forwards props
const CheckboxRoot = styled(AriaCheckbox, {
    className: 'tale-checkbox',
    // ...
});
```

Both libraries use React Aria Components as the foundation. The difference is in the wrapping layer — UntitledUI adds visual rendering in the wrapper, while Tale UI adds BEM class names and forwards to the consumer's JSX tree.

## Project Structure

### UntitledUI

```
pro/
├── src/components/
│   ├── base/           # 20 component categories
│   ├── application/    # 12 complex components
│   ├── foundations/     # Icons, logos, tokens
│   ├── marketing/      # Marketing components
│   └── shared-assets/  # Utility visuals
```

### Tale UI

```
core/
├── packages/
│   ├── css/            # Design tokens (@tale-ui/core)
│   ├── react/src/      # 67 component directories
│   ├── styles/src/     # CSS per component (@tale-ui/react-styles)
│   └── utils/          # Shared utilities
├── playground/
│   ├── vite-app/       # Dev playground
│   └── storybook/      # Storybook stories
└── docs/components/    # Per-component markdown
```

### Key Structural Differences

- UntitledUI: everything in one package, styles co-located in components
- Tale UI: separated concerns — tokens, components, styles, utils as distinct packages
- UntitledUI: no separate CSS package — Tailwind classes are the style layer
- Tale UI: explicit CSS layer that consumers can override independently

## Icon System

### UntitledUI

- `@untitledui/icons` (1,100+ free)
- `@untitledui-pro/icons` (4,600+ pro, 4 styles)
- Passed as component function or ReactNode with `data-icon` attribute

### Tale UI

- External icon libraries (e.g., Lucide)
- Wrapped in `<Icon>` component with size/accessibility props
- Consumer chooses icon library

## Summary

| Category | UntitledUI Pro | Tale UI |
|---|---|---|
| **Target consumer** | Developers building apps (starter kit) | Teams adopting a design system |
| **Customization model** | Fork/modify source, Tailwind config | CSS overrides on BEM classes, token overrides |
| **Component philosophy** | Hide complexity, expose props | Expose structure, enable composition |
| **Style system** | Tailwind utility classes | Semantic CSS tokens + BEM |
| **Documentation** | Centralized CLAUDE.md + external | Distributed per-component docs |
| **Demo/showcase** | None built-in | Playground + Storybook |
| **Maintenance model** | Update source directly | Package updates via npm |
