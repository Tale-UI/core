import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getRelativeLuminance, getContrastRatio } from '../utils'

const Container = styled.div`
  position: relative;
  height: 80px;
  cursor: pointer;
  min-width: 0;

  &:not(:hover) .hex-label {
    opacity: 0;
    transition: opacity 0.6s;
  }

  &:hover .hex-label {
    opacity: 1;
    transition: opacity 0.2s;
  }
`

const ShadeLabel = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  color: ${props => props.$lightText ? '#fff' : '#000'};
  opacity: ${props => props.$lightText ? 0.8 : 0.65};
  pointer-events: none;
`

const BaseIndicator = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 4px;
  height: 4px;
  border-radius: var(--radius-full);
  background: ${props => props.$lightText ? '#fff' : '#000'};
  opacity: ${props => props.$lightText ? 0.8 : 0.65};
  pointer-events: none;
`

const RatioLabel = styled.div`
  position: absolute;
  bottom: 6px;
  left: 6px;
  text-align: left;
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  letter-spacing: 0.02em;
  color: ${props => props.$lightText ? '#fff' : '#000'};
  opacity: ${props => props.$lightText ? 0.85 : 0.7};
  pointer-events: none;
`

const ContrastLevelLabel = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  text-align: right;
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  letter-spacing: 0.02em;
  color: ${props => props.$lightText ? '#fff' : '#000'};
  opacity: ${props => props.$lightText ? 0.85 : 0.7};
  pointer-events: none;
`

const AgLabel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--title-l-font-size);
  font-weight: var(--title-font-weight);
  line-height: 1;
  letter-spacing: var(--title-letter-spacing);
  pointer-events: none;
`

const HexLabel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  text-align: center;
  padding-top: 6px;
  font-size: var(--text-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1.4;
  word-break: break-all;
`

const copyAnimation = keyframes`
  0%   { opacity: 0; transform: translateY(-8px); }
  20%  { opacity: 0.6; }
  80%  { opacity: 0.4; transform: translateY(0); }
  100% { opacity: 0; }
`

const CopiedText = styled.div`
  animation: ${copyAnimation} 0.8s forwards;
`

const isLightColor = (hex) => {
  try {
    return getRelativeLuminance(hex) > 0.179
  } catch {
    return true
  }
}

const wcagBadge = (ratio) => {
  if (ratio >= 7)   return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3)   return 'AA·LG'
  return '✕'
}

const ColorBlock = ({ shade, hex, isBase, contrastHex, style }) => {
  const [copied, setCopied] = useState(false)
  const lightText = contrastHex ? isLightColor(contrastHex) : !isLightColor(hex)

  const ratio = contrastHex ? getContrastRatio(hex, contrastHex) : null
  const badge = ratio !== null ? wcagBadge(ratio) : null

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 800)
  }

  return (
    <CopyToClipboard text={hex} onCopy={handleCopy}>
      <Container style={style}>
        <ShadeLabel $lightText={lightText}>{shade}</ShadeLabel>
        {isBase && <BaseIndicator $lightText={lightText} />}
        {contrastHex && <AgLabel style={{ color: contrastHex }}>Ag</AgLabel>}

        {ratio !== null && <RatioLabel $lightText={lightText}>{ratio.toFixed(2)}:1</RatioLabel>}
        {badge !== null && <ContrastLevelLabel $lightText={lightText}>{badge}</ContrastLevelLabel>}

        <HexLabel className="hex-label">
          {hex}
          {copied && <CopiedText>Copied</CopiedText>}
        </HexLabel>
      </Container>
    </CopyToClipboard>
  )
}

export default ColorBlock
