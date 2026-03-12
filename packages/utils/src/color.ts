// Color palette generation utilities for Tale UI.
// Ported from the scale project (scale/src/utils.js) which uses culori for OKLCH color math.
import { converter, formatHex, clampChroma } from 'culori'

const toOklch = converter('oklch')

export const NAMED_SHADES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const

// Convert OKLCH values to a clamped 6-digit hex string
const oklchToHex = (l: number, c: number, h: number | undefined): string => {
  const clamped = clampChroma({ mode: 'oklch', l, c, h: h ?? 0 }, 'oklch')
  return formatHex({ mode: 'oklch', ...clamped }) as string
}

/**
 * Generate a tonal palette from a base hex (treated as the -60 shade).
 * Returns Array<{shade, hex}> where shade is one of NAMED_SHADES.
 */
export const generatePalette = (baseHex: string, mode: 'named' | 'neutral' = 'named'): Array<{ shade: number; hex: string }> => {
  const base = toOklch(baseHex)
  if (!base) return []

  const { l: L60, c: C60, h: H60 } = base
  const isNeutral = mode === 'neutral'

  const L_MAX = 0.977

  const DARK_L_RATIO = isNeutral ? 0.45 : 0.55
  const DARK_C_RATIO = isNeutral ? 0.50 : 0.62

  const LIGHT_C_TARGET = isNeutral ? 0.004 : 0.008

  const isTypeB = !isNeutral && L60 > 0.70

  return NAMED_SHADES.map((shade) => {
    if (shade === 60) {
      return { shade, hex: baseHex.toLowerCase() }
    }

    let l, c

    if (shade < 60) {
      const t = (60 - shade) / 55
      l = L60 + t * (L_MAX - L60)
      c = C60 + t * (LIGHT_C_TARGET - C60)
    } else {
      const t = (shade - 60) / 40
      if (isTypeB) {
        const L_MIN = Math.max(0.26, L60 * 0.33)
        l = L60 + t * (L_MIN - L60)
        c = C60 * (1 - t * 0.70)
      } else {
        l = L60 * (DARK_L_RATIO + (1 - DARK_L_RATIO) * (1 - t))
        c = C60 * (DARK_C_RATIO + (1 - DARK_C_RATIO) * (1 - t))
      }
    }

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
const getRelativeLuminance = (hex: string): number => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * WCAG contrast ratio between two hex colours (always ≥ 1).
 */
const getContrastRatio = (hex1: string, hex2: string): number => {
  const L1 = getRelativeLuminance(hex1)
  const L2 = getRelativeLuminance(hex2)
  const lighter = Math.max(L1, L2)
  const darker  = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Generate a random BASE hex colour suitable for the given mode.
 * Validates WCAG contrast thresholds against the actual generated palette.
 */
export const randomBaseColor = (mode: 'named' | 'neutral' = 'named'): string => {
  const isNeutral = mode === 'neutral'

  for (let attempt = 0; attempt < 200; attempt++) {
    const h = Math.random() * 360
    const c = isNeutral
      ? 0.01 + Math.random() * 0.03
      : 0.10 + Math.random() * 0.15

    if (isNeutral) {
      const l = 0.35 + Math.random() * 0.20
      const candidateHex = oklchToHex(l, c, h)
      const palette = generatePalette(candidateHex, mode)
      if (!palette.length) continue
      const get = (shade: number) => palette.find(p => p.shade === shade)?.hex
      const s5   = get(5)
      const s50  = get(50)
      const s100 = get(100)
      if (s5 && s50 && s100 &&
          getContrastRatio(candidateHex, s5) >= 4.5 &&
          getContrastRatio(s50, s100)        >= 4.5) {
        return candidateHex
      }
    } else {
      const isTypeB = Math.random() < 0.5
      const l = isTypeB
        ? 0.71 + Math.random() * 0.17
        : 0.38 + Math.random() * 0.32
      const candidateHex = oklchToHex(l, c, h)
      const palette = generatePalette(candidateHex, mode)
      if (!palette.length) continue
      const get = (shade: number) => palette.find(p => p.shade === shade)?.hex

      if (isTypeB) {
        const s5  = get(5)
        const s70 = get(70)
        const s80 = get(80)
        if (s5 && s70 && s80 &&
            getContrastRatio(s70, s5) >= 3.0 &&
            getContrastRatio(s80, s5) >= 4.5) {
          return candidateHex
        }
      } else {
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

  return isNeutral ? '#79716b' : '#dc2626'
}
