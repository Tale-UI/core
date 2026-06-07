import { expect } from 'vitest';
import { generatePalette, getRelativeLuminance, NEUTRAL_SHADES } from '@tale-ui/utils/color';

const getShade = (palette: Array<{ shade: number; hex: string }>, shade: number) => {
  const match = palette.find((item) => item.shade === shade);

  if (!match) {
    throw new Error(`Missing shade ${shade}`);
  }

  return match.hex;
};

const getLuminanceDeltaRange = (
  palette: Array<{ shade: number; hex: string }>,
  shades: number[],
) => {
  const deltas = [];

  for (let i = 1; i < shades.length; i += 1) {
    const previous = getRelativeLuminance(getShade(palette, shades[i - 1]));
    const current = getRelativeLuminance(getShade(palette, shades[i]));
    deltas.push(previous - current);
  }

  return Math.max(...deltas) - Math.min(...deltas);
};

describe('generatePalette', () => {
  it('generates the full neutral shade scale', () => {
    expect(generatePalette('#79716b', 'neutral').map(({ shade }) => shade)).toEqual([
      ...NEUTRAL_SHADES,
    ]);
  });

  it('sets neutral-10 to the previous neutral-12 depth', () => {
    const palette = generatePalette('#79716b', 'neutral');

    expect(getShade(palette, 10)).toBe('#f6f3f1');
  });

  it('spaces neutral-12 through neutral-18 evenly between neutral-10 and neutral-20', () => {
    const palette = generatePalette('#79716b', 'neutral');

    expect(getLuminanceDeltaRange(palette, [10, 12, 14, 16, 18, 20])).toBeLessThan(0.012);
  });

  it('spaces neutral-10 through neutral-60 evenly by major step', () => {
    const palette = generatePalette('#79716b', 'neutral');

    expect(getLuminanceDeltaRange(palette, [10, 20, 30, 40, 50, 60])).toBeLessThan(0.02);
  });
});
