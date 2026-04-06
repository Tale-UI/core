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

## Props

Accepts all React Aria `SearchField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

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
import { Icon } from '@tale-ui/react/icon';
import { X } from 'lucide-react';

<SearchField.Root defaultValue="React">
  <SearchField.Label>Search</SearchField.Label>
  <SearchField.Input placeholder="Search..." />
  <SearchField.ClearButton><Icon icon={X} size="sm" /></SearchField.ClearButton>
</SearchField.Root>
```

## CSS Classes

- `.tale-search-field` — Root
- `.tale-search-field__input` — Text input
- `.tale-search-field__label` — Label
- `.tale-search-field__description` — Description text
- `.tale-search-field__error` — Error message
- `.tale-search-field__clear` — Clear button

## Pitfalls

<!-- pitfall: search-field-clear-button-needs-icon -->
- **`SearchField.ClearButton` does NOT auto-render an icon** — pass `<Icon icon={X}>` as a child.
  - anti-pattern: `<SearchField.ClearButton />`
  - fix: `<SearchField.ClearButton><Icon icon={X} size="sm" /></SearchField.ClearButton>`

<!-- pitfall: search-field-no-input-group -->
- **No `SearchField.InputGroup` sub-part.** Place `SearchField.Input` and `SearchField.ClearButton` directly inside `SearchField.Root`.
  - anti-pattern: `<SearchField.InputGroup><SearchField.Input /></SearchField.InputGroup>`
  - fix: `<SearchField.Root><SearchField.Input /><SearchField.ClearButton>...</SearchField.ClearButton></SearchField.Root>`

<!-- pitfall: search-field-default-value-on-root -->
- **`SearchField.Root` owns `defaultValue`.** Do not put it on `SearchField.Input`.
  - anti-pattern: `<SearchField.Input defaultValue="React" />`
  - fix: `<SearchField.Root defaultValue="React"><SearchField.Input /></SearchField.Root>`

## Notes

- `ClearButton` clears the field value on press; pass custom children for the button content.
- The clear button is absolutely positioned inside the input (overlays the right side). The input has `padding-inline-end` reserved for it.
- The clear button automatically hides when the field is empty (via `data-empty` on the Root: `.tale-search-field[data-empty] .tale-search-field__clear { display: none }`).
- Supports `isDisabled` prop on the Root.
