# PinInput

`import { PinInput } from '@tale-ui/react/pin-input';`

OTP / verification code input with individual digit slots. Built on [input-otp](https://github.com/guilhermerodz/input-otp).

## Parts

| Part | Description |
|------|-------------|
| `PinInput.Root` | Container. Wraps `OTPInput` from `input-otp`. Accepts `maxLength`, `value`, `onChange`, `disabled`. |
| `PinInput.Group` | Groups related slots together (`<div>`). |
| `PinInput.Slot` | Renders a single digit slot. Accepts `index`. |
| `PinInput.Separator` | Decorative separator between groups (`<span>`). |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | — | Total number of input slots (required) |
| `value` | `string` | — | Controlled value |
| `onChange` | `(value: string) => void` | — | Called when the value changes |
| `disabled` | `boolean` | `false` | Whether the input is disabled |

### Slot

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | — | Zero-based index into the slots array (required) |

Group and Separator accept only an optional `className`.

## Basic Usage

```tsx
<PinInput.Root maxLength={4}>
  <PinInput.Group>
    <PinInput.Slot index={0} />
    <PinInput.Slot index={1} />
    <PinInput.Slot index={2} />
    <PinInput.Slot index={3} />
  </PinInput.Group>
</PinInput.Root>
```

## Examples

### With Separator (6-digit)

```tsx
<PinInput.Root maxLength={6}>
  <PinInput.Group>
    <PinInput.Slot index={0} />
    <PinInput.Slot index={1} />
    <PinInput.Slot index={2} />
  </PinInput.Group>
  <PinInput.Separator />
  <PinInput.Group>
    <PinInput.Slot index={3} />
    <PinInput.Slot index={4} />
    <PinInput.Slot index={5} />
  </PinInput.Group>
</PinInput.Root>
```

### Controlled

```tsx
const [value, setValue] = React.useState('');

<PinInput.Root maxLength={6} value={value} onChange={setValue}>
  <PinInput.Group>
    <PinInput.Slot index={0} />
    <PinInput.Slot index={1} />
    <PinInput.Slot index={2} />
    <PinInput.Slot index={3} />
    <PinInput.Slot index={4} />
    <PinInput.Slot index={5} />
  </PinInput.Group>
</PinInput.Root>
```

### Disabled

```tsx
<PinInput.Root maxLength={4} disabled>
  <PinInput.Group>
    <PinInput.Slot index={0} />
    <PinInput.Slot index={1} />
    <PinInput.Slot index={2} />
    <PinInput.Slot index={3} />
  </PinInput.Group>
</PinInput.Root>
```

## CSS Classes

- `.tale-pin-input` — Root container
- `.tale-pin-input:has(input:disabled)` — Disabled state (dimmed, no pointer events)
- `.tale-pin-input__group` — Slot group
- `.tale-pin-input__slot` — Individual digit slot
- `.tale-pin-input__slot[data-active]` — Active (focused) slot
- `.tale-pin-input__slot[data-filled]` — Slot with a character (darker border)
- `.tale-pin-input__caret` — Blinking caret indicator
- `.tale-pin-input__separator` — Separator between groups

## Pitfalls

<!-- pitfall: pin-input-slot-not-input -->
- **Uses `PinInput.Slot` (NOT `PinInput.Input`).** Each `Slot` requires an `index` prop. Requires `maxLength` on Root.
  - anti-pattern: `<PinInput.Root><PinInput.Input /><PinInput.Input /></PinInput.Root>`
  - fix: `<PinInput.Root maxLength={2}><PinInput.Group><PinInput.Slot index={0} /><PinInput.Slot index={1} /></PinInput.Group></PinInput.Root>`

## Notes

- Requires `input-otp` as a peer dependency. Install it separately: `npm install input-otp`.
- The hidden `<input>` element is managed by `input-otp` and handles keyboard navigation, paste, and autofill automatically.
- Each `Slot` reads its state (character, active, caret) from React context provided by `Root`.
