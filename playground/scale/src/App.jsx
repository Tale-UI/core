import React, { useState, useEffect, useMemo, useRef } from 'react'
import './App.css'
import { formatHex, converter } from 'culori'
import styled from 'styled-components'
import Footer from './components/footer'
import { isValidHex, numberToHex, errorColor, generatePalette, randomBaseColor, getContrastRatio, generateCssOutput } from './utils'
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
    padding: var(--space-l);
    min-height: calc(100vh - 40px);
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
  }
`

const OutputRow = styled.div`
  display: flex;
  gap: var(--space-xl);
  margin-top: var(--space-xl);
  align-items: stretch;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`

const CssColumn = styled.div`
  width: 440px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 960px) {
    width: 100%;
    height: 400px;
  }
`

const PreviewColumn = styled.div`
  flex: 1;
  min-width: 0;
`

const BackgroundSelectorSection = styled.div`
  border-left: 1px solid var(--neutral-30);
  padding-left: var(--space-xl);

  @media (max-width: 720px) {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid var(--neutral-30);
    padding-top: var(--space-l);
    width: 100%;
  }
`

const DEFAULT_NAMED_COLOR   = 'dc2626'
const DEFAULT_NAMED_NAME    = 'color'
const DEFAULT_NEUTRAL_COLOR = '79716b'
const DEFAULT_NEUTRAL_NAME  = 'neutral'
const DEFAULT_MODE          = 'named'
const DEFAULT_BG            = 'white'

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

  // Resolve bgColor to a hex string for CSS variable
  const resolvedBg = useMemo(() => {
    if (bgColor === 'white') return '#ffffff'
    if (bgColor === 'black') return '#000000'
    if (bgColor === 'light') return palette.find(p => p.shade === 5)?.hex  ?? '#ffffff'
    if (bgColor === 'dark')  return palette.find(p => p.shade === 100)?.hex ?? '#000000'
    return '#ffffff'
  }, [bgColor, palette])

  // Determine if background is light or dark for text colour
  const bgIsLight = useMemo(() => {
    if (bgColor === 'white' || bgColor === 'light') return true
    if (bgColor === 'black' || bgColor === 'dark')  return false
    return true
  }, [bgColor])

  // --- Effects ---

  // Update background and toggle dark/light mode on the design system
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bodyBg', resolvedBg)
    root.setAttribute('data-color-mode', bgIsLight ? 'light' : 'dark')
  }, [resolvedBg, bgIsLight])

  // Update palette-tinted text colour tokens
  useEffect(() => {
    const hex = isValidHex(numberToHex(mainColor)) ? numberToHex(mainColor) : errorColor
    const mixTarget = bgIsLight ? '#000000' : '#ffffff'
    const bodyColor = mixColors(hex, mixTarget, 0.5)
    const root = document.documentElement

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
    el.textContent = parts.join('\n\n')
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

  return (
    <MainWrapper>
      <TopSection>
        <ColorsSection>
          <ControlsRow>
            <MainColorSelector
              mainColor={mainColor}
              paletteName={paletteName}
              mode={mode}
              onColorChange={handleMainColorChange}
              onColorBlur={(e) => { if (!e.target.value) setMainColor(mode === 'named' ? DEFAULT_NAMED_COLOR : DEFAULT_NEUTRAL_COLOR) }}
              onNameChange={(e) => setPaletteName(e.target.value)}
              onModeChange={setMode}
              onRandomize={handleRandomize}
              whiteAnchor={whiteAnchor}
              onWhiteAnchorChange={setWhiteAnchor}
            />
            <BackgroundSelectorSection>
              <BackgroundSelector
                setBgColor={setBgColor}
                bgColor={bgColor}
                palette={palette}
              />
            </BackgroundSelectorSection>
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
                paletteName={paletteName}
                palette={palette}
                mode={mode}
                pivot={switchPoint ?? autoPivot}
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

      <Footer />
    </MainWrapper>
  )
}

export default ScaleApp
