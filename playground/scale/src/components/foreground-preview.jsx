import React from 'react'
import styled from 'styled-components'
import { getContrastRatio } from '../utils'

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  width: 100%;
  margin-bottom: var(--space-2xl);
`

const Tile = styled.div`
  position: relative;
  height: 80px;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SampleText = styled.div`
  font-size: var(--display-s-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  letter-spacing: -0.01em;
`

const ShadeLabel = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
`

const BadgeLabel = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  letter-spacing: 0.02em;
`

const RatioLabel = styled.div`
  position: absolute;
  bottom: 6px;
  left: 6px;
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  letter-spacing: 0.02em;
`

const wcagBadge = (ratio) => {
  if (ratio >= 7)   return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3)   return 'AA·LG'
  return '✕'
}

const ForegroundPreview = ({ palette = [], pivot = 60 }) => {
  const shade5Hex   = palette.find(p => p.shade === 5)?.hex
  const shade100Hex = palette.find(p => p.shade === 100)?.hex

  return (
    <Row>
      {palette.map(({ shade, hex }) => {
        const fgHex = shade < pivot ? shade100Hex : shade5Hex
        const ratio = fgHex ? getContrastRatio(hex, fgHex) : null
        const badge = ratio !== null ? wcagBadge(ratio) : null

        return (
          <Tile key={shade} style={{ background: hex, color: fgHex }}>
            <ShadeLabel>{shade}</ShadeLabel>
            <SampleText>Ag</SampleText>
            {ratio !== null && <RatioLabel>{ratio.toFixed(1)}:1</RatioLabel>}
            {badge !== null && <BadgeLabel>{badge}</BadgeLabel>}
          </Tile>
        )
      })}
    </Row>
  )
}

export default ForegroundPreview
