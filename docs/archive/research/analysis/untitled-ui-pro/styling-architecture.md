# UntitledUI Pro — Styling Architecture

## Framework: Tailwind CSS v4.2

All styling uses Tailwind utility classes — no CSS-in-JS, no separate CSS files per component, no BEM. Styles are co-located inside component `.tsx` files using the `sortCx()` utility.

## The `sortCx()` and `cx()` Utilities

### `cx()` — Class Name Merging

Wrapper around `tailwind-merge`'s `extendTailwindMerge`. Handles deduplication and conflict resolution:

```tsx
import { extendTailwindMerge } from "tailwind-merge";

export const cx = extendTailwindMerge({
    // custom merge configuration
});
```

### `sortCx()` — Style Object Organization

A no-op identity function that provides IDE IntelliSense for organized style objects:

```tsx
export function sortCx<T>(styles: T): T {
    return styles;
}
```

Used to structure component styles by concern:

```tsx
export const styles = sortCx({
    common: {
        root: "inline-flex items-center justify-center rounded-lg font-semibold transition-colors",
        icon: "shrink-0",
    },
    sizes: {
        xs: { root: "h-7 px-2 text-xs gap-1", icon: "size-3.5" },
        sm: { root: "h-8 px-3 text-sm gap-1.5", icon: "size-4" },
        md: { root: "h-9 px-3.5 text-sm gap-1.5", icon: "size-4" },
        lg: { root: "h-10 px-4 text-md gap-2", icon: "size-5" },
        xl: { root: "h-11 px-5 text-md gap-2", icon: "size-5" },
    },
    colors: {
        primary: {
            root: "bg-brand-solid text-white shadow-xs-skeuomorphic hover:bg-brand-solid-hover",
        },
        secondary: {
            root: "bg-primary text-secondary border border-primary shadow-xs-skeuomorphic hover:bg-primary-hover hover:text-secondary-hover",
        },
        tertiary: {
            root: "text-tertiary hover:bg-primary-hover hover:text-secondary-hover",
        },
        destructive: {
            root: "bg-error-solid text-white shadow-xs-skeuomorphic hover:bg-error-solid-hover",
        },
    },
});
```

### Usage in Components

```tsx
<AriaButton
    className={cx(
        styles.common.root,
        styles.sizes[size].root,
        styles.colors[color].root,
        isDisabled && "opacity-50",
        className,
    )}
>
    {children}
</AriaButton>
```

## Theme System

### theme.css (856 lines)

Defines the complete Tailwind theme using `@theme` blocks:

```css
@theme {
    /* Typography scale */
    --font-size-xs: 0.75rem;       /* 12px */
    --font-size-sm: 0.875rem;      /* 14px */
    --font-size-md: 1rem;          /* 16px */
    --font-size-lg: 1.125rem;      /* 18px */
    --font-size-xl: 1.25rem;       /* 20px */
    --font-size-display-xs: 1.5rem;    /* 24px */
    --font-size-display-sm: 1.875rem;  /* 30px */
    --font-size-display-md: 2.25rem;   /* 36px */
    --font-size-display-lg: 3rem;      /* 48px */
    --font-size-display-xl: 3.75rem;   /* 60px */
    --font-size-display-2xl: 4.5rem;   /* 72px */

    /* Spacing, radius, shadows */
    --radius-xs: 0.25rem;
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.625rem;
    --radius-xl: 0.75rem;

    /* Skeuomorphic shadows */
    --shadow-xs-skeuomorphic: 0px 1px 1px 0px rgba(10, 13, 18, 0.12), ...;
}
```

### globals.css (69 lines)

Tailwind imports and custom variants:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-animate";

@custom-variant dark (&:where(.dark-mode, .dark-mode *));
@custom-variant label (&:where(label, label *));
@custom-variant focus-input-within (&:has(input:focus));

@utility scrollbar-hide { /* hides scrollbar */ }
@utility transition-inherit-all { transition: inherit; }
```

### typography.css (430 lines)

Font definitions and text utility classes:

```css
@font-face {
    font-family: "Inter";
    src: url("InterVariable.woff2") format("woff2-variations");
}

/* Semantic text classes combining size + weight */
.text-sm-medium { font-size: 0.875rem; font-weight: 500; }
.text-md-semibold { font-size: 1rem; font-weight: 600; }
```

## Color System

### Semantic Color Classes (CRITICAL: never use raw color values)

**Text colors:**

- `text-primary` — main body text
- `text-secondary` — supporting text
- `text-tertiary` — muted text
- `text-quaternary` — very muted
- `text-disabled` — disabled state
- `text-placeholder` — input placeholders
- `text-brand-primary` — brand-colored text
- `text-error-primary` — error text
- `text-warning-primary` — warning text
- `text-success-primary` — success text

**Background colors:**

- `bg-primary` — default surface
- `bg-secondary` — elevated surface
- `bg-tertiary` — recessed surface
- `bg-brand-solid` — brand fill
- `bg-error-solid` — error fill

**Border colors:**

- `border-primary` — default borders
- `border-secondary` — subtle borders
- `border-brand` — brand-colored borders
- `border-error` — error state borders

**Foreground (icon colors):**

- `fg-primary` — default icon color
- `fg-secondary` — muted icon
- `fg-quaternary` — very muted icon
- `fg-brand-primary` — brand icon
- `fg-error-primary` — error icon

### Dark Mode

Handled by the ThemeProvider, which toggles `.dark-mode` class on `<html>`:

```tsx
// ThemeProvider sets the class
document.documentElement.classList.toggle("dark-mode", isDark);

// Tailwind custom variant targets it
@custom-variant dark (&:where(.dark-mode, .dark-mode *));
```

All semantic color tokens automatically invert in dark mode — this is why raw color values (`text-gray-900`) must never be used.

### Brand Color Customization

Brand colors are CSS variables in theme.css that can be overridden:

```css
:root {
    --color-brand-50: rgb(249 245 255);
    --color-brand-100: rgb(244 235 255);
    /* ... through 950 */
}
```

## Size Variants

Consistent across all components:

| Size | Typical usage |
|---|---|
| `xs` | Compact UI, badges, small buttons |
| `sm` | Default for form inputs |
| `md` | Default for standalone components |
| `lg` | Emphasized elements |
| `xl` | Hero sections, large CTAs |
| `2xl` | Display elements (avatars) |

## State Styling

### Via React Aria Data Attributes

```css
[data-disabled] { opacity: 0.5; }
[data-selected] { /* selected styles */ }
[data-focus-visible] { outline: 2px solid var(--color-brand-500); }
[data-hovered] { /* hover styles */ }
```

### Via Tailwind State Modifiers

```tsx
className={cx(
    "hover:bg-primary-hover",
    "focus-visible:outline-2 focus-visible:outline-brand-500",
    "disabled:opacity-50",
    "data-[selected]:bg-brand-solid",
)}
```

### Via Render Function State

```tsx
<AriaCheckbox>
    {({ isSelected, isDisabled, isFocusVisible }) => (
        <div className={cx(
            isSelected && "bg-brand-solid border-brand-solid",
            isDisabled && "opacity-50",
            isFocusVisible && "ring-2 ring-brand-500",
        )}>
            {/* visual indicator */}
        </div>
    )}
</AriaCheckbox>
```

## Disabled State Convention

Universally uses `opacity-50` instead of per-component color-based disabled styling:

```tsx
// ✅ Correct
className={cx(isDisabled && "opacity-50")}

// ❌ Incorrect
className={cx(isDisabled && "bg-gray-100 text-gray-400 border-gray-200")}
```

## Data Attributes for Component Identification

Custom data attributes used for CSS targeting and component introspection:

- `data-icon` — marks an icon element
- `data-icon-only` — button with icon only (no text)
- `data-loading` — loading state
- `data-text` — marks text content
- `data-input-wrapper` — input container
- `data-input-size` — input size variant
- `data-avatar` — avatar element
- `data-avatar-img` — avatar image
