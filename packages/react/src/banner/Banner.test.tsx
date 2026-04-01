import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { Banner } from '@tale-ui/react/banner';
import { createRenderer } from '#test-utils';

describe('<Banner />', () => {
  const { render } = createRenderer();

  it('renders with role="status" and the tale-banner class', async () => {
    await render(<Banner.Root>Content</Banner.Root>);
    const el = screen.getByRole('status');
    expect(el).to.have.class('tale-banner');
  });

  it('merges additional className on Root', async () => {
    await render(<Banner.Root className="custom">Content</Banner.Root>);
    const el = screen.getByRole('status');
    expect(el).to.have.class('tale-banner');
    expect(el).to.have.class('custom');
  });

  describe('prop: variant', () => {
    it('info (default) — uses BEM modifier', async () => {
      await render(<Banner.Root>Info</Banner.Root>);
      expect(screen.getByRole('status')).to.have.class('tale-banner--info');
    });

    it('success', async () => {
      await render(<Banner.Root variant="success">Success</Banner.Root>);
      expect(screen.getByRole('status')).to.have.class('color-success');
    });

    it('warning', async () => {
      await render(<Banner.Root variant="warning">Warning</Banner.Root>);
      expect(screen.getByRole('status')).to.have.class('color-warning');
    });

    it('error', async () => {
      await render(<Banner.Root variant="error">Error</Banner.Root>);
      expect(screen.getByRole('status')).to.have.class('color-error');
    });
  });

  describe('prop: size', () => {
    it('md (default) — no size modifier', async () => {
      await render(<Banner.Root>Content</Banner.Root>);
      expect(screen.getByRole('status')).not.to.have.class('tale-banner--sm');
    });

    it('sm', async () => {
      await render(<Banner.Root size="sm">Content</Banner.Root>);
      expect(screen.getByRole('status')).to.have.class('tale-banner--sm');
    });
  });

  describe('sub-parts', () => {
    it('Icon applies the correct class', async () => {
      await render(
        <Banner.Root>
          <Banner.Icon data-testid="icon">!</Banner.Icon>
        </Banner.Root>,
      );
      expect(screen.getByTestId('icon')).to.have.class('tale-banner__icon');
    });

    it('Title applies the correct class', async () => {
      await render(
        <Banner.Root>
          <Banner.Title data-testid="title">Heads up</Banner.Title>
        </Banner.Root>,
      );
      expect(screen.getByTestId('title')).to.have.class('tale-banner__title');
    });

    it('Description applies the correct class', async () => {
      await render(
        <Banner.Root>
          <Banner.Description data-testid="desc">Details here</Banner.Description>
        </Banner.Root>,
      );
      expect(screen.getByTestId('desc')).to.have.class('tale-banner__description');
    });

    it('Actions applies the correct class', async () => {
      await render(
        <Banner.Root>
          <Banner.Actions data-testid="actions">
            <button type="button">OK</button>
          </Banner.Actions>
        </Banner.Root>,
      );
      expect(screen.getByTestId('actions')).to.have.class('tale-banner__actions');
    });

    it('Close renders a button with the correct class', async () => {
      await render(
        <Banner.Root>
          <Banner.Close aria-label="Dismiss" />
        </Banner.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Dismiss' });
      expect(btn).to.have.class('tale-banner__close');
    });
  });
});
