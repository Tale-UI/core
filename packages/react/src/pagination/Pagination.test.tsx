import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { Pagination } from '@tale-ui/react/pagination';
import { createRenderer } from '#test-utils';

describe('<Pagination />', () => {
  const { render } = createRenderer();

  it('renders a nav element with the tale-pagination class', async () => {
    await render(
      <Pagination.Root aria-label="Pagination">
        <Pagination.Item page={1} />
      </Pagination.Root>,
    );
    expect(screen.getByRole('navigation')).to.have.class('tale-pagination');
  });

  it('merges additional className on Root', async () => {
    await render(
      <Pagination.Root aria-label="Pagination" className="custom">
        <Pagination.Item page={1} />
      </Pagination.Root>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).to.have.class('tale-pagination');
    expect(nav).to.have.class('custom');
  });

  describe('Item', () => {
    it('renders a button with the page number', async () => {
      await render(
        <Pagination.Root aria-label="Pagination">
          <Pagination.Item page={3} />
        </Pagination.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Page 3' });
      expect(btn).to.have.class('tale-pagination__item');
      expect(btn).to.have.text('3');
    });

    it('applies --current modifier when current', async () => {
      await render(
        <Pagination.Root aria-label="Pagination">
          <Pagination.Item page={2} current />
        </Pagination.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Page 2' });
      expect(btn).to.have.class('tale-pagination__item--current');
      expect(btn).to.have.attribute('aria-current', 'page');
    });

    it('does not apply --current modifier by default', async () => {
      await render(
        <Pagination.Root aria-label="Pagination">
          <Pagination.Item page={1} />
        </Pagination.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Page 1' });
      expect(btn).not.to.have.class('tale-pagination__item--current');
      expect(btn).not.to.have.attribute('aria-current');
    });

    it('merges additional className', async () => {
      await render(
        <Pagination.Root aria-label="Pagination">
          <Pagination.Item page={1} className="custom" />
        </Pagination.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Page 1' });
      expect(btn).to.have.class('tale-pagination__item');
      expect(btn).to.have.class('custom');
    });
  });

  describe('PreviousTrigger', () => {
    it('renders with the correct class and aria-label', async () => {
      await render(
        <Pagination.Root aria-label="Pagination">
          <Pagination.PreviousTrigger />
        </Pagination.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Previous page' });
      expect(btn).to.have.class('tale-pagination__previous');
    });

    it('can be disabled', async () => {
      await render(
        <Pagination.Root aria-label="Pagination">
          <Pagination.PreviousTrigger disabled />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Previous page' })).to.have.attribute('disabled');
    });
  });

  describe('NextTrigger', () => {
    it('renders with the correct class and aria-label', async () => {
      await render(
        <Pagination.Root aria-label="Pagination">
          <Pagination.NextTrigger />
        </Pagination.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Next page' });
      expect(btn).to.have.class('tale-pagination__next');
    });
  });

  describe('Ellipsis', () => {
    it('renders with the correct class and is hidden from accessibility', async () => {
      await render(
        <Pagination.Root aria-label="Pagination">
          <Pagination.Ellipsis data-testid="ellipsis" />
        </Pagination.Root>,
      );
      const el = screen.getByTestId('ellipsis');
      expect(el).to.have.class('tale-pagination__ellipsis');
      expect(el).to.have.attribute('aria-hidden', 'true');
    });
  });
});
