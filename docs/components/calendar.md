# Calendar

`import { Calendar } from '@tale-ui/react/calendar';`

A date picker calendar for selecting a single date, with month navigation.

## Parts

| Part | Description |
|------|-------------|
| `Calendar.Root` | Wrapper managing date state and locale |
| `Calendar.PreviousButton` | Navigate to the previous month (renders a ChevronLeft icon by default) |
| `Calendar.NextButton` | Navigate to the next month (renders a ChevronRight icon by default) |
| `Calendar.Heading` | Displays the current month and year |
| `Calendar.Grid` | `<table>` containing the header and body |
| `Calendar.GridHeader` | `<thead>` row of weekday names (render prop: `(day) => ...`) |
| `Calendar.GridHeaderCell` | `<th>` weekday label — **use inside `GridHeader` only** |
| `Calendar.GridBody` | `<tbody>` rows of date cells (render prop: `(date) => ...`) |
| `Calendar.Cell` | Individual date cell — **use inside `GridBody` only**; accepts a `date` prop |
| `Calendar.Header` | Flex row wrapper for navigation buttons and heading |

## Props

Accepts all React Aria `Calendar` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Calendar.Root>
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>
      {(date) => <Calendar.Cell date={date} />}
    </Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>
```

> **Note:** Wrap navigation buttons and heading in `Calendar.Header` — it provides the flex layout automatically.

## Examples

### Disabled

```tsx
<Calendar.Root isDisabled>
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>
      {(date) => <Calendar.Cell date={date} />}
    </Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>
```

### Read Only (with default value)

```tsx
import { today, getLocalTimeZone } from '@internationalized/date';

<Calendar.Root defaultValue={today(getLocalTimeZone())} isReadOnly>
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
    </Calendar.GridHeader>
    <Calendar.GridBody>
      {(date) => <Calendar.Cell date={date} />}
    </Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>
```

## CSS Classes

- `.tale-calendar` — Root container
- `.tale-calendar__header` — Navigation header row
- `.tale-calendar__heading` — Month/year heading
- `.tale-calendar__prev-button` — Previous month button
- `.tale-calendar__next-button` — Next month button
- `.tale-calendar__grid` — Table element
- `.tale-calendar__grid-header` — Weekday header row
- `.tale-calendar__grid-header-cell` — Individual weekday label
- `.tale-calendar__grid-body` — Date rows
- `.tale-calendar__cell` — Individual date cell

## Pitfalls

<!-- pitfall: calendar-header-required -->
- **Navigation buttons and heading must be inside `Calendar.Header`** — `Calendar.PreviousButton`, `Calendar.Heading`, and `Calendar.NextButton` must be placed inside `Calendar.Header`. Placing them directly in `Calendar.Root` without the `Header` wrapper loses the flex layout.

<!-- pitfall: calendar-grid-header-cell-not-cell -->
- **Use `Calendar.GridHeaderCell` in `GridHeader`, not `Calendar.Cell`** — `Calendar.GridHeader` passes day name strings (e.g. `"Mon"`) to its render prop. Using `Calendar.Cell` there crashes with `TypeError: can't access property "calendar", date is undefined` because `Cell` expects a `date` prop. Reserve `Calendar.Cell` for `GridBody`.

<!-- pitfall: calendar-heading-no-margin -->
- **`Calendar.Heading` must have no vertical margin or padding** — Do not add `margin-top`, `margin-bottom`, or vertical `padding` to `Calendar.Heading`. It is sized and positioned by `Calendar.Header`'s flex layout.

<!-- cross-pitfall-ref: no-locale-prop-on-calendar -->
<!-- cross-pitfall-ref: no-native-date -->
<!-- cross-pitfall-ref: derive-date-type-from-props -->
<!-- cross-pitfall-ref: no-null-state-without-type -->
<!-- cross-pitfall-ref: no-internationalized-date-import -->

## Notes

- Built on React Aria `Calendar` and related components.
- Uses `@internationalized/date` for date values. Import helpers like `today()` and `getLocalTimeZone()` from that package.
- `GridHeader` and `GridBody` use render props to iterate weekday names and date objects respectively.
- **Use `Calendar.GridHeaderCell` in `GridHeader`, not `Calendar.Cell`.** `GridHeader`'s render prop passes day name strings (e.g. `"Mon"`), not date objects. Using `Calendar.Cell` there crashes with `TypeError: can't access property "calendar", date is undefined` because `Cell` expects a `date` prop. Reserve `Calendar.Cell` for `GridBody` where actual date objects are provided.
- Calendar supports single-date selection only. Use RangeCalendar for selecting date ranges.
