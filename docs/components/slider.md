# Slider

`import { Slider } from '@tale-ui/react/slider';`

A draggable range input for selecting a value or range within a given span.

## Parts

| Part | Description |
|------|-------------|
| `Slider.Root` | Wrapper managing value, min/max, step, and orientation |
| `Slider.Header` | Flex row wrapper for Label + Output |
| `Slider.Label` | Accessible label |
| `Slider.Output` | Displays the current value(s) |
| `Slider.Control` | Touch-active container around the track |
| `Slider.Track` | The rail the thumb slides along |
| `Slider.Indicator` | Filled portion of the track |
| `Slider.Thumb` | Draggable handle (render two for a range slider) |

## Basic Usage

```tsx
<Slider.Root defaultValue={50}>
  <Slider.Header>
    <Slider.Label>Volume</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

## Examples

### Range Slider

```tsx
<Slider.Root defaultValue={[20, 80]}>
  <Slider.Header>
    <Slider.Label>Price Range</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Custom Step

```tsx
<Slider.Root defaultValue={50} step={10}>
  <Slider.Header>
    <Slider.Label>Quality</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Disabled

```tsx
<Slider.Root defaultValue={60} isDisabled>
  <Slider.Header>
    <Slider.Label>Disabled Slider</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Vertical

```tsx
<Slider.Root defaultValue={40} orientation="vertical">
  <Slider.Label>Vertical</Slider.Label>
  <Slider.Output />
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

## CSS Classes

- `.tale-slider` — Root container
- `.tale-slider__header` — Header row (Label + Output)
- `.tale-slider__label` — Label
- `.tale-slider__output` — Value display
- `.tale-slider__control` — Touch container
- `.tale-slider__track` — Rail
- `.tale-slider__indicator` — Filled portion
- `.tale-slider__thumb` — Draggable handle

## Notes

- Built on React Aria `Slider`, `SliderTrack`, `SliderThumb`, and `SliderOutput`.
- Pass an array (e.g. `defaultValue={[20, 80]}`) for a range slider, and render two `Slider.Thumb` elements.
- Supports `orientation="horizontal"` (default) and `orientation="vertical"`.
- `Slider.Control` is a plain `<div>` that provides a larger touch target around the track.
