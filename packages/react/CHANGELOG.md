# Changelog — @tale-ui/react

All notable changes to the React component library are documented in this file.

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
