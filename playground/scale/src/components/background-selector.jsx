import React from 'react'
import styled from 'styled-components'

const Root = styled.div``

const Title = styled.div`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
  margin-bottom: var(--space-m);
`

const DotsRow = styled.div`
  display: flex;
  gap: var(--space-3xs);
  flex-wrap: wrap;
`

const Dot = styled.button`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: ${props => props.$hex};
  box-shadow: ${props => props.$active
    ? 'inset 0 0 0 2px rgba(0,0,0,0.65), inset 0 0 0 3px rgba(255,255,255,0.65)'
    : 'inset 0 0 0 1px rgba(0,0,0,0.2), inset 0 0 0 2px rgba(255,255,255,0.2)'};
  cursor: pointer;
  border: 1px solid rgba(128,128,128,0.25);
  padding: 0;
  outline: none;
  transition: box-shadow 0.15s;

  &:focus {
    box-shadow: inset 0 0 0 2px var(--color-60);
  }
`

const BackgroundSelector = ({ setBgColor, bgColor, palette }) => {
  const shade5   = palette.find(p => p.shade === 5)?.hex   ?? '#ffffff'
  const shade100 = palette.find(p => p.shade === 100)?.hex ?? '#000000'

  const options = [
    { key: 'white', hex: '#ffffff',  label: 'White' },
    { key: 'light', hex: shade5,     label: 'Shade 5' },
    { key: 'dark',  hex: shade100,   label: 'Shade 100' },
    { key: 'black', hex: '#000000',  label: 'Black' },
  ]

  return (
    <Root>
      <Title>Background</Title>
      <DotsRow>
        {options.map(({ key, hex, label }) => (
          <Dot
            key={key}
            $hex={hex}
            $active={bgColor === key}
            title={label}
            onClick={() => setBgColor(key)}
          />
        ))}
      </DotsRow>
    </Root>
  )
}

export default BackgroundSelector
