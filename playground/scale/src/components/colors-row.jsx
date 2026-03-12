import React from 'react'
import styled from 'styled-components'
import ColorBlock from './color-block'

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  width: 100%;
  margin-bottom: var(--space-2xl);
`

const ColorsRow = ({ palette = [], pivot = 60 }) => {
  const shade5   = palette.find(p => p.shade === 5)?.hex
  const shade100 = palette.find(p => p.shade === 100)?.hex

  return (
    <Row>
      {palette.map(({ shade, hex }) => {
        // Shades below pivot use shade-100 as contrast (dark text); pivot and above use shade-5 (light text).
        const contrastHex = shade < pivot ? shade100 : shade5

        return (
          <ColorBlock
            key={shade}
            shade={shade}
            hex={hex}
            isBase={shade === 60}
            contrastHex={contrastHex}
            style={{ background: hex }}
          />
        )
      })}
    </Row>
  )
}

export default ColorsRow
