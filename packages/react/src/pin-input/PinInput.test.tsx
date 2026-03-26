import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { PinInput } from '@tale-ui/react/pin-input';
import { createRenderer } from '#test-utils';

// Mock input-otp since it relies on DOM measurement
vi.mock('input-otp', () => {
  const OTPInputContext = React.createContext<any>({
    slots: [],
    isFocused: false,
    isHovering: false,
  });

  return {
    OTPInputContext,
    OTPInput: React.forwardRef(({ maxLength, containerClassName, disabled, children, ...props }: any, ref: any) => {
      const slots = Array.from({ length: maxLength }, (_, i) => ({
        char: null,
        hasFakeCaret: i === 0,
        isActive: i === 0,
        placeholderChar: null,
      }));

      return (
        <OTPInputContext.Provider value={{ slots, isFocused: true, isHovering: false }}>
          <div className={containerClassName} data-testid={props['data-testid']} {...props}>
            <input ref={ref} type="text" hidden disabled={disabled || undefined} />
            {children}
          </div>
        </OTPInputContext.Provider>
      );
    }),
  };
});

describe('<PinInput />', () => {
  const { render } = createRenderer();

  it('Root renders with tale-pin-input class', async () => {
    await render(
      <PinInput.Root maxLength={4} data-testid="root">
        <PinInput.Slot index={0} />
      </PinInput.Root>,
    );
    expect(screen.getByTestId('root')).to.have.class('tale-pin-input');
  });

  it('Root merges additional className', async () => {
    await render(
      <PinInput.Root maxLength={4} className="custom" data-testid="root">
        <PinInput.Slot index={0} />
      </PinInput.Root>,
    );
    expect(screen.getByTestId('root')).to.have.class('custom');
  });

  it('Root passes disabled to the hidden input', async () => {
    await render(
      <PinInput.Root maxLength={4} disabled data-testid="root">
        <PinInput.Slot index={0} />
      </PinInput.Root>,
    );
    const input = screen.getByTestId('root').querySelector('input');
    expect(input).to.have.attribute('disabled');
  });

  it('Group renders with tale-pin-input__group class', async () => {
    await render(
      <PinInput.Root maxLength={4}>
        <PinInput.Group data-testid="group">
          <PinInput.Slot index={0} />
        </PinInput.Group>
      </PinInput.Root>,
    );
    expect(screen.getByTestId('group')).to.have.class('tale-pin-input__group');
  });

  it('Slot renders with tale-pin-input__slot class', async () => {
    await render(
      <PinInput.Root maxLength={4}>
        <PinInput.Slot index={0} data-testid="slot" />
      </PinInput.Root>,
    );
    expect(screen.getByTestId('slot')).to.have.class('tale-pin-input__slot');
  });

  it('first Slot has data-active when focused', async () => {
    await render(
      <PinInput.Root maxLength={4}>
        <PinInput.Slot index={0} data-testid="slot" />
      </PinInput.Root>,
    );
    expect(screen.getByTestId('slot')).to.have.attribute('data-active');
  });

  it('Separator renders with correct class and role', async () => {
    await render(
      <PinInput.Root maxLength={4}>
        <PinInput.Separator data-testid="sep" />
        <PinInput.Slot index={0} />
      </PinInput.Root>,
    );
    const sep = screen.getByTestId('sep');
    expect(sep).to.have.class('tale-pin-input__separator');
    expect(sep).to.have.attribute('role', 'presentation');
    expect(sep).to.have.attribute('aria-hidden', 'true');
  });

  it('Separator renders default dash character', async () => {
    await render(
      <PinInput.Root maxLength={4}>
        <PinInput.Separator data-testid="sep" />
        <PinInput.Slot index={0} />
      </PinInput.Root>,
    );
    expect(screen.getByTestId('sep').textContent).to.equal('–');
  });
});
