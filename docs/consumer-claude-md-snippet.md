# Tale UI — CLAUDE.md snippet for consuming projects

Copy the section below into your project's `CLAUDE.md` file.

---

## UI Components (@tale-ui/react)

This project uses `@tale-ui/react` for all UI components.

**IMPORTANT: Do NOT read .d.ts type definition files to learn component APIs.** They do not show correct import paths, composition patterns, or required wrapper components, and will lead to broken code. Always read the official documentation instead.

Before generating or modifying component code, you MUST:

1. **Read the setup guide** in `node_modules/@tale-ui/react/README.md` — it contains critical configuration (font-size base, style imports, dark mode, theme overrides) that will produce broken output if skipped.

2. **Read the component's documentation** before using it. Each component has a detailed guide with correct imports, sub-parts, props, and working examples. Read the doc for every component you intend to use:

   ```
   node_modules/@tale-ui/react/docs/{name}.md
   ```

   For example, before using Button, Select, and DatePicker, read all three:
   - `node_modules/@tale-ui/react/docs/button.md`
   - `node_modules/@tale-ui/react/docs/select.md`
   - `node_modules/@tale-ui/react/docs/date-picker.md`

   Available components: accordion, alert-dialog, autocomplete, avatar, breadcrumbs, button, calendar, checkbox, checkbox-group, color-area, color-field, color-picker, color-slider, color-swatch, color-swatch-picker, color-wheel, combobox, context-menu, date-field, date-picker, date-range-picker, dialog, disclosure, drawer, drop-zone, field, fieldset, file-trigger, form, grid-list, input, link, menu, menubar, meter, navigation-menu, number-field, popover, preview-card, progress-bar, radio, range-calendar, scroll-area, search-field, select, separator, slider, switch, table, tabs, tag-group, text-area, text-field, time-field, toggle-button, toolbar, tooltip, tree.

3. **Do not guess component APIs.** Read the documentation first — every time. Incorrect usage (wrong sub-part names, missing wrapper components, wrong import paths) causes build failures that are harder to debug than reading the docs upfront.

4. **Common pitfalls to avoid:**
   - `Table`, `Drawer`, `Meter`, `ProgressBar`, `NumberField`, etc. are namespace objects — always use `<Component.Root>`, never `<Component>` directly.
   - `Drawer.Backdrop` must be a self-closing sibling of `Drawer.Popup` (`<Drawer.Backdrop />`), never a wrapper around it.
   - `Meter.Value` and `ProgressBar.Value` need children text (e.g. `<Meter.Value>60%</Meter.Value>`), not self-closing.
   - `NumberField.Increment` and `NumberField.Decrement` render their own `+`/`−` icons — use them self-closing.
   - `ToggleButtonGroup` requires `aria-label` or `aria-labelledby` for accessibility.
   - Dark mode: always set `data-color-mode` to `"dark"` or `"light"` — never remove the attribute to switch to light mode.
   - `Calendar.GridHeader` passes day name strings, not dates — use `Calendar.GridHeaderCell` inside it, not `Calendar.Cell`. Reserve `Calendar.Cell` for `Calendar.GridBody`.
