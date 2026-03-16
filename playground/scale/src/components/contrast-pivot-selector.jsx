import React from 'react'
import styled from 'styled-components'
import { ToggleButton } from '@tale-ui/react/toggle-button'
import { ToggleButtonGroup } from '@tale-ui/react/toggle-button'
import { NAMED_SHADES } from '../utils'

const Wrapper = styled.div`
  .tale-toggle-button-group {
    flex-wrap: wrap;
  }
`

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
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value === null ? 'auto' : String(value)]}
      onSelectionChange={(keys) => {
        const val = [...keys][0]
        if (!val) return
        onChange(val === 'auto' ? null : Number(val))
      }}
    >
      <ToggleButton id="auto" size="sm">
        Auto ({autoPivot})
      </ToggleButton>
      {NAMED_SHADES.map(shade => (
        <ToggleButton
          key={shade}
          id={String(shade)}
          size="sm"
        >
          {shade}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Wrapper>
)

export default ContrastPivotSelector
