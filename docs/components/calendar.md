# Calendar

`import { Calendar } from '@tale-ui/react/calendar';`

A date picker calendar for selecting a single date, with month navigation.

## Parts

| Part | Description |
|------|-------------|
| `Calendar.Root` | Wrapper managing date state and locale |
| `Calendar.PreviousButton` | Navigate to the previous month (renders `‹` by default) |
| `Calendar.NextButton` | Navigate to the next month (renders `›` by default) |
| `Calendar.Heading` | Displays the current month and year |
| `Calendar.Grid` | `<table>` containing the header and body |
| `Calendar.GridHeader` | `<thead>` row of weekday names (render prop: `(day) => ...`) |
| `Calendar.GridHeaderCell` | `<th>` weekday label |
| `Calendar.GridBody` | `<tbody>` rows of date cells (render prop: `(date) => ...`) |
| `Calendar.Cell` | Individual date cell; accepts a `date` prop |

## Basic Usage

```tsx
<Calendar.Root>
  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </header>
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

## Examples

### Disabled

```tsx
<Calendar.Root isDisabled>
  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </header>
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
  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </header>
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
- `.tale-calendar__heading` — Month/year heading
- `.tale-calendar__prev-button` — Previous month button
- `.tale-calendar__next-button` — Next month button
- `.tale-calendar__grid` — Table element
- `.tale-calendar__grid-header` — Weekday header row
- `.tale-calendar__grid-header-cell` — Individual weekday label
- `.tale-calendar__grid-body` — Date rows
- `.tale-calendar__cell` — Individual date cell

## Notes

- Built on React Aria `Calendar` and related components.
- Uses `@internationalized/date` for date values. Import helpers like `today()` and `getLocalTimeZone()` from that package.
- `GridHeader` and `GridBody` use render props to iterate weekday names and date objects respectively.
- Calendar supports single-date selection only. Use RangeCalendar for selecting date ranges.
