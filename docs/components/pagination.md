# Pagination

`import { Pagination } from '@tale-ui/react/pagination';`

Page navigation for moving between pages of content.

## Parts

| Part | Description |
|------|-------------|
| `Pagination.Root` | Container (`<nav>`). Requires `aria-label`. |
| `Pagination.PreviousTrigger` | Button to go to the previous page. |
| `Pagination.NextTrigger` | Button to go to the next page. |
| `Pagination.Item` | A page number button. Set `current` for the active page. |
| `Pagination.Ellipsis` | Visual indicator for skipped page numbers. |

## Props

### Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | — | The page number this item represents |
| `current` | `boolean` | — | Whether this is the current page (sets `aria-current="page"`) |

Also accepts all standard `<button>` HTML attributes (except `children`, which is derived from `page`).

## Basic Usage

```tsx
<Pagination.Root aria-label="Pagination">
  <Pagination.PreviousTrigger />
  <Pagination.Item page={1} />
  <Pagination.Item page={2} current />
  <Pagination.Item page={3} />
  <Pagination.NextTrigger />
</Pagination.Root>
```

## Examples

### Many Pages with Ellipsis

```tsx
<Pagination.Root aria-label="Pagination">
  <Pagination.PreviousTrigger />
  <Pagination.Item page={1} />
  <Pagination.Ellipsis />
  <Pagination.Item page={4} />
  <Pagination.Item page={5} current />
  <Pagination.Item page={6} />
  <Pagination.Ellipsis />
  <Pagination.Item page={20} />
  <Pagination.NextTrigger />
</Pagination.Root>
```

### First Page (Previous Disabled)

```tsx
<Pagination.Root aria-label="Pagination">
  <Pagination.PreviousTrigger disabled />
  <Pagination.Item page={1} current />
  <Pagination.Item page={2} />
  <Pagination.Item page={3} />
  <Pagination.NextTrigger />
</Pagination.Root>
```

### Custom Trigger Labels

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '@tale-ui/react/icon';

<Pagination.Root aria-label="Pagination">
  <Pagination.PreviousTrigger><Icon icon={ChevronLeft} size="sm" /> Prev</Pagination.PreviousTrigger>
  <Pagination.Item page={1} />
  <Pagination.Item page={2} current />
  <Pagination.Item page={3} />
  <Pagination.NextTrigger>Next <Icon icon={ChevronRight} size="sm" /></Pagination.NextTrigger>
</Pagination.Root>
```

## CSS Classes

- `.tale-pagination` — Root container
- `.tale-pagination__item` — Page number button
- `.tale-pagination__item--current` — Active page
- `.tale-pagination__ellipsis` — Skipped pages indicator
- `.tale-pagination__previous` — Previous page trigger
- `.tale-pagination__next` — Next page trigger

## Notes

- Custom component — not built on a React Aria primitive.
- Set `aria-label` on `Pagination.Root` for accessibility.
- The `current` prop on `Item` sets `aria-current="page"` and applies the `--current` modifier.
- Disable `PreviousTrigger` on the first page and `NextTrigger` on the last page.
- Default trigger content renders `ChevronLeft` / `ChevronRight` icons via the `Icon` component. Pass children to override.
