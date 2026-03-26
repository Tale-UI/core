import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { EmptyState } from '@tale-ui/react/empty-state';
import { createRenderer } from '#test-utils';

describe('<EmptyState />', () => {
  const { render } = createRenderer();

  it('renders with the tale-empty-state class', async () => {
    await render(<EmptyState.Root data-testid="root">Content</EmptyState.Root>);
    expect(screen.getByTestId('root')).to.have.class('tale-empty-state');
  });

  it('merges additional className on Root', async () => {
    await render(<EmptyState.Root data-testid="root" className="custom">Content</EmptyState.Root>);
    const el = screen.getByTestId('root');
    expect(el).to.have.class('tale-empty-state');
    expect(el).to.have.class('custom');
  });

  describe('prop: size', () => {
    it('md (default) — no size modifier', async () => {
      await render(<EmptyState.Root data-testid="root">Content</EmptyState.Root>);
      expect(screen.getByTestId('root')).not.to.have.class('tale-empty-state--sm');
      expect(screen.getByTestId('root')).not.to.have.class('tale-empty-state--lg');
    });

    it('sm', async () => {
      await render(<EmptyState.Root data-testid="root" size="sm">Content</EmptyState.Root>);
      expect(screen.getByTestId('root')).to.have.class('tale-empty-state--sm');
    });

    it('lg', async () => {
      await render(<EmptyState.Root data-testid="root" size="lg">Content</EmptyState.Root>);
      expect(screen.getByTestId('root')).to.have.class('tale-empty-state--lg');
    });
  });

  describe('sub-parts', () => {
    it('Icon applies the correct class', async () => {
      await render(
        <EmptyState.Root>
          <EmptyState.Icon data-testid="icon">🔍</EmptyState.Icon>
        </EmptyState.Root>,
      );
      expect(screen.getByTestId('icon')).to.have.class('tale-empty-state__icon');
    });

    it('Title renders an h3 with the correct class', async () => {
      await render(
        <EmptyState.Root>
          <EmptyState.Title>No results</EmptyState.Title>
        </EmptyState.Root>,
      );
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).to.have.class('tale-empty-state__title');
      expect(heading).to.have.text('No results');
    });

    it('Description applies the correct class', async () => {
      await render(
        <EmptyState.Root>
          <EmptyState.Description data-testid="desc">Try again</EmptyState.Description>
        </EmptyState.Root>,
      );
      expect(screen.getByTestId('desc')).to.have.class('tale-empty-state__description');
    });

    it('Actions applies the correct class', async () => {
      await render(
        <EmptyState.Root>
          <EmptyState.Actions data-testid="actions">
            <button type="button">Retry</button>
          </EmptyState.Actions>
        </EmptyState.Root>,
      );
      expect(screen.getByTestId('actions')).to.have.class('tale-empty-state__actions');
    });
  });
});
