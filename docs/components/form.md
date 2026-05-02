# Form

`import { Form } from '@tale-ui/react/form';`

A styled form element with built-in React Aria validation support.

## Props

Accepts all React Aria `Form` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

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

## Pitfalls

<!-- pitfall: form-no-sub-parts -->
- **`Form` is a simple component with no sub-parts** — There is no `Form.Submit`, `Form.Field`, or `Form.Label`. Use `<Form>` directly and compose `Button`, `Field`, and other components as children.
  - anti-pattern: `<Form.Root onSubmit={handleSubmit}>`
  - fix: `<Form onSubmit={handleSubmit}>`
  - complete example:
    ```tsx
    import { Form } from '@tale-ui/react/form';
    import { TextField } from '@tale-ui/react/text-field';
    import { Button } from '@tale-ui/react/button';
    
    export function Example() {
      return (
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <TextField.Root isRequired>
            <TextField.Label>Username</TextField.Label>
            <TextField.Input />
          </TextField.Root>
          <Button type="submit" variant="primary">Submit</Button>
        </Form>
      );
    }
    ```

<!-- pitfall: form-method-lowercase -->
- **method prop requires lowercase values** — Valid values are `"get"`, `"post"`, and `"dialog"`. Uppercase values like `"GET"` or `"POST"` are not valid.
  - anti-pattern: `<Form method="POST">`
  - fix: `<Form method="post">`
<!-- pitfall: when-wrapping-form-fields-in -->
- **When wrapping form fields in Column, use spacing-token gap values, not component-size names** — `gap="md"` is not a valid `Gap` value and causes `Type '"md"' is not assignable to type 'Gap | undefined'`; use `gap="s"` for tight field stacks (recommended for forms) or `gap="m"` for looser spacing.
  - anti-pattern: `<Column gap="md">`
  - fix: `<Column gap="s">`

## Notes

- This is a simple (non-compound) component -- use `<Form>` directly.
- Set `validationBehavior="native"` to use the browser's built-in constraint validation.
- Built on React Aria `Form`.
