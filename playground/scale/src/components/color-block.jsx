import * as React from 'react';
import styled, { keyframes } from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getRelativeLuminance, getContrastRatio } from '../utils'

const Container = styled.div`
  position: relative;
  height: var(--space-2xl);
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

  @media (max-width: 480px) {
    height: var(--space-xl);
  }
`

const ShadeLabel = styled.div`
  position: absolute;
  top: var(--space-4xs);
  left: var(--space-4xs);
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  color: ${props => props.$fgVar};
  opacity: ${props => props.$lightText ? 0.8 : 0.65};
  pointer-events: none;
`

const BaseIndicator = styled.div`
  position: absolute;
  top: var(--space-4xs);
  right: var(--space-4xs);
  width: var(--space-4xs);
  height: var(--space-4xs);
  border-radius: var(--radius-full);
  background: ${props => props.$fgVar};
  opacity: ${props => props.$lightText ? 0.8 : 0.65};
  pointer-events: none;
`

const RatioLabel = styled.div`
  position: absolute;
  bottom: var(--space-4xs);
  left: var(--space-4xs);
  text-align: left;
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  letter-spacing: 0.02em;
  color: ${props => props.$fgVar};
  opacity: ${props => props.$lightText ? 0.85 : 0.7};
  pointer-events: none;

  @media (max-width: 480px) {
    display: none;
  }
`

const ContrastLevelLabel = styled.div`
  position: absolute;
  bottom: var(--space-4xs);
  right: var(--space-4xs);
  text-align: right;
  font-size: var(--label-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: 1;
  letter-spacing: 0.02em;
  color: ${props => props.$fgVar};
  opacity: ${props => props.$lightText ? 0.85 : 0.7};
  pointer-events: none;

  @media (max-width: 480px) {
    display: none;
  }
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

  @media (max-width: 480px) {
    font-size: var(--title-s-font-size);
  }
`

const HexLabel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  text-align: center;
  padding-top: var(--space-4xs);
  font-size: var(--text-xs-font-size);
  font-weight: var(--display-font-weight);
  line-height: var(--text-line-height);
  word-break: break-all;
`

const copyAnimation = keyframes`
  0%   { opacity: 0; transform: translateY(calc(-1 * var(--space-3xs))); }
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
  if (ratio >= 7)   {return 'AAA'}
  if (ratio >= 4.5) {return 'AA'}
  if (ratio >= 3)   {return 'AA·LG'}
  return '✕'
}

function ColorBlock({ shade, hex, resolvedBgHex, isBase, contrastHex, bgVar, fgVar }) {
  const [copied, setCopied] = React.useState(false)
  const bgHex = resolvedBgHex || hex
  const lightText = contrastHex ? isLightColor(contrastHex) : !isLightColor(bgHex)

  const ratio = contrastHex ? getContrastRatio(bgHex, contrastHex) : null
  const badge = ratio !== null ? wcagBadge(ratio) : null

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 800)
  }

  return (
    <CopyToClipboard text={hex} onCopy={handleCopy}>
      <Container style={{ background: bgVar }}>
        <ShadeLabel $lightText={lightText} $fgVar={fgVar}>{shade}</ShadeLabel>
        {isBase && <BaseIndicator $lightText={lightText} $fgVar={fgVar} />}
        {contrastHex && <AgLabel style={{ color: fgVar }}>Ag</AgLabel>}

        {ratio !== null && <RatioLabel $lightText={lightText} $fgVar={fgVar}>{ratio.toFixed(2)}:1</RatioLabel>}
        {badge !== null && <ContrastLevelLabel $lightText={lightText} $fgVar={fgVar}>{badge}</ContrastLevelLabel>}

        <HexLabel className="hex-label">
          {hex}
          {copied && <CopiedText>Copied</CopiedText>}
        </HexLabel>
      </Container>
    </CopyToClipboard>
  )
}

export default ColorBlock
