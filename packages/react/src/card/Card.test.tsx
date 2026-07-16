import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect, vi } from 'vitest';
import { Card } from '@tale-ui/react/card';
import { createRenderer } from '#test-utils';

describe('<Card />', () => {
  const { render } = createRenderer();

  it('keeps Card.Root presentational', async () => {
    await render(<Card.Root data-testid="card">Content</Card.Root>);
    const card = screen.getByTestId('card');

    expect(card.tagName).toBe('DIV');
    expect(card.classList.contains('tale-card')).toBe(true);
    expect(card.classList.contains('tale-card--outlined')).toBe(true);
    expect(card.classList.contains('tale-card--md')).toBe(true);
  });

  it('renders Card.Button as a native button with React Aria defaults', async () => {
    await render(<Card.Button>Choose Harbour</Card.Button>);
    const button = screen.getByRole('button', { name: 'Choose Harbour' });

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.classList.contains('tale-card')).toBe(true);
    expect(button.classList.contains('tale-card--button')).toBe(true);
    expect(button.classList.contains('tale-card--outlined')).toBe(true);
    expect(button.classList.contains('tale-card--md')).toBe(true);
  });

  it('applies Card.Button variant, padding, and custom classes', async () => {
    await render(
      <Card.Button variant="filled" padding="sm" className="theme-card">
        Choose Fern
      </Card.Button>,
    );
    const button = screen.getByRole('button', { name: 'Choose Fern' });

    expect(button.classList.contains('tale-card--filled')).toBe(true);
    expect(button.classList.contains('tale-card--sm')).toBe(true);
    expect(button.classList.contains('theme-card')).toBe(true);
  });

  it('supports pointer and keyboard activation through onPress', async () => {
    const onPress = vi.fn();
    const { user } = await render(<Card.Button onPress={onPress}>Apply theme</Card.Button>);
    const button = screen.getByRole('button', { name: 'Apply theme' });

    await user.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);

    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('exposes a controlled selected state with aria-pressed', async () => {
    await render(<Card.Button isSelected>Harbour theme</Card.Button>);
    const button = screen.getByRole('button', { name: 'Harbour theme' });

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.hasAttribute('data-selected')).toBe(true);
  });

  it('exposes an unselected toggle state without selected styling', async () => {
    await render(<Card.Button isSelected={false}>Harbour theme</Card.Button>);
    const button = screen.getByRole('button', { name: 'Harbour theme' });

    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.hasAttribute('data-selected')).toBe(false);
  });

  it('does not expose toggle semantics when isSelected is omitted', async () => {
    await render(<Card.Button>Open project</Card.Button>);
    expect(screen.getByRole('button', { name: 'Open project' }).hasAttribute('aria-pressed')).toBe(
      false,
    );
  });

  it('prevents activation and exposes disabled state when isDisabled', async () => {
    const onPress = vi.fn();
    const { user } = await render(
      <Card.Button isDisabled onPress={onPress}>
        Unavailable theme
      </Card.Button>,
    );
    const button = screen.getByRole('button', { name: 'Unavailable theme', hidden: true });

    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.hasAttribute('data-disabled')).toBe(true);
    await user.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('keeps pending cards focusable while suppressing activation', async () => {
    const onPress = vi.fn();
    const { user } = await render(
      <Card.Button isPending onPress={onPress}>
        Applying theme
      </Card.Button>,
    );
    const button = screen.getByRole('button', { name: 'Applying theme' });

    expect(button.hasAttribute('data-pending')).toBe(true);
    expect(button.hasAttribute('disabled')).toBe(false);
    await user.tab();
    expect(document.activeElement).toBe(button);
    await user.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
