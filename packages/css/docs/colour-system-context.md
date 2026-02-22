# Colour System Context — Tonal Palette Generator

> **Temporary reference document** — created as context for building a tonal palette generator tool.
> Source of truth: CSS files in `packages/css/src/tokens/` and `packages/css/src/themes/`.

---

## 1. Overview

The design system's colour system is built around **tonal palettes** — each colour family has exactly **11 shades** numbered from 5 (lightest) to 100 (darkest). All colour values are stored as **hex strings** in CSS custom properties (no hsl, oklch, or rgb in the token definitions).

**Shade numbering philosophy:**
- `5` = near-white, the lightest tint
- `100` = near-black, the darkest tone
- `60` = the **BASE shade** — the primary, most saturated expression of a colour; the switch point for contrast pairing
- Values increase in perceived darkness/saturation as the number increases

**Three tiers of colour families:**
1. **Named colour families** (16 families): red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, indigo, violet, purple, fuchsia, pink, rose
2. **Brand** (1 family): the active brand colour, defaults to a teal; overridden by `.color-*` theme classes
3. **Semantic** (3 families): error, warning, success — independent families with their own full 11-shade palettes

**Separate system — Neutral families** (5 families): cool, slate, gray, onyx, warm — use an irregular shade scale, documented in Section 5.

---

## 2. Shade Structure

### Named / Brand / Semantic colours — 11 shades
```
5  10  20  30  40  50  60  70  80  90  100
```
Note the gap: steps are +5, +10, +10, +10, +10, +10, +10, +10, +10, +10.

### Neutral families — 27 shades (irregular)
```
5  10  12  14  16  18  20  22  24  26  28  30  40  50  60  70  80  82  84  86  88  90  92  94  96  98  100
```
Fine-grained steps at the light end (for subtle surface tints) and dark end (for dark UI layers). Coarser in the midrange.

---

## 3. CSS Token Naming Format

```css
/* Named family */
--{family}-{shade}: #hexvalue;
/* e.g.: */
--red-5: #fef6f6;
--red-60: #dc2626;
--red-100: #66000f;

/* Brand (the active theme colour) */
--brand-{shade}: #hexvalue;

/* Semantic */
--error-{shade}: #hexvalue;
--warning-{shade}: #hexvalue;
--success-{shade}: #hexvalue;

/* Neutral */
--neutral-{family}-{shade}: #hexvalue;
/* e.g.: */
--neutral-warm-60: #79716b;
--neutral-cool-60: #606b90;
```

All tokens are declared in `:root {}` in `packages/css/src/tokens/_colors.css` and `_neutrals.css`.

---

## 4. All Named Colour Families

### -60 (BASE) hex values for all families

| Family | BASE (-60) | Type |
|--------|-----------|------|
| `brand` | `#025768` | brand (default teal) |
| `red` | `#dc2626` | named |
| `orange` | `#f97316` | named |
| `amber` | `#df8d2e` | named |
| `yellow` | `#eab308` | named |
| `lime` | `#85bc31` | named |
| `green` | `#22c55e` | named |
| `emerald` | `#10b981` | named |
| `teal` | `#14b8a6` | named |
| `cyan` | `#06b6d4` | named |
| `sky` | `#0ea5e9` | named |
| `indigo` | `#5d5aeb` | named |
| `violet` | `#7e4bdc` | named |
| `purple` | `#9543d7` | named |
| `fuchsia` | `#c025c2` | named |
| `pink` | `#d02a67` | named |
| `rose` | `#d32837` | named |
| `error` | `#cc3330` | semantic (red-based) |
| `warning` | `#f79009` | semantic (amber-based) |
| `success` | `#3cbe7e` | semantic (green-based) |

### Complete example — brand palette (all 11 shades)

```css
--brand-5: #e6f0f0;
--brand-10: #cce1e1;
--brand-20: #a4c7c9;
--brand-30: #7fb3b5;
--brand-40: #3e8d90;
--brand-50: #0a7282;
--brand-60: #025768;   /* BASE */
--brand-70: #024d5c;
--brand-80: #023d4a;
--brand-90: #012d38;
--brand-100: #012334;
```

### Complete example — red palette (all 11 shades)

```css
--red-5: #fef6f6;
--red-10: #fde9e9;
--red-20: #fac3c3;
--red-30: #f79e9e;
--red-40: #f25353;
--red-50: #ef4444;
--red-60: #dc2626;   /* BASE */
--red-70: #b91c1c;
--red-80: #991b1b;
--red-90: #7f1d1d;
--red-100: #66000f;
```

---

## 5. Neutral Families

Neutral families use the **irregular 27-shade scale**. They follow the same naming pattern as colours but with an extra family segment: `--neutral-{family}-{shade}`.

### -60 (BASE) hex values

| Family | BASE (-60) | Notes |
|--------|-----------|-------|
| `neutral-warm` | `#79716b` | Default — warm-toned grays |
| `neutral-cool` | `#606b90` | Bluish grays |
| `neutral-slate` | `#677383` | Neutral with slight blue tint |
| `neutral-gray` | `#6c737f` | Pure neutral grays |
| `neutral-onyx` | `#70707b` | Near-pure neutral |

### Complete example — neutral-warm (all 27 shades)

```css
--neutral-warm-5: #f9f8f8;
--neutral-warm-10: #f2f1f0;
--neutral-warm-12: #edeceb;
--neutral-warm-14: #e8e7e6;
--neutral-warm-16: #e4e1e0;
--neutral-warm-18: #dfdcdb;
--neutral-warm-20: #dad7d6;
--neutral-warm-22: #d5d2d1;
--neutral-warm-24: #d0cdcb;
--neutral-warm-26: #cbc8c6;
--neutral-warm-28: #c6c3c0;
--neutral-warm-30: #c1bebb;
--neutral-warm-40: #a9a4a0;
--neutral-warm-50: #918b86;
--neutral-warm-60: #79716b;   /* BASE */
--neutral-warm-70: #5f5954;
--neutral-warm-80: #45403d;
--neutral-warm-82: #403b38;
--neutral-warm-84: #3b3634;
--neutral-warm-86: #35322f;
--neutral-warm-88: #302d2b;
--neutral-warm-90: #2b2826;
--neutral-warm-92: #262321;
--neutral-warm-94: #211e1d;
--neutral-warm-96: #1b1a18;
--neutral-warm-98: #161514;
--neutral-warm-100: #11100f;
```

---

## 5b. Neutral Contrast Pairing

Neutrals follow a similar switch-point model to named colours, but with one key difference: **neutral-60 falls definitively on the dark side** (not an ambiguous switch point).

### Contrast pairing rule (background dictates text colour)

| Background shade | Text/icon colour |
|---|---|
| `neutral-5` → `neutral-50` | `neutral-100` (dark text on light background) |
| `neutral-60` → `neutral-100` | `neutral-5` (light text on dark background) |

### Comparison with named/semantic colour pairing

| | Named/semantic colours | Neutral colours |
|---|---|---|
| BASE shade | `-60` (ambiguous switch — hue-dependent) | `neutral-60` (definitively dark side) |
| Light group → dark text | `-5` through `-50` | `neutral-5` through `neutral-50` |
| Dark group → light text | `-70` through `-100` | **`neutral-60`** through `neutral-100` |
| Edge shade(s) | `-50` and `-70` (both sides) | **`neutral-50` only** (light side edge) |

### Edge shade

- **`neutral-50`** is just below 4.5:1 AA for normal text — use for decoration and large text (18px+) only
- **`neutral-60`** is the BASE and the switch point — it definitively pairs with `neutral-5` as text (unlike named colour `-60` which is hue-dependent)
- There is no dark-side edge shade equivalent to `-70` in the neutral system; `neutral-70` passes AA with `neutral-5`

### Dark mode behaviour

In dark mode, the neutral scale inverts (`neutral-5` → effectively near-black, `neutral-100` → near-white). The contrast pairing logic applies consistently to the inverted values since the same shade numbers flip together.

---

## 6. Token Hierarchy — How Colours Flow

```
1. :root — base family tokens
   --brand-5 through --brand-100       (raw hex values)
   --red-5 through --red-100           (raw hex values)
   etc.

2. .color-* theme class — overrides brand tokens
   .color-red { --brand-5: var(--red-5); ... --brand-100: var(--red-100); }
   .color-green { --brand-5: var(--green-5); ... }
   etc.
   → Applying .color-red to an element makes all --brand-* tokens resolve to red shades within that element

3. --color-* alias tokens — light/dark-aware brand references
   Light mode:  --color-60 = var(--brand-60)   (direct)
   Dark mode:   --color-60 = var(--brand-40)   (inverted)
   → Use --color-* tokens in component CSS so they respond correctly to dark mode
   → Use --brand-* tokens only when you explicitly want the raw palette value
```

### Single-value aliases (shorthand for the -60 shade)

Each family exposes a shorthand custom property pointing to its BASE (-60) shade:

```css
--primary:  var(--color-60)    /* points to active brand -60 */
--red:      var(--red-60)
--orange:   var(--orange-60)
--amber:    var(--amber-60)
--yellow:   var(--yellow-60)
--lime:     var(--lime-60)
--green:    var(--green-60)
--emerald:  var(--emerald-60)
--teal:     var(--teal-60)
--cyan:     var(--cyan-60)
--sky:      var(--sky-60)
--indigo:   var(--indigo-60)
--violet:   var(--violet-60)
--purple:   var(--purple-60)
--fuchsia:  var(--fuchsia-60)
--pink:     var(--pink-60)
--rose:     var(--rose-60)
--error:    var(--error-60)
--warning:  var(--warning-60)
--success:  var(--success-60)
```

---

## 7. Dark Mode Inversion

Dark mode is activated via `data-color-mode="dark"` on `<html>` (or the `.dark` class). Only the `--color-*` alias tokens and `--neutral-*` tokens are inverted — the raw `--brand-*` and `--red-*` etc. tokens are unchanged.

### `--color-*` inversion table

| Alias token | Light mode value | Dark mode value |
|-------------|-----------------|-----------------|
| `--color-5` | `--brand-5` | `--brand-100` |
| `--color-10` | `--brand-10` | `--brand-90` |
| `--color-20` | `--brand-20` | `--brand-80` |
| `--color-30` | `--brand-30` | `--brand-70` |
| `--color-40` | `--brand-40` | `--brand-60` |
| `--color-50` | `--brand-50` | `--brand-50` ← midpoint, same |
| `--color-60` | `--brand-60` | `--brand-40` |
| `--color-70` | `--brand-70` | `--brand-30` |
| `--color-80` | `--brand-80` | `--brand-20` |
| `--color-90` | `--brand-90` | `--brand-10` |
| `--color-100` | `--brand-100` | `--brand-5` |

**Key insight:** `-50` is the true midpoint and maps to itself. Inversion pairs: 5↔100, 10↔90, 20↔80, 30↔70, 40↔60.

**Implication for palette generation:** For dark mode inversion to look right, shades -40 and -60 must be perceptually close to each other (they swap), and -30/-70, -20/-80 etc. must form reasonable swap pairs. The palette must not be too asymmetric around its midpoint.

### Neutral inversion

In dark mode, `--neutral-5` is forced to `black` (not a variable reference), and the scale inverts: `--neutral-10` → darkest neutral, `--neutral-100` → near-white. The intermediate neutrals follow the same inversion pattern.

---

## 8. Contrast Pairing Rules

This applies to all named, brand, and semantic colour families. For neutrals, see Section 5b above.

### The switch-point model

The **-60 shade is the BASE** — the switch point for contrast. Depending on the hue, -60 will meet WCAG 4.5:1 AA contrast with either the -5 end (light) or the -100 end (dark) of the palette, but not necessarily both.

| Shade range | Background type | Recommended text/icon colour |
|-------------|----------------|------------------------------|
| `-5` → `-50` | Light backgrounds | Use `-100` for text/icons |
| `-60` | Switch point | Check per hue — meets 4.5:1 with `-5` or `-100` |
| `-70` → `-100` | Dark backgrounds | Use `-5` for text/icons |

### Edge shades

- **`-50` and `-70`** are the edge cases — they typically **fail WCAG 4.5:1 AA** for normal-size body text (fails with both `-5` and `-100`)
- `-50` and `-70` generally **pass 3:1** — acceptable for large text (18px+ regular / 14px+ bold) and non-text decorative elements
- **Do not use `-50` or `-70` as the text colour for body copy**

### Practical summary

```
Backgrounds:   -5  -10  -20  -30  -40      →  pair with -100 text
               -50                          →  large text only (3:1)
               -60                          →  check hue (may go either way)
               -70                          →  large text only (3:1)
               -80  -90  -100              →  pair with -5 text
```

---

## 9. What a Palette Generator Must Produce

Given a single **BASE hex colour** (treated as the `-60` shade), the generator should output:

### For a named colour family:

```css
/* 11 shades in :root */
--{name}-5:   #??????;   /* near-white tint */
--{name}-10:  #??????;
--{name}-20:  #??????;
--{name}-30:  #??????;
--{name}-40:  #??????;
--{name}-50:  #??????;   /* edge shade — large text / decoration only */
--{name}-60:  #??????;   /* = the input BASE colour, exact */
--{name}-70:  #??????;   /* edge shade — large text / decoration only */
--{name}-80:  #??????;
--{name}-90:  #??????;
--{name}-100: #??????;   /* near-black tone */
```

### Quality requirements for each shade:

- Shades `5`–`50`: tints — progressively lighter/less saturated as the number decreases; -5 should be near-white
- Shade `60`: exact input hex value, unchanged
- Shades `70`–`100`: tones/shades — progressively darker/less saturated as the number increases; -100 should be near-black
- Adjacent shades should have visually distinct but smooth perceptual steps
- The palette must look coherent in both light and dark mode given the inversion pairs (5↔100, 10↔90, 20↔80, 30↔70, 40↔60)
- All output values must be 6-digit hex codes (e.g. `#f5a623`) — no hsl, oklch, rgb, or 3-digit hex

---

### For a neutral colour family:

```css
/* 27 shades in :root — use neutral-{name}-* naming */
--{name}-5:   #??????;   /* near-white — pair with {name}-100 for text */
--{name}-10:  #??????;
--{name}-12:  #??????;
--{name}-14:  #??????;
--{name}-16:  #??????;
--{name}-18:  #??????;
--{name}-20:  #??????;
--{name}-22:  #??????;
--{name}-24:  #??????;
--{name}-26:  #??????;
--{name}-28:  #??????;
--{name}-30:  #??????;
--{name}-40:  #??????;
--{name}-50:  #??????;   /* edge shade — large text / decoration only (just below 4.5:1) */
--{name}-60:  #??????;   /* = the input BASE colour, exact — dark side; pair with {name}-5 for text */
--{name}-70:  #??????;
--{name}-80:  #??????;
--{name}-82:  #??????;
--{name}-84:  #??????;
--{name}-86:  #??????;
--{name}-88:  #??????;
--{name}-90:  #??????;
--{name}-92:  #??????;
--{name}-94:  #??????;
--{name}-96:  #??????;
--{name}-98:  #??????;
--{name}-100: #??????;   /* near-black — pair with {name}-5 for text */
```

**Quality requirements for neutral shades:**
- Shades `5`–`50`: progressively lighter/less saturated toward white; `-5` should be ≥95% lightness (HSL)
- Shade `60`: exact input BASE hex, unchanged
- Shades `70`–`100`: progressively darker; `-100` should be ≤10% lightness
- Fine steps at `12`–`30` and `82`–`98` are for subtle surface layering — each step is a tiny lightness increment (~2–3%), visually distinct only at close inspection
- Coarser steps at `40`/`50` and `70`/`80` can have larger perceptual jumps
- All shades must be **very low chroma** — should read as gray with a hue bias, never as a colour
- Hue angle must stay **consistent** across all shades — do not let it drift
- All output values must be 6-digit hex codes — no hsl, oklch, or rgb

### Integration — `.neutral-{name}` theme class:

If adding a new neutral family to the design system, add to `_neutral-themes.css`:

```css
.neutral-{name} {
    --neutral-default-5:   var(--{name}-5);
    --neutral-default-10:  var(--{name}-10);
    --neutral-default-12:  var(--{name}-12);
    --neutral-default-14:  var(--{name}-14);
    --neutral-default-16:  var(--{name}-16);
    --neutral-default-18:  var(--{name}-18);
    --neutral-default-20:  var(--{name}-20);
    --neutral-default-22:  var(--{name}-22);
    --neutral-default-24:  var(--{name}-24);
    --neutral-default-26:  var(--{name}-26);
    --neutral-default-28:  var(--{name}-28);
    --neutral-default-30:  var(--{name}-30);
    --neutral-default-40:  var(--{name}-40);
    --neutral-default-50:  var(--{name}-50);
    --neutral-default-60:  var(--{name}-60);
    --neutral-default-70:  var(--{name}-70);
    --neutral-default-80:  var(--{name}-80);
    --neutral-default-82:  var(--{name}-82);
    --neutral-default-84:  var(--{name}-84);
    --neutral-default-86:  var(--{name}-86);
    --neutral-default-88:  var(--{name}-88);
    --neutral-default-90:  var(--{name}-90);
    --neutral-default-92:  var(--{name}-92);
    --neutral-default-94:  var(--{name}-94);
    --neutral-default-96:  var(--{name}-96);
    --neutral-default-98:  var(--{name}-98);
    --neutral-default-100: var(--{name}-100);
}
```

---

### Optional — `.color-*` theme class entry:

If the generator is adding a new named family `{name}` to the design system, it also needs:

```css
.color-{name} {
    --brand-5:   var(--{name}-5);
    --brand-10:  var(--{name}-10);
    --brand-20:  var(--{name}-20);
    --brand-30:  var(--{name}-30);
    --brand-40:  var(--{name}-40);
    --brand-50:  var(--{name}-50);
    --brand-60:  var(--{name}-60);
    --brand-70:  var(--{name}-70);
    --brand-80:  var(--{name}-80);
    --brand-90:  var(--{name}-90);
    --brand-100: var(--{name}-100);
}
```

And a shorthand alias in `:root`:
```css
--{name}: var(--{name}-60);
```

---

## 10. Palette Generation — Algorithmic Guidance

The existing palettes appear to follow these approximate perceptual properties (inferred from the hex values):

### Light shades (-5 to -50): tints
- `-5`: Very high lightness (~95–98% in HSL), low saturation — near-white with a hint of the hue
- `-10`: Still very light (~90–94%), slightly more saturated
- `-20`, `-30`: Noticeably tinted but still pale (~75–88%)
- `-40`, `-50`: Mid-light, clearly the hue but still light enough that dark text works

### Dark shades (-70 to -100): shades
- `-70`: Slightly darker than -60, clearly the same hue
- `-80`, `-90`: Significantly darker, hue still recognisable
- `-100`: Near-black with a tint of the hue (~5–15% lightness)

### The BASE (-60): the pure hue
- Full saturation, medium-dark — this is the "canonical" colour
- Most suitable for interactive UI elements (buttons, links, icons on white)

### Recommended approach
Work in a perceptual colour space (OKLCH or HSL) to generate steps, then convert to hex:
1. Start with the BASE at its natural OKLCH/HSL values
2. Generate lighter steps by increasing L (lightness) and decreasing C (chroma) toward the light end
3. Generate darker steps by decreasing L and slightly decreasing C toward the dark end
4. Verify WCAG contrast ratios at each shade against the expected contrast pair
5. Convert all final values to 6-digit hex

### Neutral palette generation

Neutral palettes differ significantly from named colour palettes — they are desaturated grays with a consistent hue bias, not tinted/shaded saturated colours.

**Character of a neutral:**
- The BASE (-60) is a mid-gray with a subtle hue lean (e.g. warm = brownish-orange bias, cool = blue bias, slate = blue-gray, onyx = near-achromatic)
- All shades share the same hue angle — the "personality" of the neutral is its hue direction, not its saturation
- At no point should any shade look like a coloured swatch — it should always read as gray

**Recommended approach using OKLCH:**
1. Convert the BASE hex to OKLCH to extract its L (lightness), C (chroma), and H (hue)
2. Keep H **constant** across all 27 shades — hue drift makes the palette look incoherent
3. Keep C **very low** (typically 0.003–0.06 in OKLCH) — decrease C slightly toward both extremes
4. Generate lightness values for each shade number:
   - `-5`: L ≈ 0.975–0.985 (near-white)
   - `-10`: L ≈ 0.955–0.965
   - `-12` through `-30`: L steps of ~0.012–0.018 each (fine-grained surface layers)
   - `-40`: larger step down
   - `-50`: L such that contrast with `-5` is just below 4.5:1 (decoration/large text threshold)
   - `-60`: exact BASE value (L unchanged)
   - `-70`: first step darker than BASE
   - `-80`: larger step
   - `-82` through `-98`: L steps of ~0.012–0.018 each (fine-grained dark UI layers)
   - `-100`: L ≈ 0.055–0.080 (near-black)
5. Verify contrast at the critical thresholds:
   - `-50` on `-5` background: should be **just below** 4.5:1 (confirms edge shade)
   - `-60` on `-5` background: should **meet or exceed** 4.5:1 (confirms switch point)
6. Convert all final OKLCH values to 6-digit hex

**Contrast verification targets:**
- `-5` background + `-100` text: ≥ 15:1 (maximum contrast)
- `-5` background + `-60` text: ≥ 4.5:1 (AA — just passes)
- `-5` background + `-50` text: < 4.5:1 (just fails — decoration only)
- `-100` background + `-5` text: ≥ 15:1 (maximum contrast)

---

## File Locations (for reference when integrating output)

| File | Purpose |
|------|---------|
| `packages/css/src/tokens/_colors.css` | Where to add new `--{name}-*` tokens |
| `packages/css/src/themes/_color-themes.css` | Where to add `.color-{name}` class |
| `packages/css/src/tokens/_neutrals.css` | Neutral families (separate system) |
| `packages/css/src/themes/_color-modes.css` | Dark/light mode — `--color-*` aliases |
| `packages/css/docs/ai-reference.md` | Update family list and alias table |
