import { NAMED_SHADES, NEUTRAL_SHADES } from '@tale-ui/utils/color';
import { expect } from 'vitest';
import {
  DEFAULT_MONOCHROME_THEME_ID,
  DEFAULT_STANDARD_THEME_ID,
  MONOCHROME_THEMES,
  MONOCHROME_THEME_ATTRIBUTE,
  MONOCHROME_THEME_IDS,
  STANDARD_THEMES,
  STANDARD_THEME_IDS,
  THEME_ATTRIBUTE,
  applyMonochromeTheme,
  applyStandardTheme,
  clearTheme,
  getMonochromeThemeById,
  getMonochromeThemeClassName,
  getMonochromeThemeIdForColor,
  getStandardThemeById,
  getStandardThemeClassName,
  getStandardThemeIdForColors,
  isMonochromeThemeId,
  isStandardThemeId,
} from './themes.js';

describe('@tale-ui/themes', () => {
  it('ships the standard theme suite with unique identifiers', () => {
    expect(STANDARD_THEMES).toHaveLength(8);
    expect(new Set(STANDARD_THEME_IDS).size).toBe(STANDARD_THEME_IDS.length);
    expect(DEFAULT_STANDARD_THEME_ID).toBe('harbour');
  });

  it('ships Bento Browser non-default presets as monochrome themes', () => {
    expect(MONOCHROME_THEME_IDS).toEqual([
      'antique',
      'forest',
      'mauve',
      'mountain-meadow',
      'rosewater',
      'teal',
      'terracotta',
    ]);
    expect(DEFAULT_MONOCHROME_THEME_ID).toBe('antique');
    expect(MONOCHROME_THEMES.map(({ color }) => color)).toEqual([
      '#936400',
      '#317d00',
      '#9b5267',
      '#007e64',
      '#c60648',
      '#25778d',
      '#a64300',
    ]);
  });

  it('generates complete immutable brand and neutral palettes', () => {
    for (const theme of STANDARD_THEMES) {
      expect(theme.brandPalette.map(({ shade }) => shade)).toEqual([...NAMED_SHADES]);
      expect(theme.neutralPalette.map(({ shade }) => shade)).toEqual([...NEUTRAL_SHADES]);
      expect(Object.isFrozen(theme)).toBe(true);
      expect(Object.isFrozen(theme.brandPalette)).toBe(true);
      expect(Object.isFrozen(theme.neutralPalette)).toBe(true);
    }

    for (const theme of MONOCHROME_THEMES) {
      expect(theme.brandPalette.map(({ shade }) => shade)).toEqual([...NAMED_SHADES]);
      expect(theme.neutralPalette.map(({ shade }) => shade)).toEqual([...NEUTRAL_SHADES]);
      expect(theme.brandPalette).toEqual(
        theme.neutralPalette.filter(({ shade }) =>
          NAMED_SHADES.some((namedShade) => namedShade === shade),
        ),
      );
      expect(Object.isFrozen(theme)).toBe(true);
      expect(Object.isFrozen(theme.brandPalette)).toBe(true);
      expect(Object.isFrozen(theme.neutralPalette)).toBe(true);
    }
  });

  it('looks monochrome themes up by id and shared colour anchor', () => {
    expect(getMonochromeThemeById('mountain-meadow')?.name).toBe('Mountain Meadow');
    expect(getMonochromeThemeIdForColor('#C60648')).toBe('rosewater');
    expect(getMonochromeThemeIdForColor('#000000')).toBeNull();
    expect(isMonochromeThemeId('terracotta')).toBe(true);
    expect(isMonochromeThemeId('custom')).toBe(false);
    expect(getMonochromeThemeClassName('terracotta')).toBe('monochrome-theme-terracotta');
  });

  it('looks standard themes up by id and anchor colours', () => {
    expect(getStandardThemeById('violet-dusk')?.name).toBe('Violet Dusk');
    expect(getStandardThemeIdForColors('#6552A3', '706d78')).toBe('violet-dusk');
    expect(getStandardThemeIdForColors('#000000', '#ffffff')).toBeNull();
    expect(isStandardThemeId('fern')).toBe(true);
    expect(isStandardThemeId('custom')).toBe(false);
    expect(getStandardThemeClassName('amber-grove')).toBe('standard-theme-amber-grove');
  });

  it('applies and clears a standard theme on an explicit target', () => {
    const target = document.createElement('section');

    applyStandardTheme('fern', target);
    expect(target.getAttribute(THEME_ATTRIBUTE)).toBe('fern');

    clearTheme(target);
    expect(target.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
  });

  it('keeps standard and monochrome themes mutually exclusive', () => {
    const target = document.createElement('section');

    applyStandardTheme('terracotta', target);
    applyMonochromeTheme('terracotta', target);
    expect(target.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    expect(target.getAttribute(MONOCHROME_THEME_ATTRIBUTE)).toBe('terracotta');

    applyStandardTheme('fern', target);
    expect(target.getAttribute(THEME_ATTRIBUTE)).toBe('fern');
    expect(target.hasAttribute(MONOCHROME_THEME_ATTRIBUTE)).toBe(false);

    clearTheme(target);
    expect(target.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    expect(target.hasAttribute(MONOCHROME_THEME_ATTRIBUTE)).toBe(false);
  });

  it('rejects unknown standard theme identifiers with actionable guidance', () => {
    expect(() => applyStandardTheme('custom', document.documentElement)).toThrow(
      'Unknown standard theme "custom". Use one of:',
    );
  });

  it('rejects unknown monochrome theme identifiers with actionable guidance', () => {
    expect(() => applyMonochromeTheme('custom', document.documentElement)).toThrow(
      'Unknown monochrome theme "custom". Use one of:',
    );
  });
});
