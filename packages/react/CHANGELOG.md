# Changelog — @tale-ui/react

All notable changes to the React component library are documented in this file.

## v1.3.34 — 2026-03-26

### Fixed

- **JSDoc examples:** CheckboxGroup now shows Icon+check inside Indicator; DateRangePicker dash marked `aria-hidden`; Fieldset gets `@example` block; ProgressBar and Slider examples wrap Label/Value in Header.
- **Styles:** Accordion header heading margins reset; textarea `box-sizing: border-box`; fieldset legend `border: none` in primitives reset.

## v1.3.33 — 2026-03-26

### Added

- **Icon** and **IconButton** components with lucide-react integration for consistent icon rendering and accessible icon-only buttons.
- **CSPProvider**, **I18nProvider**, and **mergeProps** utility now have dedicated docs and JSDoc.
- **PreviewCard** styled sub-components (Trigger, Popover, Content, Heading, Avatar).
- New component docs for Icon, IconButton, CSPProvider, I18nProvider, mergeProps, RadioGroup, and ToggleGroup.

### Changed

- **IconButton** now requires `aria-label` — enforced via TypeScript prop type.
- **CheckboxGroup** and **RadioGroup** accept top-level `label` and `description` props.
- Accordion, AlertDialog, Calendar, Combobox, DatePicker, DateRangePicker, Dialog, NavigationMenu, NumberField, Popover, RangeCalendar, SearchField, and Select components updated to use `Icon` sub-components internally.
- Docs, JSDoc, Storybook stories, and ComponentAudit aligned across all 67 components.
- Consumer CLAUDE.md snippet expanded with token size suffix, layout utility, and Select.placeholder pitfalls.
- Removed example apps (vite-css, tanstack-start-tailwind-css) in favour of docs.

### Fixed

- Dialog close button and Drawer popup spacing tightened in styles.

## v1.3.32 — 2026-03-25

### Fixed

- **Packaging:** `@tale-ui/react/styles` CSS import was missing from the published tarball. The build script now handles object-form CSS exports (`{ types, default }`) in addition to plain string exports.

## v1.3.31 — 2026-03-25

### Changed

- **Select:** Moved `placeholder` prop from `Select.Value` to `Select.Root` for cleaner API.
- **CheckboxGroup / RadioGroup:** Added `label` and `description` props.
- **Styles export:** Added TypeScript declaration for `@tale-ui/react/styles` CSS import.

### Docs

- Consumer CLAUDE.md snippet: added Select placeholder, token size suffix, and layout utility pitfalls.
- Updated Select component docs and stories to use new placeholder location.

## v1.3.30 — 2026-03-25

### Fixed

- Postinstall setup script (`setup.mjs`) now includes the trigger component pitfall — trigger components render their own `<button>`, never nest a `<Button>` inside them.

## v1.3.29 — 2026-03-25

### Docs

- Updated consumer CLAUDE.md snippet: added pitfall about trigger components rendering their own `<button>` — never nest a `<Button>` inside them.

## v1.3.28 — 2026-03-25

### Fixed

- **Container:** Per-shade foreground token overrides for light-coloured palettes. The `Container` component now computes WCAG contrast ratios for each palette shade and overrides `--color-*-fg` tokens where the non-default endpoint provides better contrast, ensuring readable text on every shade — including `random` and all named colour palettes.
