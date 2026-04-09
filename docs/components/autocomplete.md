# Autocomplete

`import { Autocomplete } from '@tale-ui/react/autocomplete';`

A compound inline autocomplete component with a search field and filterable listbox (no popover), built on React Aria's Autocomplete.

## Parts

| Part | Description |
|------|-------------|
| `Autocomplete.Root` | Filtering context provider (accepts a `filter` function) |
| `Autocomplete.SearchField` | The search field wrapper |
| `Autocomplete.Input` | The text input for filtering |
| `Autocomplete.ListBox` | The list of filterable items |
| `Autocomplete.Item` | An individual option |
| `Autocomplete.Section` | A group of related items |
| `Autocomplete.Header` | Section header label |
| `Autocomplete.Empty` | Shown when no items match the filter |
| `Autocomplete.Separator` | Visual divider |

## Props

Accepts all React Aria `Autocomplete` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { useFilter } from '@tale-ui/react/autocomplete';

function SearchPanel() {
  let { contains } = useFilter({ sensitivity: 'base' });
  return (
    <Autocomplete.Root filter={contains}>
      <Autocomplete.SearchField aria-label="Search fruits">
        <Autocomplete.Input placeholder="Search fruits..." />
      </Autocomplete.SearchField>
      <Autocomplete.ListBox aria-label="Fruits">
        <Autocomplete.Item id="apple" textValue="Apple">Apple</Autocomplete.Item>
        <Autocomplete.Item id="banana" textValue="Banana">Banana</Autocomplete.Item>
        <Autocomplete.Item id="cherry" textValue="Cherry">Cherry</Autocomplete.Item>
      </Autocomplete.ListBox>
    </Autocomplete.Root>
  );
}
```

## Examples

### With Sections

```tsx
import { useFilter } from '@tale-ui/react/autocomplete';

function ProduceSearch() {
  let { contains } = useFilter({ sensitivity: 'base' });
  return (
    <Autocomplete.Root filter={contains}>
      <Autocomplete.SearchField aria-label="Search produce">
        <Autocomplete.Input placeholder="Search produce..." />
      </Autocomplete.SearchField>
      <Autocomplete.ListBox aria-label="Produce">
        <Autocomplete.Section>
          <Autocomplete.Header>Fruits</Autocomplete.Header>
          <Autocomplete.Item id="apple" textValue="Apple">Apple</Autocomplete.Item>
          <Autocomplete.Item id="banana" textValue="Banana">Banana</Autocomplete.Item>
        </Autocomplete.Section>
        <Autocomplete.Section>
          <Autocomplete.Header>Vegetables</Autocomplete.Header>
          <Autocomplete.Item id="carrot" textValue="Carrot">Carrot</Autocomplete.Item>
          <Autocomplete.Item id="broccoli" textValue="Broccoli">Broccoli</Autocomplete.Item>
        </Autocomplete.Section>
      </Autocomplete.ListBox>
    </Autocomplete.Root>
  );
}
```

## CSS Classes

- `.tale-autocomplete__popover` -- Popup container (min-width anchored, max-height 28rem with overflow scroll)
- `.tale-autocomplete__search-field` -- Search field wrapper
- `.tale-autocomplete__input` -- Text input
- `.tale-autocomplete__listbox` -- List of options
- `.tale-autocomplete__item` -- Individual option
- `.tale-autocomplete__header` -- Section header
- `.tale-autocomplete__empty` -- Empty state message
- `.tale-autocomplete__separator` -- Divider

## Pitfalls

<!-- cross-pitfall-ref: usefilter-from-rac-not-react-aria -->

<!-- pitfall: autocomplete-no-phantom-sub-parts -->
- **No phantom sub-parts: no `Autocomplete.Label`, `Autocomplete.Popover`, `Autocomplete.Trigger`, or `Autocomplete.Value`** — use `Autocomplete.SearchField` with an `aria-label`; Autocomplete renders inline with no popover.
  - anti-pattern: `<Autocomplete.Root><Autocomplete.Label>Search</Autocomplete.Label><Autocomplete.Popover>...</Autocomplete.Popover></Autocomplete.Root>`
  - fix: `<Autocomplete.SearchField aria-label="Search"><Autocomplete.Input /></Autocomplete.SearchField>`
  - complete example:
    ```tsx
    import { Autocomplete } from '@tale-ui/react/autocomplete';
    
    export function Example() {
      return (
        <Autocomplete.Root>
          <Autocomplete.SearchField>
            <Autocomplete.Input placeholder="Search..." />
          </Autocomplete.SearchField>
          <Autocomplete.ListBox>
            <Autocomplete.Item id="apple">Apple</Autocomplete.Item>
            <Autocomplete.Item id="banana">Banana</Autocomplete.Item>
          </Autocomplete.ListBox>
        </Autocomplete.Root>
      );
    }
    ```

<!-- pitfall: autocomplete-no-controlled-props -->
<!-- prose-only -->
- **No controlled state props on `Autocomplete.Root`** — filter state is derived from the `filter` function and the input value managed internally.

## Notes

- Unlike Combobox, Autocomplete renders the list inline (no popover). It is suited for command palettes, sidebar filters, and embedded search panels.
- You must provide a `filter` function to `Autocomplete.Root`. Use `useFilter` from `@tale-ui/react/autocomplete` for locale-aware filtering.
- Each `Autocomplete.Item` needs both `id` and `textValue` for filtering and accessibility.
- `Autocomplete.SearchField` requires an `aria-label` when no visible label is present.
