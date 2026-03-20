# Tale UI — CLAUDE.md snippet for consuming projects

Copy the section below into your project's `CLAUDE.md` file.

---

## UI Components (@tale-ui/react)

This project uses `@tale-ui/react` for all UI components.

Before generating or modifying component code, you MUST:

1. **Read the setup guide** in `node_modules/@tale-ui/react/README.md` — it contains critical configuration (font-size base, style imports, dark mode, theme overrides) that will produce broken output if skipped.

2. **Check the JSDoc `@example` on each component's .d.ts export** before using it. Every component's Root export includes a `@example` block showing the correct import path, sub-parts, and composition pattern. Read the `.d.ts` file for each component you intend to use:

   ```
   node_modules/@tale-ui/react/esm/{name}/{Name}.styled.d.ts
   ```

   The `@example` block at the top of each file is the authoritative usage reference.

3. **For deeper details** (all props, all variants, advanced patterns), read the local component doc:

   ```
   node_modules/@tale-ui/react/docs/{name}.md
   ```

4. **Do not guess component APIs.** Always check the `@example` block first. Incorrect usage (wrong sub-part names, missing wrapper components, wrong import paths) causes build failures.

5. **Common pitfalls to avoid:**
   - `Table`, `Drawer`, `Meter`, `ProgressBar`, `NumberField`, etc. are namespace objects — always use `<Component.Root>`, never `<Component>` directly.
   - `Drawer.Backdrop` must be a self-closing sibling of `Drawer.Popup` (`<Drawer.Backdrop />`), never a wrapper around it.
   - `Meter.Value` and `ProgressBar.Value` need children text (e.g. `<Meter.Value>60%</Meter.Value>`), not self-closing.
   - `NumberField.Increment` and `NumberField.Decrement` render their own `+`/`−` icons — use them self-closing.
   - `ToggleButtonGroup` requires `aria-label` or `aria-labelledby` for accessibility.
   - Dark mode: always set `data-color-mode` to `"dark"` or `"light"` — never remove the attribute to switch to light mode.
   - `Calendar.GridHeader` passes day name strings, not dates — use `Calendar.GridHeaderCell` inside it, not `Calendar.Cell`. Reserve `Calendar.Cell` for `Calendar.GridBody`.
   - `Calendar.Heading` must have no vertical margin or padding — do not add spacing to it or wrap it in an element that adds margins (e.g. `<h2>`).
   - Do NOT nest `ColorSlider` inside `ColorPicker.Root` — the context does not propagate and causes "Unknown color channel: hue" at runtime. Use `ColorArea` and `ColorSlider` as standalone components with shared `useState`.
   - `Checkbox.Indicator` does NOT render a checkmark on its own — you must provide a child SVG icon.
   - `AlertDialog.Trigger`, `Drawer.Trigger`, and `Drawer.Close` do NOT auto-apply `tale-button` — you must add both `tale-button` and the variant class explicitly.
   - `Dialog.Backdrop` must **wrap** `Dialog.Popup` (opposite of Drawer).

6. **Dark mode must persist between refreshes.** Every new app must:

   a. Add `class="tale-ui"` and `data-color-mode` to `<html>`:
   ```html
   <html class="tale-ui" data-color-mode="light">
   ```

   b. Include this inline script in `<head>` before any CSS or JS to avoid a flash of wrong theme:
   ```html
   <script>
     (function() {
       var mode = localStorage.getItem('color-mode')
         || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
       document.documentElement.setAttribute('data-color-mode', mode);
     })();
   </script>
   ```

   c. Use `ColorModeToggle` for the toggle UI — it handles `localStorage` and `data-color-mode` automatically:
   ```tsx
   import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';

   <ColorModeToggle />
   ```
