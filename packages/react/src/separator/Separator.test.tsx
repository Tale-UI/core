import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { Separator } from '@tale-ui/react/separator';
import { createRenderer } from '#test-utils';

describe('<Separator />', () => {
  const { render } = createRenderer();

  it('renders an element with the `separator` role', async () => {
    await render(<Separator />);
    expect(screen.getByRole('separator')).toBeVisible();
  });

  it('applies the tale-separator class by default', async () => {
    await render(<Separator />);
    expect(screen.getByRole('separator')).to.have.class('tale-separator');
  });

  it('merges additional className', async () => {
    await render(<Separator className="custom-class" />);
    expect(screen.getByRole('separator')).to.have.class('tale-separator');
    expect(screen.getByRole('separator')).to.have.class('custom-class');
  });

  describe('prop: orientation', () => {
    it('horizontal (default)', async () => {
      await render(<Separator orientation="horizontal" />);
      // <hr> natively has role="separator" with implicit horizontal orientation
      // aria-orientation is not required for horizontal separators
      expect(screen.getByRole('separator')).not.to.have.class('tale-separator--vertical');
    });

    it('vertical', async () => {
      await render(<Separator orientation="vertical" />);
      expect(screen.getByRole('separator')).to.have.attribute('aria-orientation', 'vertical');
      expect(screen.getByRole('separator')).to.have.class('tale-separator--vertical');
    });
  });
});
