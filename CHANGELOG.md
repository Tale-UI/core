# Changelog

All notable changes to this project are documented in this file.

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

### Commits
- [13a4bef](https://github.com/Tale-UI/core/commit/13a4bef) Replace --brand-* with --color-*; add sidebar sync
- [8158c6a](https://github.com/Tale-UI/core/commit/8158c6a) Add custom palettes docs and bump DS to v1.1.0
