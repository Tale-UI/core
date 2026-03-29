import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container, CONTAINER_COLORS } from '@tale-ui/react/container';

type Args = {
  color?: (typeof CONTAINER_COLORS)[number];
};

const meta: Meta<Args> = {
  title: 'Components/Container',
  parameters: { layout: 'centered' },
  argTypes: {
    color: {
      control: 'select',
      options: [...CONTAINER_COLORS],
    },
  },
  args: {
    color: 'brand',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Container color={args.color} className="story-container-demo">
      <span className="story-container-label">{args.color}</span>
    </Container>
  ),
};

export const AllColors: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-row story-row--s" style={{ flexWrap: 'wrap', maxWidth: '600px' }}>
      {CONTAINER_COLORS.map((color) => (
        <Container key={color} color={color} className="story-container-demo">
          <span className="story-container-label">{color}</span>
        </Container>
      ))}
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--s" style={{ flexWrap: 'wrap', maxWidth: '600px' }}>
        {CONTAINER_COLORS.map((color) => (
          <Container key={color} color={color} className="story-container-demo">
            <span className="story-container-label">{color}</span>
          </Container>
        ))}
      </div>
    );
  },
};
