import { CalendarDate } from '@internationalized/date';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'vitest';
import { Calendar } from '@tale-ui/react/calendar';
import '../styles.css';
import { createRenderer, isJSDOM } from '#test-utils';

describe('<Calendar />', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('keeps month nav buttons styled by the calendar BEM classes', async () => {
    await render(
      <Calendar.Root aria-label="Choose a date" defaultValue={new CalendarDate(2026, 4, 15)}>
        <Calendar.Header>
          <Calendar.PreviousButton data-testid="prev" />
          <Calendar.Heading />
          <Calendar.NextButton data-testid="next" />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
        </Calendar.Grid>
      </Calendar.Root>,
    );

    const prev = screen.getByTestId('prev');
    const next = screen.getByTestId('next');
    // CalendarHeading (RAC 1.18) auto-formats the visible month with no children
    expect(screen.getByRole('heading').textContent).toContain('April 2026');
    const prevStyles = getComputedStyle(prev);
    const nextStyles = getComputedStyle(next);

    expect(prev.classList.contains('tale-calendar__prev-button')).toBe(true);
    expect(next.classList.contains('tale-calendar__next-button')).toBe(true);
    expect(prevStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(nextStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(prevStyles.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(nextStyles.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(prevStyles.paddingTop).toBe('0px');
    expect(nextStyles.paddingTop).toBe('0px');
  });

  it.skipIf(isJSDOM)('renders month and year picker defaults with calendar token styles', async () => {
    await render(
      <Calendar.Root aria-label="Choose a date" defaultValue={new CalendarDate(2025, 8, 15)}>
        <Calendar.Header>
          <Calendar.PreviousButton data-testid="prev" />
          <Calendar.MonthPicker format="short" />
          <Calendar.YearPicker visibleYears={8} />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
        </Calendar.Grid>
      </Calendar.Root>,
    );

    const prevStyles = getComputedStyle(screen.getByTestId('prev'));
    const [monthPicker, yearPicker] = screen.getAllByRole('combobox');
    const yearSelect = yearPicker as HTMLSelectElement;

    expect(monthPicker.classList.contains('tale-calendar__month-picker')).toBe(true);
    expect(yearPicker.classList.contains('tale-calendar__year-picker')).toBe(true);
    expect((monthPicker as HTMLSelectElement).value).toBe('8');
    expect(yearSelect.selectedOptions[0]?.textContent).toBe('2025');

    for (const picker of [monthPicker, yearPicker]) {
      const pickerStyles = getComputedStyle(picker);
      expect(pickerStyles.backgroundColor).toBe(prevStyles.backgroundColor);
      expect(pickerStyles.borderTopColor).toBe(prevStyles.borderTopColor);
      expect(pickerStyles.color).toBe(prevStyles.color);
      expect(pickerStyles.height).toBe(prevStyles.height);
      expect(pickerStyles.paddingTop).toBe('0px');
    }
  });
});
