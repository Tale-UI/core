# Changelog — @tale-ui/react-styles

All notable changes to the component styles package are documented in this file.

## v1.3.35 — 2026-03-27

### Added

- **banner.css**, **carousel.css**, **empty-state.css**, **pin-input.css**, **spinner.css** — styles for five new components.
- New selectors in `index.css` for the above components.
- Additional `_primitives.css` grouped selectors for new component patterns.

### Changed

- Minor fixes to breadcrumbs, calendar, color-field, drop-zone, grid-list, link, number-field, popover, table, tabs, text-area, and tree CSS.

## v1.3.34 — 2026-03-26

### Fixed

- **Accordion:** Reset heading margins (`h1`–`h6`) inside `.tale-accordion__header` to prevent external stylesheet interference.
- **TextArea:** Add `box-sizing: border-box` to `.tale-text-area__textarea` to prevent width overflow.
- **Primitives:** Add `border: none` to fieldset legend reset.

## v1.3.33 — 2026-03-26

### Added

- **icon.css** and **icon-button.css** — styles for new Icon and IconButton components.
- PreviewCard expanded styles (trigger, avatar, heading, content).

### Changed

- Simplified `_primitives.css` grouped selectors after Icon component refactor.
- Dialog close button position tightened.
- Drawer popup spacing and actions alignment adjusted.

### Fixed

- Toolbar missing declaration restored.
- Combobox, calendar, navigation-menu, number-field, and popover CSS updated for Icon sub-component usage.
