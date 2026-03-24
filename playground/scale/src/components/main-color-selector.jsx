import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { HexColorPicker } from 'react-colorful'
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
      ? props.$color + '33'
      : 'var(--neutral-30)'};
  }
`

const PickerAnchor = styled.div`
  position: relative;
  flex-shrink: 0;
  align-self: center;
`

const PickerTrigger = styled.button`
  width: var(--space-s);
  height: var(--space-s);
  border-radius: var(--radius-full);
  background-color: ${props => props.$hex};
  border: 1px solid var(--neutral-30);
  padding: 0;
  cursor: pointer;
  display: block;

  &:focus {
    outline: 2px solid var(--color-60);
    outline-offset: 2px;
  }
`

const PickerPopover = styled.div`
  position: absolute;
  top: calc(100% + var(--space-2xs));
  left: 0;
  z-index: 100;
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-l);
  overflow: hidden;

  /* react-colorful overrides */
  .react-colorful {
    width: 240px;
    height: 240px;
  }
  .react-colorful__saturation {
    border-radius: 0;
  }
  .react-colorful__hue {
    height: var(--space-s);
    border-radius: 0;
  }

  @media (max-width: 480px) {
    position: fixed;
    top: auto;
    bottom: var(--space-m);
    left: var(--space-s);
    right: var(--space-s);

    .react-colorful {
      width: 100%;
    }
  }
`

const MainColorSelector = ({
  mainColor,
  onColorChange,
  onColorBlur,
}) => {
  const hex = numberToHex(mainColor)
  const valid = isValidHex(hex)

  const [open, setOpen] = useState(false)
  const pickerRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Bridge: HexColorPicker gives '#rrggbb'; onColorChange expects a synthetic event
  const handlePickerChange = (newHex) => {
    onColorChange({ target: { value: newHex } })
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
          {valid && (
            <PickerAnchor ref={pickerRef}>
              <PickerTrigger
                $hex={hex}
                onClick={() => setOpen(o => !o)}
                title="Open colour picker"
              />
              {open && (
                <PickerPopover>
                  <HexColorPicker color={hex} onChange={handlePickerChange} />
                </PickerPopover>
              )}
            </PickerAnchor>
          )}
        </HexInputWrapper>
      </Field>
    </Root>
  )
}

export default MainColorSelector
