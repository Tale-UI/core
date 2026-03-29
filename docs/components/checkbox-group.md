# CheckboxGroup

`import { CheckboxGroup } from '@tale-ui/react/checkbox-group';`

Groups a set of checkboxes with form validation and accessibility support, built on React Aria's CheckboxGroup.

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | `string` | — | Accessible group label |
| `orientation` | `'horizontal' \| 'vertical'` | — | Layout orientation. Sets `data-orientation` for CSS styling |
| `isDisabled` | `boolean` | `false` | Disables all child checkboxes |
| `size` | `'sm' \| 'md' \| 'lg'` | — | Propagates size to all child Checkbox.Root components |

## Basic Usage

```tsx
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Icon } from '@tale-ui/react/icon';
import { Check } from 'lucide-react';

<CheckboxGroup label="Favorite fruits">
  <Checkbox.Root value="apple">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Apple
  </Checkbox.Root>
  <Checkbox.Root value="banana">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Banana
  </Checkbox.Root>
  <Checkbox.Root value="cherry">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Cherry
  </Checkbox.Root>
</CheckboxGroup>
```

## Examples

### Disabled

```tsx
<CheckboxGroup label="Disabled group" isDisabled>
  <Checkbox.Root value="apple">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Apple
  </Checkbox.Root>
  <Checkbox.Root value="banana">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Banana
  </Checkbox.Root>
</CheckboxGroup>
```

### With Description

```tsx
import { Field } from '@tale-ui/react/field';

<CheckboxGroup label="Notification preferences">
  <Field.Description>Select how you would like to be notified.</Field.Description>
  <Checkbox.Root value="email">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Email
  </Checkbox.Root>
  <Checkbox.Root value="sms">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    SMS
  </Checkbox.Root>
  <Checkbox.Root value="push">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Push notification
  </Checkbox.Root>
</CheckboxGroup>
```

### Horizontal Layout

```tsx
<CheckboxGroup label="Pick toppings" orientation="horizontal">
  <Checkbox.Root value="cheese">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Cheese
  </Checkbox.Root>
  <Checkbox.Root value="pepperoni">
    <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
    Pepperoni
  </Checkbox.Root>
</CheckboxGroup>
```

## CSS Classes

- `.tale-checkbox-group` -- Base wrapper

## Notes

- The `label` prop sets the accessible group label.
- `isDisabled` on the group disables all child checkboxes.
- Each `Checkbox.Root` inside a group must have a `value` prop.
- Use `Field.Description` from `@tale-ui/react/field` to add helper text.
- The `orientation` prop sets `data-orientation` on the DOM element, enabling CSS-based horizontal/vertical layout.
