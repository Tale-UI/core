# @tale-ui/themes

Optional composite themes for the Tale UI token system.

- **Standard themes** have distinct brand and neutral colour anchors.
- **Monochrome themes** derive the brand and neutral scales from one named colour.

## Source of truth

- Edit standard and monochrome theme names, descriptions, and shade-60 anchors in `src/themes.ts`.
- Never hand-edit `src/themes.css`; run `pnpm generate`.
- Keep theme IDs stable after publication because they are public CSS and JavaScript identifiers.

## Package boundary

- Do not import React or playground code.
- Use `@tale-ui/utils/color` for standard palettes. Keep the package-local monochrome generator in
  `src/monochrome.ts` aligned with the Theme Playground without depending on an unpublished Utils
  API; the Themes package must remain independently publishable.
- Theme CSS may define raw `--brand-*` and `--neutral-default-*` palette tokens. Component CSS must
  continue using `--color-*` and `--neutral-*` aliases.
- Preserve the root metadata export and `themes.css` export so the package can be extracted without
  changing consumer imports.

## Verification

Run `pnpm generate:check`, `pnpm test`, `pnpm build`, and `pnpm test:package` after changes.
