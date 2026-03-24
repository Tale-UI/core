# Changelog — @tale-ui/react

All notable changes to the React component library are documented in this file.

## v1.3.28 — 2026-03-25

### Fixed
- **Container:** Per-shade foreground token overrides for light-coloured palettes. The `Container` component now computes WCAG contrast ratios for each palette shade and overrides `--color-*-fg` tokens where the non-default endpoint provides better contrast, ensuring readable text on every shade — including `random` and all named colour palettes.
