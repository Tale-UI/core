import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputGroup } from '@tale-ui/react/input-group';
import { Input } from '@tale-ui/react/input';

type Args = {
  leadingAddon: string;
  trailingAddon: string;
  placeholder: string;
};

const meta: Meta<Args> = {
  title: 'Components/InputGroup',
  parameters: { layout: 'centered' },
  args: {
    leadingAddon: 'https://',
    trailingAddon: '',
    placeholder: 'example.com',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <div style={{ width: 320 }}>
        <InputGroup.Root>
          {args.leadingAddon && (
            <InputGroup.Addon position="leading">{args.leadingAddon}</InputGroup.Addon>
          )}
          <Input.Root>
            <Input.Label>Website</Input.Label>
            <Input.Input placeholder={args.placeholder} />
          </Input.Root>
          {args.trailingAddon && (
            <InputGroup.Addon position="trailing">{args.trailingAddon}</InputGroup.Addon>
          )}
        </InputGroup.Root>
      </div>
    );
  },
};

export const LeadingTextAddon: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ width: 320 }}>
        <InputGroup.Root>
          <InputGroup.Addon position="leading">https://</InputGroup.Addon>
          <Input.Root>
            <Input.Label>Website URL</Input.Label>
            <Input.Input placeholder="example.com" />
          </Input.Root>
        </InputGroup.Root>
      </div>
    );
  },
};

export const TrailingUnitAddon: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ width: 280 }}>
        <InputGroup.Root>
          <Input.Root>
            <Input.Label>Duration</Input.Label>
            <Input.Input type="number" placeholder="30" />
          </Input.Root>
          <InputGroup.Addon position="trailing">minutes</InputGroup.Addon>
        </InputGroup.Root>
      </div>
    );
  },
};

export const BothAddons: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ width: 280 }}>
        <InputGroup.Root>
          <InputGroup.Addon position="leading">$</InputGroup.Addon>
          <Input.Root>
            <Input.Label>Amount</Input.Label>
            <Input.Input type="number" placeholder="0.00" />
          </Input.Root>
          <InputGroup.Addon position="trailing">USD</InputGroup.Addon>
        </InputGroup.Root>
      </div>
    );
  },
};

export const CurrencyPrefix: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 280 }}>
        {(['$', '€', '£', '¥'] as const).map((symbol) => (
          <InputGroup.Root key={symbol}>
            <InputGroup.Addon position="leading">{symbol}</InputGroup.Addon>
            <Input.Root>
              <Input.Input type="number" placeholder="0.00" />
            </Input.Root>
          </InputGroup.Root>
        ))}
      </div>
    );
  },
};
