import { converter, formatHex, clampChroma } from 'culori'

const toOklch = converter('oklch')

export const errorColor = '#666666'

export const NAMED_SHADES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
export const NEUTRAL_SHADES = [5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100]

export const isValidHex = (color) => {
  if (!color || typeof color !== 'string') return false
  const stripped = color.startsWith('#') ? color.slice(1) : color
  return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(stripped)
}

export const numberToHex = (color) => {
  if (!color) return errorColor
  const str = String(color)
  return str.startsWith('#') ? str : '#' + str
}

// Convert OKLCH values to a clamped 6-digit hex string
const oklchToHex = (l, c, h) => {
  const clamped = clampChroma({ mode: 'oklch', l, c, h: h ?? 0 }, 'oklch')
  return formatHex({ mode: 'oklch', ...clamped })
}

/**
 * Generate a tonal palette from a base hex (treated as the -60 shade).
 *
 * @param {string} baseHex  - hex string including '#'
 * @param {'named'|'neutral'} mode
 * @param {object} [options]
 * @param {boolean} [options.whiteAnchor=false] - Neutral only: force shade-5 to pure
 *   white (#ffffff) and give shade-10 the value that shade-5 would otherwise receive.
 * @returns {Array<{shade: number, hex: string}>}
 */
export const generatePalette = (baseHex, mode, { whiteAnchor = false } = {}) => {
  const base = toOklch(baseHex)
  if (!base) return []

  const { l: L60, c: C60, h: H60 } = base
  const shades = mode === 'neutral' ? NEUTRAL_SHADES : NAMED_SHADES
  const isNeutral = mode === 'neutral'

  // Light end target (shade 5): near-white with a hint of hue
  const L_MAX = 0.977

  // Dark end (shade 100): calibrated from spec reference palettes.
  // Shade-100 retains ~55% of the base L and ~62% of the base C —
  // it is dark but visibly tinted, not near-black.
  const DARK_L_RATIO = isNeutral ? 0.45 : 0.55  // fraction of L60 kept at shade-100
  const DARK_C_RATIO = isNeutral ? 0.50 : 0.62  // fraction of C60 kept at shade-100

  // Absolute chroma target at shade-5 — ensures visible hue tinting even for
  // very low-chroma bases (e.g. dark neutralised teals).
  const LIGHT_C_TARGET = isNeutral ? 0.004 : 0.008

  // Type B: light base (L > 0.70) uses a steep linear interpolation to near-black
  // so shade-100 is always near-black regardless of shade-60's lightness.
  const isTypeB = !isNeutral && L60 > 0.70

  return shades.map((shade) => {
    // White anchor: neutral-5 = pure white; neutral-10 = the computed shade-5 value
    if (isNeutral && whiteAnchor) {
      if (shade === 5) return { shade, hex: '#ffffff' }
      if (shade === 10) {
        // Compute what shade-5 would normally be (t=1: full tint toward near-white)
        const l = L_MAX
        const c = Math.min(Math.max(LIGHT_C_TARGET, 0.002), 0.05)
        return { shade, hex: oklchToHex(l, c, H60) }
      }
    }

    if (shade === 60) {
      return { shade, hex: baseHex.toLowerCase() }
    }

    let l, c

    if (shade < 60) {
      // Tint — interpolate toward near-white
      // When whiteAnchor: shade-10 is the near-white anchor (span 10→60 = 50)
      // Otherwise: shade-5 is the near-white anchor (span 5→60 = 55)
      const tintSpan = (isNeutral && whiteAnchor) ? 50 : 55
      const t = (60 - shade) / tintSpan
      l = L60 + t * (L_MAX - L60)
      // Linearly interpolate from C60 down to a fixed near-white target chroma,
      // ensuring visible hue tinting regardless of how low the base chroma is.
      c = C60 + t * (LIGHT_C_TARGET - C60)
    } else {
      // Shade — darken from base toward target dark end
      // t = 0 at shade 60, t = 1 at shade 100
      const t = (shade - 60) / 40
      if (isTypeB) {
        // Steep linear interpolation to dark.
        // L_MIN scales with L60 so very light bases (e.g. L60≈0.95) don't produce
        // a disproportionately dark shade-100 relative to shade-90. The absolute
        // floor 0.26 guards warm hues (orange, yellow) whose sRGB gamut collapses
        // below L≈0.20, clamping chroma to near-zero and producing near-black.
        // Chroma retention raised to 30% (vs typical 10%) so the tint stays
        // perceptible at dark lightness.
        const L_MIN = Math.max(0.26, L60 * 0.33)
        l = L60 + t * (L_MIN - L60)
        c = C60 * (1 - t * 0.70)
      } else {
        l = L60 * (DARK_L_RATIO + (1 - DARK_L_RATIO) * (1 - t))
        c = C60 * (DARK_C_RATIO + (1 - DARK_C_RATIO) * (1 - t))
      }
    }

    // Neutrals: enforce very low chroma so they always read as gray
    if (isNeutral) {
      c = Math.min(c, 0.05)
      c = Math.max(c, 0.002)
    }

    const hex = oklchToHex(l, c, H60)
    return { shade, hex }
  })
}

/**
 * WCAG relative luminance for a hex colour.
 */
export const getRelativeLuminance = (hex) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const toLinear = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * WCAG contrast ratio between two hex colours (always ≥ 1).
 */
export const getContrastRatio = (hex1, hex2) => {
  const L1 = getRelativeLuminance(hex1)
  const L2 = getRelativeLuminance(hex2)
  const lighter = Math.max(L1, L2)
  const darker  = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Generate a random BASE hex colour suitable for the given mode.
 * Validates contrast thresholds against the actual generated palette to
 * eliminate rounding/gamut-clamping discrepancies.
 *
 * Named:   moderate-to-high chroma, medium-dark lightness.
 * Neutral: very low chroma (reads as gray), mid lightness.
 */
export const randomBaseColor = (mode) => {
  const isNeutral = mode === 'neutral'

  for (let attempt = 0; attempt < 200; attempt++) {
    const h = Math.random() * 360
    const c = isNeutral
      ? 0.01 + Math.random() * 0.03  // 0.01–0.04
      : 0.10 + Math.random() * 0.15  // 0.10–0.25

    if (isNeutral) {
      const l = 0.35 + Math.random() * 0.20  // 0.35–0.55
      const candidateHex = oklchToHex(l, c, h)
      const palette = generatePalette(candidateHex, mode)
      if (!palette.length) continue
      const get = (shade) => palette.find(p => p.shade === shade)?.hex
      const s5   = get(5)
      const s50  = get(50)
      const s100 = get(100)
      if (s5 && s50 && s100 &&
          getContrastRatio(candidateHex, s5) >= 4.5 &&
          getContrastRatio(s50, s100)        >= 4.5) {
        return candidateHex
      }
    } else {
      // Decide type first, then sample L from the matching zone so the
      // validation type always matches generatePalette's isTypeB = L60 > 0.70.
      const isTypeB = Math.random() < 0.5
      const l = isTypeB
        ? 0.71 + Math.random() * 0.17  // Type B zone: L 0.71–0.88
        : 0.38 + Math.random() * 0.32  // Type A zone: L 0.38–0.70
      const candidateHex = oklchToHex(l, c, h)
      const palette = generatePalette(candidateHex, mode)
      if (!palette.length) continue
      const get = (shade) => palette.find(p => p.shade === shade)?.hex

      if (isTypeB) {
        // Type B: light shade-60 — shade-70 AA-LG vs shade-5, shade-80 AA vs shade-5
        const s5  = get(5)
        const s70 = get(70)
        const s80 = get(80)
        if (s5 && s70 && s80 &&
            getContrastRatio(s70, s5) >= 3.0 &&
            getContrastRatio(s80, s5) >= 4.5) {
          return candidateHex
        }
      } else {
        // Type A: dark shade-60 — shade-60 AA vs shade-5, shade-50 AA-LG vs shade-100
        const s5   = get(5)
        const s50  = get(50)
        const s100 = get(100)
        if (s5 && s50 && s100 &&
            getContrastRatio(candidateHex, s5) >= 4.5 &&
            getContrastRatio(s50, s100)        >= 3.0) {
          return candidateHex
        }
      }
    }
  }

  // Fallback to known-good colours (should never be reached in practice)
  return isNeutral ? '#79716b' : '#dc2626'
}
export const generateCssOutput = (name, palette, { mode = 'named', pivot = 60 } = {}) => {
  if (!palette || palette.length === 0) return ''

  const maxPropWidth = Math.max(
    ...palette.map(p => `--${name}-${p.shade}`.length)
  )

  // 1. Raw palette tokens
  const paletteLines = palette.map(({ shade, hex }) => {
    const prop    = `--${name}-${shade}`
    const comment = shade === 60 ? '  /* BASE */' : ''
    return `  ${prop.padEnd(maxPropWidth)}: ${hex};${comment}`
  })

  // fg overrides when pivot differs from the default (60)
  if (mode === 'named' && pivot > 60) paletteLines.push('  --color-60-fg: var(--color-100);')
  if (mode === 'named' && pivot > 70) paletteLines.push('  --color-70-fg: var(--color-100);')

  const blocks = [`:root {\n${paletteLines.join('\n')}\n}`]

  // 2. Theme class (named colors only)
  if (mode === 'named') {
    const brandWidth  = '--brand-100'.length
    const themeLines  = palette.map(({ shade }) => {
      const brandProp = `--brand-${shade}`
      return `  ${brandProp.padEnd(brandWidth)}: var(--${name}-${shade});`
    })

    // fg overrides when pivot differs from the default (60)
    if (pivot > 60) themeLines.push('  --color-60-fg: var(--color-100);')
    if (pivot > 70) themeLines.push('  --color-70-fg: var(--color-100);')

    blocks.push(`.color-${name} {\n${themeLines.join('\n')}\n}`)
  }

  return blocks.join('\n\n')
}
