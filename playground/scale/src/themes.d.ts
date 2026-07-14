export type ThemeColor = {
  shade: number;
  hex: string;
};

export type PlaygroundThemeDefinition = {
  id: string;
  name: string;
  description: string;
  brandColor: string;
  neutralColor: string;
};

export type PlaygroundTheme = PlaygroundThemeDefinition & {
  brandPalette: readonly ThemeColor[];
  neutralPalette: readonly ThemeColor[];
};

export declare const createTheme: (definition: PlaygroundThemeDefinition) => PlaygroundTheme;
export declare const THEMES: readonly PlaygroundTheme[];
export declare const DEFAULT_THEME_ID: string;
export declare const getThemeById: (themeId: string) => PlaygroundTheme | undefined;
export declare const getThemeIdForColors: (
  brandColor: string,
  neutralColor: string,
) => string | null;
