# RangeCalendar

`import { RangeCalendar } from '@tale-ui/react/range-calendar';`

A calendar component for selecting a date range with start and end dates.

## Parts

| Part | Description |
|------|-------------|
| `RangeCalendar.Root` | Wrapper that manages range calendar state |
| `RangeCalendar.Grid` | Table-based calendar grid |
| `RangeCalendar.GridHeader` | Header row with day-of-week labels |
| `RangeCalendar.GridHeaderCell` | Individual day-of-week header cell |
| `RangeCalendar.GridBody` | Body containing date cells |
| `RangeCalendar.Cell` | Individual date cell |
| `RangeCalendar.Heading` | Month/year heading |
| `RangeCalendar.PreviousButton` | Navigate to previous month |
| `RangeCalendar.NextButton` | Navigate to next month |

## Basic Usage

```tsx
<RangeCalendar.Root>
  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <RangeCalendar.PreviousButton />
    <RangeCalendar.Heading />
    <RangeCalendar.NextButton />
  </header>
  <RangeCalendar.Grid>
    <RangeCalendar.GridHeader>
      {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
    </RangeCalendar.GridHeader>
    <RangeCalendar.GridBody>
      {(date) => <RangeCalendar.Cell date={date} />}
    </RangeCalendar.GridBody>
  </RangeCalendar.Grid>
</RangeCalendar.Root>
```

## CSS Classes

- `.tale-range-calendar` — Root
- `.tale-range-calendar__grid` — Calendar grid table
- `.tale-range-calendar__grid-header` — Grid header section
- `.tale-range-calendar__header-cell` — Day-of-week header cell
- `.tale-range-calendar__grid-body` — Grid body section
- `.tale-range-calendar__cell` — Date cell
- `.tale-range-calendar__heading` — Month/year heading
- `.tale-range-calendar__prev-button` — Previous month button
- `.tale-range-calendar__next-button` — Next month button

## Notes

- `PreviousButton` defaults to a left-pointing arrow; `NextButton` defaults to a right-pointing arrow. Pass children to customize.
- Supports `isDisabled` and `isReadOnly` props on the Root.
- Often used inside `DateRangePicker.Dialog` for range picker popover content.
- Use `isDisabled` on Root to disable the entire calendar and prevent date selection.
