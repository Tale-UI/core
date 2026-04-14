# Changelog — @tale-ui/react-styles

All notable changes to the component styles package are documented in this file.

## v1.3.44 — 2026-04-14

No changes — version bump for coordinated release.

## v1.3.43 — 2026-04-14

No changes — version bump for coordinated release.

## v1.3.42 — 2026-04-04

No changes — version bump for coordinated release.

## v1.3.41 — 2026-03-31

### Changed

- **button.css:** Added `width: fit-content` so buttons no longer stretch to fill their container by default.
- **number-field.css:** Added `width: fit-content` to root; changed input from `flex: 1` to `flex: 0 0 6rem` for consistent sizing.

## v1.3.40 — 2026-03-31

### Changed

- **Card:** Tightened padding for all sizes (sm: `xs`, md: `s`, lg: `m`).
- **SelectNative:** Changed width from `100%` to `fit-content` with `max-width: 100%` for intrinsic sizing.

## v1.3.39 — 2026-03-30

### Changed

- **badge.css:** Replaced 20 individual named-color variant classes with single `.tale-badge--color` using `--color-*` tokens. Background uses `color-mix(in srgb, var(--color-60) 15%, var(--neutral-5))`.
- **banner.css:** Info variant (`.tale-banner--info`) uses neutral tokens (neutral-90 bg, neutral-5 text). Added custom action button and close button styles for info variant visibility. Color variants use `--color-*` tokens via `.color-*` theme classes.

## v1.3.38 — 2026-03-29

### Changed

- Updated `_primitives.css`, banner, icon-button, rating-stars, scroll-area, select-native, social-button, switch, tabs, and toggle-button CSS.

## v1.3.37 — 2026-03-27

### Fixed

- CSS override scoping fixes in playground.

## v1.3.36 — 2026-03-27

### Added

- **button.css:** `inverse` variant styles.
- CSS for 9 new components: AppStoreButton, Badge, DotIcon, FeaturedIcon, PaymentInput, RatingBadge, RatingStars, SelectNative, SocialButton.
- `_dark-overrides.css` for explicit dark mode overrides.

### Fixed

- **NumberField:** Remove spurious `background-color` from group wrapper; move correct shade to stepper buttons.
- **Slider** and **Combobox** style refinements.

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
