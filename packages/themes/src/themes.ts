import { generatePalette, NAMED_SHADES } from '@tale-ui/utils/color';
import { generateMonochromePalette } from './monochrome.js';

export type ThemeColor = Readonly<{
  shade: number;
  hex: string;
}>;

export type StandardThemeDefinition = Readonly<{
  id: string;
  name: string;
  description: string;
  brandColor: string;
  neutralColor: string;
}>;

export type MonochromeThemeDefinition = Readonly<{
  id: string;
  name: string;
  description: string;
  color: string;
}>;

const THEME_DEFINITIONS = [
  {
    id: 'harbour',
    name: 'Harbour',
    description: 'Deep teal with a warm stone neutral.',
    brandColor: '#025768',
    neutralColor: '#79716b',
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    description: 'Clear cyan teal with a cool mineral neutral.',
    brandColor: '#006a6b',
    neutralColor: '#677472',
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Confident blue with a crisp steel neutral.',
    brandColor: '#215d9a',
    neutralColor: '#68717a',
  },
  {
    id: 'violet-dusk',
    name: 'Violet Dusk',
    description: 'Soft violet with a balanced slate neutral.',
    brandColor: '#6552a3',
    neutralColor: '#706d78',
  },
  {
    id: 'wildflower',
    name: 'Wildflower',
    description: 'Muted berry with a gently rosy neutral.',
    brandColor: '#8f3d65',
    neutralColor: '#746b70',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Earthy coral with a warm clay neutral.',
    brandColor: '#9b3f35',
    neutralColor: '#756b68',
  },
  {
    id: 'amber-grove',
    name: 'Amber Grove',
    description: 'Burnished amber with a soft sand neutral.',
    brandColor: '#8a5a0a',
    neutralColor: '#756f64',
  },
  {
    id: 'fern',
    name: 'Fern',
    description: 'Leaf green with a quiet botanical neutral.',
    brandColor: '#3b6b43',
    neutralColor: '#6a7169',
  },
] as const satisfies readonly StandardThemeDefinition[];

const MONOCHROME_THEME_DEFINITIONS = [
  {
    id: 'antique',
    name: 'Antique',
    description: 'Burnished ochre across the brand and neutral scales.',
    color: '#936400',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Fresh leaf green across the brand and neutral scales.',
    color: '#317d00',
  },
  {
    id: 'mauve',
    name: 'Mauve',
    description: 'Dusty rose across the brand and neutral scales.',
    color: '#9b5267',
  },
  {
    id: 'mountain-meadow',
    name: 'Mountain Meadow',
    description: 'Lush green teal across the brand and neutral scales.',
    color: '#007e64',
  },
  {
    id: 'rosewater',
    name: 'Rosewater',
    description: 'Vivid rose across the brand and neutral scales.',
    color: '#c60648',
  },
  {
    id: 'teal',
    name: 'Teal',
    description: 'Cool blue teal across the brand and neutral scales.',
    color: '#25778d',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Rich burnt orange across the brand and neutral scales.',
    color: '#a64300',
  },
] as const satisfies readonly MonochromeThemeDefinition[];

export type StandardThemeId = (typeof THEME_DEFINITIONS)[number]['id'];
export type MonochromeThemeId = (typeof MONOCHROME_THEME_DEFINITIONS)[number]['id'];

export type GeneratedStandardTheme<TId extends string = string> = StandardThemeDefinition &
  Readonly<{
    id: TId;
    brandPalette: readonly ThemeColor[];
    neutralPalette: readonly ThemeColor[];
  }>;

export type StandardTheme = GeneratedStandardTheme<StandardThemeId>;

export type GeneratedMonochromeTheme<TId extends string = string> = MonochromeThemeDefinition &
  Readonly<{
    id: TId;
    brandPalette: readonly ThemeColor[];
    neutralPalette: readonly ThemeColor[];
  }>;

export type MonochromeTheme = GeneratedMonochromeTheme<MonochromeThemeId>;

const freezePalette = (palette: Array<{ shade: number; hex: string }>): readonly ThemeColor[] =>
  Object.freeze(palette.map((color) => Object.freeze(color)));

export const createStandardTheme = <TDefinition extends StandardThemeDefinition>(
  definition: TDefinition,
): TDefinition & GeneratedStandardTheme<TDefinition['id']> =>
  Object.freeze({
    ...definition,
    brandPalette: freezePalette(generatePalette(definition.brandColor, 'named')),
    neutralPalette: freezePalette(generatePalette(definition.neutralColor, 'neutral')),
  });

export const createMonochromeTheme = <TDefinition extends MonochromeThemeDefinition>(
  definition: TDefinition,
): TDefinition & GeneratedMonochromeTheme<TDefinition['id']> => {
  const neutralPalette = freezePalette(generateMonochromePalette(definition.color));
  const brandPalette = Object.freeze(
    neutralPalette.filter(({ shade }) => NAMED_SHADES.some((namedShade) => namedShade === shade)),
  );

  return Object.freeze({
    ...definition,
    brandPalette,
    neutralPalette,
  });
};

export const STANDARD_THEMES: readonly StandardTheme[] = Object.freeze(
  THEME_DEFINITIONS.map(createStandardTheme),
);
export const STANDARD_THEME_IDS: readonly StandardThemeId[] = Object.freeze(
  STANDARD_THEMES.map(({ id }) => id),
);
export const DEFAULT_STANDARD_THEME_ID: StandardThemeId = 'harbour';
export const THEME_ATTRIBUTE = 'data-tale-theme';
export const MONOCHROME_THEMES: readonly MonochromeTheme[] = Object.freeze(
  MONOCHROME_THEME_DEFINITIONS.map(createMonochromeTheme),
);
export const MONOCHROME_THEME_IDS: readonly MonochromeThemeId[] = Object.freeze(
  MONOCHROME_THEMES.map(({ id }) => id),
);
export const DEFAULT_MONOCHROME_THEME_ID: MonochromeThemeId = 'antique';
export const MONOCHROME_THEME_ATTRIBUTE = 'data-tale-monochrome-theme';

export const isStandardThemeId = (value: string): value is StandardThemeId =>
  STANDARD_THEME_IDS.some((themeId) => themeId === value);

export const getStandardThemeById = (themeId: string): StandardTheme | undefined =>
  STANDARD_THEMES.find(({ id }) => id === themeId);

export const isMonochromeThemeId = (value: string): value is MonochromeThemeId =>
  MONOCHROME_THEME_IDS.some((themeId) => themeId === value);

export const getMonochromeThemeById = (themeId: string): MonochromeTheme | undefined =>
  MONOCHROME_THEMES.find(({ id }) => id === themeId);

export const getStandardThemeIdForColors = (
  brandColor: string,
  neutralColor: string,
): StandardThemeId | null => {
  const normalize = (color: string) => color.replace(/^#/, '').toLowerCase();
  const normalizedBrand = normalize(brandColor);
  const normalizedNeutral = normalize(neutralColor);

  return (
    STANDARD_THEMES.find(
      (theme) =>
        normalize(theme.brandColor) === normalizedBrand &&
        normalize(theme.neutralColor) === normalizedNeutral,
    )?.id ?? null
  );
};

export const getMonochromeThemeIdForColor = (color: string): MonochromeThemeId | null => {
  const normalizedColor = color.replace(/^#/, '').toLowerCase();

  return (
    MONOCHROME_THEMES.find(
      (theme) => theme.color.replace(/^#/, '').toLowerCase() === normalizedColor,
    )?.id ?? null
  );
};

export const getStandardThemeClassName = (
  themeId: StandardThemeId,
): `standard-theme-${StandardThemeId}` => `standard-theme-${themeId}`;

export const getMonochromeThemeClassName = (
  themeId: MonochromeThemeId,
): `monochrome-theme-${MonochromeThemeId}` => `monochrome-theme-${themeId}`;

const resolveTarget = (target: Element | undefined): Element => {
  const resolvedTarget =
    target ?? (typeof document === 'undefined' ? undefined : document.documentElement);

  if (!resolvedTarget) {
    throw new Error(
      '@tale-ui/themes: Cannot apply a theme without a document. Pass the target Element explicitly when rendering outside a browser.',
    );
  }

  return resolvedTarget;
};

export const applyStandardTheme = (themeId: string, target?: Element): void => {
  if (!isStandardThemeId(themeId)) {
    throw new Error(
      `@tale-ui/themes: Unknown standard theme "${themeId}". Use one of: ${STANDARD_THEME_IDS.join(', ')}.`,
    );
  }

  const resolvedTarget = resolveTarget(target);
  resolvedTarget.removeAttribute(MONOCHROME_THEME_ATTRIBUTE);
  resolvedTarget.setAttribute(THEME_ATTRIBUTE, themeId);
};

export const applyMonochromeTheme = (themeId: string, target?: Element): void => {
  if (!isMonochromeThemeId(themeId)) {
    throw new Error(
      `@tale-ui/themes: Unknown monochrome theme "${themeId}". Use one of: ${MONOCHROME_THEME_IDS.join(', ')}.`,
    );
  }

  const resolvedTarget = resolveTarget(target);
  resolvedTarget.removeAttribute(THEME_ATTRIBUTE);
  resolvedTarget.setAttribute(MONOCHROME_THEME_ATTRIBUTE, themeId);
};

export const clearTheme = (target?: Element): void => {
  const resolvedTarget = resolveTarget(target);
  resolvedTarget.removeAttribute(THEME_ATTRIBUTE);
  resolvedTarget.removeAttribute(MONOCHROME_THEME_ATTRIBUTE);
};
