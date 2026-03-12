import React, { useState, useEffect, useMemo, useRef } from 'react'
import './App.css'
import { formatHex, converter } from 'culori'
import styled from 'styled-components'
import Footer from './components/footer'
import { isValidHex, numberToHex, errorColor, generatePalette, randomBaseColor, getContrastRatio } from './utils'
import ColorsRow from './components/colors-row'
import MainColorSelector from './components/main-color-selector'
import BackgroundSelector from './components/background-selector'
import ContrastPivotSelector from './components/contrast-pivot-selector'
import CssOutput from './components/css-output'

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

const DEFAULT_COLOR   = 'dc2626'
const DEFAULT_NAME    = 'color'
const DEFAULT_MODE    = 'named'
const DEFAULT_BG      = 'white'

const parseHash = () => {
  try {
    const hash = decodeURI(window.location.hash)
    if (!hash || hash === '#') return null
    const parts = hash.slice(1).split('/')
    // Expect: color/name/mode  (3 segments)
    if (parts.length < 3) return null
    const [color, name, mode] = parts
    if (!isValidHex(color)) return null
    if (!['named', 'neutral'].includes(mode)) return null
    return { mainColor: color, paletteName: name, mode, bgColor: DEFAULT_BG }
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
    mainColor: DEFAULT_COLOR,
    paletteName: DEFAULT_NAME,
    mode: DEFAULT_MODE,
    bgColor: DEFAULT_BG,
  }, [])

  const [mainColor,   setMainColor]   = useState(initial.mainColor)
  const [paletteName, setPaletteName] = useState(initial.paletteName)
  const [mode,        setMode]        = useState(initial.mode)
  const [bgColor,     setBgColor]     = useState(initial.bgColor)
  const [switchPoint, setSwitchPoint] = useState(null)  // null = auto
  const [whiteAnchor, setWhiteAnchor] = useState(false)

  const hashUpdateTimeoutRef = useRef(null)
  const latestHashRef        = useRef('')

  // Compute the full palette from the BASE hex
  const palette = useMemo(() => {
    const hex = numberToHex(mainColor)
    return isValidHex(hex) ? generatePalette(hex, mode, { whiteAnchor }) : []
  }, [mainColor, mode, whiteAnchor])

  // Auto-detect pivot (60 for Type A, 70 for Type B)
  const autoPivot = useMemo(() => {
    const s5   = palette.find(p => p.shade === 5)?.hex
    const s60  = palette.find(p => p.shade === 60)?.hex
    const s100 = palette.find(p => p.shade === 100)?.hex
    if (!s5 || !s60 || !s100) return 60
    return getContrastRatio(s60, s100) > getContrastRatio(s60, s5) ? 70 : 60
  }, [palette])

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

    // Override the design system text tokens with the palette-tinted colour
    // so all text — including Tale UI components — uses the tinted value
    root.style.setProperty('--text-color',    bodyColor)
    root.style.setProperty('--display-color', bodyColor)
    root.style.setProperty('--mono-color',    bodyColor)
    // Derived opacity variants for custom chrome elements
    root.style.setProperty('--bodyDimmed',  bodyColor + '4d')  // ~30% opacity
    root.style.setProperty('--bodyXDimmed', bodyColor + '1a')  // ~10% opacity
    root.style.setProperty('--border',      bodyColor + '26')  // ~15% opacity
  }, [mainColor, bgIsLight])

  // Update theme-color meta tag
  useEffect(() => {
    const el = document.getElementById('themeMetaTag')
    if (el) el.setAttribute('content', numberToHex(mainColor))
  }, [mainColor])

  // Reset manual pivot and white anchor when colour or mode changes
  useEffect(() => {
    setSwitchPoint(null)
    if (mode !== 'neutral') setWhiteAnchor(false)
  }, [mainColor, mode])

  // Debounced URL hash update
  useEffect(() => {
    const nextHash = `#${encodeURIComponent(mainColor)}/${encodeURIComponent(paletteName)}/${mode}`

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
  }, [mainColor, paletteName, mode])

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
              onColorBlur={(e) => { if (!e.target.value) setMainColor(DEFAULT_COLOR) }}
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

          <CssOutput
            paletteName={paletteName}
            palette={palette}
            mode={mode}
            pivot={switchPoint ?? autoPivot}
          />
        </ColorsSection>
      </TopSection>

      <Footer />
    </MainWrapper>
  )
}

export default ScaleApp
