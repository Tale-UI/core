import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'vitest';
import { ExternalLink, Home } from 'lucide-react';
import { Icon } from '@tale-ui/react/icon';
import { Link } from '@tale-ui/react/link';
import { createRenderer } from '#test-utils';

describe('<Link />', () => {
  const { render } = createRenderer();

  it('renders an anchor with the tale-link class', async () => {
    await render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.classList.contains('tale-link')).toBe(true);
    expect(link.getAttribute('href')).toBe('/docs');
  });

  it('merges additional className', async () => {
    await render(<Link href="/docs" className="custom-link">Docs</Link>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.classList.contains('tale-link')).toBe(true);
    expect(link.classList.contains('custom-link')).toBe(true);
  });

  it('preserves target and rel attributes', async () => {
    await render(
      <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
        Example
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Example' });
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders a leading icon before the link text', async () => {
    await render(
      <Link
        href="/home"
        iconLeading={<Icon icon={Home} size="sm" data-testid="home-icon" />}
      >
        Home
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    const iconWrapper = link.querySelector('.tale-link__icon');
    expect(iconWrapper).not.toBeNull();
    expect(iconWrapper?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByTestId('home-icon').classList.contains('tale-icon--sm')).toBe(true);
    expect(link.firstElementChild).toBe(iconWrapper);
  });

  it('renders a trailing icon after the link text', async () => {
    await render(
      <Link
        href="https://example.com"
        iconTrailing={<Icon icon={ExternalLink} size="sm" data-testid="external-icon" />}
      >
        Example
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Example' });
    const iconWrapper = link.querySelector('.tale-link__icon');
    expect(iconWrapper).not.toBeNull();
    expect(iconWrapper?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByTestId('external-icon').classList.contains('tale-icon--sm')).toBe(true);
    expect(link.lastElementChild).toBe(iconWrapper);
  });

  it('supports leading and trailing icons together', async () => {
    await render(
      <Link
        href="/home"
        iconLeading={<Icon icon={Home} size="sm" data-testid="leading-icon" />}
        iconTrailing={<Icon icon={ExternalLink} size="sm" data-testid="trailing-icon" />}
      >
        Home
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    const iconWrappers = link.querySelectorAll('.tale-link__icon');
    expect(iconWrappers.length).toBe(2);
    expect(screen.getByTestId('leading-icon')).not.toBeNull();
    expect(screen.getByTestId('trailing-icon')).not.toBeNull();
  });

  it('preserves render-prop children when icons are present', async () => {
    await render(
      <Link href="/status" iconLeading={<Icon icon={Home} size="sm" />}>
        {({ isHovered }) => (isHovered ? 'Hovered' : 'Idle')}
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Idle' })).not.toBeNull();
  });

  it('does not auto-render an external icon for new-tab links', async () => {
    await render(
      <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
        Example
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Example' });
    expect(link.querySelector('.tale-link__icon')).toBeNull();
  });

  it('can be styled with button BEM classes', async () => {
    await render(
      <Link href="/signup" className="tale-button tale-button--primary tale-button--md">
        Sign up
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Sign up' });
    expect(link.classList.contains('tale-link')).toBe(true);
    expect(link.classList.contains('tale-button')).toBe(true);
    expect(link.classList.contains('tale-button--primary')).toBe(true);
    expect(link.classList.contains('tale-button--md')).toBe(true);
  });
});
