# @tale-ui/utils

Shared utilities for the Tale UI component library. This is an internal package — most consumers will not need to import it directly (it is pulled in automatically by `@tale-ui/react`).

## Colour Utilities

```ts
import { generatePalette, randomBaseColor, NAMED_SHADES } from '@tale-ui/utils/color';
```

| Export | Description |
|--------|------------|
| `generatePalette(baseHex, mode)` | Generate an 11-shade tonal palette from a base hex colour (OKLCH math via culori) |
| `randomBaseColor(mode)` | Generate a random base hex that passes WCAG contrast validation |
| `NAMED_SHADES` | `[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]` |
| `NEUTRAL_SHADES` | Full 27-shade neutral scale |
| `getContrastRatio(hex1, hex2)` | WCAG contrast ratio between two hex colours |
| `getRelativeLuminance(hex)` | WCAG relative luminance of a hex colour |

## React Hooks

| Hook | Purpose |
|------|---------|
| `useControlled` | Manage controlled/uncontrolled component state |
| `useId` | Generate stable unique IDs |
| `useMergedRefs` | Merge multiple refs into one |
| `usePreviousValue` | Track the previous value of a variable |
| `useScrollLock` | Lock body scroll (for modals/drawers) |
| `useStableCallback` | Stable reference for callbacks |
| `useAnimationFrame` | `requestAnimationFrame` wrapper |
| `useInterval` | `setInterval` wrapper |
| `useTimeout` | `setTimeout` wrapper |
| `useOnMount` | Run effect only on mount |
| `useOnFirstRender` | Run callback on first render |
| `useIsoLayoutEffect` | SSR-safe `useLayoutEffect` |
| `useRefWithInit` | Ref with lazy initialiser |
| `useValueAsRef` | Keep a ref synchronised with a value |
| `useForcedRerendering` | Force a component re-render |
| `useEnhancedClickHandler` | Click handler with additional event logic |

## DOM Helpers

| Export | Purpose |
|--------|---------|
| `owner` | Get the owner document of a node |
| `isElementDisabled` | Check if an element is disabled |
| `isMouseWithinBounds` | Check if a mouse event is within an element's bounds |
| `getReactElementRef` | Extract ref from a React element |
| `visuallyHidden` | CSS-in-JS styles for visually hidden content |
| `detectBrowser` | Detect browser environment |
| `inertValue` | Inert value helper for SSR |

## General

| Export | Purpose |
|--------|---------|
| `mergeObjects` | Deep merge objects |
| `fastObjectShallowCompare` | Fast shallow equality check |
| `formatErrorMessage` | Format error messages with codes |
| `generateId` | Generate unique string IDs |
| `warn` | Development-only console warning |

## License

MIT
