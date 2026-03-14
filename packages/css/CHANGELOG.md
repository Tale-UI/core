# Changelog — @tale-ui/core

All notable changes to the CSS design system are documented in this file.

## v1.1.8 - 2026-03-14

### Fixed
- Fixed `--color-*-fg` tokens not re-evaluating correctly in dark mode on `.color-{name}` scoped elements. Explicitly declaring the full `--color-*` and `--color-*-fg` chains in all three mode blocks (light, OS dark, explicit dark) ensures the var() chain resolves reliably across all browsers.
- Moved per-family foreground pivot overrides (orange/sky at shade-60; amber/yellow/lime/green/emerald/teal/cyan at shade-60 and shade-70) from `_color-themes.css` into light-mode-only rules in `_color-modes.css`. This fixes those families showing light text on light backgrounds in dark mode.

## v1.1.6 - 2026-02-26

### Changed
- Updated typography and spacing guidance across the core styles and package documentation.
- Refreshed package docs pages and generated documentation output to align with current token usage.
- Updated release automation to create descriptive GitHub release titles and body content from `CHANGELOG.md`.

### Release
- Bumped `@tale-ui/core` package version to `1.1.6`.
- Updated consumer setup snippet version references to `v1.1.6`.

## v1.1.5 - 2026-02-26

### Changed
- Bumped `@tale-ui/core` package version to `1.1.5`.
- Updated documentation version references to `v1.1.5` for consumer setup snippets.

## v1.1.4 - 2026-02-25

### Changed
- Bumped `@tale-ui/core` package version to `1.1.4`.
- Updated documentation version references to `v1.1.4` for consumer setup snippets.

## v1.1.3 - 2026-02-25

### Changed
- Renamed npm package identity to `@tale-ui/core` across package metadata, release tooling, CI workflow filters, and documentation.
- Updated repository references to `Tale-UI/core` in docs and release automation.

### Published
- Published `@tale-ui/core@1.1.2` to npm as the new package name.

### Deprecated
- Deprecated the legacy npm package name with message: `Package moved to @tale-ui/core`.

## v1.1.2 - 2026-02-22

### Fixed
- Bumped `@tale-ui/core` package version to `1.1.2` so the pushed tag and package version match for the publish workflow.

### Notes
- This release resolves the failed publish run for tag `v1.1.1`, where `packages/css/package.json` was still `1.1.0`.

## v1.1.1 - 2026-02-22

### Changed
- Replaced custom palette variable references in docs from `--brand-*` to `--color-*` for consistency.
- Improved docs navigation by adding sidebar synchronization behavior in the documentation page.
- Updated design system guidance docs and AI reference with corrected palette/theming extension instructions.
