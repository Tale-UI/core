import { create } from 'storybook/theming';

/**
 * Static color maps derived from the Tale UI design tokens.
 *
 * In Storybook v8 we resolved CSS custom properties at runtime via temp DOM
 * elements. Storybook v10's manager UI loads before the managerHead <style>
 * tag is available, so runtime resolution returns transparent/empty values
 * that crash polished's parseToRgb. We use hardcoded hex values instead.
 *
 * Light values come from --neutral-warm-* and --brand-* in _neutrals.css / _colors.css.
 * Dark values use the inverted scale from _color-modes.css.
 */
const palette = {
  light: {
    neutral5: '#f9f8f8',
    neutral12: '#edeceb',
    neutral14: '#e8e7e6',
    neutral16: '#e4e1e0',
    neutral20: '#dad7d6',
    neutral60: '#79716b',
    neutral70: '#5f5954',
    neutral90: '#2b2826',
    color60: '#025768',
  },
  dark: {
    neutral5: '#0a0a09',   // color-mix(in srgb, neutral-default-100 60%, black)
    neutral12: '#161514',  // neutral-default-98
    neutral14: '#1b1a18',  // neutral-default-96
    neutral16: '#211e1d',  // neutral-default-94
    neutral20: '#2b2826',  // neutral-default-90
    neutral60: '#918b86',  // neutral-default-50
    neutral70: '#a9a4a0',  // neutral-default-40
    neutral90: '#dad7d6',  // neutral-default-20
    color60: '#539198',    // brand-40
  },
} as const;

const fonts = {
  body: '"Inter", sans-serif',
  mono: '"Roboto Mono", monospace',
};

export function buildTheme(base: 'light' | 'dark') {
  // Set data-color-mode so the CSS tokens injected via managerHead resolve
  // correctly for the active mode (e.g. --neutral-16 in the hover overrides).
  document.documentElement.setAttribute('data-color-mode', base);

  const p = palette[base];

  return create({
    base,

    // Brand / accent
    colorPrimary: p.color60,
    colorSecondary: p.color60,

    // App chrome backgrounds
    appBg: p.neutral12,        // Left sidebar
    appContentBg: p.neutral5,
    appPreviewBg: p.neutral5,
    appBorderColor: p.neutral14,
    appBorderRadius: 12,       // --radius-s ≈ 0.75rem ≈ 12px

    // Top toolbar bar
    barBg: p.neutral12,
    barTextColor: p.neutral70,
    barHoverColor: p.color60,
    barSelectedColor: p.color60,

    // Text
    textColor: p.neutral90,
    textInverseColor: p.neutral5,
    textMutedColor: p.neutral60,

    // Controls (icon buttons and boolean toggles in addons panel)
    buttonBg: p.neutral12,
    buttonBorder: p.neutral20,
    booleanBg: p.neutral16,
    booleanSelectedBg: p.neutral5,

    // Inputs (controls panel, search)
    inputBg: p.neutral5,
    inputBorder: p.neutral20,
    inputTextColor: p.neutral90,
    inputBorderRadius: 8,      // --radius-xs ≈ 0.5rem ≈ 8px

    // Typography
    fontBase: fonts.body,
    fontCode: fonts.mono,

    brandTitle: 'Tale UI',
  });
}
