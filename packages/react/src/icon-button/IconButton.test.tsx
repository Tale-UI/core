import { expect } from 'chai';
import { spy } from 'sinon';
import { IconButton } from '@tale-ui/react/icon-button';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';

describe('<IconButton />', () => {
  const { render } = createRenderer();

  it('renders a native button element', async () => {
    await render(<IconButton aria-label="Test">X</IconButton>);
    expect(screen.getByRole('button')).to.exist;
  });

  it('applies tale-icon-button and tale-button BEM classes', async () => {
    await render(<IconButton aria-label="Test">X</IconButton>);
    const button = screen.getByRole('button');
    expect(button).to.have.class('tale-icon-button');
    expect(button).to.have.class('tale-button');
  });

  it('applies default variant (ghost) and size (md) classes', async () => {
    await render(<IconButton aria-label="Test">X</IconButton>);
    const button = screen.getByRole('button');
    expect(button).to.have.class('tale-button--ghost');
    expect(button).to.have.class('tale-icon-button--md');
  });

  it('applies variant and size BEM classes', async () => {
    await render(<IconButton variant="primary" size="sm" aria-label="Test">X</IconButton>);
    const button = screen.getByRole('button');
    expect(button).to.have.class('tale-button--primary');
    expect(button).to.have.class('tale-icon-button--sm');
  });

  it('merges additional className', async () => {
    await render(<IconButton className="custom" aria-label="Test">X</IconButton>);
    const button = screen.getByRole('button');
    expect(button).to.have.class('tale-icon-button');
    expect(button).to.have.class('custom');
  });

  it('sets disabled attribute when isDisabled', async () => {
    await render(<IconButton isDisabled aria-label="Test">X</IconButton>);
    const button = screen.getByRole('button', { hidden: true });
    expect(button).to.have.attribute('disabled');
  });

  it('sets disabled attribute when disabled alias is used', async () => {
    await render(<IconButton disabled aria-label="Test">X</IconButton>);
    const button = screen.getByRole('button', { hidden: true });
    expect(button).to.have.attribute('disabled');
  });

  it('does not fire onPress when disabled', async () => {
    const handlePress = spy();
    const { user } = await render(<IconButton isDisabled onPress={handlePress} aria-label="Test">X</IconButton>);
    const button = screen.getByRole('button', { hidden: true });
    await user.click(button);
    expect(handlePress.callCount).to.equal(0);
  });

  it('forwards ref', async () => {
    let ref: HTMLButtonElement | null = null;
    await render(<IconButton ref={(el) => { ref = el; }} aria-label="Test">X</IconButton>);
    expect(ref).to.be.instanceOf(HTMLButtonElement);
  });
});
