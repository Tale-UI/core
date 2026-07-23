# @tale-ui/tokens

The canonical, platform-neutral token source for Tale UI.

`tokens.json` generates both:

- the CSS custom-property modules published by `@tale-ui/css`;
- typed JavaScript token objects for React Native and other non-CSS consumers.

## Native usage

```ts
import { nativeTokenModes, nativeTokens } from '@tale-ui/tokens/native';

const buttonStyle = {
  backgroundColor: nativeTokens.color60,
  borderRadius: nativeTokens.radiusM,
  paddingHorizontal: nativeTokens.spaceXs,
};

const darkButtonStyle = {
  backgroundColor: nativeTokenModes.dark.color60,
};
```

Values that have a direct native representation are converted automatically:

- `rem` and `px` dimensions become numbers using the Tale UI 16px root contract;
- palette and semantic colours become colour strings;
- token aliases and simple multiplication expressions are resolved;
- CSS-only expressions such as fluid `clamp()`, browser scrims, and complex shadows remain web-only.

## Development

Edit `tokens.json`, then regenerate and verify:

```bash
pnpm --filter @tale-ui/tokens generate
pnpm --filter @tale-ui/tokens test
pnpm --filter @tale-ui/tokens test:package
```
