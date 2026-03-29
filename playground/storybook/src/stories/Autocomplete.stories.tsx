import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from '@tale-ui/react/autocomplete';
import { useFilter } from 'react-aria-components';

type Args = {
  isDisabled?: boolean;
};

const panelStyle: React.CSSProperties = {
  width: '320px',
  border: '1px solid var(--neutral-20)',
  borderRadius: 'var(--radius-m)',
  background: 'var(--background)',
  overflow: 'hidden',
};

const searchStyle: React.CSSProperties = {
  padding: 'var(--space-2xs)',
  borderBottom: '1px solid var(--neutral-20)',
};

const listStyle: React.CSSProperties = {
  maxHeight: '260px',
  overflowY: 'auto',
  padding: 'var(--space-4xs)',
};

const meta: Meta<Args> = {
  title: 'Components/Autocomplete',
  parameters: { layout: 'centered' },
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
  args: {
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

const fruits = [
  { id: 'apple', name: 'Apple' },
  { id: 'banana', name: 'Banana' },
  { id: 'cherry', name: 'Cherry' },
  { id: 'grape', name: 'Grape' },
  { id: 'lemon', name: 'Lemon' },
  { id: 'mango', name: 'Mango' },
  { id: 'orange', name: 'Orange' },
  { id: 'peach', name: 'Peach' },
  { id: 'strawberry', name: 'Strawberry' },
];

export const Default: Story = {
  render: function DefaultAutocomplete(args) {
    let { contains } = useFilter({ sensitivity: 'base' });
    return (
      <div style={panelStyle}>
        <Autocomplete.Root filter={contains}>
          <div style={searchStyle}>
            <Autocomplete.SearchField aria-label="Search fruits" isDisabled={args.isDisabled}>
              <Autocomplete.Input placeholder="Search fruits..." />
            </Autocomplete.SearchField>
          </div>
          <div style={listStyle}>
            <Autocomplete.ListBox aria-label="Fruits">
              {fruits.map((fruit) => (
                <Autocomplete.Item key={fruit.id} id={fruit.id} textValue={fruit.name}>
                  {fruit.name}
                </Autocomplete.Item>
              ))}
            </Autocomplete.ListBox>
          </div>
        </Autocomplete.Root>
      </div>
    );
  },
};

export const WithSections: Story = {
  render: function SectionsAutocomplete(args) {
    let { contains } = useFilter({ sensitivity: 'base' });
    return (
      <div style={panelStyle}>
        <Autocomplete.Root filter={contains}>
          <div style={searchStyle}>
            <Autocomplete.SearchField aria-label="Search produce" isDisabled={args.isDisabled}>
              <Autocomplete.Input placeholder="Search produce..." />
            </Autocomplete.SearchField>
          </div>
          <div style={listStyle}>
            <Autocomplete.ListBox aria-label="Produce">
              <Autocomplete.Section>
                <Autocomplete.Header>Fruits</Autocomplete.Header>
                <Autocomplete.Item id="apple" textValue="Apple">Apple</Autocomplete.Item>
                <Autocomplete.Item id="banana" textValue="Banana">Banana</Autocomplete.Item>
                <Autocomplete.Item id="cherry" textValue="Cherry">Cherry</Autocomplete.Item>
              </Autocomplete.Section>
              <Autocomplete.Section>
                <Autocomplete.Header>Vegetables</Autocomplete.Header>
                <Autocomplete.Item id="carrot" textValue="Carrot">Carrot</Autocomplete.Item>
                <Autocomplete.Item id="broccoli" textValue="Broccoli">Broccoli</Autocomplete.Item>
                <Autocomplete.Item id="spinach" textValue="Spinach">Spinach</Autocomplete.Item>
              </Autocomplete.Section>
            </Autocomplete.ListBox>
          </div>
        </Autocomplete.Root>
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render: function AllVariationsAutocomplete() {
    let { contains } = useFilter({ sensitivity: 'base' });
    return (
      <div style={{ display: 'flex', gap: '1.6rem', flexWrap: 'wrap' }}>
        <div>
          <div className="story-label" style={{ marginBottom: '0.4rem' }}>Default</div>
          <div style={panelStyle}>
            <Autocomplete.Root filter={contains}>
              <div style={searchStyle}>
                <Autocomplete.SearchField aria-label="Search">
                  <Autocomplete.Input placeholder="Search fruits..." />
                </Autocomplete.SearchField>
              </div>
              <div style={listStyle}>
                <Autocomplete.ListBox aria-label="Fruits">
                  {fruits.map((f) => <Autocomplete.Item key={`av-${f.id}`} id={`av-${f.id}`} textValue={f.name}>{f.name}</Autocomplete.Item>)}
                </Autocomplete.ListBox>
              </div>
            </Autocomplete.Root>
          </div>
        </div>
        <div>
          <div className="story-label" style={{ marginBottom: '0.4rem' }}>Disabled</div>
          <div style={panelStyle}>
            <Autocomplete.Root filter={contains}>
              <div style={searchStyle}>
                <Autocomplete.SearchField aria-label="Search" isDisabled>
                  <Autocomplete.Input placeholder="Disabled" />
                </Autocomplete.SearchField>
              </div>
              <div style={listStyle}>
                <Autocomplete.ListBox aria-label="Fruits">
                  {fruits.slice(0, 3).map((f) => <Autocomplete.Item key={`avd-${f.id}`} id={`avd-${f.id}`} textValue={f.name}>{f.name}</Autocomplete.Item>)}
                </Autocomplete.ListBox>
              </div>
            </Autocomplete.Root>
          </div>
        </div>
        <div>
          <div className="story-label" style={{ marginBottom: '0.4rem' }}>With sections</div>
          <div style={panelStyle}>
            <Autocomplete.Root filter={contains}>
              <div style={searchStyle}>
                <Autocomplete.SearchField aria-label="Search produce">
                  <Autocomplete.Input placeholder="Search produce..." />
                </Autocomplete.SearchField>
              </div>
              <div style={listStyle}>
                <Autocomplete.ListBox aria-label="Produce">
                  <Autocomplete.Section>
                    <Autocomplete.Header>Fruits</Autocomplete.Header>
                    <Autocomplete.Item id="avs-apple" textValue="Apple">Apple</Autocomplete.Item>
                    <Autocomplete.Item id="avs-banana" textValue="Banana">Banana</Autocomplete.Item>
                  </Autocomplete.Section>
                  <Autocomplete.Section>
                    <Autocomplete.Header>Vegetables</Autocomplete.Header>
                    <Autocomplete.Item id="avs-carrot" textValue="Carrot">Carrot</Autocomplete.Item>
                    <Autocomplete.Item id="avs-broccoli" textValue="Broccoli">Broccoli</Autocomplete.Item>
                  </Autocomplete.Section>
                </Autocomplete.ListBox>
              </div>
            </Autocomplete.Root>
          </div>
        </div>
      </div>
    );
  },
};
