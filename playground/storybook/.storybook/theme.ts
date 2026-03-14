import { create } from 'storybook/internal/theming';

/**
 * Resolve a CSS color token to a concrete rgb() value.
 *
 * getPropertyValue() returns the raw registered value — e.g. "var(--neutral-default-10)" —
 * because custom properties are not computed. Storybook's create() can't parse var()
 * chains, so we force full resolution by applying the variable to a real CSS property
 * on a temp element and reading the computed value back.
 */
function resolveColor(varName: string): string {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:-9999px;visibility:hidden;pointer-events:none;';
  document.body.appendChild(el);
  el.style.setProperty('background-color', `var(${varName})`);
  const color = getComputedStyle(el).backgroundColor; // 'rgb(r, g, b)'
  el.remove();
  return color;
}

/**
 * Resolve a calc()-based length token (e.g. --radius-s) to a concrete pixel number
 * by measuring a hidden element in the manager's own rem context (1rem = 16px).
 */
function resolveTokenPx(varName: string): number {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:-9999px;visibility:hidden;pointer-events:none;';
  document.body.appendChild(el);
  el.style.setProperty('width', `var(${varName})`);
  const px = parseFloat(getComputedStyle(el).width);
  el.remove();
  return px;
}

/**
 * Read a non-color CSS custom property (e.g. font-family strings) directly.
 * These are stored as literal strings so getPropertyValue is sufficient.
 */
function resolveString(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export function buildTheme(base: 'light' | 'dark') {
  // Set data-color-mode so _color-modes.css applies the correct light/dark inversion
  // before we read the token values. This ensures resolveColor() returns the right
  // rgb() for the target mode, not the current browser state.
  document.documentElement.setAttribute('data-color-mode', base);

  return create({
    base,

    // Brand / accent — uses --color-60 which inverts in dark mode
    colorPrimary: resolveColor('--color-60'),
    colorSecondary: resolveColor('--color-60'),

    // App chrome backgrounds
    appBg: resolveColor('--neutral-12'), // Left sidebar
    appContentBg: resolveColor('--neutral-5'),
    appPreviewBg: resolveColor('--neutral-5'),
    appBorderColor: resolveColor('--neutral-14'),
    appBorderRadius: resolveTokenPx('--radius-s'),

    // Top toolbar bar
    barBg: resolveColor('--neutral-12'),
    barTextColor: resolveColor('--neutral-70'),
    barHoverColor: resolveColor('--color-60'),
    barSelectedColor: resolveColor('--color-60'),

    // Text
    textColor: resolveColor('--neutral-90'),
    textInverseColor: resolveColor('--neutral-5'),
    textMutedColor: resolveColor('--neutral-60'),

    // Controls (icon buttons and boolean toggles in addons panel)
    buttonBg: resolveColor('--neutral-12'),
    buttonBorder: resolveColor('--neutral-20'),
    booleanBg: resolveColor('--neutral-16'),
    booleanSelectedBg: resolveColor('--neutral-5'),

    // Inputs (controls panel, search)
    inputBg: resolveColor('--neutral-5'),
    inputBorder: resolveColor('--neutral-20'),
    inputTextColor: resolveColor('--neutral-90'),
    inputBorderRadius: resolveTokenPx('--radius-xs'),

    // Typography — font tokens are literal strings, no var() chain to resolve
    fontBase: resolveString('--body-font'),
    fontCode: resolveString('--mono-font'),

    brandTitle: 'Tale UI',
  });
}
