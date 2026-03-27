# Checkbox

`import { Checkbox } from '@tale-ui/react/checkbox';`

A compound checkbox component with a visual indicator, built on React Aria's Checkbox.

## Parts

| Part | Description |
|------|-------------|
| `Checkbox.Root` | The checkbox label and input wrapper |
| `Checkbox.Indicator` | The visual box that contains the check/minus icon |

> **Important:** `Checkbox.Indicator` is a plain `<span>` — it does NOT include a built-in checkmark icon. You must provide a child icon using `<Icon icon={Check} size="sm" />` from `@tale-ui/react/icon` and `lucide-react`.

## Props

Accepts all React Aria `Checkbox` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### Visual

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether the checkbox visual appears checked |

`Checkbox.Visual` is `aria-hidden` — for component composition only, not application UI. See [Visual-Only Exports](visual-exports.md).

## Basic Usage

```tsx
import { Checkbox } from '@tale-ui/react/checkbox';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

<Checkbox.Root>
  <Checkbox.Indicator>
    <Icon icon={Check} size="sm" />
  </Checkbox.Indicator>
  Accept terms and conditions
</Checkbox.Root>
```

## Examples

### Checked by Default

```tsx
<Checkbox.Root defaultSelected>
  <Checkbox.Indicator>
    <Icon icon={Check} size="sm" />
  </Checkbox.Indicator>
  Checked by default
</Checkbox.Root>
```

### Disabled

```tsx
<Checkbox.Root isDisabled>
  <Checkbox.Indicator>
    <Icon icon={Check} size="sm" />
  </Checkbox.Indicator>
  Disabled checkbox
</Checkbox.Root>
```

### Indeterminate

```tsx
import { Minus } from 'lucide-react';

<Checkbox.Root isIndeterminate>
  <Checkbox.Indicator>
    <Icon icon={Minus} size="sm" />
  </Checkbox.Indicator>
  Indeterminate state
</Checkbox.Root>
```

### All States

```tsx
import { Check, Minus } from 'lucide-react';

<Checkbox.Root>
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Unchecked
</Checkbox.Root>

<Checkbox.Root defaultSelected>
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Checked
</Checkbox.Root>

<Checkbox.Root isIndeterminate>
  <Checkbox.Indicator><Icon icon={Minus} size="sm" /></Checkbox.Indicator>
  Indeterminate
</Checkbox.Root>

<Checkbox.Root isDisabled>
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Disabled
</Checkbox.Root>

<Checkbox.Root isDisabled defaultSelected>
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Disabled + Checked
</Checkbox.Root>
```

## CSS Classes

- `.tale-checkbox` -- Base (root label)
- `.tale-checkbox__indicator` -- The visual indicator box

## Notes

- You must provide your own icon inside `Checkbox.Indicator` — use `<Icon icon={Check} size="sm" />` from `@tale-ui/react/icon` with `lucide-react`.
- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- `isIndeterminate` renders a third visual state (typically a minus icon instead of a checkmark).
- When used inside a `CheckboxGroup`, add a `value` prop to each `Checkbox.Root`.
- Supports `data-readonly` and `data-required` attributes for corresponding states.
