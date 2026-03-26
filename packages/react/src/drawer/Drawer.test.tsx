import { expect } from 'chai';
import { createRenderer, screen, waitFor } from '@tale-ui/monorepo-tests/test-utils';
import { Drawer } from '@tale-ui/react/drawer';

describe('<Drawer />', () => {
  const { render } = createRenderer();

  it('opens the popup when the trigger is pressed', async () => {
    const { user } = await render(
      <Drawer.Root>
        <Drawer.Trigger>Open Drawer</Drawer.Trigger>
        <Drawer.Popup>
          <p>Drawer content goes here.</p>
        </Drawer.Popup>
      </Drawer.Root>,
    );

    expect(screen.queryByRole('dialog')).to.equal(null);

    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));

    expect(screen.getByRole('dialog')).to.have.class('tale-drawer__popup');
  });

  it('keeps the popup mounted until the close animation finishes', async () => {
    // Temporarily enable animations so the getAnimations mock is consulted
    // (setupVitest.ts sets TALE_UI_ANIMATIONS_DISABLED = true globally).
    globalThis.TALE_UI_ANIMATIONS_DISABLED = false;

    let resolveAnimation: (() => void) | undefined;
    const finished = new Promise<void>((resolve) => {
      resolveAnimation = resolve;
    });

    const { user } = await render(
      <Drawer.Root defaultOpen>
        <Drawer.Backdrop />
        <Drawer.Popup>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Popup>
      </Drawer.Root>,
    );

    const popup = screen.getByRole('dialog');

    (popup as any).getAnimations = () => [
      { finished, pending: true, playState: 'running' },
    ];

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByRole('dialog')).to.have.attribute('data-ending-style');

    resolveAnimation?.();

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).to.equal(null);
    });

    globalThis.TALE_UI_ANIMATIONS_DISABLED = true;
  });
});