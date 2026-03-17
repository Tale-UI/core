# Radio

`import { Radio } from '@tale-ui/react/radio';`

A compound radio button component with group support, built on React Aria's Radio and RadioGroup.

## Parts

| Part | Description |
|------|-------------|
| `Radio.Group` | Groups radio buttons with a label and manages selection |
| `Radio.Root` | An individual radio option |
| `Radio.Indicator` | The visual circle indicator |

## Basic Usage

```tsx
<Radio.Group label="Favorite color">
  <Radio.Root value="red">
    <Radio.Indicator />
    Red
  </Radio.Root>
  <Radio.Root value="green">
    <Radio.Indicator />
    Green
  </Radio.Root>
  <Radio.Root value="blue">
    <Radio.Indicator />
    Blue
  </Radio.Root>
</Radio.Group>
```

## Examples

### Disabled

```tsx
<Radio.Group label="Disabled group" isDisabled>
  <Radio.Root value="red">
    <Radio.Indicator />
    Red
  </Radio.Root>
  <Radio.Root value="green">
    <Radio.Indicator />
    Green
  </Radio.Root>
</Radio.Group>
```

### Horizontal

```tsx
<Radio.Group label="Plan" orientation="horizontal">
  <Radio.Root value="free">
    <Radio.Indicator />
    Free
  </Radio.Root>
  <Radio.Root value="pro">
    <Radio.Indicator />
    Pro
  </Radio.Root>
  <Radio.Root value="enterprise">
    <Radio.Indicator />
    Enterprise
  </Radio.Root>
</Radio.Group>
```

### All Sizes

```tsx
<Radio.Group label="Small radios">
  <Radio.Root value="a" size="sm">
    <Radio.Indicator />
    Small option A
  </Radio.Root>
</Radio.Group>

<Radio.Group label="Medium radios">
  <Radio.Root value="a" size="md">
    <Radio.Indicator />
    Medium option A
  </Radio.Root>
</Radio.Group>

<Radio.Group label="Large radios">
  <Radio.Root value="a" size="lg">
    <Radio.Indicator />
    Large option A
  </Radio.Root>
</Radio.Group>
```

## CSS Classes

- `.tale-radio` -- Base radio option
- `.tale-radio--sm` -- Small size modifier
- `.tale-radio--lg` -- Large size modifier
- `.tale-radio__indicator` -- The visual circle indicator
- `.tale-radio-group` -- The group wrapper

## Notes

- `size` defaults to `"md"`. The `--md` modifier class is omitted from the DOM.
- The `label` prop on `Radio.Group` sets the accessible group label.
- Use `orientation="horizontal"` on `Radio.Group` for inline layout.
- `isDisabled` on the group disables all child radios.
