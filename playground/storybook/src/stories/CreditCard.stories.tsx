import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreditCard } from '@tale-ui/react/credit-card';

type CreditCardType =
  | 'transparent' | 'transparent-gradient'
  | 'brand-dark' | 'brand-light'
  | 'gray-dark' | 'gray-light'
  | 'transparent-strip' | 'gray-strip' | 'gradient-strip' | 'salmon-strip'
  | 'gray-strip-vertical' | 'gradient-strip-vertical' | 'salmon-strip-vertical';

type Args = {
  company: string;
  cardNumber: string;
  cardHolder: string;
  cardExpiration: string;
  type: CreditCardType;
  width?: number;
};

const ALL_TYPES: CreditCardType[] = [
  'brand-dark', 'brand-light', 'gray-dark', 'gray-light',
  'transparent', 'transparent-gradient',
  'transparent-strip', 'gray-strip', 'gradient-strip', 'salmon-strip',
  'gray-strip-vertical', 'gradient-strip-vertical', 'salmon-strip-vertical',
];

const meta: Meta<Args> = {
  title: 'Components/CreditCard',
  parameters: { layout: 'centered' },
  argTypes: {
    type: { control: 'select', options: ALL_TYPES },
    width: { control: 'number' },
  },
  args: {
    company: 'Acme Inc.',
    cardNumber: '4242 4242 4242 4242',
    cardHolder: 'OLIVIA RHYE',
    cardExpiration: '12/28',
    type: 'brand-dark',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <CreditCard.Root
        company={args.company}
        cardNumber={args.cardNumber}
        cardHolder={args.cardHolder}
        cardExpiration={args.cardExpiration}
        type={args.type}
        width={args.width}
      />
    );
  },
};

export const AllNormalVariants: Story = {
  name: 'All Normal Variants',
  parameters: { controls: { disable: true } },
  render() {
    const types: CreditCardType[] = ['brand-dark', 'brand-light', 'gray-dark', 'gray-light', 'transparent', 'transparent-gradient'];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9375rem' }}>
        {types.map((t) => (
          <div key={t}>
            <p className="story-label" style={{ marginBottom: '0.3125rem' }}>{t}</p>
            <CreditCard.Root type={t} />
          </div>
        ))}
      </div>
    );
  },
};

export const AllStripVariants: Story = {
  name: 'All Strip Variants',
  parameters: { controls: { disable: true } },
  render() {
    const types: CreditCardType[] = ['transparent-strip', 'gray-strip', 'gradient-strip', 'salmon-strip'];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9375rem' }}>
        {types.map((t) => (
          <div key={t}>
            <p className="story-label" style={{ marginBottom: '0.3125rem' }}>{t}</p>
            <CreditCard.Root type={t} />
          </div>
        ))}
      </div>
    );
  },
};

export const AllVerticalStripVariants: Story = {
  name: 'All Vertical Strip Variants',
  parameters: { controls: { disable: true } },
  render() {
    const types: CreditCardType[] = ['gray-strip-vertical', 'gradient-strip-vertical', 'salmon-strip-vertical'];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9375rem' }}>
        {types.map((t) => (
          <div key={t}>
            <p className="story-label" style={{ marginBottom: '0.3125rem' }}>{t}</p>
            <CreditCard.Root type={t} />
          </div>
        ))}
      </div>
    );
  },
};

export const ScaledWidth: Story = {
  name: 'Scaled Width',
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '0.9375rem', alignItems: 'flex-end' }}>
        <div>
          <p className="story-label">200 px</p>
          <CreditCard.Root width={200} />
        </div>
        <div>
          <p className="story-label">260 px</p>
          <CreditCard.Root width={260} />
        </div>
        <div>
          <p className="story-label">316 px (native)</p>
          <CreditCard.Root />
        </div>
      </div>
    );
  },
};
