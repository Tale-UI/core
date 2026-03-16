import React, { useState, useEffect, useMemo, useRef } from 'react'
import './App.css'
import { formatHex, converter } from 'culori'
import styled from 'styled-components'
import { Button } from '@tale-ui/react/button'
import { ToggleButton } from '@tale-ui/react/toggle-button'
import { ToggleButtonGroup } from '@tale-ui/react/toggle-button'
import { isValidHex, numberToHex, errorColor, generatePalette, randomBaseColor, getContrastRatio, generateCssOutput, NAMED_SHADES, NEUTRAL_SHADES } from './utils'
import ColorsRow from './components/colors-row'
import MainColorSelector from './components/main-color-selector'
import BackgroundSelector from './components/background-selector'
import ContrastPivotSelector from './components/contrast-pivot-selector'
import CssOutput from './components/css-output'
import ComponentPreview from './components/component-preview'

const toRgb = converter('rgb')

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
`

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
`

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
`

const PageTitle = styled.h1`
  font-size: var(--display-s-font-size);
  font-weight: var(--display-font-weight);
  line-height: var(--display-line-height);
  margin: 0;
`

const PageDescription = styled.p`
  font-size: var(--text-s-font-size);
  line-height: var(--text-line-height);
  margin: 0;
  opacity: 0.7;
`

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
`

const ColorsSection = styled.div`
  width: 100%;
`

const PivotRow = styled.div`
  margin-bottom: var(--space-l);
`

const TopSection = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
`

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
`

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
`

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
`

const PreviewColumn = styled.div`
  flex: 1;
  min-width: 0;
`


const randomName = () => {
  const len = 3 + Math.floor(Math.random() * 5)
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let name = ''
  for (let i = 0; i < len; i++) name += chars[Math.floor(Math.random() * 26)]
  return name
}

const DEFAULT_NAMED_COLOR   = 'dc2626'
const DEFAULT_NAMED_NAME    = randomName()
const DEFAULT_NEUTRAL_COLOR = '79716b'
const DEFAULT_NEUTRAL_NAME  = randomName()
const DEFAULT_MODE          = 'named'
const DEFAULT_BG            = 'light'

// Hash format: #namedHex/namedName/neutralHex/neutralName/mode
// Falls back to legacy 3-part: #hex/name/mode (named only)
const parseHash = () => {
  try {
    const hash = decodeURI(window.location.hash)
    if (!hash || hash === '#') return null
    const parts = hash.slice(1).split('/')
    if (parts.length === 5) {
      const [namedColor, namedName, neutralColor, neutralName, mode] = parts
      if (!isValidHex(namedColor) || !isValidHex(neutralColor)) return null
      if (!['named', 'neutral'].includes(mode)) return null
      return { namedColor, namedName, neutralColor, neutralName, mode }
    }
    // Legacy 3-part
    if (parts.length >= 3) {
      const [color, name, mode] = parts
      if (!isValidHex(color)) return null
      if (!['named', 'neutral'].includes(mode)) return null
      if (mode === 'named') return { namedColor: color, namedName: name, neutralColor: DEFAULT_NEUTRAL_COLOR, neutralName: DEFAULT_NEUTRAL_NAME, mode }
      return { namedColor: DEFAULT_NAMED_COLOR, namedName: DEFAULT_NAMED_NAME, neutralColor: color, neutralName: name, mode }
    }
    return null
  } catch {
    return null
  }
}

// Mix two hex colors in sRGB space at ratio t (0=a, 1=b), return hex
const mixColors = (hexA, hexB, t) => {
  const a = toRgb(hexA)
  const b = toRgb(hexB)
  if (!a || !b) return hexA
  return formatHex({
    mode: 'rgb',
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  })
}

const ScaleApp = () => {
  const initial = useMemo(() => parseHash() ?? {
    namedColor:   DEFAULT_NAMED_COLOR,
    namedName:    DEFAULT_NAMED_NAME,
    neutralColor: DEFAULT_NEUTRAL_COLOR,
    neutralName:  DEFAULT_NEUTRAL_NAME,
    mode:         DEFAULT_MODE,
  }, [])

  // Independent named + neutral state
  const [namedColor,   setNamedColor]   = useState(initial.namedColor)
  const [namedName,    setNamedName]    = useState(initial.namedName)
  const [neutralColor, setNeutralColor] = useState(initial.neutralColor)
  const [neutralName,  setNeutralName]  = useState(initial.neutralName)
  const [mode,         setMode]         = useState(initial.mode)
  const [bgColor,      setBgColor]      = useState(DEFAULT_BG)
  const [switchPoint,  setSwitchPoint]  = useState(null)  // null = auto
  const [whiteAnchor,  setWhiteAnchor]  = useState(false)

  // Active-mode aliases — the rest of the UI (controls, ColorsRow, CssOutput) operates on these
  const mainColor    = mode === 'named' ? namedColor   : neutralColor
  const setMainColor = mode === 'named' ? setNamedColor : setNeutralColor
  const paletteName    = mode === 'named' ? namedName    : neutralName
  const setPaletteName = mode === 'named' ? setNamedName  : setNeutralName

  const hashUpdateTimeoutRef = useRef(null)
  const latestHashRef        = useRef('')

  // Compute both palettes independently
  const namedPalette = useMemo(() => {
    const hex = numberToHex(namedColor)
    return isValidHex(hex) ? generatePalette(hex, 'named', {}) : []
  }, [namedColor])

  const neutralPalette = useMemo(() => {
    const hex = numberToHex(neutralColor)
    return isValidHex(hex) ? generatePalette(hex, 'neutral', { whiteAnchor }) : []
  }, [neutralColor, whiteAnchor])

  // Active palette for the existing controls/display
  const palette = mode === 'named' ? namedPalette : neutralPalette

  // Auto-detect pivot from the named palette (only relevant for named mode)
  const namedAutoPivot = useMemo(() => {
    const s5   = namedPalette.find(p => p.shade === 5)?.hex
    const s60  = namedPalette.find(p => p.shade === 60)?.hex
    const s100 = namedPalette.find(p => p.shade === 100)?.hex
    if (!s5 || !s60 || !s100) return 60
    return getContrastRatio(s60, s100) > getContrastRatio(s60, s5) ? 70 : 60
  }, [namedPalette])

  // Active pivot for the controls display (neutral mode shows 60 by default)
  const autoPivot = mode === 'named' ? namedAutoPivot : 60

  // Determine if background is light or dark for text colour
  const bgIsLight = useMemo(() => {
    if (bgColor === 'white' || bgColor === 'light') return true
    if (bgColor === 'dark' || bgColor === 'accent') return false
    return true
  }, [bgColor])

  // --- Effects ---

  // The style root is [data-scale-app] when embedded (Storybook) or <html> standalone
  const getStyleRoot = () => document.querySelector('[data-scale-app]') || document.documentElement

  // Update background and toggle dark/light mode on the design system
  useEffect(() => {
    const embedded = document.querySelector('[data-scale-app]')
    var isAccent = bgColor === 'accent'
    if (embedded) {
      // Apply the generated neutral theme class so --neutral-default-* resolves
      // from the generated palette, making --neutral-5 use the generated values
      embedded.className = embedded.className.replace(/\bneutral-\S+/g, '')
      if (neutralName) embedded.classList.add(`neutral-${neutralName}`)

      // In accent mode, tint neutral-5 with the darkest generated palette tone
      if (isAccent && namedName) {
        embedded.style.setProperty('--neutral-5', `color-mix(in srgb, var(--${namedName}-100) 50%, black)`)
      } else {
        embedded.style.removeProperty('--neutral-5')
      }
      embedded.style.backgroundColor = 'var(--neutral-5)'
      embedded.classList.toggle('dark', !bgIsLight)
      embedded.classList.toggle('light', bgIsLight)
      // Also set data-color-mode on <html> to silence the OS dark media query
      document.documentElement.setAttribute('data-color-mode', bgIsLight ? 'light' : 'dark')

      // Re-define fg tokens on the embedded element so var(--neutral-5) / var(--neutral-100)
      // resolve in this element's context (where .dark/.light is set) rather than at :root
      const neutralFgPivot = 60
      for (const shade of NEUTRAL_SHADES) {
        const fg = shade < neutralFgPivot ? 'var(--neutral-100)' : 'var(--neutral-5)'
        embedded.style.setProperty(`--neutral-${shade}-fg`, fg)
      }
      const colorFgPivot = 60
      for (const shade of NAMED_SHADES) {
        const fg = shade < colorFgPivot ? 'var(--color-100)' : 'var(--color-5)'
        embedded.style.setProperty(`--color-${shade}-fg`, fg)
      }
    } else {
      const root = document.documentElement
      // Apply the generated neutral theme class
      root.className = root.className.replace(/\bneutral-\S+/g, '')
      if (neutralName) root.classList.add(`neutral-${neutralName}`)

      if (isAccent && namedName) {
        root.style.setProperty('--neutral-5', `color-mix(in srgb, var(--${namedName}-100) 50%, black)`)
      } else {
        root.style.removeProperty('--neutral-5')
      }
      root.setAttribute('data-color-mode', bgIsLight ? 'light' : 'dark')
    }
  }, [bgIsLight, bgColor, namedName, neutralName])

  // Update palette-tinted text colour tokens
  useEffect(() => {
    const hex = isValidHex(numberToHex(mainColor)) ? numberToHex(mainColor) : errorColor
    const mixTarget = bgIsLight ? '#000000' : '#ffffff'
    const bodyColor = mixColors(hex, mixTarget, 0.5)
    const root = getStyleRoot()

    root.style.setProperty('--text-color',    bodyColor)
    root.style.setProperty('--display-color', bodyColor)
    root.style.setProperty('--mono-color',    bodyColor)
    root.style.setProperty('--bodyDimmed',  bodyColor + '4d')
    root.style.setProperty('--bodyXDimmed', bodyColor + '1a')
    root.style.setProperty('--border',      bodyColor + '26')
  }, [mainColor, bgIsLight])

  // Update theme-color meta tag
  useEffect(() => {
    const el = document.getElementById('themeMetaTag')
    if (el) el.setAttribute('content', numberToHex(mainColor))
  }, [mainColor])

  // Reset manual pivot and white anchor when the active colour or mode changes
  useEffect(() => {
    setSwitchPoint(null)
    if (mode !== 'neutral') setWhiteAnchor(false)
  }, [mainColor, mode])

  // Inject CSS for both palettes so ComponentPreview reflects both simultaneously
  useEffect(() => {
    const parts = []
    if (namedPalette.length) {
      const pivot = mode === 'named' ? (switchPoint ?? namedAutoPivot) : namedAutoPivot
      parts.push(generateCssOutput(namedName || 'color', namedPalette, { mode: 'named', pivot }))
    }
    if (neutralPalette.length) {
      parts.push(generateCssOutput(neutralName || 'neutral', neutralPalette, { mode: 'neutral' }))
    }
    if (!parts.length) return
    const el = document.createElement('style')
    el.id = 'scale-preview-theme'
    document.getElementById('scale-preview-theme')?.remove()
    document.head.appendChild(el)
    // Scope :root rules to [data-scale-app] when embedded (e.g. Storybook)
    // so they don't leak into other pages
    const isEmbedded = !!document.querySelector('[data-scale-app]')
    let css = parts.join('\n\n')
    if (isEmbedded) {
      css = css.replace(/:root\b/g, '[data-scale-app]')
    }
    el.textContent = css
    return () => el.remove()
  }, [namedPalette, namedName, neutralPalette, neutralName, mode, switchPoint, namedAutoPivot])

  // Debounced URL hash update (5-part format)
  useEffect(() => {
    const nextHash = `#${encodeURIComponent(namedColor)}/${encodeURIComponent(namedName)}/${encodeURIComponent(neutralColor)}/${encodeURIComponent(neutralName)}/${mode}`

    if (hashUpdateTimeoutRef.current) clearTimeout(hashUpdateTimeoutRef.current)

    hashUpdateTimeoutRef.current = setTimeout(() => {
      if (window.location.hash === nextHash || latestHashRef.current === nextHash) return
      try {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`)
        latestHashRef.current = nextHash
      } catch {
        try { window.location.hash = nextHash } catch {}
      }
    }, 120)

    return () => { if (hashUpdateTimeoutRef.current) clearTimeout(hashUpdateTimeoutRef.current) }
  }, [namedColor, namedName, neutralColor, neutralName, mode])

  const handleMainColorChange = (e) => {
    const raw = e.target.value.replace(/^#/, '')
    setMainColor(raw)
  }

  const handleRandomize = () => {
    setMainColor(randomBaseColor(mode).replace('#', ''))
  }

  const handleRandomizeBoth = () => {
    setNamedColor(randomBaseColor('named').replace('#', ''))
    setNeutralColor(randomBaseColor('neutral').replace('#', ''))
    setNamedName(randomName())
    setNeutralName(randomName())
  }

  return (
    <MainWrapper className={`neutral-${neutralName || 'neutral'} color-${namedName || 'color'}`}>
      <HeaderRow>
        <HeaderLeft>
          <PageTitle>Theme Playground</PageTitle>
          <PageDescription>Generate named and neutral colour scales from a base colour. Preview how they look across components, copy the CSS tokens, and fine-tune contrast pivot points.</PageDescription>
        </HeaderLeft>
        <BackgroundSelector
          setBgColor={setBgColor}
          bgColor={bgColor}
          paletteName={namedName}
        />
      </HeaderRow>

      <ToolbarRow>
        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const selected = [...keys][0]
            if (selected) setMode(selected)
          }}
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
        {mode === 'neutral' && (
          <ToggleButton
            size="sm"
            isSelected={whiteAnchor}
            onChange={setWhiteAnchor}
          >
            White at neutral-5
          </ToggleButton>
        )}
      </ToolbarRow>

      <TopSection>
        <ColorsSection>
          <ControlsRow>
            <MainColorSelector
              mainColor={mainColor}
              paletteName={paletteName}
              onColorChange={handleMainColorChange}
              onColorBlur={(e) => { if (!e.target.value) setMainColor(mode === 'named' ? DEFAULT_NAMED_COLOR : DEFAULT_NEUTRAL_COLOR) }}
              onNameChange={(e) => setPaletteName(e.target.value)}
            />
          </ControlsRow>

          <PivotRow>
            <ContrastPivotSelector
              value={switchPoint}
              autoPivot={autoPivot}
              onChange={setSwitchPoint}
            />
          </PivotRow>

          <ColorsRow palette={palette} pivot={switchPoint ?? autoPivot} />

          <OutputRow>
            <CssColumn>
              <CssOutput
                namedName={namedName}
                namedPalette={namedPalette}
                namedPivot={switchPoint ?? namedAutoPivot}
                neutralName={neutralName}
                neutralPalette={neutralPalette}
                bgColor={bgColor}
              />
            </CssColumn>
            <PreviewColumn>
              <ComponentPreview
                namedName={namedName}
                neutralName={neutralName}
              />
            </PreviewColumn>
          </OutputRow>
        </ColorsSection>
      </TopSection>

    </MainWrapper>
  )
}

export default ScaleApp
