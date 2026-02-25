# Changelog

All notable changes to this project are documented in this file.

## v1.1.2 - 2026-02-22

### Fixed
- Bumped `@cloudiverse/design-system` package version to `1.1.2` so the pushed tag and package version match for the publish workflow.

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
