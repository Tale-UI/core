import React from 'react'
import styled from 'styled-components'
import { Toggle } from '@tale-ui/react/toggle'
import { ToggleGroup } from '@tale-ui/react/toggle-group'
import { NAMED_SHADES } from '../utils'

const Wrapper = styled.div``

const Label = styled.div`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
  margin-bottom: var(--space-m);
`

const ContrastPivotSelector = ({ value, autoPivot, onChange }) => (
  <Wrapper>
    <Label>Light text from</Label>
    <ToggleGroup
      className="tale-toggle-group"
      value={[value === null ? 'auto' : String(value)]}
      onValueChange={(newValue) => {
        if (newValue.length === 0) return
        const val = newValue[0]
        onChange(val === 'auto' ? null : Number(val))
      }}
    >
      <Toggle className="tale-toggle tale-toggle--sm" value="auto">
        Auto ({autoPivot})
      </Toggle>
      {NAMED_SHADES.map(shade => (
        <Toggle
          key={shade}
          className="tale-toggle tale-toggle--sm"
          value={String(shade)}
        >
          {shade}
        </Toggle>
      ))}
    </ToggleGroup>
  </Wrapper>
)

export default ContrastPivotSelector
