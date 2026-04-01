# Changelog — @tale-ui/core

All notable changes to the CSS design system are documented in this file.

## v1.1.16 — 2026-03-25

### Docs

- Updated consumer CLAUDE.md snippet: added pitfall about trigger components rendering their own `<button>` — never nest a `<Button>` inside them.

## v1.1.15 — 2026-03-25

### Fixed

- Reset default margins on heading elements (`h1`–`h6`) to `0` in the typography foundation, preventing browser-default margins from leaking into component layouts.

## v1.1.11 — 2026-03-17

### Fixed

- Foreground override specificity: use `html` selector to beat design system light-mode rule for `--color-*-fg` pivot overrides.
- Include fg pivot overrides in `:root` block for standalone CSS use.

## v1.1.10 — 2026-03-16

### Fixed

- Dark-mode neutral-5: tint with accent colour (`color-mix`) instead of plain neutral for better visual cohesion.
- Fixed dark-mode neutral-5 mix ratio; replaced `--bodyBg` with `--neutral-5` token.

## v1.1.9 — 2026-03-15

### Changed

- Refined dark-mode neutral-5 shading.
- Bumped mono font sizes for better readability.
- Enhanced scale playground with palette preview and contrast tools.

## v1.1.8 — 2026-03-14

### Fixed

- Fixed `--color-*-fg` tokens not re-evaluating correctly in dark mode on `.color-{name}` scoped elements. Explicitly declaring the full `--color-*` and `--color-*-fg` chains in all three mode blocks (light, OS dark, explicit dark) ensures the var() chain resolves reliably across all browsers.
- Moved per-family foreground pivot overrides (orange/sky at shade-60; amber/yellow/lime/green/emerald/teal/cyan at shade-60 and shade-70) from `_color-themes.css` into light-mode-only rules in `_color-modes.css`. This fixes those families showing light text on light backgrounds in dark mode.

## v1.1.6 — 2026-02-26

### Changed

- Updated typography and spacing guidance across the core styles and package documentation.
- Updated release automation to create descriptive GitHub release titles and body content from `CHANGELOG.md`.

## v1.1.5 — 2026-02-26

### Changed

- Bumped `@tale-ui/core` package version to `1.1.5`.
- Updated documentation version references to `v1.1.5` for consumer setup snippets.

## v1.1.4 — 2026-02-25

### Changed

- Bumped `@tale-ui/core` package version to `1.1.4`.
- Updated documentation version references to `v1.1.4` for consumer setup snippets.

## v1.1.3 — 2026-02-25

### Changed

- Renamed npm package identity to `@tale-ui/core` across package metadata, release tooling, CI workflow filters, and documentation.

## v1.1.2 — 2026-02-22

### Fixed

- Bumped `@tale-ui/core` package version to `1.1.2` so the pushed tag and package version match for the publish workflow.

## v1.1.1 — 2026-02-22

### Changed

- Replaced custom palette variable references in docs from `--brand-*` to `--color-*` for consistency.
- Improved docs navigation by adding sidebar synchronization behavior in the documentation page.
- Updated design system guidance docs and AI reference with corrected palette/theming extension instructions.
