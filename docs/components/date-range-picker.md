# DateRangePicker

`import { DateRangePicker } from '@tale-ui/react/date-range-picker';`

A compound date input for selecting a start and end date, with a trigger that opens a range calendar popover.

## Parts

| Part | Description |
|------|-------------|
| `DateRangePicker.Root` | Wrapper that manages date range state |
| `DateRangePicker.Group` | Groups start/end inputs and trigger |
| `DateRangePicker.StartDate` | Date input for the start date |
| `DateRangePicker.EndDate` | Date input for the end date |
| `DateRangePicker.Segment` | Individual editable segment |
| `DateRangePicker.Trigger` | Button that opens the calendar popover |
| `DateRangePicker.Popover` | Popover container |
| `DateRangePicker.Dialog` | Dialog wrapper inside the popover |
| `DateRangePicker.Label` | Accessible label |
| `DateRangePicker.Description` | Helper text |
| `DateRangePicker.ErrorMessage` | Validation error message |

## Basic Usage

```tsx
import { DateRangePicker } from '@tale-ui/react/date-range-picker';
import { RangeCalendar } from '@tale-ui/react/range-calendar';

<DateRangePicker.Root>
  <DateRangePicker.Label>Date range</DateRangePicker.Label>
  <DateRangePicker.Group>
    <DateRangePicker.StartDate>
      {(segment) => <DateRangePicker.Segment segment={segment} />}
    </DateRangePicker.StartDate>
    <span>&ndash;</span>
    <DateRangePicker.EndDate>
      {(segment) => <DateRangePicker.Segment segment={segment} />}
    </DateRangePicker.EndDate>
    <DateRangePicker.Trigger />
  </DateRangePicker.Group>
  <DateRangePicker.Popover>
    <DateRangePicker.Dialog>
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
    </DateRangePicker.Dialog>
  </DateRangePicker.Popover>
</DateRangePicker.Root>
```

## CSS Classes

- `.tale-date-range-picker` — Root
- `.tale-date-range-picker__group` — Input group
- `.tale-date-range-picker__start` — Start date input
- `.tale-date-range-picker__end` — End date input
- `.tale-date-range-picker__segment` — Individual segment
- `.tale-date-range-picker__trigger` — Trigger button
- `.tale-date-range-picker__popover` — Popover
- `.tale-date-range-picker__dialog` — Dialog
- `.tale-date-range-picker__label` — Label
- `.tale-date-range-picker__description` — Description text
- `.tale-date-range-picker__error` — Error message

## Notes

- Requires `RangeCalendar` from `@tale-ui/react/range-calendar` for the popover content.
- `StartDate` and `EndDate` each accept a render function child for segments.
- Supports `isRequired` and `isDisabled` props on the Root.
