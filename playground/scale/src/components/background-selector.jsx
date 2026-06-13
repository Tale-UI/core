import * as React from 'react';
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
  width: var(--space-m);
  height: var(--space-m);
  border-radius: var(--radius-full);
  background-color: ${props => props.$hex};
  box-shadow: ${props => props.$active
    ? 'inset 0 0 0 2px var(--neutral-90), inset 0 0 0 3px var(--neutral-5)'
    : 'inset 0 0 0 1px var(--neutral-40)'};
  cursor: pointer;
  border: 1px solid var(--neutral-30);
  padding: 0;
  outline: none;
  transition: box-shadow 0.15s;

  &:focus {
    box-shadow: inset 0 0 0 2px var(--color-60);
  }
`

function BackgroundSelector({ setBgColor, bgColor }) {
  const accentHex = 'color-mix(in srgb, var(--brand-100) 50%, black)'

  const options = [
    { key: 'light',  hex: 'var(--neutral-default-5)',   label: 'Light mode' },
    { key: 'dark',   hex: 'var(--neutral-default-100)', label: 'Dark mode' },
    { key: 'accent', hex: accentHex,                    label: 'Accent dark' },
  ]

  return (
    <Root>
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
