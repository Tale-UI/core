import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button } from '@tale-ui/react/button'
import { generateCssOutput } from '../utils'

const Root = styled.div`
  margin-top: var(--space-xl);
  margin-bottom: var(--space-l);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-m);
  margin-bottom: var(--space-xs);
`

const Title = styled.div`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
`

const Pre = styled.pre`
  font-family: var(--mono-font-family);
  font-size: var(--mono-s-font-size);
  line-height: var(--mono-line-height);
  margin: 0;
  padding: var(--space-m);
  background: var(--neutral-10);
  border: 1px solid var(--neutral-20);
  border-radius: var(--radius-m);
  overflow-y: auto;
  max-height: none;
  white-space: pre;
  color: var(--text-color);
`

const CssOutput = ({ paletteName, palette }) => {
  const [copied, setCopied] = useState(false)

  const css = useMemo(
    () => generateCssOutput(paletteName || 'color', palette),
    [paletteName, palette]
  )

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <Root>
      <Header>
        <Title>CSS tokens</Title>
        <CopyToClipboard text={css} onCopy={handleCopy}>
          <Button className="tale-button tale-button--neutral tale-button--sm">
            {copied ? 'Copied!' : 'Copy CSS'}
          </Button>
        </CopyToClipboard>
      </Header>
      <Pre>{css}</Pre>
    </Root>
  )
}

export default CssOutput
