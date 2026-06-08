import * as React from 'react';
import styled from 'styled-components';
import ColorBlock from './color-block';
import { getContrastRatio } from '../utils';

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  width: 100%;
  margin-bottom: var(--space-2xl);

  @media (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    margin-bottom: var(--space-xl);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    margin-bottom: var(--space-l);
  }
`;

function ColorsRow({ palette = [], pivot = 60, varPrefix = 'color', bgIsLight = true }) {
  const shade5 = palette.find((p) => p.shade === 5)?.hex;
  const shade100 = palette.find((p) => p.shade === 100)?.hex;
  const getHex = (s) => palette.find((p) => p.shade === s)?.hex;
  const getBetterContrastHex = (backgroundHex, color5Hex, color100Hex) => {
    if (!backgroundHex || !color5Hex || !color100Hex) {
      return null;
    }

    return getContrastRatio(backgroundHex, color5Hex) >=
      getContrastRatio(backgroundHex, color100Hex)
      ? color5Hex
      : color100Hex;
  };

  // Dark-mode mirror: the design system inverts the scale so --color-N
  // displays the palette hex from the opposite end (10↔90, 20↔80, …).
  const shades = palette.map((p) => p.shade);
  const mirroredShades = varPrefix === 'color' ? shades : shades.filter((s) => s !== 5);
  const reversed = [...mirroredShades].reverse();
  const mirror = {};
  for (let i = 0; i < mirroredShades.length; i += 1) {
    mirror[mirroredShades[i]] = reversed[i];
  }
  if (varPrefix !== 'color') {
    mirror[5] = shades[shades.length - 1];
  }

  return (
    <Row>
      {palette.map(({ shade, hex }) => {
        let resolvedBgHex, contrastHex;

        if (bgIsLight) {
          // Light mode: bg is the palette shade, fg splits at the pivot
          resolvedBgHex = hex;
          if (varPrefix === 'color') {
            contrastHex = getBetterContrastHex(resolvedBgHex, shade5, shade100);
          } else {
            contrastHex = shade < pivot ? shade100 : shade5;
          }
        } else {
          // Dark mode: bg is the mirrored palette shade
          resolvedBgHex = getHex(mirror[shade]) || hex;

          // In dark mode the fg vars resolve through the mirrored color tokens:
          // --color-5 is the darkest endpoint, --color-100 is the lightest endpoint.
          const color5Fg = varPrefix === 'color' ? shade100 : shade5;
          const color100Fg = varPrefix === 'color' ? shade5 : shade100;
          contrastHex = getBetterContrastHex(resolvedBgHex, color5Fg, color100Fg);
        }

        return (
          <ColorBlock
            key={shade}
            shade={shade}
            hex={hex}
            resolvedBgHex={resolvedBgHex}
            isBase={shade === 60}
            contrastHex={contrastHex}
            bgVar={`var(--${varPrefix}-${shade})`}
            fgVar={`var(--${varPrefix}-${shade}-fg)`}
          />
        );
      })}
    </Row>
  );
}

export default ColorsRow;
