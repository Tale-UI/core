import './App.css';
import * as React from 'react';
import styled from 'styled-components';
import { Button } from '@tale-ui/react/button';
import { Card } from '@tale-ui/react/card';
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';
import {
  DEFAULT_STANDARD_THEME_ID,
  MONOCHROME_THEMES,
  MONOCHROME_THEME_ATTRIBUTE,
  STANDARD_THEMES,
  THEME_ATTRIBUTE,
  getMonochromeThemeById,
  getMonochromeThemeIdForColor,
  getStandardThemeById,
  getStandardThemeIdForColors,
} from '@tale-ui/themes';
import { useTimeout } from '@tale-ui/utils/useTimeout';
import {
  isValidHex,
  numberToHex,
  generatePalette,
  generateMonochromePalette,
  randomBaseColor,
  getContrastRatio,
  generateCssOutput,
  generateRadiusCss,
  getRadiusValue,
  RADIUS_TOKENS,
  NAMED_SHADES,
  NEUTRAL_SHADES,
} from './utils';
import Slider from './components/slider';
import ColorsRow from './components/colors-row';
import MainColorSelector from './components/main-color-selector';
import BackgroundSelector from './components/background-selector';
import ContrastPivotSelector from './components/contrast-pivot-selector';
import CssOutput from './components/css-output';
import ComponentPreview from './components/component-preview';

const { useEffect, useMemo, useRef, useState } = React;

const MainWrapper = styled.div`
  padding: var(--space-xl) var(--space-3xl);
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 720px) {
    padding: var(--space-m) var(--space-l);
  }

  @media (max-width: 480px) {
    padding: var(--space-s);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-m);
  margin-bottom: var(--space-l);
  flex-wrap: wrap;

  @media (max-width: 720px) {
    margin-bottom: var(--space-m);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
`;

const PageTitle = styled.h1`
  font-size: var(--display-s-font-size);
  font-weight: var(--display-font-weight);
  line-height: var(--display-line-height);
  margin: 0;
`;

const PageDescription = styled.p`
  font-size: var(--text-s-font-size);
  line-height: var(--text-line-height);
  margin: 0;
  opacity: 0.7;
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-m);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;

  @media (max-width: 720px) {
    margin-bottom: var(--space-l);
    gap: var(--space-s);
  }

  @media (max-width: 480px) {
    margin-bottom: var(--space-m);
  }
`;

const ThemeSection = styled.section`
  margin-bottom: var(--space-xl);

  @media (max-width: 720px) {
    margin-bottom: var(--space-l);
  }
`;

const ThemeSectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-s);
  margin-bottom: var(--space-s);
`;

const ThemeSectionTitle = styled.h2`
  margin: 0;
  font-size: var(--title-s-font-size);
  font-weight: var(--title-font-weight);
  line-height: var(--title-line-height);
`;

const ThemeSectionHint = styled.span`
  color: var(--neutral-60);
  font-size: var(--text-xs-font-size);
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-xs);
`;

const ThemeCard = styled(Card.Button)`
  flex-direction: row;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  width: 100%;
`;

const ThemeSwatches = styled.span`
  display: grid;
  grid-template-columns: repeat(2, 1.5rem);
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid var(--neutral-24);
  border-radius: var(--radius-s);
`;

const ThemeSwatch = styled.span`
  width: 1.5rem;
  height: 2rem;
`;

const ThemeName = styled.span`
  overflow: hidden;
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ColorsSection = styled.div`
  width: 100%;
`;

const PivotRow = styled.div`
  margin-bottom: var(--space-l);
`;

const TopSection = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;

  @media (max-width: 720px) {
    gap: var(--space-l);
    margin-bottom: var(--space-l);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: var(--space-m);
  }
`;

const OutputRow = styled.div`
  display: flex;
  gap: var(--space-xl);
  margin-top: var(--space-xl);
  align-items: stretch;

  @media (max-width: 1560px) {
    flex-direction: column;
    gap: var(--space-l);
  }

  @media (max-width: 480px) {
    margin-top: var(--space-l);
  }
`;

const CssColumn = styled.div`
  width: 440px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 1560px) {
    width: 100%;
    height: 400px;
  }

  @media (max-width: 480px) {
    height: 300px;
  }
`;

const PreviewColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const RadiusSection = styled.div`
  margin-bottom: var(--space-xl);

  @media (max-width: 720px) {
    margin-bottom: var(--space-l);
  }
`;

const RadiusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-m);
  margin-bottom: var(--space-m);
`;

const RadiusLabel = styled.span`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
`;

const RadiusValue = styled.span`
  font-size: var(--mono-s-font-size);
  font-family: var(--mono-font-family);
  color: var(--neutral-60);
  min-width: 80px;
`;

const RadiusPreviewRow = styled.div`
  display: flex;
  gap: var(--space-m);
  flex-wrap: wrap;
`;

const RadiusPreviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3xs);
`;

const RadiusPreviewBox = styled.div`
  width: 48px;
  height: 48px;
  background: var(--color-60, var(--neutral-40));
  border: 1px solid var(--neutral-26);
  transition: border-radius 0.15s ease;
`;

const RadiusTokenName = styled.span`
  font-size: var(--mono-xs-font-size, 10px);
  font-family: var(--mono-font-family);
  color: var(--neutral-60);
`;

const RadiusTokenValue = styled.span`
  font-size: var(--mono-xs-font-size, 10px);
  font-family: var(--mono-font-family);
  color: var(--neutral-40);
`;

const NAMED_DARK_MIRROR = NAMED_SHADES.reduce((acc, shade, index) => {
  acc[shade] = NAMED_SHADES[NAMED_SHADES.length - 1 - index];
  return acc;
}, {});

const getPaletteHex = (palette, shade) => palette.find((p) => p.shade === shade)?.hex;

const getNamedForegroundToken = (palette, shade, bgIsLight) => {
  const shade5 = getPaletteHex(palette, 5);
  const shade100 = getPaletteHex(palette, 100);
  const bgHex = getPaletteHex(palette, bgIsLight ? shade : NAMED_DARK_MIRROR[shade]);

  if (!shade5 || !shade100 || !bgHex) {
    return shade < 60 ? 'var(--color-100)' : 'var(--color-5)';
  }

  const color5Hex = bgIsLight ? shade5 : shade100;
  const color100Hex = bgIsLight ? shade100 : shade5;

  return getContrastRatio(bgHex, color5Hex) >= getContrastRatio(bgHex, color100Hex)
    ? 'var(--color-5)'
    : 'var(--color-100)';
};

const defaultTheme = getStandardThemeById(DEFAULT_STANDARD_THEME_ID);
const DEFAULT_NAMED_COLOR = defaultTheme?.brandColor.replace(/^#/, '') ?? '025768';
const DEFAULT_NEUTRAL_COLOR = defaultTheme?.neutralColor.replace(/^#/, '') ?? '79716b';
const DEFAULT_MODE = 'named';
const DEFAULT_BG = 'light';

// Hash format: #namedHex/neutralHex/mode
// Falls back to legacy formats:
//   5-part: #namedHex/namedName/neutralHex/neutralName/mode (ignores names)
//   3-part: #hex/name/mode (ignores name)
const parseHash = () => {
  try {
    const hash = decodeURI(window.location.hash);
    if (!hash || hash === '#') {
      return null;
    }
    const parts = hash.slice(1).split('/');
    // 4/5-part: namedHex/neutralHex/mode/curvature[/monochrome]
    if (
      (parts.length === 4 || parts.length === 5) &&
      isValidHex(parts[0]) &&
      isValidHex(parts[1]) &&
      ['named', 'neutral'].includes(parts[2])
    ) {
      const c = parseFloat(parts[3]);
      return {
        namedColor: parts[0],
        neutralColor: parts[1],
        mode: parts[2],
        curvature: Number.isFinite(c) ? c : 1,
        isMonochrome: parts[4] === 'monochrome' || parts[4] === 'named-neutral',
      };
    }
    // 3-part: namedHex/neutralHex/mode
    if (
      parts.length === 3 &&
      isValidHex(parts[0]) &&
      isValidHex(parts[1]) &&
      ['named', 'neutral'].includes(parts[2])
    ) {
      return { namedColor: parts[0], neutralColor: parts[1], mode: parts[2] };
    }
    // Legacy 5-part (with names)
    if (parts.length === 5) {
      const [namedColor, , neutralColor, , mode] = parts;
      if (!isValidHex(namedColor) || !isValidHex(neutralColor)) {
        return null;
      }
      if (!['named', 'neutral'].includes(mode)) {
        return null;
      }
      return { namedColor, neutralColor, mode };
    }
    // Legacy 3-part (single colour)
    if (parts.length >= 3) {
      const [color, , mode] = parts;
      if (!isValidHex(color)) {
        return null;
      }
      if (!['named', 'neutral'].includes(mode)) {
        return null;
      }
      if (mode === 'named') {
        return { namedColor: color, neutralColor: DEFAULT_NEUTRAL_COLOR, mode };
      }
      return { namedColor: DEFAULT_NAMED_COLOR, neutralColor: color, mode };
    }
    return null;
  } catch {
    return null;
  }
};

function ScaleApp({ syncUrlHash = true } = {}) {
  const initial = useMemo(
    () =>
      (syncUrlHash ? parseHash() : null) ?? {
        namedColor: DEFAULT_NAMED_COLOR,
        neutralColor: DEFAULT_NEUTRAL_COLOR,
        mode: DEFAULT_MODE,
      },
    [syncUrlHash],
  );

  // Independent named + neutral state
  const [namedColor, setNamedColor] = useState(initial.namedColor);
  const [neutralColor, setNeutralColor] = useState(initial.neutralColor);
  const [mode, setMode] = useState(initial.mode);
  const [bgColor, setBgColor] = useState(() => {
    try {
      return localStorage.getItem('scale-bg') || DEFAULT_BG;
    } catch {
      return DEFAULT_BG;
    }
  });
  const [switchPoint, setSwitchPoint] = useState(null); // null = auto
  const [whiteAnchor, setWhiteAnchor] = useState(false);
  const [isMonochrome, setIsMonochrome] = useState(initial.isMonochrome ?? false);
  const [curvature, setCurvature] = useState(initial.curvature ?? 1);
  const selectedStandardThemeId = useMemo(
    () =>
      isMonochrome || whiteAnchor ? null : getStandardThemeIdForColors(namedColor, neutralColor),
    [isMonochrome, namedColor, neutralColor, whiteAnchor],
  );
  const selectedMonochromeThemeId = useMemo(
    () => (isMonochrome && !whiteAnchor ? getMonochromeThemeIdForColor(namedColor) : null),
    [isMonochrome, namedColor, whiteAnchor],
  );

  // Active-mode aliases — the rest of the UI (controls, ColorsRow, CssOutput) operates on these
  const useNamedBase = mode === 'named' || (mode === 'neutral' && isMonochrome);
  const mainColor = useNamedBase ? namedColor : neutralColor;
  const setMainColor = useNamedBase ? setNamedColor : setNeutralColor;

  const hashUpdateTimeout = useTimeout();
  const latestHashRef = useRef('');

  // Compute both palettes independently
  const namedPalette = useMemo(() => {
    const hex = numberToHex(namedColor);
    if (!isValidHex(hex)) {
      return [];
    }

    if (isMonochrome) {
      return generateMonochromePalette(hex, { whiteAnchor }).filter(({ shade }) =>
        NAMED_SHADES.includes(shade),
      );
    }

    return generatePalette(hex, 'named', {});
  }, [isMonochrome, namedColor, whiteAnchor]);

  const neutralPalette = useMemo(() => {
    if (isMonochrome) {
      const hex = numberToHex(namedColor);
      return isValidHex(hex) ? generateMonochromePalette(hex, { whiteAnchor }) : [];
    }

    const hex = numberToHex(neutralColor);
    return isValidHex(hex) ? generatePalette(hex, 'neutral', { whiteAnchor }) : [];
  }, [isMonochrome, namedColor, neutralColor, whiteAnchor]);

  // Active palette for the existing controls/display
  const palette = mode === 'named' ? namedPalette : neutralPalette;

  // Auto-detect pivot from the named palette (only relevant for named mode)
  const namedAutoPivot = useMemo(() => {
    const s5 = namedPalette.find((p) => p.shade === 5)?.hex;
    const s60 = namedPalette.find((p) => p.shade === 60)?.hex;
    const s100 = namedPalette.find((p) => p.shade === 100)?.hex;
    if (!s5 || !s60 || !s100) {
      return 60;
    }
    return getContrastRatio(s60, s100) > getContrastRatio(s60, s5) ? 70 : 60;
  }, [namedPalette]);

  // Active pivot for the controls display (neutral mode shows 60 by default)
  const autoPivot = mode === 'named' ? namedAutoPivot : 60;

  // Determine if background is light or dark for text colour
  const bgIsLight = useMemo(() => {
    if (bgColor === 'white' || bgColor === 'light') {
      return true;
    }
    if (bgColor === 'dark' || bgColor === 'accent') {
      return false;
    }
    return true;
  }, [bgColor]);

  // --- Effects ---

  // The style root is [data-scale-app] when embedded (Storybook) or <html> standalone
  const getStyleRoot = () => document.querySelector('[data-scale-app]') || document.documentElement;

  // Update background and toggle dark/light mode on the design system
  useEffect(() => {
    try {
      localStorage.setItem('scale-bg', bgColor);
    } catch {
      /* quota */
    }
    const embedded = document.querySelector('[data-scale-app]');
    const isAccent = bgColor === 'accent';
    if (embedded) {
      // In accent mode, tint neutral-5 with the darkest generated palette tone
      if (isAccent) {
        embedded.style.setProperty(
          '--neutral-5',
          `color-mix(in srgb, var(--brand-100) 50%, black)`,
        );
      } else {
        embedded.style.removeProperty('--neutral-5');
      }
      embedded.style.backgroundColor = 'var(--neutral-5)';
      embedded.setAttribute('data-color-mode', bgIsLight ? 'light' : 'dark');
      document.documentElement.setAttribute('data-color-mode', bgIsLight ? 'light' : 'dark');

      // Re-define fg tokens on the embedded element so var(--neutral-5) / var(--neutral-100)
      // resolve in this element's context (where .dark/.light is set) rather than at :root
      const neutralFgPivot = 60;
      for (const shade of NEUTRAL_SHADES) {
        const fg = shade < neutralFgPivot ? 'var(--neutral-100)' : 'var(--neutral-5)';
        embedded.style.setProperty(`--neutral-${shade}-fg`, fg);
      }
      // Per-shade contrast: pick whichever resolved endpoint
      // (--color-5 or --color-100) has better contrast in the active mode.
      for (const shade of NAMED_SHADES) {
        const fg = getNamedForegroundToken(namedPalette, shade, bgIsLight);
        embedded.style.setProperty(`--color-${shade}-fg`, fg);
      }
    } else {
      const root = document.documentElement;

      if (isAccent) {
        root.style.setProperty('--neutral-5', `color-mix(in srgb, var(--brand-100) 50%, black)`);
      } else {
        root.style.removeProperty('--neutral-5');
      }
      root.setAttribute('data-color-mode', bgIsLight ? 'light' : 'dark');

      // Re-define fg tokens so var(--neutral-5) / var(--neutral-100)
      // resolve correctly for the active color mode
      const neutralFgPivot = 60;
      for (const shade of NEUTRAL_SHADES) {
        const fg = shade < neutralFgPivot ? 'var(--neutral-100)' : 'var(--neutral-5)';
        root.style.setProperty(`--neutral-${shade}-fg`, fg);
      }
      // Per-shade contrast: same logic as embedded branch
      for (const shade of NAMED_SHADES) {
        const fg = getNamedForegroundToken(namedPalette, shade, bgIsLight);
        root.style.setProperty(`--color-${shade}-fg`, fg);
      }
    }
  }, [bgIsLight, bgColor, namedPalette]);

  // Update theme-color meta tag
  useEffect(() => {
    const el = document.getElementById('themeMetaTag');
    if (el) {
      el.setAttribute('content', numberToHex(mainColor));
    }
  }, [mainColor]);

  // Inject CSS for both palettes so ComponentPreview reflects both simultaneously
  useEffect(() => {
    const parts = [];
    if (namedPalette.length) {
      const pivot = mode === 'named' ? (switchPoint ?? namedAutoPivot) : namedAutoPivot;
      parts.push(generateCssOutput('color', namedPalette, { mode: 'named', pivot }));
    }
    if (neutralPalette.length) {
      parts.push(generateCssOutput('neutral', neutralPalette, { mode: 'neutral' }));
    }
    const radiusCss = generateRadiusCss(curvature);
    if (radiusCss) {
      parts.push(radiusCss);
    }
    if (!parts.length) {
      return undefined;
    }
    const el = document.createElement('style');
    el.id = 'scale-preview-theme';
    document.getElementById('scale-preview-theme')?.remove();
    document.head.appendChild(el);
    // Scope :root rules to [data-scale-app] when embedded (e.g. Storybook)
    // so they don't leak into other pages
    const isEmbedded = !!document.querySelector('[data-scale-app]');
    let css = parts.join('\n\n');
    if (isEmbedded) {
      css = css.replace(/:root\b/g, '[data-scale-app]');
    }
    el.textContent = css;

    // Also set --radius-* on the style root so non-embedded elements pick them up
    const root = getStyleRoot();
    for (const { name, multiplier } of RADIUS_TOKENS) {
      if (curvature === 1) {
        root.style.removeProperty(`--radius-${name}`);
      } else {
        root.style.setProperty(
          `--radius-${name}`,
          `${getRadiusValue(multiplier, curvature).toFixed(3)}rem`,
        );
      }
    }

    return () => {
      el.remove();
      const r = getStyleRoot();
      for (const { name } of RADIUS_TOKENS) {
        r.style.removeProperty(`--radius-${name}`);
      }
    };
  }, [namedPalette, neutralPalette, mode, switchPoint, namedAutoPivot, curvature]);

  // Debounced URL hash update (5-part format)
  useEffect(() => {
    if (!syncUrlHash) {
      hashUpdateTimeout.clear();
      return undefined;
    }

    const curvaturePart = curvature !== 1 || isMonochrome ? `/${curvature.toFixed(2)}` : '';
    const monochromePart = isMonochrome ? '/monochrome' : '';
    const nextHash = `#${encodeURIComponent(namedColor)}/${encodeURIComponent(neutralColor)}/${mode}${curvaturePart}${monochromePart}`;

    hashUpdateTimeout.clear();
    hashUpdateTimeout.start(120, () => {
      if (window.location.hash === nextHash || latestHashRef.current === nextHash) {
        return;
      }
      try {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}${nextHash}`,
        );
        latestHashRef.current = nextHash;
      } catch {
        try {
          window.location.hash = nextHash;
        } catch {
          /* ignore */
        }
      }
    });

    return () => {
      hashUpdateTimeout.clear();
    };
  }, [namedColor, neutralColor, mode, curvature, isMonochrome, syncUrlHash, hashUpdateTimeout]);

  const resetToDefaults = () => {
    setNamedColor(DEFAULT_NAMED_COLOR);
    setNeutralColor(DEFAULT_NEUTRAL_COLOR);
    setMode(DEFAULT_MODE);
    setSwitchPoint(null);
    setWhiteAnchor(false);
    setIsMonochrome(false);
    setCurvature(1);
    if (syncUrlHash) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        latestHashRef.current = '';
      } catch {
        /* ignore */
      }
    }
  };

  const handleMainColorChange = (event) => {
    const raw = event.target.value
      .replace(/#/g, '')
      .replace(/[^0-9a-fA-F]/g, '')
      .slice(0, 6);
    setSwitchPoint(null);
    setMainColor(raw);
  };

  const handleRandomize = () => {
    const randomMode = mode === 'neutral' && isMonochrome ? 'monochrome' : mode;
    setSwitchPoint(null);
    setMainColor(randomBaseColor(randomMode, { whiteAnchor }).replace('#', ''));
  };

  const handleRandomizeBoth = () => {
    setSwitchPoint(null);
    setNamedColor(
      randomBaseColor(isMonochrome ? 'monochrome' : 'named', {
        whiteAnchor,
      }).replace('#', ''),
    );
    setNeutralColor(randomBaseColor('neutral', { whiteAnchor }).replace('#', ''));
  };

  const handleModeChange = (keys) => {
    const selected = [...keys][0];
    if (!selected) {
      return;
    }

    setSwitchPoint(null);
    setMode(selected);
    if (selected !== 'neutral') {
      setWhiteAnchor(false);
      setIsMonochrome(false);
    }
  };

  const handleMonochromeChange = (selected) => {
    setSwitchPoint(null);
    setIsMonochrome(selected);
  };

  const applyStandardThemePreset = (themeId) => {
    const theme = getStandardThemeById(themeId);
    if (!theme) {
      return;
    }

    setNamedColor(theme.brandColor.replace(/^#/, ''));
    setNeutralColor(theme.neutralColor.replace(/^#/, ''));
    setSwitchPoint(null);
    setWhiteAnchor(false);
    setIsMonochrome(false);
  };

  const applyMonochromeThemePreset = (themeId) => {
    const theme = getMonochromeThemeById(themeId);
    if (!theme) {
      return;
    }

    const color = theme.color.replace(/^#/, '');
    setNamedColor(color);
    setNeutralColor(color);
    setMode('neutral');
    setSwitchPoint(null);
    setWhiteAnchor(false);
    setIsMonochrome(true);
  };

  // Listen for external requests from the playground header
  useEffect(() => {
    const onRandomize = () => handleRandomizeBoth();
    const onSetBg = (event) => setBgColor(event.detail);
    const onReset = () => resetToDefaults();
    const onApplyStandardTheme = (event) => applyStandardThemePreset(event.detail);
    const onApplyMonochromeTheme = (event) => applyMonochromeThemePreset(event.detail);
    window.addEventListener('scale:randomize-both', onRandomize);
    window.addEventListener('scale:set-bg', onSetBg);
    window.addEventListener('scale:reset', onReset);
    window.addEventListener('scale:apply-standard-theme', onApplyStandardTheme);
    window.addEventListener('scale:apply-monochrome-theme', onApplyMonochromeTheme);
    return () => {
      window.removeEventListener('scale:randomize-both', onRandomize);
      window.removeEventListener('scale:set-bg', onSetBg);
      window.removeEventListener('scale:reset', onReset);
      window.removeEventListener('scale:apply-standard-theme', onApplyStandardTheme);
      window.removeEventListener('scale:apply-monochrome-theme', onApplyMonochromeTheme);
    };
  });

  useEffect(() => {
    const themeId = selectedStandardThemeId ?? selectedMonochromeThemeId ?? 'custom';
    document.documentElement.dataset.playgroundTheme = themeId;
    if (selectedStandardThemeId) {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, selectedStandardThemeId);
      document.documentElement.removeAttribute(MONOCHROME_THEME_ATTRIBUTE);
    } else if (selectedMonochromeThemeId) {
      document.documentElement.removeAttribute(THEME_ATTRIBUTE);
      document.documentElement.setAttribute(MONOCHROME_THEME_ATTRIBUTE, selectedMonochromeThemeId);
    } else {
      document.documentElement.removeAttribute(THEME_ATTRIBUTE);
      document.documentElement.removeAttribute(MONOCHROME_THEME_ATTRIBUTE);
    }
    window.dispatchEvent(
      new CustomEvent('scale:standard-theme-change', { detail: selectedStandardThemeId }),
    );
    window.dispatchEvent(
      new CustomEvent('scale:monochrome-theme-change', { detail: selectedMonochromeThemeId }),
    );
  }, [selectedMonochromeThemeId, selectedStandardThemeId]);

  return (
    <MainWrapper className="tale-ui">
      <HeaderRow>
        <HeaderLeft>
          <PageTitle>Theme Playground</PageTitle>
          <PageDescription>
            Generate named and neutral colour scales from a base colour. Preview how they look
            across components, copy the CSS tokens, and fine-tune contrast pivot points.
          </PageDescription>
        </HeaderLeft>
        <BackgroundSelector setBgColor={setBgColor} bgColor={bgColor} />
      </HeaderRow>

      <ThemeSection aria-labelledby="theme-presets-heading">
        <ThemeSectionHeader>
          <ThemeSectionTitle id="theme-presets-heading">Standard themes</ThemeSectionTitle>
          <ThemeSectionHint>Distinct brand + neutral scales from paired anchors</ThemeSectionHint>
        </ThemeSectionHeader>
        <ThemeGrid role="group" aria-label="Standard themes">
          {STANDARD_THEMES.map((theme) => (
            <ThemeCard
              key={theme.id}
              variant="outlined"
              padding="sm"
              isSelected={selectedStandardThemeId === theme.id}
              title={theme.description}
              onPress={() => applyStandardThemePreset(theme.id)}
            >
              <ThemeSwatches aria-hidden="true">
                <ThemeSwatch style={{ backgroundColor: theme.brandPalette[6]?.hex }} />
                <ThemeSwatch style={{ backgroundColor: theme.neutralPalette[14]?.hex }} />
              </ThemeSwatches>
              <ThemeName>{theme.name}</ThemeName>
            </ThemeCard>
          ))}
        </ThemeGrid>
      </ThemeSection>

      <ThemeSection aria-labelledby="monochrome-theme-presets-heading">
        <ThemeSectionHeader>
          <ThemeSectionTitle id="monochrome-theme-presets-heading">
            Monochrome themes
          </ThemeSectionTitle>
          <ThemeSectionHint>Shared brand + neutral scales from one colour anchor</ThemeSectionHint>
        </ThemeSectionHeader>
        <ThemeGrid role="group" aria-label="Monochrome themes">
          {MONOCHROME_THEMES.map((theme) => (
            <ThemeCard
              key={theme.id}
              variant="outlined"
              padding="sm"
              isSelected={selectedMonochromeThemeId === theme.id}
              title={theme.description}
              onPress={() => applyMonochromeThemePreset(theme.id)}
            >
              <ThemeSwatches aria-hidden="true">
                <ThemeSwatch style={{ backgroundColor: theme.brandPalette[6]?.hex }} />
                <ThemeSwatch style={{ backgroundColor: theme.neutralPalette[14]?.hex }} />
              </ThemeSwatches>
              <ThemeName>{theme.name}</ThemeName>
            </ThemeCard>
          ))}
        </ThemeGrid>
      </ThemeSection>

      <ToolbarRow>
        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[mode]}
          onSelectionChange={handleModeChange}
        >
          <ToggleButton id="named" size="sm">
            Named
          </ToggleButton>
          <ToggleButton id="neutral" size="sm">
            Neutral
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="neutral"
          size="sm"
          onPress={handleRandomize}
          title="Pick a random BASE colour"
        >
          Randomize
        </Button>
        <Button
          variant="neutral"
          size="sm"
          onPress={handleRandomizeBoth}
          title="Randomize both named and neutral colours"
        >
          Randomize both
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onPress={resetToDefaults}
          title="Reset all settings to design system defaults"
        >
          Reset to defaults
        </Button>
        {mode === 'neutral' && (
          <React.Fragment>
            <ToggleButton size="sm" isSelected={whiteAnchor} onChange={setWhiteAnchor}>
              White at neutral-5
            </ToggleButton>
            <ToggleButton
              size="sm"
              isSelected={isMonochrome}
              onChange={handleMonochromeChange}
              title="Derive the brand and neutral scales from the named colour"
            >
              Monochrome theme
            </ToggleButton>
          </React.Fragment>
        )}
      </ToolbarRow>

      <TopSection>
        <ColorsSection>
          <ControlsRow>
            <MainColorSelector
              mainColor={mainColor}
              onColorChange={handleMainColorChange}
              onColorBlur={(event) => {
                if (!event.target.value) {
                  setSwitchPoint(null);
                  setMainColor(mode === 'named' ? DEFAULT_NAMED_COLOR : DEFAULT_NEUTRAL_COLOR);
                }
              }}
            />
          </ControlsRow>

          <PivotRow>
            <ContrastPivotSelector
              value={switchPoint}
              autoPivot={autoPivot}
              onChange={setSwitchPoint}
            />
          </PivotRow>

          <ColorsRow
            palette={palette}
            pivot={switchPoint ?? autoPivot}
            varPrefix={mode === 'named' ? 'color' : 'neutral'}
            bgIsLight={bgIsLight}
          />

          <RadiusSection>
            <RadiusHeader>
              <RadiusLabel>Border radius</RadiusLabel>
              <Slider
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={curvature}
                onChange={(event) => setCurvature(parseFloat(event.target.value))}
              />
              <RadiusValue>
                {curvature.toFixed(2)}x{curvature === 1 ? ' (default)' : ''}
              </RadiusValue>
              {curvature !== 1 && (
                <Button variant="ghost" size="sm" onPress={() => setCurvature(1)}>
                  Reset
                </Button>
              )}
            </RadiusHeader>
            <RadiusPreviewRow>
              {RADIUS_TOKENS.map(({ name, multiplier }) => {
                const rem = getRadiusValue(multiplier, curvature);
                const px = Math.round(rem * 16);
                return (
                  <RadiusPreviewItem key={name}>
                    <RadiusPreviewBox style={{ borderRadius: `${rem}rem` }} />
                    <RadiusTokenName>{name}</RadiusTokenName>
                    <RadiusTokenValue>{px}px</RadiusTokenValue>
                  </RadiusPreviewItem>
                );
              })}
            </RadiusPreviewRow>
          </RadiusSection>

          <OutputRow>
            <CssColumn>
              <CssOutput
                namedPalette={namedPalette}
                namedPivot={switchPoint ?? namedAutoPivot}
                neutralPalette={neutralPalette}
                bgColor={bgColor}
                curvature={curvature}
              />
            </CssColumn>
            <PreviewColumn>
              <ComponentPreview />
            </PreviewColumn>
          </OutputRow>
        </ColorsSection>
      </TopSection>
    </MainWrapper>
  );
}

export default ScaleApp;
