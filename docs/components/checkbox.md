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

### Checkbox.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the checkbox indicator |

### Visual

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether the checkbox visual appears checked |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the checkbox indicator |

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

### Sizes

```tsx
<Checkbox.Root size="sm">
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Small
</Checkbox.Root>

<Checkbox.Root size="md">
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Medium (default)
</Checkbox.Root>

<Checkbox.Root size="lg">
  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
  Large
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
- `.tale-checkbox--sm` -- Small size (1.4rem indicator)
- `.tale-checkbox--lg` -- Large size (2.2rem indicator)
- `.tale-checkbox__indicator` -- The visual indicator box

## Pitfalls

<!-- pitfall: checkbox-always-use-namespace -->
- **`Checkbox` is a namespace component — always use `<Checkbox.Root value="...">`, never `<Checkbox>` directly.** Using `<Checkbox>` causes "'Checkbox' cannot be used as a JSX component" errors.
  - anti-pattern: `<Checkbox value="agree">Accept terms</Checkbox>`
  - fix: `<Checkbox.Root value="agree"><Checkbox.Indicator>...</Checkbox.Indicator> Accept terms</Checkbox.Root>`

<!-- pitfall: checkbox-value-not-id -->
- **Each checkbox item uses `value` prop (not `id`) matching the parent CheckboxGroup's `value` array.**
  - anti-pattern: `<Checkbox.Root id="apple">Apple</Checkbox.Root>`
  - fix: `<Checkbox.Root value="apple">Apple</Checkbox.Root>`

<!-- pitfall: checkbox-indicator-needs-icon -->
- **`Checkbox.Indicator` does NOT render a checkmark on its own** — provide `<Icon icon={Check} size="sm" />` as a child.
  - anti-pattern: `<Checkbox.Indicator />`
  - fix: `<Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>`

<!-- cross-pitfall-ref: no-visual-exports-for-interactive-ui -->

## Notes

- You must provide your own icon inside `Checkbox.Indicator` — use `<Icon icon={Check} size="sm" />` from `@tale-ui/react/icon` with `lucide-react`.
- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- `isIndeterminate` renders a third visual state (typically a minus icon instead of a checkmark).
- When used inside a `CheckboxGroup`, add a `value` prop to each `Checkbox.Root`.
- Supports `data-readonly` and `data-required` attributes for corresponding states.
- **Size guidance:** The default `md` size is almost always the right choice. The `sm` variant is intended for edge-cases only (e.g. dense data tables or compact toolbars) and should be seldom used — it reduces the touch target and can hurt readability.
