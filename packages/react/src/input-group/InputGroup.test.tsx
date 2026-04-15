import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { Input } from '@tale-ui/react/input';
import { InputGroup } from '@tale-ui/react/input-group';
import '../styles.css';
import { createRenderer, isJSDOM } from '#test-utils';

describe('<InputGroup />', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('keeps addons matched to the input control height when labels are present', async () => {
    await render(
      <InputGroup.Root data-testid="group">
        <InputGroup.Addon position="leading" data-testid="leading-addon">
          https://
        </InputGroup.Addon>
        <Input.Root>
          <Input.Label>Website</Input.Label>
          <Input.Input placeholder="example.com" />
        </Input.Root>
        <InputGroup.Addon position="trailing" data-testid="trailing-addon">
          .com
        </InputGroup.Addon>
      </InputGroup.Root>,
    );

    const group = screen.getByTestId('group');
    const input = screen.getByRole('textbox', { name: 'Website' });
    const leadingAddon = screen.getByTestId('leading-addon');
    const trailingAddon = screen.getByTestId('trailing-addon');

    const groupHeight = group.getBoundingClientRect().height;
    const inputHeight = input.getBoundingClientRect().height;
    const leadingAddonHeight = leadingAddon.getBoundingClientRect().height;
    const trailingAddonHeight = trailingAddon.getBoundingClientRect().height;

    expect(groupHeight).to.be.greaterThan(inputHeight);
    expect(leadingAddonHeight).to.be.closeTo(inputHeight, 0.5);
    expect(trailingAddonHeight).to.be.closeTo(inputHeight, 0.5);
  });
});
