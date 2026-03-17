# Form

`import { Form } from '@tale-ui/react/form';`

A styled form element with built-in React Aria validation support.

## Basic Usage

```tsx
<Form onSubmit={(e) => { e.preventDefault(); }}>
  <TextField.Root name="username" isRequired>
    <TextField.Label>Username</TextField.Label>
    <TextField.Input placeholder="Enter username" />
  </TextField.Root>
  <Button type="submit">Submit</Button>
</Form>
```

## Examples

### With Native Validation

```tsx
<Form
  validationBehavior="native"
  onSubmit={(e) => {
    e.preventDefault();
    alert('Validation passed!');
  }}
>
  <TextField.Root name="fullName" isRequired>
    <TextField.Label>Full Name</TextField.Label>
    <TextField.Input placeholder="Enter your full name" />
  </TextField.Root>
  <TextField.Root name="password" type="password" isRequired minLength={8}>
    <TextField.Label>Password</TextField.Label>
    <TextField.Input placeholder="At least 8 characters" />
  </TextField.Root>
  <NumberField.Root name="age" minValue={18} maxValue={120}>
    <NumberField.Label>Age</NumberField.Label>
    <NumberField.Input placeholder="Must be 18+" />
  </NumberField.Root>
  <Button type="submit">Submit</Button>
</Form>
```

## CSS Classes

- `.tale-form` — Base

## Notes

- This is a simple (non-compound) component -- use `<Form>` directly.
- Set `validationBehavior="native"` to use the browser's built-in constraint validation.
- Built on React Aria `Form`.
