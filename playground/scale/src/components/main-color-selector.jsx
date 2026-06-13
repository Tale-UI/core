import * as React from 'react';
import styled from 'styled-components'
import { parseColor } from 'react-aria-components'
import { ColorArea } from '@tale-ui/react/color-area'
import { ColorSlider } from '@tale-ui/react/color-slider'
import { isValidHex, numberToHex } from '../utils'

const Root = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-xl);
  flex-wrap: wrap;

  @media (max-width: 720px) {
    flex-direction: column;
    gap: var(--space-l);
  }
`

const PickerColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  width: 240px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
  }
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`

const Label = styled.div`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
  min-height: calc(var(--label-line-height) * 1em);
`

const HexInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`

const HexPrefix = styled.span`
  font-size: var(--display-s-font-size);
  line-height: 1;
  opacity: 0.5;
`

const HexInput = styled.input`
  font-size: var(--display-s-font-size);
  font-family: inherit;
  font-weight: inherit;
  line-height: 1;
  border: none;
  background: transparent;
  color: inherit;
  width: 6.5ch;
  padding: 0;
  appearance: textfield;

  &:focus {
    outline: none;
  }

  &::selection {
    background: ${props => props.$valid
      ? `${props.$color  }33`
      : 'var(--neutral-30)'};
  }
`

function MainColorSelector({
  mainColor,
  onColorChange,
  onColorBlur,
}) {
  const hex = numberToHex(mainColor)
  const valid = isValidHex(hex)

  // Parse hex into a Color object for the React Aria color components
  const colorValue = React.useMemo(() => {
    if (!valid) {return null}
    try { return parseColor(hex) } catch { return null }
  }, [hex, valid])

  // Bridge: ColorArea/ColorSlider give a Color object; parent expects { target: { value } }
  const handleColorChange = (color) => {
    onColorChange({ target: { value: color.toString('hex').replace('#', '') } })
  }

  return (
    <Root>
      <Field>
        <Label>BASE colour (–60)</Label>
        <HexInputWrapper>
          <HexPrefix>#</HexPrefix>
          <HexInput
            type="text"
            value={mainColor}
            onChange={onColorChange}
            onBlur={onColorBlur}
            maxLength={7}
            spellCheck={false}
            $valid={valid}
            $color={hex}
          />
        </HexInputWrapper>
      </Field>

      {colorValue && (
        <PickerColumn>
          <ColorArea.Root
            value={colorValue}
            onChange={handleColorChange}
            xChannel="saturation"
            yChannel="lightness"
            colorSpace="hsl"
            aria-label="Saturation and lightness"
            style={{ width: '100%', aspectRatio: '1' }}
          >
            <ColorArea.Thumb />
          </ColorArea.Root>
          <ColorSlider.Root
            value={colorValue}
            onChange={handleColorChange}
            channel="hue"
            colorSpace="hsl"
            aria-label="Hue"
          >
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        </PickerColumn>
      )}
    </Root>
  )
}

export default MainColorSelector
