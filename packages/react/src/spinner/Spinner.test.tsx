import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { Spinner } from '@tale-ui/react/spinner';
import { createRenderer } from '#test-utils';

describe('<Spinner />', () => {
  const { render } = createRenderer();

  it('renders with role="status" and default aria-label', async () => {
    await render(<Spinner />);
    const el = screen.getByRole('status');
    expect(el).to.have.attribute('aria-label', 'Loading');
  });

  it('applies the tale-spinner class', async () => {
    await render(<Spinner />);
    expect(screen.getByRole('status')).to.have.class('tale-spinner');
  });

  it('merges additional className', async () => {
    await render(<Spinner className="custom" />);
    const el = screen.getByRole('status');
    expect(el).to.have.class('tale-spinner');
    expect(el).to.have.class('custom');
  });

  describe('prop: label', () => {
    it('sets a custom aria-label', async () => {
      await render(<Spinner label="Saving…" />);
      expect(screen.getByRole('status')).to.have.attribute('aria-label', 'Saving…');
    });
  });

  describe('prop: variant', () => {
    it('circle (default) — no variant modifier', async () => {
      await render(<Spinner />);
      expect(screen.getByRole('status')).not.to.have.class('tale-spinner--circle');
    });

    it('line', async () => {
      await render(<Spinner variant="line" />);
      expect(screen.getByRole('status')).to.have.class('tale-spinner--line');
    });

    it('dots', async () => {
      await render(<Spinner variant="dots" />);
      expect(screen.getByRole('status')).to.have.class('tale-spinner--dots');
    });
  });

  describe('prop: size', () => {
    it('md (default) — no size modifier', async () => {
      await render(<Spinner />);
      expect(screen.getByRole('status')).not.to.have.class('tale-spinner--md');
    });

    it('sm', async () => {
      await render(<Spinner size="sm" />);
      expect(screen.getByRole('status')).to.have.class('tale-spinner--sm');
    });

    it('lg', async () => {
      await render(<Spinner size="lg" />);
      expect(screen.getByRole('status')).to.have.class('tale-spinner--lg');
    });
  });
});
