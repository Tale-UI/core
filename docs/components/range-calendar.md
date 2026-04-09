# RangeCalendar

`import { RangeCalendar } from '@tale-ui/react/range-calendar';`

A calendar component for selecting a date range with start and end dates.

## Parts

| Part | Description |
|------|-------------|
| `RangeCalendar.Root` | Wrapper that manages range calendar state |
| `RangeCalendar.Header` | Flex row for navigation buttons and heading |
| `RangeCalendar.Grid` | Table-based calendar grid |
| `RangeCalendar.GridHeader` | Header row with day-of-week labels |
| `RangeCalendar.GridHeaderCell` | Individual day-of-week header cell |
| `RangeCalendar.GridBody` | Body containing date cells |
| `RangeCalendar.Cell` | Individual date cell |
| `RangeCalendar.Heading` | Month/year heading |
| `RangeCalendar.PreviousButton` | Navigate to previous month (renders a ChevronLeft icon by default) |
| `RangeCalendar.NextButton` | Navigate to next month (renders a ChevronRight icon by default) |

## Props

Accepts all React Aria `RangeCalendar` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<RangeCalendar.Root>
  <RangeCalendar.Header>
    <RangeCalendar.PreviousButton />
    <RangeCalendar.Heading />
    <RangeCalendar.NextButton />
  </RangeCalendar.Header>
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
- `.tale-range-calendar__header` — Navigation header row
- `.tale-range-calendar__grid` — Calendar grid table
- `.tale-range-calendar__grid-header` — Grid header section
- `.tale-range-calendar__header-cell` — Day-of-week header cell
- `.tale-range-calendar__grid-body` — Grid body section
- `.tale-range-calendar__cell` — Date cell
- `.tale-range-calendar__heading` — Month/year heading
- `.tale-range-calendar__prev-button` — Previous month button
- `.tale-range-calendar__next-button` — Next month button

## Pitfalls

<!-- pitfall: range-calendar-no-footer -->
- **No `Footer` sub-part** — `RangeCalendar` has no `Footer` sub-part. To display the selected range below the calendar, place a `<Text>` component outside `RangeCalendar.Root` and update it from `onChange`.
  - anti-pattern: `<RangeCalendar.Root><RangeCalendar.Footer>{range}</RangeCalendar.Footer></RangeCalendar.Root>`
  - fix: `<RangeCalendar.Root onChange={setRange} />{range && <Text>{range.start} – {range.end}</Text>}`
  - complete example:
    ```tsx
    import { RangeCalendar } from '@tale-ui/react/range-calendar';
    
    export function Example() {
      return (
        <RangeCalendar.Root>
          <RangeCalendar.Header>
            <RangeCalendar.PreviousButton />
            <RangeCalendar.Heading />
            <RangeCalendar.NextButton />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => <RangeCalendar.Cell date={date} />}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
        </RangeCalendar.Root>
      );
    }
    ```

<!-- pitfall: range-calendar-unavailable-prop -->
- **Use `isDateUnavailable` to disable dates, not `isOutsideRange`** — The correct prop for disabling specific dates is `isDateUnavailable` (a function that returns `true` for dates to disable). There is no `isOutsideRange` prop.
  - anti-pattern: `<RangeCalendar.Root isOutsideRange={(date) => date.day === 1} />`
  - fix: `<RangeCalendar.Root isDateUnavailable={(date) => date.day === 1} />`

<!-- cross-pitfall-ref: no-locale-prop-on-calendar -->
<!-- cross-pitfall-ref: no-native-date -->
<!-- cross-pitfall-ref: derive-date-type-from-props -->
<!-- cross-pitfall-ref: no-null-state-without-type -->
<!-- cross-pitfall-ref: no-internationalized-date-import -->

## Notes

- `PreviousButton` defaults to a left-pointing arrow; `NextButton` defaults to a right-pointing arrow. Pass children to customize.
- Supports `isDisabled` and `isReadOnly` props on the Root.
- Often used inside `DateRangePicker.Dialog` for range picker popover content.
- Use `isDisabled` on Root to disable the entire calendar and prevent date selection.
- **CSS class naming note:** The header cell class is `.tale-range-calendar__header-cell` (not `__grid-header-cell` like Calendar). This naming difference is intentional — keep it in mind when writing custom CSS overrides.
