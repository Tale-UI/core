import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';
import { createRenderer } from '#test-utils';

// jsdom lacks ResizeObserver and matchMedia — provide stubs
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof globalThis.ResizeObserver;
  }
  if (typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }
});

describe('<ColorModeToggle />', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
    // Ensure matchMedia is available (jsdom may reset between tests)
    if (typeof window.matchMedia !== 'function') {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    }
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
  });

  it('renders a switch with tale-color-mode-toggle class', async () => {
    await render(<ColorModeToggle data-testid="toggle" />);
    // React Aria Switch renders <label> with the class, wrapping an <input role="switch">
    const label = screen.getByTestId('toggle');
    expect(label).to.have.class('tale-color-mode-toggle');
    expect(screen.getByRole('switch')).to.exist;
  });

  it('has an accessible label', async () => {
    await render(<ColorModeToggle defaultMode="light" />);
    expect(screen.getByRole('switch')).to.have.attribute('aria-label', 'Toggle dark mode');
  });

  it('merges additional className', async () => {
    await render(<ColorModeToggle defaultMode="light" className="custom" data-testid="toggle" />);
    const label = screen.getByTestId('toggle');
    expect(label).to.have.class('tale-color-mode-toggle');
    expect(label).to.have.class('custom');
  });

  describe('initial mode', () => {
    it('reads from localStorage', async () => {
      localStorage.setItem('color-mode', 'dark');
      await render(<ColorModeToggle />);
      expect(document.documentElement.getAttribute('data-color-mode')).to.equal('dark');
    });

    it('uses defaultMode when no localStorage value', async () => {
      await render(<ColorModeToggle defaultMode="dark" />);
      expect(document.documentElement.getAttribute('data-color-mode')).to.equal('dark');
    });

    it('falls back to OS preference via matchMedia', async () => {
      const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
      } as MediaQueryList);
      await render(<ColorModeToggle />);
      expect(document.documentElement.getAttribute('data-color-mode')).to.equal('dark');
      matchMediaSpy.mockRestore();
    });

    it('defaults to light when OS prefers light', async () => {
      const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: false,
      } as MediaQueryList);
      await render(<ColorModeToggle />);
      expect(document.documentElement.getAttribute('data-color-mode')).to.equal('light');
      matchMediaSpy.mockRestore();
    });
  });

  describe('toggling', () => {
    it('sets data-color-mode on documentElement', async () => {
      await render(<ColorModeToggle defaultMode="light" />);
      expect(document.documentElement.getAttribute('data-color-mode')).to.equal('light');
    });

    it('persists to localStorage', async () => {
      await render(<ColorModeToggle defaultMode="light" />);
      expect(localStorage.getItem('color-mode')).to.equal('light');
    });

    it('toggles from light to dark on click', async () => {
      const { user } = await render(<ColorModeToggle defaultMode="light" />);
      await user.click(screen.getByRole('switch'));
      expect(document.documentElement.getAttribute('data-color-mode')).to.equal('dark');
      expect(localStorage.getItem('color-mode')).to.equal('dark');
    });
  });

  describe('custom storageKey', () => {
    it('reads from custom key', async () => {
      localStorage.setItem('theme', 'dark');
      await render(<ColorModeToggle storageKey="theme" />);
      expect(document.documentElement.getAttribute('data-color-mode')).to.equal('dark');
    });

    it('persists to custom key', async () => {
      await render(<ColorModeToggle storageKey="theme" defaultMode="light" />);
      expect(localStorage.getItem('theme')).to.equal('light');
    });
  });
});
