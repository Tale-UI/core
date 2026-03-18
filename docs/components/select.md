# Select

`import { Select } from '@tale-ui/react/select';`

A compound dropdown select component with popover listbox, built on React Aria's Select.

## Parts

| Part | Description |
|------|-------------|
| `Select.Root` | Top-level select wrapper |
| `Select.Label` | Accessible label for the select |
| `Select.Trigger` | The button that opens the dropdown |
| `Select.Value` | Displays the selected value (or placeholder) |
| `Select.Icon` | Decorative dropdown arrow icon |
| `Select.Popover` | The floating popover container |
| `Select.ListBox` | The scrollable list of options |
| `Select.Item` | An individual option |
| `Select.Section` | A group of related items |
| `Select.Header` | A header label for a section |
| `Select.Separator` | A visual divider between items or sections |

## Basic Usage

```tsx
<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select a fruit..." />
    <Select.Icon>&#x25BE;</Select.Icon>
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
      <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
      <Select.Item id="cherry" textValue="Cherry">Cherry</Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

## Examples

### With Label

```tsx
<Select.Root>
  <Select.Label>Favorite fruit</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Choose one..." />
    <Select.Icon>&#x25BE;</Select.Icon>
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
      <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
      <Select.Item id="cherry" textValue="Cherry">Cherry</Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

### With Sections

```tsx
<Select.Root>
  <Select.Label>Food</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Select a food..." />
    <Select.Icon>&#x25BE;</Select.Icon>
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Section>
        <Select.Header>Fruits</Select.Header>
        <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
        <Select.Item id="banana" textValue="Banana">Banana</Select.Item>
      </Select.Section>
      <Select.Section>
        <Select.Header>Vegetables</Select.Header>
        <Select.Item id="carrot" textValue="Carrot">Carrot</Select.Item>
        <Select.Item id="broccoli" textValue="Broccoli">Broccoli</Select.Item>
      </Select.Section>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

### With Disabled Items

```tsx
<Select.Root>
  <Select.Label>Available options</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
    <Select.Icon>&#x25BE;</Select.Icon>
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
      <Select.Item id="banana" textValue="Banana" isDisabled>Banana (sold out)</Select.Item>
      <Select.Item id="cherry" textValue="Cherry">Cherry</Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

### Disabled

```tsx
<Select.Root isDisabled>
  <Select.Label>Disabled select</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Cannot select..." />
    <Select.Icon>&#x25BE;</Select.Icon>
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="apple" textValue="Apple">Apple</Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>
```

## CSS Classes

- `.tale-select` -- Base (root)
- `.tale-select__trigger` -- Trigger button
- `.tale-select__value` -- Selected value display
- `.tale-select__icon` -- Dropdown arrow icon
- `.tale-select__popover` -- Floating popover
- `.tale-select__listbox` -- List of options
- `.tale-select__item` -- Individual option
- `.tale-select__header` -- Section header
- `.tale-select__label` -- Label element
- `.tale-select__separator` -- Divider

## Notes

- Each `Select.Item` should have an `id` and a `textValue` prop. `textValue` is inferred from text children but should be explicit for complex item content (icons, badges, etc.).
- `isDisabled` on `Select.Root` disables the entire select. Use `isDisabled` on individual `Select.Item` elements to disable specific options.
- The `placeholder` prop on `Select.Value` is shown when no item is selected.
