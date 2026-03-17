# SearchField

`import { SearchField } from '@tale-ui/react/search-field';`

A search input field with built-in clear button support.

## Parts

| Part | Description |
|------|-------------|
| `SearchField.Root` | Wrapper that manages search field state |
| `SearchField.Input` | The search text input |
| `SearchField.Label` | Accessible label |
| `SearchField.Description` | Helper text |
| `SearchField.ErrorMessage` | Validation error message |
| `SearchField.ClearButton` | Button to clear the input value |

## Basic Usage

```tsx
<SearchField.Root>
  <SearchField.Input placeholder="Search..." />
</SearchField.Root>
```

## Examples

### With Label

```tsx
<SearchField.Root>
  <SearchField.Label>Search</SearchField.Label>
  <SearchField.Input placeholder="Search..." />
</SearchField.Root>
```

### With Clear Button

```tsx
<SearchField.Root defaultValue="React">
  <SearchField.Label>Search</SearchField.Label>
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)' }}>
    <SearchField.Input placeholder="Search..." />
    <SearchField.ClearButton>&times;</SearchField.ClearButton>
  </div>
</SearchField.Root>
```

## CSS Classes

- `.tale-search-field` — Root
- `.tale-search-field__input` — Text input
- `.tale-search-field__label` — Label
- `.tale-search-field__description` — Description text
- `.tale-search-field__error` — Error message
- `.tale-search-field__clear` — Clear button

## Notes

- `ClearButton` clears the field value on press; pass custom children for the button content.
- Supports `isDisabled` prop on the Root.
