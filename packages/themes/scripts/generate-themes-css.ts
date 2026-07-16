import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getContrastRatio, NAMED_SHADES } from '@tale-ui/utils/color';
import { format } from 'prettier';
import {
  MONOCHROME_THEMES,
  MONOCHROME_THEME_ATTRIBUTE,
  STANDARD_THEMES,
  THEME_ATTRIBUTE,
  type MonochromeTheme,
  type StandardTheme,
  type ThemeColor,
} from '../src/themes.js';

const outputPath = fileURLToPath(new URL('../src/themes.css', import.meta.url));
const isCheck = process.argv.includes('--check');

const getHex = (palette: readonly ThemeColor[], shade: number): string => {
  const color = palette.find((entry) => entry.shade === shade);

  if (!color) {
    throw new Error(`@tale-ui/themes: Cannot generate CSS because shade ${shade} is missing.`);
  }

  return color.hex;
};

type ThemeEntry =
  | Readonly<{ kind: 'standard'; theme: StandardTheme }>
  | Readonly<{ kind: 'monochrome'; theme: MonochromeTheme }>;

const THEME_ENTRIES: readonly ThemeEntry[] = [
  ...STANDARD_THEMES.map((theme) => ({ kind: 'standard' as const, theme })),
  ...MONOCHROME_THEMES.map((theme) => ({ kind: 'monochrome' as const, theme })),
];

const getSelectorParts = ({ kind, theme }: ThemeEntry): readonly [string, string] =>
  kind === 'standard'
    ? [`.standard-theme-${theme.id}`, `[${THEME_ATTRIBUTE}="${theme.id}"]`]
    : [`.monochrome-theme-${theme.id}`, `[${MONOCHROME_THEME_ATTRIBUTE}="${theme.id}"]`];

const selector = (entry: ThemeEntry) => getSelectorParts(entry).join(',\n');

const scopedSelector = (entry: ThemeEntry) => `:is(${getSelectorParts(entry).join(', ')})`;

const getForegroundDeclarations = (
  theme: StandardTheme | MonochromeTheme,
  mode: 'light' | 'dark',
) => {
  const lightEndpoint = getHex(theme.brandPalette, 5);
  const darkEndpoint = getHex(theme.brandPalette, 100);
  const reversedShades = [...NAMED_SHADES].reverse();

  return NAMED_SHADES.map((shade, index) => {
    const backgroundShade = mode === 'light' ? shade : reversedShades[index];
    const background = getHex(theme.brandPalette, backgroundShade);
    const useLightEndpoint =
      getContrastRatio(background, lightEndpoint) >= getContrastRatio(background, darkEndpoint);
    let token: string;
    if (mode === 'light') {
      token = useLightEndpoint ? 'var(--color-5)' : 'var(--color-100)';
    } else {
      token = useLightEndpoint ? 'var(--color-100)' : 'var(--color-5)';
    }

    return `  --color-${shade}-fg: ${token};`;
  }).join('\n');
};

const getThemeBlock = (entry: ThemeEntry) => {
  const { kind, theme } = entry;
  const brandTokens = theme.brandPalette
    .map(({ shade, hex }) => `  --brand-${shade}: ${hex};`)
    .join('\n');
  const neutralTokens = theme.neutralPalette
    .map(({ shade, hex }) => `  --neutral-default-${shade}: ${hex};`)
    .join('\n');

  return `/* ${theme.name} (${kind}) — ${theme.description} */\n${selector(entry)} {\n  --neutral-default: var(--neutral-default-60);\n${brandTokens}\n${neutralTokens}\n${getForegroundDeclarations(theme, 'light')}\n}`;
};

const getDarkModeBlock = (entry: ThemeEntry) => {
  const { theme } = entry;
  const themeSelector = scopedSelector(entry);
  const declarations = getForegroundDeclarations(theme, 'dark');

  return `@media (prefers-color-scheme: dark) {\n  :where(html:not([data-color-mode="light"]))${themeSelector},\n  :where(html:not([data-color-mode="light"])) ${themeSelector} {\n${declarations}\n  }\n}\n\nhtml[data-color-mode="dark"]${themeSelector},\nhtml[data-color-mode="dark"] ${themeSelector},\n.dark${themeSelector},\n.dark ${themeSelector} {\n${declarations}\n}\n\n.light${themeSelector},\n.light ${themeSelector} {\n${getForegroundDeclarations(theme, 'light')}\n}`;
};

const rawContent = `/*
 * @tale-ui/themes v0.1.0
 * Generated from src/themes.ts. Run \`pnpm generate\` after changing theme definitions.
 * Import this stylesheet after @tale-ui/core or @tale-ui/react-styles.
 */

${THEME_ENTRIES.map(getThemeBlock).join('\n\n')}

/* Foreground contrast follows Tale UI's light, dark, and forced-mode aliases. */
${THEME_ENTRIES.map(getDarkModeBlock).join('\n\n')}
`;

const main = async () => {
  const content = await format(rawContent, {
    parser: 'css',
    printWidth: 100,
    singleQuote: true,
    trailingComma: 'all',
  });

  if (isCheck) {
    const current = await readFile(outputPath, 'utf8').catch(() => '');

    if (current !== content) {
      throw new Error('@tale-ui/themes: Generated CSS is out of date. Run `pnpm generate`.');
    }

    // eslint-disable-next-line no-console
    console.log('✓ @tale-ui/themes CSS is up to date.');
    return;
  }

  await writeFile(outputPath, content);
  // eslint-disable-next-line no-console
  console.log('✓ Generated packages/themes/src/themes.css.');
};

void main();
