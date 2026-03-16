import React from 'react'
import styled from 'styled-components'
import ColorBlock from './color-block'
import { getContrastRatio } from '../utils'

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  width: 100%;
  margin-bottom: var(--space-2xl);

  @media (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    margin-bottom: var(--space-xl);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    margin-bottom: var(--space-l);
  }
`

const ColorsRow = ({ palette = [], pivot = 60, varPrefix = 'color', bgIsLight = true }) => {
  const shade5   = palette.find(p => p.shade === 5)?.hex
  const shade100 = palette.find(p => p.shade === 100)?.hex
  const getHex   = (s) => palette.find(p => p.shade === s)?.hex

  // Dark-mode mirror: the design system inverts the scale so --color-N
  // displays the palette hex from the opposite end (10↔90, 20↔80, …).
  const shades   = palette.map(p => p.shade)
  const without5 = shades.filter(s => s !== 5)
  const reversed = [...without5].reverse()
  const mirror   = {}
  for (let i = 0; i < without5.length; i++) mirror[without5[i]] = reversed[i]
  mirror[5] = shades[shades.length - 1]

  return (
    <Row>
      {palette.map(({ shade, hex }) => {
        let resolvedBgHex, contrastHex

        if (bgIsLight) {
          // Light mode: bg is the palette shade, fg splits at the pivot
          resolvedBgHex = hex
          contrastHex = shade < pivot ? shade100 : shade5
        } else {
          // Dark mode: bg is the mirrored palette shade
          resolvedBgHex = getHex(mirror[shade]) || hex

          // Default dark fg: <60 gets --color-100 (= palette[5] in dark),
          //                   >=60 gets --color-5  (= palette[100] in dark).
          // If contrast < 4.5 the override flips it (same logic as generateCssOutput block 4).
          const defaultFg = shade < 60 ? shade5   : shade100
          const altFg     = shade < 60 ? shade100 : shade5

          if (defaultFg && altFg && resolvedBgHex &&
              getContrastRatio(resolvedBgHex, defaultFg) < 4.5 &&
              getContrastRatio(resolvedBgHex, altFg) >= 4.5) {
            contrastHex = altFg
          } else {
            contrastHex = defaultFg
          }
        }

        return (
          <ColorBlock
            key={shade}
            shade={shade}
            hex={hex}
            resolvedBgHex={resolvedBgHex}
            isBase={shade === 60}
            contrastHex={contrastHex}
            bgVar={`var(--${varPrefix}-${shade})`}
            fgVar={`var(--${varPrefix}-${shade}-fg)`}
          />
        )
      })}
    </Row>
  )
}

export default ColorsRow
