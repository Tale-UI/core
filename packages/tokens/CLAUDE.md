# @tale-ui/tokens

Framework-neutral token source shared by Tale UI web and native packages.

## Critical rules

- `tokens.json` is the canonical source.
- Never hand-edit `src/generated.ts` or `packages/css/src/tokens/*.css`; run
  `pnpm --filter @tale-ui/tokens generate`.
- Keep CSS-only expressions out of native output unless React Native supports an equivalent value.
- Preserve the 16px root conversion contract when deriving native numeric dimensions.
- Run `generate:check`, `test`, and `test:package` after token changes.
