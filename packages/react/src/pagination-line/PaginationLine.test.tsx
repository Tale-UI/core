import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { PaginationLine } from '@tale-ui/react/pagination-line';
import '../styles.css';
import { createRenderer, isJSDOM } from '#test-utils';

describe('<PaginationLine />', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('keeps framed width inside the assigned layout width', async () => {
    await render(
      <div
        data-testid="frame"
        style={{
          padding: '1rem',
          borderRadius: '8px',
          display: 'inline-block',
          width: '240px',
        }}
      >
        <PaginationLine page={2} total={5} framed style={{ width: '100%' }} />
      </div>,
    );

    const frame = screen.getByTestId('frame');
    const nav = screen.getByRole('navigation', { name: 'Slide pagination' });

    expect(nav.getBoundingClientRect().width).to.be.closeTo(240, 1);
  });
});
