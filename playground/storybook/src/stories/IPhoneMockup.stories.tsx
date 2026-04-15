import type { Meta, StoryObj } from '@storybook/react-vite';
import { IphoneMockup } from '@tale-ui/react/iphone-mockup';

type Args = {
  image: string;
  imageDark?: string;
  theme?: 'light' | 'dark';
  width?: number;
};

const PLACEHOLDER = 'https://placehold.co/750x1624/e2e8f0/64748b?text=App+Screenshot';
const PLACEHOLDER_DARK = 'https://placehold.co/750x1624/1e293b/94a3b8?text=App+Screenshot+Dark';

const meta: Meta<Args> = {
  title: 'Components/IphoneMockup',
  parameters: { layout: 'centered' },
  argTypes: {
    theme: { control: 'select', options: [undefined, 'light', 'dark'] },
    width: { control: 'number' },
  },
  args: {
    image: PLACEHOLDER,
    width: undefined,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return <IphoneMockup image={args.image} imageDark={args.imageDark} theme={args.theme} />;
  },
};

export const Scaled: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="story-label">200 px</p>
          <IphoneMockup image={PLACEHOLDER} width={200} height={408} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p className="story-label">260 px</p>
          <IphoneMockup image={PLACEHOLDER} width={260} height={530} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p className="story-label">314 px (native)</p>
          <IphoneMockup image={PLACEHOLDER} />
        </div>
      </div>
    );
  },
};

export const DarkModeImage: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '3rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="story-label">Light mode</p>
          <IphoneMockup image={PLACEHOLDER} imageDark={PLACEHOLDER_DARK} theme="light" width={200} height={408} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p className="story-label">Dark mode</p>
          <IphoneMockup image={PLACEHOLDER} imageDark={PLACEHOLDER_DARK} theme="dark" width={200} height={408} />
        </div>
      </div>
    );
  },
};
