import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '@tale-ui/react/scroll-area';

type Args = {
  orientation?: 'vertical' | 'horizontal' | 'both';
};

const meta: Meta<Args> = {
  title: 'Components/ScrollArea',
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
    },
  },
  args: {
    orientation: 'vertical',
  },
};

export default meta;

type Story = StoryObj<Args>;

const paragraphs = Array.from({ length: 20 }, (_, i) => (
  <p key={i} className="story-scroll-line">
    Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </p>
));

export const Default: Story = {
  render: (args) => {
    const isHorizontal = args.orientation === 'horizontal' || args.orientation === 'both';
    const isVertical = args.orientation === 'vertical' || args.orientation === 'both';
    return (
      <ScrollArea.Root style={{ width: 300, height: 200, border: '1px solid var(--neutral-20)' }}>
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            <div
              style={{
                padding: 'var(--space-s)',
                ...(isHorizontal ? { width: 600, whiteSpace: 'nowrap' } : {}),
              }}
            >
              {paragraphs}
            </div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        {isVertical && (
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        )}
        {isHorizontal && (
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        )}
        {args.orientation === 'both' && <ScrollArea.Corner />}
      </ScrollArea.Root>
    );
  },
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea.Root style={{ width: 300, height: 100, border: '1px solid var(--neutral-20)' }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div style={{ width: 800, padding: 'var(--space-s)', whiteSpace: 'nowrap' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <p key={i} className="story-scroll-line">
                This is a very long line of text that extends beyond the visible area to demonstrate horizontal scrolling behavior in the ScrollArea component.
              </p>
            ))}
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea.Root style={{ width: 300, height: 200, border: '1px solid var(--neutral-20)' }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div style={{ width: 600, padding: 'var(--space-s)' }}>
            {Array.from({ length: 30 }, (_, i) => (
              <p key={i} className="story-scroll-line" style={{ whiteSpace: 'nowrap' }}>
                Row {i + 1}: This content is wide and tall enough to require both vertical and horizontal scrollbars.
              </p>
            ))}
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};


export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <p className="story-label">Vertical scroll</p>
          <ScrollArea.Root style={{ width: 300, height: 200, border: '1px solid var(--neutral-20)' }}>
            <ScrollArea.Viewport>
              <ScrollArea.Content>
                <div style={{ padding: 'var(--space-s)' }}>
                  {paragraphs}
                </div>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <p className="story-label">Horizontal scroll</p>
          <ScrollArea.Root style={{ width: 300, height: 100, border: '1px solid var(--neutral-20)' }}>
            <ScrollArea.Viewport>
              <ScrollArea.Content>
                <div style={{ width: 800, padding: 'var(--space-s)', whiteSpace: 'nowrap' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <p key={i}>
                      This is a very long line of text that extends beyond the visible area to demonstrate horizontal scrolling.
                    </p>
                  ))}
                </div>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="horizontal">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      </div>
    );
  },
};
