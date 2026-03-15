import { expect } from 'chai';
import { Checkbox } from '@tale-ui/react/checkbox';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';

describe('<Checkbox />', () => {
  const { render } = createRenderer();

  it('renders a checkbox input', async () => {
    await render(
      <Checkbox.Root>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(screen.getByRole('checkbox')).to.exist;
  });

  it('applies tale-checkbox class to the root', async () => {
    await render(
      <Checkbox.Root>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    const label = screen.getByRole('checkbox').closest('label');
    expect(label).to.have.class('tale-checkbox');
  });

  it('applies tale-checkbox__indicator class to the indicator', async () => {
    const { container } = await render(
      <Checkbox.Root>
        <Checkbox.Indicator data-testid="indicator" />
      </Checkbox.Root>,
    );
    const indicator = container.querySelector('.tale-checkbox__indicator');
    expect(indicator).to.exist;
  });

  it('sets data-selected when checked', async () => {
    await render(
      <Checkbox.Root isSelected>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    const label = screen.getByRole('checkbox').closest('label');
    expect(label).to.have.attribute('data-selected');
  });

  it('sets data-disabled when isDisabled', async () => {
    await render(
      <Checkbox.Root isDisabled>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    const label = screen.getByRole('checkbox', { hidden: true }).closest('label');
    expect(label).to.have.attribute('data-disabled');
  });

  it('merges additional className on root', async () => {
    await render(
      <Checkbox.Root className="custom">
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    const label = screen.getByRole('checkbox').closest('label');
    expect(label).to.have.class('tale-checkbox');
    expect(label).to.have.class('custom');
  });
});
