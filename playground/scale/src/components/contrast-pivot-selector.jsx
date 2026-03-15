import React from 'react'
import styled from 'styled-components'
import { ToggleButton } from '@tale-ui/react/toggle-button'
import { ToggleButtonGroup } from '@tale-ui/react/toggle-button'
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
    <ToggleButtonGroup
      className="tale-toggle-button-group"
      value={[value === null ? 'auto' : String(value)]}
      onValueChange={(newValue) => {
        if (newValue.length === 0) return
        const val = newValue[0]
        onChange(val === 'auto' ? null : Number(val))
      }}
    >
      <ToggleButton className="tale-toggle-button tale-toggle-button--sm" value="auto">
        Auto ({autoPivot})
      </ToggleButton>
      {NAMED_SHADES.map(shade => (
        <ToggleButton
          key={shade}
          className="tale-toggle-button tale-toggle-button--sm"
          value={String(shade)}
        >
          {shade}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Wrapper>
)

export default ContrastPivotSelector
