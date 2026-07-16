import { clampChroma, converter, formatHex } from 'culori';
import { generatePalette, NEUTRAL_SHADES } from '@tale-ui/utils/color';

const toOklch = converter('oklch');
const toRgb = converter('rgb');

const LIGHTNESS_MAX = 0.977;
const LIGHT_CHROMA_TARGET = 0.008;
const DARK_LIGHTNESS_RATIO = 0.08;
const DARK_CHROMA_RATIO = 0.25;
const LIGHT_ANCHOR_SHADE = 12;
const DARK_END_SHADE = 96;

const oklchToHex = (lightness: number, chroma: number, hue: number | undefined): string => {
  const clamped = clampChroma({ mode: 'oklch', l: lightness, c: chroma, h: hue ?? 0 }, 'oklch');
  return formatHex({ mode: 'oklch', ...clamped }) as string;
};

const linearRgbChannel = (channel: number): number =>
  channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);

const relativeLuminance = (lightness: number, chroma: number, hue: number | undefined): number => {
  const rgb = toRgb(clampChroma({ mode: 'oklch', l: lightness, c: chroma, h: hue ?? 0 }, 'oklch'));
  return (
    0.2126 * linearRgbChannel(rgb.r) +
    0.7152 * linearRgbChannel(rgb.g) +
    0.0722 * linearRgbChannel(rgb.b)
  );
};

const findLightnessForLuminance = ({
  targetLuminance,
  chroma,
  hue,
  minimum,
  maximum,
}: {
  targetLuminance: number;
  chroma: number;
  hue: number | undefined;
  minimum: number;
  maximum: number;
}): number => {
  let low = minimum;
  let high = maximum;

  for (let iteration = 0; iteration < 20; iteration += 1) {
    const middle = (low + high) / 2;
    if (relativeLuminance(middle, chroma, hue) < targetLuminance) {
      low = middle;
    } else {
      high = middle;
    }
  }

  return (low + high) / 2;
};

const lightProgress = (shade: number): number =>
  ((60 - shade) / 50) * ((60 - LIGHT_ANCHOR_SHADE) / 50);

const darkProgress = (shade: number): number => ((shade - 60) / 40) * ((DARK_END_SHADE - 60) / 40);

const generateChromaPalette = (baseHex: string): Array<{ shade: number; hex: string }> => {
  const base = toOklch(baseHex);
  if (!base) {
    return [];
  }

  const { l: baseLightness, c: baseChroma, h: hue } = base;
  const lightAnchorLuminance = relativeLuminance(LIGHTNESS_MAX, LIGHT_CHROMA_TARGET, hue);
  const baseLuminance = relativeLuminance(baseLightness, baseChroma, hue);

  return NEUTRAL_SHADES.map((shade) => {
    if (shade === 60) {
      return { shade, hex: baseHex.toLowerCase() };
    }

    let lightness: number;
    let chroma: number;

    if (shade < 60) {
      if (shade >= 10) {
        const progress = lightProgress(shade);
        chroma = baseChroma + progress * (LIGHT_CHROMA_TARGET - baseChroma);
        lightness = findLightnessForLuminance({
          targetLuminance: baseLuminance + progress * (lightAnchorLuminance - baseLuminance),
          chroma,
          hue,
          minimum: baseLightness,
          maximum: LIGHTNESS_MAX,
        });
      } else {
        const progress = (60 - shade) / 55;
        lightness = baseLightness + progress * (LIGHTNESS_MAX - baseLightness);
        chroma = baseChroma + progress * (LIGHT_CHROMA_TARGET - baseChroma);
      }
    } else {
      const progress = darkProgress(shade);
      lightness =
        baseLightness * (DARK_LIGHTNESS_RATIO + (1 - DARK_LIGHTNESS_RATIO) * (1 - progress));
      chroma = baseChroma * (DARK_CHROMA_RATIO + (1 - DARK_CHROMA_RATIO) * (1 - progress));
    }

    return { shade, hex: oklchToHex(lightness, chroma, hue) };
  });
};

/** Generate a 27-stop palette whose named and neutral scales share one colour anchor. */
export const generateMonochromePalette = (
  baseHex: string,
  { whiteAnchor = false }: { whiteAnchor?: boolean } = {},
): Array<{ shade: number; hex: string }> => {
  const tonePalette = generatePalette(baseHex, 'neutral');
  const chromaPalette = generateChromaPalette(baseHex);
  const getTone = (shade: number): string | undefined =>
    tonePalette.find((color) => color.shade === shade)?.hex;

  return chromaPalette.map(({ shade, hex }) => {
    if (whiteAnchor && shade === 5) {
      return { shade, hex: '#ffffff' };
    }

    const toneHex = getTone(shade);
    if (!toneHex) {
      return { shade, hex };
    }

    const tone = toOklch(toneHex);
    const chroma = toOklch(hex);
    if (!tone || !chroma) {
      return { shade, hex };
    }

    if (shade === 60) {
      return { shade, hex: baseHex.toLowerCase() };
    }

    return { shade, hex: oklchToHex(tone.l, chroma.c, chroma.h) };
  });
};
