import { expect } from 'chai';
import { spy } from 'sinon';
import { Button } from '@tale-ui/react/button';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';

describe('<Button />', () => {
  const { render } = createRenderer();

  it('renders a native button element', async () => {
    await render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).to.exist;
  });

  it('applies BEM class names from variant and size props', async () => {
    await render(<Button variant="neutral" size="sm">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).to.have.class('tale-button');
    expect(button).to.have.class('tale-button--neutral');
    expect(button).to.have.class('tale-button--sm');
  });

  it('applies default variant and size BEM classes', async () => {
    await render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).to.have.class('tale-button');
    expect(button).to.have.class('tale-button--primary');
    expect(button).to.have.class('tale-button--md');
  });

  it('merges additional className', async () => {
    await render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).to.have.class('tale-button');
    expect(button).to.have.class('custom-class');
  });

  describe('isDisabled', () => {
    it('sets disabled attribute and data-disabled when isDisabled', async () => {
      await render(<Button isDisabled>Click me</Button>);
      const button = screen.getByRole('button', { hidden: true });
      expect(button).to.have.attribute('disabled');
      expect(button).to.have.attribute('data-disabled');
    });

    it('sets disabled attribute and data-disabled when disabled alias prop is used', async () => {
      await render(<Button disabled>Click me</Button>);
      const button = screen.getByRole('button', { hidden: true });
      expect(button).to.have.attribute('disabled');
      expect(button).to.have.attribute('data-disabled');
    });

    it('does not fire onPress when disabled', async () => {
      const handlePress = spy();
      const { user } = await render(<Button isDisabled onPress={handlePress}>Click me</Button>);
      const button = screen.getByRole('button', { hidden: true });
      await user.click(button);
      expect(handlePress.callCount).to.equal(0);
    });
  });

  describe('isPending', () => {
    it('sets data-pending attribute when isPending', async () => {
      await render(<Button isPending>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).to.have.attribute('data-pending');
    });

    it('sets data-pending attribute when pending alias is used', async () => {
      await render(<Button pending>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).to.have.attribute('data-pending');
    });

    it('renders a spinner when pending', async () => {
      const { container } = await render(<Button isPending>Click me</Button>);
      expect(container.querySelector('.tale-button__spinner')).to.exist;
    });

    it('hides button content visually when pending', async () => {
      const { container } = await render(<Button isPending>Click me</Button>);
      const content = container.querySelector('.tale-button__content') as HTMLElement;
      expect(content.style.visibility).to.equal('hidden');
    });

    it('does not render spinner when not pending', async () => {
      const { container } = await render(<Button>Click me</Button>);
      expect(container.querySelector('.tale-button__spinner')).to.not.exist;
    });

    it('does not fire onPress when pending', async () => {
      const handlePress = spy();
      const { user } = await render(<Button isPending onPress={handlePress}>Click me</Button>);
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handlePress.callCount).to.equal(0);
    });

    it('keeps button focusable when pending', async () => {
      await render(<Button isPending>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).to.not.have.attribute('disabled');
    });
  });
});
