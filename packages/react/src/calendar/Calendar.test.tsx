import { CalendarDate } from '@internationalized/date';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
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
    expect(screen.getByRole('heading')).to.contain.text('April 2026');
    const prevStyles = getComputedStyle(prev);
    const nextStyles = getComputedStyle(next);

    expect(prev).to.have.class('tale-calendar__prev-button');
    expect(next).to.have.class('tale-calendar__next-button');
    expect(prevStyles.backgroundColor).not.to.equal('rgba(0, 0, 0, 0)');
    expect(nextStyles.backgroundColor).not.to.equal('rgba(0, 0, 0, 0)');
    expect(prevStyles.borderTopColor).not.to.equal('rgba(0, 0, 0, 0)');
    expect(nextStyles.borderTopColor).not.to.equal('rgba(0, 0, 0, 0)');
    expect(prevStyles.paddingTop).to.equal('0px');
    expect(nextStyles.paddingTop).to.equal('0px');
  });
});
