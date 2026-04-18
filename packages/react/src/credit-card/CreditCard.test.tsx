import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { CreditCard } from '@tale-ui/react/credit-card';
import '../styles.css';
import { createRenderer, isJSDOM } from '#test-utils';

describe('<CreditCard />', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('keeps the wrapper at least as large as the scaled visual', async () => {
    await render(<CreditCard.Root width={200} data-testid="card" />);

    const card = screen.getByTestId('card');
    const inner = card.querySelector('.tale-credit-card__inner') as HTMLElement | null;

    expect(inner).not.to.equal(null);

    const cardRect = card.getBoundingClientRect();
    const innerRect = inner!.getBoundingClientRect();

    expect(cardRect.width).to.be.at.least(innerRect.width);
    expect(cardRect.height).to.be.at.least(innerRect.height);
  });
});
