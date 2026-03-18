# DatePicker

`import { DatePicker } from '@tale-ui/react/date-picker';`

A date input with a trigger button that opens a popover calendar for date selection.

## Parts

| Part | Description |
|------|-------------|
| `DatePicker.Root` | Wrapper that manages date picker state |
| `DatePicker.Group` | Groups the date input and trigger button |
| `DatePicker.DateInput` | Container for date segments; accepts a render function |
| `DatePicker.Segment` | Individual editable segment (month, day, year) |
| `DatePicker.Trigger` | Button that opens the calendar popover (defaults to a down-pointing triangle) |
| `DatePicker.Popover` | Popover container for the calendar |
| `DatePicker.Dialog` | Dialog wrapper inside the popover |
| `DatePicker.Label` | Accessible label |
| `DatePicker.Description` | Helper text |
| `DatePicker.ErrorMessage` | Validation error message |

## Basic Usage

```tsx
import { DatePicker } from '@tale-ui/react/date-picker';
import { Calendar } from '@tale-ui/react/calendar';

<DatePicker.Root>
  <DatePicker.Group>
    <DatePicker.DateInput>
      {(segment) => <DatePicker.Segment segment={segment} />}
    </DatePicker.DateInput>
    <DatePicker.Trigger />
  </DatePicker.Group>
  <DatePicker.Popover>
    <DatePicker.Dialog>
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
    </DatePicker.Dialog>
  </DatePicker.Popover>
</DatePicker.Root>
```

## Examples

### With Label

```tsx
<DatePicker.Root>
  <DatePicker.Label>Date</DatePicker.Label>
  <DatePicker.Group>
    <DatePicker.DateInput>
      {(segment) => <DatePicker.Segment segment={segment} />}
    </DatePicker.DateInput>
    <DatePicker.Trigger />
  </DatePicker.Group>
  <DatePicker.Popover>
    <DatePicker.Dialog>
      {/* Calendar content same as above */}
    </DatePicker.Dialog>
  </DatePicker.Popover>
</DatePicker.Root>
```

## CSS Classes

- `.tale-date-picker` — Root
- `.tale-date-picker__group` — Input + trigger group
- `.tale-date-picker__input` — DateInput container
- `.tale-date-picker__segment` — Individual segment
- `.tale-date-picker__trigger` — Trigger button
- `.tale-date-picker__popover` — Popover
- `.tale-date-picker__dialog` — Dialog inside popover
- `.tale-date-picker__label` — Label
- `.tale-date-picker__description` — Description text
- `.tale-date-picker__error` — Error message

## Notes

- Requires `Calendar` from `@tale-ui/react/calendar` for the popover content.
- The `Trigger` renders a down-pointing triangle by default; pass children to customize.
- Supports `isRequired` and `isDisabled` props on the Root.
- The popover renders a Calendar component — import both `DatePicker` and `Calendar` parts.
