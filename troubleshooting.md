# Tale UI Troubleshooting Guide

Issues encountered while setting up a Vite + React + TypeScript app with `@tale-ui/react@1.3.30`.

---

## 1. `Select.Value` — `placeholder` prop not in TypeScript types

**What the docs say** (`node_modules/@tale-ui/react/docs/select.md`):

```tsx
<Select.Value placeholder="Select a fruit..." />
```

**What actually happens:**

TypeScript error TS2322:

```
Type '{ placeholder: string; }' is not assignable to type '...SelectValueProps...'.
Property 'placeholder' does not exist on type '...'.
```

**Root cause:** `react-aria-components`'s `SelectValueProps` interface does not include a `placeholder` property. The tale-ui `ValueProps` type extends it via `Omit<AriaSelectValueProps<T>, 'className'>`, inheriting the missing prop. The prop works fine at runtime — it's purely a type-level omission.

**Workaround:**

```tsx
{/* @ts-expect-error placeholder is a runtime prop from React Aria */}
<Select.Value placeholder="Choose a country..." />
```

---

## 2. `CheckboxGroup` — `label` prop not in TypeScript types

**What the docs say** (`node_modules/@tale-ui/react/docs/checkbox-group.md`):

```tsx
<CheckboxGroup label="Favorite fruits">
  ...
</CheckboxGroup>
```

**What actually happens:**

TypeScript error TS2322:

```
Property 'label' does not exist on type '...CheckboxGroupProps...'.
```

**Root cause:** The tale-ui `CheckboxGroupProps` extends `Omit<AriaCheckboxGroupProps, 'className'>` from `react-aria-components`. However, `react-aria-components`'s own `CheckboxGroupProps` already explicitly Omits `'label'` from the base `AriaCheckboxGroupProps` (along with `'children'`, `'description'`, `'errorMessage'`, etc.). So by the time tale-ui extends it, `label` is already gone. The prop works at runtime but fails TypeScript.

**Workaround:** Use `aria-label` instead:

```tsx
<CheckboxGroup aria-label="Favorite fruits">
  ...
</CheckboxGroup>
```

---

## 3. `Radio.Group` — `label` prop not in TypeScript types

**What the docs say** (`node_modules/@tale-ui/react/docs/radio.md`):

```tsx
<Radio.Group label="Favorite color">
  ...
</Radio.Group>
```

**What actually happens:**

TypeScript error TS2322:

```
Property 'label' does not exist on type '...RadioGroupProps...'.
```

**Root cause:** Identical to the CheckboxGroup issue. `react-aria-components`'s `RadioGroupProps` explicitly Omits `'label'` from the base `AriaRadioGroupProps`. The tale-ui type extends this already-omitted type, so `label` is not available.

**Workaround:** Use `aria-label` instead:

```tsx
<Radio.Group aria-label="Favorite color">
  ...
</Radio.Group>
```

---

## 4. `@tale-ui/react/styles` — no type declaration for CSS import

**What the docs say** (`node_modules/@tale-ui/react/README.md`):

```tsx
import '@tale-ui/react/styles';
```

**What actually happens:**

TypeScript error TS2882:

```
Cannot find module or type declarations for side-effect import of '@tale-ui/react/styles'.
```

**Root cause:** The package.json `exports` field maps `"./styles"` to `./styles.css` (a plain CSS file). There is no corresponding `.d.ts` type declaration for this entry point. TypeScript strict mode requires type declarations even for side-effect-only imports.

**Workaround:** Add a module declaration in your `vite-env.d.ts` (or any `.d.ts` file included by your `tsconfig.json`):

```ts
// vite-env.d.ts
/// <reference types="vite/client" />

declare module '@tale-ui/react/styles';
```

---

## 5. `Checkbox.Indicator` renders no visible checkmark by default

**Note:** This IS documented correctly in both `docs/checkbox.md` and the `.d.ts` `@example` block, but is easy to miss.

**What happens:** If you use `<Checkbox.Indicator />` as a self-closing tag (no children), nothing visible renders when the checkbox is checked. There is no built-in checkmark icon.

**What you need to do:** Always provide an SVG icon as a child:

```tsx
const CheckIcon = () => (
  <svg viewBox="0 0 12 10" width="12" height="10" fill="none"
       stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1.5 5 4.5 8 10.5 2" />
  </svg>
);

<Checkbox.Root>
  <Checkbox.Indicator>
    <CheckIcon />
  </Checkbox.Indicator>
  Accept terms
</Checkbox.Root>
```

---

## 6. No spacing or gaps between components inside sections

**Source: AI-generated code (Claude hallucination)** — not a tale-ui issue. Claude generated the `.section` CSS class in `app.css` without flex layout or gap, resulting in no spacing between child components.

**What happens:** Components placed directly inside a container `<section>` have no visible spacing between them — everything is crammed together with no gaps.

**Root cause:** The `.section` CSS class was AI-generated and only included `padding`, `margin-bottom`, `background`, `border-radius`, and `border`. It was missing `display: flex` and `gap`, so direct children relied on default block flow with no explicit spacing. Only components wrapped in utility classes like `.row`, `.col`, or `.grid-*` received gaps.

**Fix:** Add flex column layout with a gap to `.section`:

```css
.section {
  /* ...existing styles... */
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}
```

Also zero out `h2`/`h3` margins inside sections to prevent double-spacing (flex gap + margin):

```css
.section h2 { margin: 0; }
.section h3 { margin: 0; }
```

---

## 7. CSS custom properties "not set" — wrong token suffixes

**Source: AI-generated code (Claude hallucination)** — not a tale-ui issue. Claude assumed Bootstrap-style token names (`-sm`, `-md`, `-lg`) instead of reading the actual token definitions in `@tale-ui/core`. The generated CSS referenced non-existent custom properties.

**What happens:** Spacing and border-radius values don't apply. Browser DevTools shows variables like `--space-md`, `--space-lg`, `--radius-lg` as not defined.

**Root cause:** The tale-ui design tokens (`@tale-ui/core`) use **short suffixes** (`-s`, `-m`, `-l`). Claude generated CSS with Bootstrap-style suffixes (`-sm`, `-md`, `-lg`) without verifying against the actual token definitions:

| Wrong (doesn't exist) | Correct token |
|---|---|
| `--space-sm` | `--space-s` |
| `--space-md` | `--space-m` |
| `--space-lg` | `--space-l` |
| `--radius-sm` | `--radius-s` |
| `--radius-md` | `--radius-m` |
| `--radius-lg` | `--radius-l` |

Tokens like `--space-xs`, `--space-xl`, `--space-2xl` etc. are unaffected since those names match.

**Fix:** Replace all wrong suffixes. The authoritative token definitions are in:

- `node_modules/@tale-ui/core/src/tokens/_spacing.css` (spacing)
- `node_modules/@tale-ui/core/src/tokens/_effects.css` (border-radius)

---

## Summary

| Issue | Component | Doc says | Reality | Fix |
| ----- | ----- | ----- | ----- | ----- |
| 1 | `Select.Value` | Use `placeholder` prop | Prop missing from TS types | `@ts-expect-error` |
| 2 | `CheckboxGroup` | Use `label` prop | `label` Omitted by react-aria-components | Use `aria-label` |
| 3 | `Radio.Group` | Use `label` prop | `label` Omitted by react-aria-components | Use `aria-label` |
| 4 | Style import | `import '@tale-ui/react/styles'` | No `.d.ts` for CSS entry | `declare module` in `.d.ts` |
| 5 | `Checkbox.Indicator` | Needs child icon (documented) | No built-in checkmark | Provide SVG child |
| 6 | `.section` layout | N/A | No flex/gap on section containers | Add `display: flex; flex-direction: column; gap` |
| 7 | CSS tokens | N/A | Tokens use `-s`/`-m`/`-l` suffixes | Use correct short suffixes |

Issues 1–4 are documentation inaccuracies where the docs show props/patterns that produce TypeScript errors. Issue 5 is a correctly documented gotcha that's easy to overlook. Issues 6–7 are **Claude hallucinations** — AI-generated code that didn't match tale-ui's actual API, not bugs in tale-ui itself.
