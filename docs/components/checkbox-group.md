# CheckboxGroup

`import { CheckboxGroup } from '@tale-ui/react/checkbox-group';`

Groups a set of checkboxes with form validation and accessibility support, built on React Aria's CheckboxGroup.

## Basic Usage

```tsx
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Checkbox } from '@tale-ui/react/checkbox';

<CheckboxGroup label="Favorite fruits">
  <Checkbox.Root value="apple">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    Apple
  </Checkbox.Root>
  <Checkbox.Root value="banana">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    Banana
  </Checkbox.Root>
  <Checkbox.Root value="cherry">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    Cherry
  </Checkbox.Root>
</CheckboxGroup>
```

## Examples

### Disabled

```tsx
<CheckboxGroup label="Disabled group" isDisabled>
  <Checkbox.Root value="apple">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    Apple
  </Checkbox.Root>
  <Checkbox.Root value="banana">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
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
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    Email
  </Checkbox.Root>
  <Checkbox.Root value="sms">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    SMS
  </Checkbox.Root>
  <Checkbox.Root value="push">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    Push notification
  </Checkbox.Root>
</CheckboxGroup>
```

### Horizontal Layout

```tsx
<CheckboxGroup
  label="Pick toppings"
  style={{ flexDirection: 'row', display: 'flex', gap: 'var(--space-m)' }}
>
  <Checkbox.Root value="cheese">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
    Cheese
  </Checkbox.Root>
  <Checkbox.Root value="pepperoni">
    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
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
