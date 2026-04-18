import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { NumberField } from '@tale-ui/react/number-field';
import '../styles.css';
import { createRenderer, isJSDOM } from '#test-utils';

describe('<NumberField />', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('keeps the group sized to its contents', async () => {
    await render(
      <NumberField.Root aria-label="Quantity" defaultValue={0} minValue={0} maxValue={100}>
        <NumberField.Group data-testid="group">
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField.Root>,
    );

    const group = screen.getByTestId('group');
    const input = screen.getByRole('textbox', { name: 'Quantity' });
    const buttons = group.querySelectorAll('button');

    expect(buttons).to.have.length(2);

    const groupWidth = group.getBoundingClientRect().width;
    const inputWidth = input.getBoundingClientRect().width;
    const buttonsWidth = Array.from(buttons).reduce(
      (total, button) => total + button.getBoundingClientRect().width,
      0,
    );

    expect(groupWidth).to.be.closeTo(inputWidth + buttonsWidth + 2, 1);
  });
});
