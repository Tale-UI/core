import * as React from 'react';
import { expect } from 'chai';
import { Icon } from '@tale-ui/react/icon';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';

// Minimal forwardRef SVG component that mimics a lucide-react icon
const MockIcon = React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(
  (props, ref) => (
    <svg ref={ref} data-testid="mock-icon" {...props}>
      <path d="M0 0" />
    </svg>
  ),
);

describe('<Icon />', () => {
  const { render } = createRenderer();

  it('renders the provided icon component', async () => {
    await render(<Icon icon={MockIcon} />);
    expect(screen.getByTestId('mock-icon')).to.exist;
  });

  it('applies tale-icon BEM class by default (md size)', async () => {
    await render(<Icon icon={MockIcon} />);
    const el = screen.getByTestId('mock-icon');
    expect(el).to.have.class('tale-icon');
  });

  it('applies size modifier classes', async () => {
    const { container } = await render(
      <>
        <Icon icon={MockIcon} size="sm" data-testid="sm" />
        <Icon icon={MockIcon} size="lg" data-testid="lg" />
        <Icon icon={MockIcon} size="xl" data-testid="xl" />
      </>,
    );
    expect(screen.getByTestId('sm')).to.have.class('tale-icon--sm');
    expect(screen.getByTestId('lg')).to.have.class('tale-icon--lg');
    expect(screen.getByTestId('xl')).to.have.class('tale-icon--xl');
  });

  it('merges additional className', async () => {
    await render(<Icon icon={MockIcon} className="custom" />);
    const el = screen.getByTestId('mock-icon');
    expect(el).to.have.class('tale-icon');
    expect(el).to.have.class('custom');
  });

  it('sets aria-hidden="true" by default (decorative)', async () => {
    await render(<Icon icon={MockIcon} />);
    const el = screen.getByTestId('mock-icon');
    expect(el).to.have.attribute('aria-hidden', 'true');
  });

  it('sets aria-label and role="img" when label is provided', async () => {
    await render(<Icon icon={MockIcon} label="Close" />);
    const el = screen.getByRole('img');
    expect(el).to.have.attribute('aria-label', 'Close');
    expect(el).not.to.have.attribute('aria-hidden');
  });

  it('forwards ref to the SVG element', async () => {
    let ref: SVGSVGElement | null = null;
    await render(<Icon icon={MockIcon} ref={(el) => { ref = el; }} />);
    expect(ref).to.be.instanceOf(SVGSVGElement);
  });

  it('passes through additional SVG attributes', async () => {
    await render(<Icon icon={MockIcon} data-custom="test" />);
    const el = screen.getByTestId('mock-icon');
    expect(el).to.have.attribute('data-custom', 'test');
  });
});
