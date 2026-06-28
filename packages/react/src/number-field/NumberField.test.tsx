import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'vitest';
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

    expect(buttons).toHaveLength(2);

    const groupWidth = group.getBoundingClientRect().width;
    const inputWidth = input.getBoundingClientRect().width;
    const buttonsWidth = Array.from(buttons).reduce(
      (total, button) => total + button.getBoundingClientRect().width,
      0,
    );

    expect(Math.abs(groupWidth - (inputWidth + buttonsWidth + 2))).toBeLessThanOrEqual(1);
  });

  it.skipIf(isJSDOM)('allows layered consumer CSS to set the group width without constraining the root', async () => {
    await render(
      <div>
        <style>
          {`
            @layer number-field-test {
              .number-field-test-layered-width {
                --tale-number-field-width: 32rem;
                --tale-number-field-group-width: 14rem;
              }
            }
          `}
        </style>
        <NumberField.Root
          aria-label="Panel width"
          className="number-field-test-layered-width"
          data-testid="root"
          defaultValue={920}
        >
          <NumberField.Label>Default panel width (px)</NumberField.Label>
          <NumberField.Group data-testid="group">
            <NumberField.Decrement />
            <NumberField.Input />
            <NumberField.Increment />
          </NumberField.Group>
          <NumberField.Description>
            Width applied to newly opened panels.
          </NumberField.Description>
        </NumberField.Root>
      </div>,
    );

    const root = screen.getByTestId('root');
    const group = screen.getByTestId('group');
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

    expect(Math.abs(group.getBoundingClientRect().width - (14 * rootFontSize + 2))).toBeLessThanOrEqual(1);
    expect(Math.abs(root.getBoundingClientRect().width - 32 * rootFontSize)).toBeLessThanOrEqual(1);
    expect(root.getBoundingClientRect().width).toBeGreaterThan(group.getBoundingClientRect().width);
  });
});
