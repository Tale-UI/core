import * as React from 'react';
import styled from 'styled-components'
import { Button } from '@tale-ui/react/button'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Color from 'color'
import { numberToHex } from '../utils'

const Title = styled.div`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
  margin-bottom: var(--space-s);
  min-height: var(--space-m);
`

const ButtonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4xs);
`

const getSvg = (darkColors, mainColor, lightColors) => {
  const svgWidth = darkColors.length * 72 + 192 + lightColors.length * 72
  const darkRects = darkColors.map((color, index) => (
    `<rect x="${72 * index}" width="72" height="72" fill="${color}"/>`
  ))
  const mainRect = `<rect x="${darkColors.length * 72}" width="192" height="72" fill="${numberToHex(mainColor)}"/>`
  const lightRects = lightColors.map((color, index) => (
    `<rect x="${72 * index + 192 + darkColors.length * 72}" width="72" height="72" fill="${color}"/>`
  ))

  return `<svg width="${svgWidth}" height="72" viewBox="0 0 ${svgWidth} 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${darkRects.join(``)}
    ${mainRect}
    ${lightRects.join(``)}
  </svg>`
}

const getColorsListText = (darkColors, mainColor, lightColors) => {
  const toHexSafe = (color) => {
    try {
      return Color(color).hex()
    } catch (entry) {
      return color
    }
  }
  const darks = darkColors.map((color) => toHexSafe(color))
  const lights = lightColors.map((color) => toHexSafe(color))

  return `${darks.join(`
`)}
${numberToHex(mainColor)}
${lights.join(`
`)}`
}

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

function Triggers({
  darkColors,
  mainColor,
  lightColors,
  setR,
  setG,
  setB,
  setDarkColorsAmount,
  setDarkestAmount,
  setDarkColorsMixRotate,
  setLightColorsAmount,
  setLightestAmount,
  setLightColorsMixRotate,
  setLightSaturation,
  setDarkSaturation,
  rgbToMainColor,
}) {
  const randomState = () => {
    setR(randomNumber(0, 255))
    setG(randomNumber(0, 255))
    setB(randomNumber(0, 255))

    setDarkColorsAmount(randomNumber(2, 8))
    setLightColorsAmount(randomNumber(2, 8))

    setDarkestAmount(randomNumber(40, 80))
    setLightestAmount(randomNumber(40, 80))

    setLightSaturation(randomNumber(0, 25))
    setDarkSaturation(randomNumber(0, 55))

    setDarkColorsMixRotate(randomNumber(0, 70))
    setLightColorsMixRotate(randomNumber(0, 70))
    rgbToMainColor()
  }

  const randomColor = () => {
    setR(randomNumber(0, 255))
    setG(randomNumber(0, 255))
    setB(randomNumber(0, 255))
    rgbToMainColor()
  }

  return (
    <React.Fragment>
      <Title>Triggers</Title>

      <ButtonsRow>
        <CopyToClipboard
          text={getSvg(darkColors, mainColor, lightColors)}
        >
          <Button variant="neutral" size="sm">Copy SVG</Button>
        </CopyToClipboard>

        <CopyToClipboard
          text={getColorsListText(darkColors, mainColor, lightColors)}
        >
          <Button variant="neutral" size="sm">Copy colors</Button>
        </CopyToClipboard>

        <Button variant="neutral" size="sm" onPress={() => randomState()}>Randomize all</Button>
        <Button variant="neutral" size="sm" onPress={() => randomColor()}>Randomize color</Button>
      </ButtonsRow>
    </React.Fragment>
  )
}

export default Triggers
