import type { Meta, StoryObj } from '@storybook/react';
import { PaymentInput } from '@tale-ui/react/payment-input';

const meta: Meta = {
  title: 'Components/PaymentInput',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render() {
    return (
      <PaymentInput.Root>
        <PaymentInput.Group>
          <PaymentInput.Input placeholder="1234 5678 9012 3456" />
          <PaymentInput.CardIcon />
        </PaymentInput.Group>
      </PaymentInput.Root>
    );
  },
};

export const WithLabel: Story = {
  render() {
    return (
      <PaymentInput.Root>
        <PaymentInput.Label>Card number</PaymentInput.Label>
        <PaymentInput.Group>
          <PaymentInput.Input placeholder="1234 5678 9012 3456" />
          <PaymentInput.CardIcon />
        </PaymentInput.Group>
        <PaymentInput.Description>We accept Visa, Mastercard, Amex, and Discover.</PaymentInput.Description>
      </PaymentInput.Root>
    );
  },
};

export const WithValidation: Story = {
  render() {
    return (
      <PaymentInput.Root isInvalid>
        <PaymentInput.Label>Card number</PaymentInput.Label>
        <PaymentInput.Group>
          <PaymentInput.Input placeholder="1234 5678 9012 3456" />
          <PaymentInput.CardIcon />
        </PaymentInput.Group>
        <PaymentInput.ErrorMessage>Invalid card number</PaymentInput.ErrorMessage>
      </PaymentInput.Root>
    );
  },
};
