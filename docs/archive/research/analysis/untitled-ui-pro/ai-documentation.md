# UntitledUI Pro — AI-Supporting Documentation Strategy

## Overview

UntitledUI Pro's AI documentation strategy centers on a single, comprehensive CLAUDE.md file (36KB) that serves as the definitive guide for AI tools. This is supplemented by JSDoc on exported interfaces and TypeScript types as implicit documentation.

## CLAUDE.md — The Central AI Guide

### Structure (36,993 bytes)

The CLAUDE.md covers the following sections:

1. **Project Overview** — stack, purpose, React Aria foundation
2. **Critical Architecture Principles** — import naming, file naming
3. **Project Structure** — directory layout with categories
4. **Component Patterns** — compound components, size/color variants
5. **Styling Architecture** — sortCx, cx, Tailwind integration
6. **Icon Usage** — three icon packages, passing patterns
7. **Disabled States Convention** — opacity-50 rule
8. **Component References** — Button, Input, Select, Checkbox, Radio, Badge, Avatar, FeaturedIcon, Link
9. **Color System** — complete semantic token reference
10. **Best Practices for AI** — summary rules

### Strengths

- **Single file, complete context**: An AI agent can load one file and have everything needed to generate correct code
- **Explicit naming rules**: `Aria*` prefix convention prevents import collisions
- **Color system reference**: Full semantic token listing prevents raw color usage
- **Component-specific sections**: Key components have their own reference blocks with props, sizes, and examples
- **Architecture decisions documented**: explains _why_ patterns exist, not just _what_ they are

### Weaknesses

- **36KB is large for context windows**: Some agents may truncate or summarize
- **Not all components documented**: Only ~8 components have dedicated reference sections
- **No code examples for composition**: The compound component patterns lack full usage examples
- **No troubleshooting section**: Common mistakes aren't enumerated
- **Single file maintenance burden**: As components grow, the file becomes harder to keep synchronized

## JSDoc Conventions

### Simple Props (single-line)

```tsx
/** Disables the button and shows a disabled state */
isDisabled?: boolean;

/** Shows a loading spinner and disables the button */
isLoading?: boolean;
```

### Complex Props (multi-line with context)

```tsx
/**
 * Whether the avatar should show a focus ring when the parent group is in focus.
 * For example, when the avatar is wrapped inside a link.
 *
 * @default false
 */
focusable?: boolean;
```

### Interface-Level JSDoc

```tsx
/**
 * Common props shared between button and anchor variants
 */
export interface CommonProps {
    /** The size variant of the button */
    size?: keyof typeof styles.sizes;
    /** The color variant of the button */
    color?: keyof typeof styles.colors;
}
```

### Conventions

- Single-line `/** ... */` for simple props
- Multi-line with context/examples for complex props
- `@default` tag for non-obvious defaults
- Clear, user-focused language
- Props ordered: required → optional
- No `@param` or `@returns` — component props, not functions

## TypeScript as Documentation

### Type-Safe Variants

```tsx
// Size and color constrained to defined values
size?: keyof typeof styles.sizes;    // resolves to "xs" | "sm" | "md" | "lg" | "xl"
color?: keyof typeof styles.colors;  // resolves to "primary" | "secondary" | ...
```

### Compound Component Typing

```tsx
// TypeScript enforces valid sub-components
const _Select = Select as typeof Select & {
    ComboBox: typeof ComboBox;
    Item: typeof SelectItem;
};
```

### Discriminated Props (Polymorphic)

```tsx
// Button is either a button or a link — TypeScript ensures correct props
type ButtonProps = CommonProps & AriaButtonProps & { href?: never };
type LinkProps = CommonProps & AriaLinkProps & { href: string };
export type Props = ButtonProps | LinkProps;
```

## What's NOT Documented

### No Storybook

UntitledUI Pro does not include Storybook. There are no `.stories.tsx` files. The reasoning appears to be that UntitledUI is a starter kit — consumers copy the source and use it directly, rather than browsing a component catalogue.

### No Per-Component Markdown

Unlike Tale UI (which has `docs/components/{name}.md` for every component), UntitledUI has no per-component documentation files. All documentation lives in:

1. CLAUDE.md (AI-facing)
2. JSDoc in source files
3. TypeScript interfaces
4. External docs at untitledui.com (consumer-facing)

### No Inline Code Examples

Component files don't include `@example` JSDoc blocks. The CLAUDE.md has some examples for key components, but most components rely on TypeScript types to communicate usage.

### No Architecture Decision Records

The CLAUDE.md states rules but doesn't always explain _why_ (e.g., why `opacity-50` for disabled states instead of color-based — no rationale given).

## Import Organization

Enforced by `.prettierrc` with `prettier-plugin-sort-imports`:

```json
{
    "importOrder": [
        "^react$",
        "<THIRD_PARTY_MODULES>",
        "^@/",
        "^[.]"
    ]
}
```

Order: React → external packages → `@/` absolute imports → relative imports.

## Comparison: Documentation Strategies

| Aspect | UntitledUI Pro | Tale UI |
|---|---|---|
| Primary AI doc | Single CLAUDE.md (36KB) | CLAUDE.md + per-package CLAUDE.md |
| Per-component docs | None (external website) | `docs/components/{name}.md` for each |
| JSDoc | Props-level, no `@example` blocks | Props + `@example` with full code |
| TypeScript types | Strong, used as implicit docs | Strong, supplemented by markdown |
| Code examples | In CLAUDE.md for ~8 components | In per-component markdown for all |
| Storybook | None | Yes (playground/storybook) |
| AI reference | CLAUDE.md only | CLAUDE.md + ai-reference.md |
| Context loading | 1 file read | Multiple file reads needed |
| Completeness | Partial (key components only) | Comprehensive (all components) |
| Maintenance | Single file to update | Many files to keep in sync |
