import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button } from '@tale-ui/react/button'
import { generateCssOutput } from '../utils'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Header = styled.div`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
  margin-bottom: var(--space-xs);
`

const PreWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

const CopyButton = styled.div`
  position: absolute;
  top: var(--space-s);
  right: var(--space-s);
  z-index: 1;
`

const Pre = styled.pre`
  font-family: var(--mono-font-family);
  font-size: var(--mono-s-font-size);
  line-height: var(--mono-line-height);
  margin: 0;
  padding: var(--space-m);
  background: var(--bodyXDimmed, var(--neutral-10));
  border: 1px solid var(--border, var(--neutral-20));
  border-radius: var(--radius-l);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  white-space: pre;
  color: var(--text-color);
`

const CssOutput = ({ paletteName, palette, mode, pivot }) => {
  const [copied, setCopied] = useState(false)

  const css = useMemo(
    () => generateCssOutput(paletteName || 'color', palette, { mode, pivot }),
    [paletteName, palette, mode, pivot]
  )

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <Root>
      <Header>CSS tokens</Header>
      <PreWrapper>
        <CopyButton>
          <CopyToClipboard text={css} onCopy={handleCopy}>
            <Button variant="neutral" size="sm">
              {copied ? 'Copied!' : 'Copy CSS'}
            </Button>
          </CopyToClipboard>
        </CopyButton>
        <Pre>{css}</Pre>
      </PreWrapper>
    </Root>
  )
}

export default CssOutput
