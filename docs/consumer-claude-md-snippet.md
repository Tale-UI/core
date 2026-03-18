# Tale UI — CLAUDE.md snippet for consuming projects

Copy the section below into your project's `CLAUDE.md` file.

---

## UI Components (@tale-ui/react)

This project uses `@tale-ui/react` for all UI components. Before generating or modifying component code, you MUST:

1. **Read the setup guide** in `node_modules/@tale-ui/react/README.md` — it contains critical configuration (font-size base, style imports, dark mode, theme overrides) that will produce broken output if skipped.

2. **Fetch the component's documentation** before using it. Each component has a detailed guide with imports, sub-parts, props, and examples:

   ```
   https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/{name}.md
   ```

   Replace `{name}` with the component name in kebab-case. For example, when building a form with a button, select, and date picker, fetch:
   - `https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/button.md`
   - `https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/select.md`
   - `https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/date-picker.md`

   Available components: accordion, alert-dialog, autocomplete, avatar, breadcrumbs, button, calendar, checkbox, checkbox-group, color-area, color-field, color-picker, color-slider, color-swatch, color-swatch-picker, color-wheel, combobox, context-menu, date-field, date-picker, date-range-picker, dialog, disclosure, drawer, drop-zone, field, fieldset, file-trigger, form, grid-list, input, link, menu, menubar, meter, navigation-menu, number-field, popover, preview-card, progress-bar, radio, range-calendar, scroll-area, search-field, select, separator, slider, switch, table, tabs, tag-group, text-area, text-field, time-field, toggle-button, toolbar, tooltip, tree.

3. **Do not guess component APIs.** If you are unsure about a component's props, sub-parts, or composition pattern, fetch its documentation first. Incorrect usage (wrong sub-part names, missing wrapper components, wrong prop names) is harder to debug than taking a moment to read the docs.

4. **Common pitfalls to avoid:**
   - `Table`, `Drawer`, `Meter`, `ProgressBar`, `NumberField`, etc. are namespace objects — always use `<Component.Root>`, never `<Component>` directly.
   - `Drawer.Backdrop` must be a self-closing sibling of `Drawer.Popup` (`<Drawer.Backdrop />`), never a wrapper around it.
   - `Meter.Value` and `ProgressBar.Value` need children text (e.g. `<Meter.Value>60%</Meter.Value>`), not self-closing.
   - `NumberField.Increment` and `NumberField.Decrement` render their own `+`/`−` icons — use them self-closing.
   - `ToggleButtonGroup` requires `aria-label` or `aria-labelledby` for accessibility.
   - Dark mode: always set `data-color-mode` to `"dark"` or `"light"` — never remove the attribute to switch to light mode.
