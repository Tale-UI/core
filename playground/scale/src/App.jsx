import './App.css';
import * as React from 'react';
import styled from 'styled-components';
import { Button } from '@tale-ui/react/button';
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';
import { useTimeout } from '@tale-ui/utils/useTimeout';
import {
  isValidHex,
  numberToHex,
  generatePalette,
  generateNamedNeutralPalette,
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

const DEFAULT_NAMED_COLOR = '025768';
const DEFAULT_NEUTRAL_COLOR = '79716b';
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
    // 4/5-part: namedHex/neutralHex/mode/curvature[/named-neutral]
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
        namedAsNeutral: parts[4] === 'named-neutral',
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

function ScaleApp() {
  const initial = useMemo(
    () =>
      parseHash() ?? {
        namedColor: DEFAULT_NAMED_COLOR,
        neutralColor: DEFAULT_NEUTRAL_COLOR,
        mode: DEFAULT_MODE,
      },
    [],
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
  const [namedAsNeutral, setNamedAsNeutral] = useState(initial.namedAsNeutral ?? false);
  const [curvature, setCurvature] = useState(initial.curvature ?? 1);

  // Active-mode aliases — the rest of the UI (controls, ColorsRow, CssOutput) operates on these
  const useNamedBase = mode === 'named' || (mode === 'neutral' && namedAsNeutral);
  const mainColor = useNamedBase ? namedColor : neutralColor;
  const setMainColor = useNamedBase ? setNamedColor : setNeutralColor;

  const hashUpdateTimeout = useTimeout();
  const latestHashRef = useRef('');

  // Compute both palettes independently
  const namedPalette = useMemo(() => {
    const hex = numberToHex(namedColor);
    return isValidHex(hex) ? generatePalette(hex, 'named', {}) : [];
  }, [namedColor]);

  const neutralPalette = useMemo(() => {
    if (namedAsNeutral) {
      const hex = numberToHex(namedColor);
      return isValidHex(hex) ? generateNamedNeutralPalette(hex, { whiteAnchor }) : [];
    }

    const hex = numberToHex(neutralColor);
    return isValidHex(hex) ? generatePalette(hex, 'neutral', { whiteAnchor }) : [];
  }, [namedAsNeutral, namedColor, neutralColor, whiteAnchor]);

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
      // Per-shade contrast: pick whichever endpoint (--color-5 or --color-100)
      // has better contrast against the shade's actual hex value.
      const s5 = namedPalette.find((p) => p.shade === 5)?.hex;
      const s100 = namedPalette.find((p) => p.shade === 100)?.hex;
      for (const shade of NAMED_SHADES) {
        const shadeHex = namedPalette.find((p) => p.shade === shade)?.hex;
        let fg = shade < 60 ? 'var(--color-100)' : 'var(--color-5)'; // fallback: default pivot
        if (shadeHex && s5 && s100) {
          fg =
            getContrastRatio(shadeHex, s5) >= getContrastRatio(shadeHex, s100)
              ? 'var(--color-5)'
              : 'var(--color-100)';
        }
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
      const s5 = namedPalette.find((p) => p.shade === 5)?.hex;
      const s100 = namedPalette.find((p) => p.shade === 100)?.hex;
      for (const shade of NAMED_SHADES) {
        const shadeHex = namedPalette.find((p) => p.shade === shade)?.hex;
        let fg = shade < 60 ? 'var(--color-100)' : 'var(--color-5)';
        if (shadeHex && s5 && s100) {
          fg =
            getContrastRatio(shadeHex, s5) >= getContrastRatio(shadeHex, s100)
              ? 'var(--color-5)'
              : 'var(--color-100)';
        }
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
    const curvaturePart = curvature !== 1 || namedAsNeutral ? `/${curvature.toFixed(2)}` : '';
    const namedAsNeutralPart = namedAsNeutral ? '/named-neutral' : '';
    const nextHash = `#${encodeURIComponent(namedColor)}/${encodeURIComponent(neutralColor)}/${mode}${curvaturePart}${namedAsNeutralPart}`;

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
  }, [namedColor, neutralColor, mode, curvature, namedAsNeutral, hashUpdateTimeout]);

  const resetToDefaults = () => {
    setNamedColor(DEFAULT_NAMED_COLOR);
    setNeutralColor(DEFAULT_NEUTRAL_COLOR);
    setMode(DEFAULT_MODE);
    setSwitchPoint(null);
    setWhiteAnchor(false);
    setNamedAsNeutral(false);
    setCurvature(1);
    try {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      latestHashRef.current = '';
    } catch {
      /* ignore */
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
    const randomMode = mode === 'neutral' && namedAsNeutral ? 'named-neutral' : mode;
    setSwitchPoint(null);
    setMainColor(randomBaseColor(randomMode, { whiteAnchor }).replace('#', ''));
  };

  const handleRandomizeBoth = () => {
    setSwitchPoint(null);
    setNamedColor(
      randomBaseColor(namedAsNeutral ? 'named-neutral' : 'named', { whiteAnchor }).replace('#', ''),
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
      setNamedAsNeutral(false);
    }
  };

  const handleNamedAsNeutralChange = (selected) => {
    setSwitchPoint(null);
    setNamedAsNeutral(selected);
  };

  // Listen for external requests from the playground header
  useEffect(() => {
    const onRandomize = () => handleRandomizeBoth();
    const onSetBg = (event) => setBgColor(event.detail);
    const onReset = () => resetToDefaults();
    window.addEventListener('scale:randomize-both', onRandomize);
    window.addEventListener('scale:set-bg', onSetBg);
    window.addEventListener('scale:reset', onReset);
    return () => {
      window.removeEventListener('scale:randomize-both', onRandomize);
      window.removeEventListener('scale:set-bg', onSetBg);
      window.removeEventListener('scale:reset', onReset);
    };
  });

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
              isSelected={namedAsNeutral}
              onChange={handleNamedAsNeutralChange}
              title="Use the named colour as a 27-step neutral palette"
            >
              Named as Neutral
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
